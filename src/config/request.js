import axios from "axios";
import Cookies from "js-cookie";

const request = axios.create({
  baseURL: "https://sahifam.uz",
  timeout: 10000, // 10 seconds timeout
});

request.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user_token");
    console.log("🔑 Request interceptor - Token exists:", !!token);
    console.log("🌐 Request URL:", config.baseURL + config.url);
    console.log("📤 Request method:", config.method?.toUpperCase());
    console.log("📦 Request data:", config.data);

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
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - redirecting to login");
      Cookies.remove("user_token");
      Cookies.remove("refresh_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export { request };
