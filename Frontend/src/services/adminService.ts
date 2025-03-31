import { AxiosError } from "axios";
import { TAdmin } from "@/types/admin";
import { adminAxiosInstance } from "./instances/adminInstance";

const api = adminAxiosInstance;

export const login = async (credential: Partial<TAdmin>) => {
  try {
    const response = await api.post("/admin/auth/login", credential);

    if (response.data.success) {
      localStorage.setItem("adminAccessToken", response.data.data.accessToken);
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

export const logout = async () => {
  try {
    const response = await api.patch("/admin/auth/logout", null, {
      withCredentials: true,
    });

    localStorage.removeItem("adminAccessToken");

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

export const validateAdminSession = async () => {
  try {
    const response = await adminAxiosInstance.get("/admin/validate_session");
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};
