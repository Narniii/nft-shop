import { CONFIG } from "../config";
import { APIWrapper } from "../utils/api_wrapper";
class BitzioApiWrapper extends APIWrapper {

}
const bitzioApi = new BitzioApiWrapper({
    baseUrl: "https://api.proposal.bitzio.ir:7257",
});
export const BITZIO_API = bitzioApi;