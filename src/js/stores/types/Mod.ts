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
    directDownload: DDLStatus;
    store: ModStore;
}
