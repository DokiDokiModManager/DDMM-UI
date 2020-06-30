import ModStore from "./types/ModStore";
import {ModListing} from "./types/ModListing";
import DDLCheckResponse from "./types/DDLCheckResponse";
import DDLStatus from "./types/DDLStatus";
import Mod from "./types/Mod";

export default class DDLCModClub implements ModStore {

    private url: string = "https://ddmm-mods.shinomiya.group/";

    name: string = "DDLC Mod Club";

    async getListing(page: number): Promise<ModListing> {
        const mods = await (await fetch(this.url + "listing")).json();
        const featured: number[] = (await (await fetch("https://raw.githubusercontent.com/DokiDokiModManager/Meta/master/featured.json")).json()).mods;
        let modList: Mod[] = (await Promise.all(mods.map(async mod => {
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
                nsfw: mod.modNSFW,
                rating: mod.modRating,
                downloadURL: replacedURL,
                directDownload: canDDL,
                lengthString: new Date(0, 0, 0, mod.modPlayTimeHours, mod.modPlayTimeMinutes).toTimeString().substring(0, 5),
                status: mod.modStatus,
                store: this,
                highlighted: featured.indexOf(mod.modID) !== -1
            }
        })));

        modList = modList.sort(((a, b) => {
            if (a.highlighted && !b.highlighted) {
                return -1;
            } else if (b.highlighted && !a.highlighted) {
                return 1
            } else {
                return b.rating - a.rating;
            }
        }));

        return {
            mods: modList,
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
            const response = await (await fetch(this.url + "mod?id=" + encodeURIComponent(id))).json();
            cache[id] = response;
            sessionStorage.setItem("ddmcCache", JSON.stringify(cache));
            return response;
        }
    }

}
