import {ModListing} from "./ModListing";

export default interface ModStore {

    name: string;

    getListing(page: number): Promise<ModListing>;
}

