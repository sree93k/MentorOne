// // // import axios from "axios";

// // // const API_URL = import.meta.env.VITE_API_URL;

// // // export const adminAxiosInstance = axios.create({
// // //   baseURL: API_URL,
// // //   withCredentials: true,
// // // });

// // // // Add a response interceptor
// // // adminAxiosInstance.interceptors.response.use(
// // //   (response) => response,
// // //   async (error) => {
// // //     const originalRequest = error.config;

// // //     if (error.response?.status === 401 && !originalRequest._retry) {
// // //       originalRequest._retry = true;
// // //       try {
// // //         const refreshResponse = await axios.get("/admin/auth/refresh_token", {
// // //           baseURL: import.meta.env.VITE_API_URL,
// // //           withCredentials: true,
// // //         });
// // //         console.log("refreshResponse>>>>>>>>", refreshResponse);

// // //         const newAccessToken = refreshResponse.data.accessToken;
// // //         localStorage.setItem("accessToken", newAccessToken);

// // //         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
// // //         return adminAxiosInstance(originalRequest); // Retry the original request
// // //       } catch (refreshError) {
// // //         console.error("Refresh token failed", refreshError);
// // //         // Optionally redirect to login
// // //         return Promise.reject(refreshError);
// // //       }
// // //     }

// // //     return Promise.reject(error);
// // //   }
// // // );

// // // services/instances/adminInstance.ts
// // import axios from "axios";

// // const API_URL = import.meta.env.VITE_API_URL;

// // export const adminAxiosInstance = axios.create({
// //   baseURL: API_URL,
// //   withCredentials: true, // Important for sending cookies
// // });

// // // Optional retry interceptor if needed
// // adminAxiosInstance.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         await adminAxiosInstance.get("/admin/auth/refresh_token");
// //         return adminAxiosInstance(originalRequest);
// //       } catch (refreshError) {
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export const adminAxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Important for sending cookies
// });

// adminAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       console.log("Attempting to refresh token...");

//       try {
//         const response = await adminAxiosInstance.get(
//           "/admin/auth/refresh_token",
//           {
//             withCredentials: true,
//           }
//         );
//         console.log("Refresh token response:", response.data);

//         return adminAxiosInstance(originalRequest); // Retry original request
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);

//         localStorage.removeItem("adminAccessToken"); // Adjust based on your storage
//         window.location.href = "/admin/login"; // Force redirect to login
//         return Promise.reject(refreshError);
//       }
//     } else if (error.response?.status === 401 && originalRequest._retry) {
//       // Prevent infinite loop: if refresh already failed, redirect to login
//       console.error("Refresh token retry failed, redirecting to login");
//       localStorage.removeItem("adminAccessToken"); // Adjust based on your storage
//       window.location.href = "/admin/login";
//     }

//     return Promise.reject(error);
//   }
// );
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
