// import axios from "axios";
// import store from "@/redux/store/store";
// import { resetUser } from "@/redux/slices/userSlice";

// const API_URL = import.meta.env.VITE_API_URL;
// export const userAxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // Add a response interceptor
// userAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshResponse = await axios.get("/auth/refresh_token", {
//           baseURL: import.meta.env.VITE_API_URL,
//           withCredentials: true,
//         });

//         const newAccessToken = refreshResponse.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);

//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return userAxiosInstance(originalRequest); // Retry the original request
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         // Optionally redirect to login
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default userAxiosInstance;
import axios from "axios";
import store from "@/redux/store/store";
import { resetUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Authorization header
userAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401
userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const { accessToken, newRefreshToken } = response.data;
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return userAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(resetUser());
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default userAxiosInstance;
