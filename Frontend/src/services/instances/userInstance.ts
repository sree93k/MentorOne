// import axios from "axios";
// import store from "@/redux/store/store";
// import { resetUser } from "@/redux/slices/userSlice";
// import { toast } from "react-hot-toast";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

// export const userAxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Important for sending cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Response Interceptor: Handle token refresh on 401
// userAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       console.log("User: Attempting to refresh token...");

//       try {
//         const response = await userAxiosInstance.post(
//           "/user/auth/refresh-token", // Updated to match RESTful route
//           null,
//           {
//             withCredentials: true, // Send refresh token cookie
//           }
//         );
//         console.log("User: Refresh token response:", response.data);

//         return userAxiosInstance(originalRequest); // Retry original request with new access token cookie
//       } catch (refreshError) {
//         console.error("User: Refresh token failed:", refreshError);

//         // Clear Redux state and redirect to login
//         store.dispatch(resetUser());
//         toast.error("Session expired. Please log in again.");
//         window.location.href = "/login";

//         return Promise.reject(refreshError);
//       }
//     } else if (error.response?.status === 401 && originalRequest._retry) {
//       // Prevent infinite loop: if refresh already failed, redirect to login
//       console.error("User: Refresh token retry failed, redirecting to login");
//       store.dispatch(resetUser());
//       window.location.href = "/login";
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

    // Check if it's a 401 error and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(
        "User: 401 detected, checking if refresh token is available..."
      );

      // Check if we have a refresh token before attempting refresh
      const hasRefreshToken = document.cookie.includes("refreshToken=");

      if (!hasRefreshToken) {
        console.log("User: No refresh token found, redirecting to login");
        store.dispatch(resetUser());
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        console.log("User: Attempting to refresh token...");

        // Make a simple request to any authenticated endpoint to trigger refresh
        // The middleware will handle the refresh automatically
        const response = await userAxiosInstance.get("/user/validate_session", {
          withCredentials: true,
        });

        console.log("User: Token refresh successful", response);

        // Retry the original request
        return userAxiosInstance(originalRequest);
      } catch (refreshError: any) {
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
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
