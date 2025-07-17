import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const adminAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
});

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Attempting to refresh token...");

      try {
        const response = await adminAxiosInstance.post(
          "/admin/auth/refresh-token", // Updated to match RESTful route
          null,
          {
            withCredentials: true,
          }
        );
        console.log("Refresh token response:", response.data);

        return adminAxiosInstance(originalRequest); // Retry original request with new access token cookie
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/admin/login"; // Force redirect to login
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401 && originalRequest._retry) {
      // Prevent infinite loop: if refresh already failed, redirect to login
      console.error("Refresh token retry failed, redirecting to login");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);
