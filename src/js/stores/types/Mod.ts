import ModStore from "./ModStore";
import DDLStatus from "./DDLStatus";

export default class Mod {
    id: string;
    name: string;
    author: string;
    description: string;
    icon?: string;
    shortDescription?: string;
    website?: string;
    downloadURL: string;
    nsfw?: boolean;
    directDownload: DDLStatus;
    rating?: number;
    lengthString?: string;
    status?: string;
    store: ModStore;
    highlighted: boolean;
}
