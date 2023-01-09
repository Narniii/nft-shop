import { API_CONFIG } from "../config";
import { APIWrapper } from "../utils/api_wrapper";
class CollectionApiWrapper extends APIWrapper {

}
const collectionApi = new CollectionApiWrapper({
    baseUrl: API_CONFIG.COLLECTIONS_API_URL,
});
export const COLLECTION_API = collectionApi;