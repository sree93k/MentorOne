// // import { TAdminLogin, TAdminLoginResponse } from "@/types/admin";
// // import { AxiosError } from "axios";
// // import { userAxiosInstance } from "./instances/userInstance";
// // const api = userAxiosInstance;

// // export const adminLogin = async (
// //   credential: TAdminLogin
// // ): Promise<TAdminLoginResponse> => {
// //   try {
// //     console.log("adminSERVICE  login 1", credential);

// //     const response = await api.post("/admin/auth/login", credential);
// //     console.log("adminSERVICE  login 2 repsonse", response);
// //     const serverData = response.data.response || response.data; // Adjust based on backend
// //     console.log("adminSERVICE  login 3 serverdata", serverData);
// //     if (serverData.success) {
// //       console.log(
// //         "adminSERVICE  login 4 userfound",
// //         serverData.data.adminFound
// //       );
// //       //   localStorage.setItem("adminAccessToken", serverData.data.accessToken);
// //       return {
// //         success: true,
// //         data: {
// //           adminFound: serverData.data.adminFound,
// //           accessToken: serverData.data.accessToken,
// //         },
// //       };
// //       // user: serverData.data.user,
// //     } else {
// //       return {
// //         success: false,
// //         error: serverData.error || "Login failed",
// //       };
// //     }
// //   } catch (error: unknown) {
// //     if (error instanceof AxiosError && error.response) {
// //       return {
// //         success: false,
// //         error: error.response.data.error || "Invalid email or password",
// //       };
// //     }
// //     return {
// //       success: false,
// //       error: "An unexpected error occurred",
// //     };
// //   }
// // };

// // export const logout = async () => {
// //   try {
// //     const response = await api.patch("/admin/auth/logout", null, {
// //       withCredentials: true,
// //     });

// //     localStorage.removeItem("accessToken");

// //     if (response.data.success) {
// //       return response.data;
// //     }

// //     return null;
// //   } catch (error: unknown) {
// //     if (error instanceof AxiosError) {
// //       return error.response;
// //     } else {
// //       return null;
// //     }
// //   }
// // };
// // services/adminAuthService.ts
// import { TAdminLogin, TAdminLoginResponse } from "@/types/admin";
// import { AxiosError } from "axios";
// import { adminAxiosInstance } from "./instances/adminInstance";

// const api = adminAxiosInstance;

// export const adminLogin = async (
//   credential: TAdminLogin
// ): Promise<TAdminLoginResponse> => {
//   try {
//     const response = await api.post("/admin/auth/login", credential, {
//       withCredentials: true,
//     });

//     const serverData = response.data.response || response.data;

//     if (serverData.success) {
//       return {
//         success: true,
//         data: {
//           adminFound: serverData.data.adminFound,
//         },
//       };
//     } else {
//       return {
//         success: false,
//         error: serverData.error || "Login failed",
//       };
//     }
//   } catch (error: unknown) {
//     if (error instanceof AxiosError && error.response) {
//       return {
//         success: false,
//         error: error.response.data.error || "Invalid email or password",
//       };
//     }
//     return {
//       success: false,
//       error: "An unexpected error occurred",
//     };
//   }
// };

// export const logout = async () => {
//   try {
//     await api.patch("/admin/auth/logout", null, {
//       withCredentials: true,
//     });

//     return true;
//   } catch (error) {
//     return false;
//   }
// };
// src/services/adminAuth.ts
import { TAdminLogin, TAdminLoginResponse } from "@/types/admin";
import { AxiosError } from "axios";
import { adminAxiosInstance } from "./instances/adminInstance";

const api = adminAxiosInstance;

export const adminLogin = async (
  credential: TAdminLogin
): Promise<TAdminLoginResponse> => {
  try {
    const response = await api.post("/admin/auth/login", credential, {
      withCredentials: true,
    });

    const serverData = response.data.response || response.data;

    if (serverData.success) {
      return {
        success: true,
        data: {
          adminFound: serverData.data.adminFound,
        },
      };
    } else {
      return {
        success: false,
        error: serverData.message || "Login failed",
      };
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        success: false,
        error: error.response.data.message || "Invalid email or password",
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

export const logout = async () => {
  try {
    await api.patch("/admin/auth/logout", null, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};
