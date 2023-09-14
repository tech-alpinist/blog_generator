import axios from "axios";
import config from 'config'

class ApiController {
  constructor() {
    this.baseURL = config.API_URL;

    this.instance = axios.create({
      baseURL: this.baseURL,
    });
  }
  async get(endpoint, data) {
    return await this.instance.get(endpoint, {
      params: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async post(endpoint, data) {
    return this.instance.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default ApiController;
