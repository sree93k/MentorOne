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

export const debugCookies = async (): Promise<void> => {
  try {
    console.log("🍪 === FRONTEND COOKIE DEBUG ===");
    console.log("🍪 Document cookies:", document.cookie);

    const response = await adminAxiosInstance.get("/admin/test-cookies", {
      withCredentials: true,
    });

    console.log("🍪 Test cookie response:", response.data);
    console.log("🍪 Document cookies after test:", document.cookie);
  } catch (error) {
    console.error("🍪 Cookie test failed:", error);
  }
};
