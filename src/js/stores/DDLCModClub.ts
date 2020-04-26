import ModStore from "./types/ModStore";
import {ModListing} from "./types/ModListing";
import DDLCheckResponse from "./types/DDLCheckResponse";
import DDLStatus from "./types/DDLStatus";

export default class DDLCModClub implements ModStore {

    private url: string = "http://localhost:8069/";

    name: string = "DDLC Mod Club";

    async getListing(page: number): Promise<ModListing> {
        const mods = await (await fetch(this.url + "listing")).json();
        return {
            mods: await Promise.all(mods.map(async mod => {
                let canDDL: DDLStatus = DDLStatus.UNKNOWN;
                let replacedURL: string = mod.modUploadURL;
                const urlObj: URL = new URL(mod.modUploadURL);

                if (urlObj.hostname === "drive.google.com" && urlObj.pathname === "/uc" && urlObj.searchParams.get("export") === "download") {
                    canDDL = DDLStatus.AVAILABLE;
                } else if (urlObj.hostname === "drive.google.com") {
                    const match: RegExpMatchArray = /(?:\/file\/d\/([a-zA-Z0-9_\-]+))|(?:\/open\?id=([a-zA-Z0-9_\-]+))/.exec(mod.modUploadURL);
                    if (match) {
                        const fileID: string = match[1] || match[2];
                        replacedURL = "https://drive.google.com/uc?id=" + fileID + "&export=download";
                        canDDL = DDLStatus.AVAILABLE;
                    }
                } else if (urlObj.hostname === "dropbox.com" || urlObj.hostname === "www.dropbox.com") {
                    if (urlObj.searchParams.get("dl") === "0") {
                        urlObj.searchParams.set("dl", "1");
                        canDDL = DDLStatus.AVAILABLE;
                    } else if (urlObj.searchParams.get("dl") === "1") {
                        canDDL = DDLStatus.AVAILABLE;
                    }
                } else if (urlObj.hostname === "mega.nz" || urlObj.hostname === "www.mediafire.com" || urlObj.hostname === "mediafire.com") {
                    canDDL = DDLStatus.UNAVAILABLE;
                }

                return {
                    id: mod.modID,
                    name: mod.modName,
                    author: mod.modAuthor,
                    description: mod.modDescription,
                    icon: mod.modAvatar,
                    shortDescription: mod.modShortDescription,
                    website: mod.modWebsite,
                    downloadURL: replacedURL,
                    directDownload: canDDL,
                    store: this
                }
            })),
            hasMore: false
        }
    }

    async testDDL(id): Promise<DDLCheckResponse> {
        if (!sessionStorage.getItem("ddmcCache")) {
            sessionStorage.setItem("ddmcCache", "{}");
        }

        const cache: any = JSON.parse(sessionStorage.getItem("ddmcCache"));
        if (cache.hasOwnProperty(id)) {
            return cache[id];
        } else {
            const response = await (await fetch(this.url + "testddl?id=" + encodeURIComponent(id))).json();
            cache[id] = response;
            sessionStorage.setItem("ddmcCache", JSON.stringify(cache));
            return response;
        }
    }

}
