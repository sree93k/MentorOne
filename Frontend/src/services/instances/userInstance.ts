import axios from "axios";
import store from "@/redux/store/store";
import { resetUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ CRITICAL: Enable cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// ✅ HELPER: Clear user data while preserving theme and other important data
const clearUserDataFromStorage = () => {
  // Save theme and other important data
  const themeToKeep = localStorage.getItem("vite-ui-theme");

  // Clear all localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Restore the theme if it existed
  if (themeToKeep) {
    localStorage.setItem("vite-ui-theme", themeToKeep);
  }

  console.log("🧹 Cleared user data, preserved theme:", themeToKeep);
};

// ✅ REMOVED: No longer add Authorization header from localStorage
// Cookies will be sent automatically with withCredentials: true
userAxiosInstance.interceptors.request.use(
  (config) => {
    // ✅ NO TOKEN HEADER - cookies sent automatically
    console.log("🔤 Request interceptor: cookies will be sent automatically");
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401
userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshTokenRequest = originalRequest.url?.includes(
      "/user/auth/refresh-token"
    );

    console.log("🔄 User interceptor triggered:", {
      status: error.response?.status,
      url: originalRequest.url,
      isRefreshRequest: isRefreshTokenRequest,
      alreadyRetried: originalRequest._retry,
      isRefreshing,
    });

    // Don't try to refresh if this IS the refresh token request that failed
    if (isRefreshTokenRequest) {
      console.log(
        "❌ Refresh token request failed, clearing auth and redirecting"
      );

      // Clear any auth state
      store.dispatch(resetUser());
      // ✅ FIXED: Use selective clearing instead of localStorage.clear()
      clearUserDataFromStorage();

      // Redirect to login
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 401 errors for other requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        console.log("⏳ Already refreshing, queueing request");
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return userAxiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      console.log("🔄 Starting user token refresh...");
      isRefreshing = true;

      try {
        // ✅ CHANGED: No refresh token in body, cookies sent automatically
        const response = await userAxiosInstance.post(
          "/user/auth/refresh-token",
          {}, // Empty body
          {
            withCredentials: true,
            _isRefreshRequest: true,
          }
        );

        console.log("✅ User token refresh successful:", response.data);
        isRefreshing = false;
        processQueue(null, "refreshed");

        // Retry the original request
        return userAxiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error("❌ User token refresh failed:", refreshError);
        isRefreshing = false;
        processQueue(refreshError, null);

        // Clear any auth state
        store.dispatch(resetUser());
        // ✅ FIXED: Use selective clearing instead of localStorage.clear()
        clearUserDataFromStorage();

        // Redirect to login
        console.log("🚪 Redirecting to login page");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // For any other 401 after retry or non-401 errors
    if (error.response?.status === 401 && originalRequest._retry) {
      console.log(
        "❌ Request failed after token refresh, redirecting to login"
      );
      store.dispatch(resetUser());
      // ✅ FIXED: Use selective clearing instead of localStorage.clear()
      clearUserDataFromStorage();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
