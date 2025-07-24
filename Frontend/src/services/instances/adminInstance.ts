import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const adminAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
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

  console.log("🧹 Cleared admin data, preserved theme:", themeToKeep);
};

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshTokenRequest = originalRequest.url?.includes(
      "/admin/auth/refresh-token"
    );

    console.log("🔄 Admin interceptor triggered:", {
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
      // ✅ FIXED: Use selective clearing instead of localStorage.clear()
      clearUserDataFromStorage();

      // Redirect to login
      window.location.href = "/admin/login";
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
            return adminAxiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      console.log("🔄 Starting admin token refresh...");
      isRefreshing = true;

      try {
        const response = await adminAxiosInstance.post(
          "/admin/auth/refresh-token",
          null,
          {
            withCredentials: true,
            // Mark this as a retry to prevent infinite loops
            _isRefreshRequest: true,
          }
        );

        console.log("✅ Admin token refresh successful:", response.data);
        isRefreshing = false;
        processQueue(null, "refreshed");

        // Retry the original request
        return adminAxiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error("❌ Admin token refresh failed:", refreshError);
        isRefreshing = false;
        processQueue(refreshError, null);

        // Clear any auth state
        // ✅ FIXED: Use selective clearing instead of localStorage.clear()
        clearUserDataFromStorage();

        // Redirect to login
        console.log("🚪 Redirecting to admin login page");
        window.location.href = "/admin/login";

        return Promise.reject(refreshError);
      }
    }

    // For any other 401 after retry or non-401 errors
    if (error.response?.status === 401 && originalRequest._retry) {
      console.log(
        "❌ Request failed after token refresh, redirecting to login"
      );
      // ✅ FIXED: Use selective clearing instead of localStorage.clear()
      clearUserDataFromStorage();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);
