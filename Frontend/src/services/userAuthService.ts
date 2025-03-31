import axios, { AxiosError, AxiosResponse } from "axios";
import { TUsers, TUserLogin, TUserLoginResponse } from "../types/user";
import { TOTP } from "../types/otp";
import { userAxiosInstance } from "./instance/userInstances";
import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  GoogleSignInData,
  DecodedGoogleToken,
  GoogleSignInRequest,
} from "@/types/googleAuth";
import { log } from "util";

const api = axios.create({
  baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
  withCredentials: true,
});

//isnup otp send
export const sentOTP = async (Credential: Partial<TUsers>) => {
  try {
    console.log("otp senfing", api);
    console.log("credentialsc >>", Credential);

    const response = await api.post("/user/auth/sendOTP", Credential);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};

//signup
export const signUp = async (otpData: TOTP): Promise<boolean> => {
  try {
    console.log("otp data ");
    console.log("otp data", otpData);

    const response = await api.post("/user/auth/signup", otpData);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// userAuthService.ts
export const login = async (
  userData: TUserLogin
): Promise<{ response: TUserLoginResponse }> => {
  try {
    console.log("login service/......", userData);

    const response: AxiosResponse<TUserLoginResponse> = await api.post(
      "/user/auth/login",
      userData
    );
    console.log("login response/......", response);

    return { response: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signInWithGoogle = async (
  credentialResponse: CredentialResponse
): Promise<GoogleSignInData> => {
  try {
    console.log("google auth step 1 service");

    if (!credentialResponse.credential) {
      throw new Error("Google credential is missing");
    }
    console.log("google auth step 2 service");

    const decoded = jwtDecode<DecodedGoogleToken>(
      credentialResponse.credential
    );
    console.log("google auth step 3 service");
    console.log("Decoded Google Data:", decoded);

    // Format the data to send to the backend
    const formattedData: GoogleSignInRequest = {
      email: decoded.email,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      profilePicture: decoded.picture,
    };
    console.log("google auth step 4 service");
    console.log("Formatted Data for Backend:", formattedData);

    // Send the formatted data to the backend
    const response = await api.post("/user/auth/google_signin", formattedData);
    console.log("google auth step 5 service", response);

    // Return the backend response, typed as GoogleSignInData
    return response.data as GoogleSignInData;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Google sign-in failed");
    }
    throw new Error("An unexpected error occurred during Google sign-in");
  }
};

export const logout = async () => {
  try {
    const response = await api.patch("/user/auth/logout", null, {
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

export const sendForgotPasswordOtp = async (email: string) => {
  try {
    console.log("forgot_password_otp step 1");

    const response = await api.post("/user/auth/forgot_password_otp", {
      email,
    });
    console.log("forgot_password_otp step 1"), response;
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("forgot_password_otp error 1", error);
      return error.response;
    } else {
      console.log("forgot_password_otp errro 2,");
      return null;
    }
  }
};

///==>>>>>>>>>>>>>>>>>>>>>>>>
export const verifyForgotPasswordOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    console.log("verifyForgotPasswordOtp 1", email, otp);
    const response = await api.post("/user/auth/otp_verify", {
      otp,
      email,
    });
    console.log("verifyForgotPasswordOtp 2", response);

    return response;
  } catch (error: unknown) {
    console.log("verifyForgotPasswordOtp 3 error", error);
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};

export const resetPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    console.log("reserpassword step 1", email, password);

    const response = await api.patch("/user/auth/forgot_password_reset", {
      password,
      email,
    });
    console.log("reserpassword step 2", response);
    return response;
  } catch (error: unknown) {
    console.log("reserpassword step 3 errro", error);
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Here you would typically:
    // - Make an API call to your backend logout endpoint
    // - Clear local storage/auth tokens
    // - Update auth state
    localStorage.clear();
  } catch (error) {
    throw new Error("Logout failed. Please try again.");
  }
};
///==>>>>>>>>>>>>>>>>>>>>>>>>
