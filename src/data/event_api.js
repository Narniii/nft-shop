import { API_CONFIG } from "../config";
import { APIWrapper } from "../utils/api_wrapper";
class EventApiWrapper extends APIWrapper {

}
const eventApi = new EventApiWrapper({
    baseUrl: API_CONFIG.EVENTS_API_URL,
});
export const EVENT_API = eventApi;