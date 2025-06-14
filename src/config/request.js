import axios from "axios";
import Cookies from "js-cookie";

const request = axios.create({
  baseURL: "https://api.sahifam.uz",
  timeout: 30000, // 30 seconds timeout
});

request.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Ensure Content-Type is set for POST requests
    if (config.method === "post" && config.data) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("user_token");
      Cookies.remove("refresh_token");
      // Dispatch auth change event
      window.dispatchEvent(new Event("authChange"));

      // Don't redirect here, let React Router handle it
    }
    return Promise.reject(error);
  }
);

export { request };
