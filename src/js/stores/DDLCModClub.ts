import ModStore from "./types/ModStore";
import {ModListing} from "./types/ModListing";

export default class DDLCModClub implements ModStore {

    private url: string = "http://localhost:8069/";

    name: string = "DDLC Mod Club";

    async getListing(page: number): Promise<ModListing> {
        const mods = await (await fetch(this.url + "listing")).json();
        return {
            mods: mods.map(mod => {
                let canDDL: boolean = false;
                let replacedURL: string = mod.modUploadURL;
                const urlObj: URL = new URL(mod.modUploadURL);

                if (urlObj.hostname === "drive.google.com" && urlObj.pathname === "/uc" && urlObj.searchParams.get("export") === "download") {
                    canDDL = true;
                } else if (urlObj.hostname === "drive.google.com") {
                    const match: RegExpMatchArray = /\/file\/d\/([a-zA-Z0-9_\-]+)/.exec(urlObj.pathname);
                    if (match) {
                        const fileID: string = match[1];
                        replacedURL = "https://drive.google.com/uc?id=" + fileID + "&export=download";
                    }
                } else {
                    if (urlObj.pathname.match(/.*\.(zip|7z|rar|gz|tar)$/)) {
                        canDDL = true;
                    }
                }

                return {
                    name: mod.modName,
                    author: mod.modAuthor,
                    description: mod.modDescription,
                    icon: mod.modAvatar,
                    shortDescription: mod.modShortDescription,
                    website: mod.modWebsite,
                    downloadURL: replacedURL,
                    directDownload: canDDL
                }
            }),
            hasMore: false
        }
    }

}
