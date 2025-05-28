import axios from "axios";
import Cookies from "js-cookie";

const request = axios.create({
  baseURL: "https://sahifam.uz",
  timeout: 30000, // 30 seconds timeout
});

request.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user_token");
    console.log("=== REQUEST INTERCEPTOR ===");
    console.log("Request URL:", config.baseURL + config.url);
    console.log("Request method:", config.method?.toUpperCase());
    console.log("Token exists:", !!token);

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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    console.log("=== RESPONSE INTERCEPTOR ===");
    console.log("Response status:", response.status);
    console.log("Response URL:", response.config.url);
    return response;
  },
  (error) => {
    console.error("=== RESPONSE ERROR INTERCEPTOR ===");
    console.error("Error status:", error.response?.status);
    console.error("Error URL:", error.config?.url);
    console.error("Error data:", error.response?.data);

    if (error.response?.status === 401) {
      console.log("Unauthorized - clearing tokens and dispatching auth change");
      Cookies.remove("user_token");
      Cookies.remove("refresh_token");
      // Dispatch auth change event
      window.dispatchEvent(new Event("authChange"));

      // Don't redirect here, let React Router handle it
      console.log(
        "Auth state should be updated, React Router will handle redirect"
      );
    }
    return Promise.reject(error);
  }
);

export { request };
