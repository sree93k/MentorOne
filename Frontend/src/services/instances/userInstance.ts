import axios from "axios";
import store from "@/redux/store/store";
import { resetUser } from "@/redux/slices/userSlice";

const API_URL = import.meta.env.VITE_API_URL;
export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a response interceptor
userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.get("/auth/refresh_token", {
          baseURL: import.meta.env.VITE_API_URL,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return userAxiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // Optionally redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
