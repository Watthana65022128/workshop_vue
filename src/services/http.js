import axios from "axios";
import config from "@/config";

// Import this client in API services; importing it does not send a request.
export default axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});
