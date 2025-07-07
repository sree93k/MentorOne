// // export default userAxiosInstance;
// import axios from "axios";
// import store from "@/redux/store/store";
// import { resetUser } from "@/redux/slices/userSlice";
// import { toast } from "react-hot-toast";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

// export const userAxiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request Interceptor: Add Authorization header
// userAxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor: Handle token refresh on 401
// userAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem("refresh_token");
//         if (!refreshToken) {
//           throw new Error("No refresh token available");
//         }
//         const response = await axios.post(
//           `${API_URL}/api/auth/refresh`,
//           { refreshToken },
//           { headers: { "Content-Type": "application/json" } }
//         );
//         const { accessToken, newRefreshToken } = response.data;
//         localStorage.setItem("auth_token", accessToken);
//         localStorage.setItem("refresh_token", newRefreshToken);
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return userAxiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         store.dispatch(resetUser());
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("refresh_token");
//         toast.error("Session expired. Please log in again.");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default userAxiosInstance;
// src/services/instances/userInstance.ts
import axios from "axios";
import store from "@/redux/store/store";
import { resetUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor: Handle token refresh on 401
userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("User: Attempting to refresh token...");

      try {
        const response = await userAxiosInstance.post(
          "/user/auth/refresh-token", // Updated to match RESTful route
          null,
          {
            withCredentials: true, // Send refresh token cookie
          }
        );
        console.log("User: Refresh token response:", response.data);

        return userAxiosInstance(originalRequest); // Retry original request with new access token cookie
      } catch (refreshError) {
        console.error("User: Refresh token failed:", refreshError);

        // Clear Redux state and redirect to login
        store.dispatch(resetUser());
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401 && originalRequest._retry) {
      // Prevent infinite loop: if refresh already failed, redirect to login
      console.error("User: Refresh token retry failed, redirecting to login");
      store.dispatch(resetUser());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
