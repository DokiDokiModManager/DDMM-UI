import {ModListing} from "./ModListing";
import DDLCheckResponse from "./DDLCheckResponse";

export default interface ModStore {

    name: string;

    getListing(page: number): Promise<ModListing>;
    testDDL(id: string): Promise<DDLCheckResponse>;
}

