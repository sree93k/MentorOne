import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const adminAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a response interceptor
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.get("/admin/auth/refresh_token", {
          baseURL: import.meta.env.VITE_API_URL,
          withCredentials: true,
        });
        console.log("refreshResponse>>>>>>>>", refreshResponse);

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return adminAxiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // Optionally redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
