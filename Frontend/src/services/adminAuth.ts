import { TAdminLogin, TAdminLoginResponse } from "@/types/admin";
import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
  withCredentials: true,
});

export const adminLogin = async (
  userData: TAdminLogin
): Promise<{ response: TAdminLoginResponse }> => {
  try {
    console.log("login service/....Step1..", userData);

    const response: AxiosResponse<TAdminLoginResponse> = await api.post(
      "/admin/auth/login",
      userData
    );
    console.log("login response/....Step2..", response);

    return { response: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const adminLogout = async (): Promise<void> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.clear();
  } catch (error) {
    throw new Error("Logout failed. Please try again.");
  }
};
