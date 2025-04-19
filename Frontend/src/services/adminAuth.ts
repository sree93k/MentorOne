import { TAdminLogin, TAdminLoginResponse } from "@/types/admin";
import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;
// const api = axios.create({
//   baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
//   withCredentials: true,
// });

export const adminLogin = async (
  credential: TAdminLogin
): Promise<TAdminLoginResponse> => {
  try {
    console.log("adminSERVICE  login 1", credential);

    const response = await api.post("/admin/auth/login", credential);
    console.log("adminSERVICE  login 2 repsonse", response);
    const serverData = response.data.response || response.data; // Adjust based on backend
    console.log("adminSERVICE  login 3 serverdata", serverData);
    if (serverData.success) {
      console.log(
        "adminSERVICE  login 4 userfound",
        serverData.data.adminFound
      );
      //   localStorage.setItem("adminAccessToken", serverData.data.accessToken);
      return {
        success: true,
        data: {
          adminFound: serverData.data.adminFound,
          accessToken: serverData.data.accessToken,
        },
      };
      // user: serverData.data.user,
    } else {
      return {
        success: false,
        error: serverData.error || "Login failed",
      };
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        success: false,
        error: error.response.data.error || "Invalid email or password",
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
    const response = await api.patch("/admin/auth/logout", null, {
      withCredentials: true,
    });

    localStorage.removeItem("accessToken");

    if (response.data.success) {
      return response.data;
    }

    return null;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};
