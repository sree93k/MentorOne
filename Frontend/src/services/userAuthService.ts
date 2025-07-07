// import axios, { AxiosError, AxiosResponse } from "axios";
// import {
//   TUsers,
//   TUserLogin,
//   TUserLoginResponse,
//   TUserSignUpResponse,
// } from "../types/user";
// import { TOTP } from "../types/otp";
// import { userAxiosInstance } from "./instances/userInstance";
// import { CredentialResponse } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import {
//   GoogleSignInData,
//   DecodedGoogleToken,
//   GoogleSignInRequest,
// } from "@/types/googleAuth";
// import { access } from "fs";

// const api = userAxiosInstance;

// //isnup otp send
// export const sentOTP = async (Credential: Partial<TUsers>) => {
//   try {
//     console.log("otp senfing", api);
//     console.log("credentialsc >>", Credential);

//     const response = await api.post("/user/auth/sendOTP", Credential);
//     console.log("user auth sendt otp response", response);

//     return response;
//   } catch (error) {
//     console.log("errr is", error?.response?.data);

//     if (error instanceof AxiosError) {
//       return error?.response?.data;
//     } else {
//       return null;
//     }
//   }
// };

// export const validateUserSession = async () => {
//   try {
//     const response = await userAxiosInstance.get("/user/validate_session");
//     return response;
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       return error.response;
//     } else {
//       return null;
//     }
//   }
// };

// //signup
// export const signUp = async (
//   otpData: TOTP
// ): Promise<{ response: TUserSignUpResponse["data"] }> => {
//   try {
//     console.log("otp data ");
//     console.log("otp data", otpData);

//     const response = await api.post("/user/auth/signup", otpData);
//     console.log("sign up response in servuce iu s", response);
//     console.log("response.data.data.  ", response.data.data);

//     return {
//       userFound: response.data.data.user,
//       accessToken: response.data.data.accessToken,
//       refreshToken: response.data.data.refreshToken,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response?.data?.message || "OTP verification failed"
//       );
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };

// export const login = async (
//   userData: TUserLogin
// ): Promise<{ response: TUserLoginResponse["data"] }> => {
//   try {
//     console.log("login service/......start", userData);

//     const response: AxiosResponse<TUserLoginResponse> = await api.post(
//       "/user/auth/login",
//       userData
//     );
//     console.log("login response/..1....", response);
//     console.log("login response/..2....", response.data);
//     console.log("login response/..3....", response.data.data);

//     // Return the response matching the declared type
//     return {
//       response: {
//         userFound: response.data.data.userFound,
//         accessToken: response.data.data.accessToken,
//         refreshToken: response.data.data.refreshToken, // Include refreshToken
//       },
//     };
//   } catch (error) {
//     console.log("login service/......errror 1", error);

//     if (axios.isAxiosError(error)) {
//       console.log("login service/......error 2", error);
//       throw new Error(error.response?.data?.data || "Login failed");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };

// export const signInWithGoogle = async (
//   credentialResponse: CredentialResponse
// ): Promise<GoogleSignInData> => {
//   try {
//     console.log("google auth step 1 service");

//     if (!credentialResponse.credential) {
//       throw new Error("Google credential is missing");
//     }
//     console.log("google auth step 2 service");

//     const decoded = jwtDecode<DecodedGoogleToken>(
//       credentialResponse.credential
//     );
//     console.log("google auth step 3 service");
//     console.log("Decoded Google Data:", decoded);

//     // Format the data to send to the backend
//     const formattedData: GoogleSignInRequest = {
//       email: decoded.email,
//       firstName: decoded.given_name,
//       lastName: decoded.family_name,
//       profilePicture: decoded.picture,
//     };
//     console.log("google auth step 4 service");
//     console.log("Formatted Data for Backend:", formattedData);

//     // Send the formatted data to the backend
//     const response = await api.post("/user/auth/google_signin", formattedData);
//     console.log("google auth step 5 service", response);

//     // Return the backend response, typed as GoogleSignInData
//     return response.data as GoogleSignInData;
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       throw new Error(error.response?.data?.message || "Google sign-in failed");
//     }
//     throw new Error("An unexpected error occurred during Google sign-in");
//   }
// };

// export const logout = async () => {
//   try {
//     console.log("user logout servcie start1 ");

//     const response = await api.patch("/user/auth/logout", null, {
//       withCredentials: true,
//     });
//     console.log("user logout servcie start2 response", response);
//     localStorage.removeItem("accessToken");

//     if (response.data.success) {
//       console.log("user logout servcie start3 finish success");
//       return response.data;
//     }
//     console.log("user logout servcie start3 finish null");
//     return null;
//   } catch (error: unknown) {
//     console.log("user logout servcie start4 ");
//     if (error instanceof AxiosError) {
//       return error.response;
//     } else {
//       return null;
//     }
//   }
// };

// export const sendForgotPasswordOtp = async (email: string) => {
//   try {
//     console.log("forgot_password_otp step 1");

//     const response = await api.post("/user/auth/forgot_password_otp", {
//       email,
//     });
//     console.log("forgot_password_otp step 2", response);
//     return response.data;
//   } catch (error: unknown) {
//     console.log("forgot_password_otp errro ", error);
//     if (error instanceof AxiosError) {
//       console.log("forgot_password_otp error 1", error.response?.data);
//       return error.response?.data;
//     } else {
//       console.log("forgot_password_otp errro 2,");
//       return null;
//     }
//   }
// };

// ///==>>>>>>>>>>>>>>>>>>>>>>>>
// export const verifyForgotPasswordOtp = async ({
//   email,
//   otp,
// }: {
//   email: string;
//   otp: string;
// }) => {
//   try {
//     console.log("verifyForgotPasswordOtp 1", email, otp);
//     const response = await api.post("/user/auth/otp_verify", {
//       otp,
//       email,
//     });
//     console.log("verifyForgotPasswordOtp 2", response);

//     return response;
//   } catch (error: unknown) {
//     console.log("verifyForgotPasswordOtp 3 error", error);
//     if (error instanceof AxiosError) {
//       return error.response;
//     } else {
//       return null;
//     }
//   }
// };

// export const resetPassword = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   try {
//     console.log("reserpassword step 1", email, password);

//     const response = await api.patch("/user/auth/forgot_password_reset", {
//       password,
//       email,
//     });
//     console.log("reserpassword step 2", response);
//     return response;
//   } catch (error: unknown) {
//     console.log("reserpassword step 3 errro", error);
//     if (error instanceof AxiosError) {
//       return error.response;
//     } else {
//       return null;
//     }
//   }
// };
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  TUsers,
  TUserLogin,
  TUserLoginResponse,
  TUserSignUpResponse,
} from "../types/user";
import { TOTP } from "../types/otp";
import { userAxiosInstance } from "./instances/userInstance";
import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  GoogleSignInData,
  DecodedGoogleToken,
  GoogleSignInRequest,
} from "@/types/googleAuth";

const api = userAxiosInstance;

// Signup OTP send
export const sentOTP = async (Credential: Partial<TUsers>) => {
  try {
    console.log("otp sending", api);
    console.log("credentials >>", Credential);

    const response = await api.post("/user/auth/sendOTP", Credential, {
      withCredentials: true, // Include cookies
    });
    console.log("user auth send otp response", response);

    return response;
  } catch (error) {
    console.log("error is", error?.response?.data);

    if (error instanceof AxiosError) {
      return error?.response?.data;
    } else {
      return null;
    }
  }
};

export const validateUserSession = async () => {
  try {
    const response = await userAxiosInstance.get("/user/validate_session", {
      withCredentials: true, // Include cookies
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};

// Signup
export const signUp = async (
  otpData: TOTP
): Promise<{ response: TUserSignUpResponse["data"] }> => {
  try {
    console.log("otp data");
    console.log("otp data", otpData);

    const response = await api.post("/user/auth/signup", otpData, {
      withCredentials: true, // Include cookies
    });
    console.log("sign up response in service is", response);
    console.log("response.data.data.", response.data.data);

    // No need to store tokens in localStorage anymore - they're in cookies
    return {
      userFound: response.data.data.user,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const login = async (
  userData: TUserLogin
): Promise<{ response: TUserLoginResponse["data"] }> => {
  try {
    console.log("login service......start", userData);

    const response: AxiosResponse<TUserLoginResponse> = await api.post(
      "/user/auth/login",
      userData,
      {
        withCredentials: true, // Include cookies
      }
    );
    console.log("login response..1....", response);
    console.log("login response..2....", response.data);
    console.log("login response..3....", response.data.data);

    // No need to store tokens in localStorage anymore - they're in cookies
    return {
      response: {
        userFound: response.data.data.userFound,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      },
    };
  } catch (error) {
    console.log("login service......error 1", error);

    if (axios.isAxiosError(error)) {
      console.log("login service......error 2", error);
      throw new Error(error.response?.data?.data || "Login failed");
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
    const response = await api.post("/user/auth/google_signin", formattedData, {
      withCredentials: true, // Include cookies
    });
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
    console.log("user logout service start1");

    const response = await api.patch("/user/auth/logout", null, {
      withCredentials: true, // Include cookies
    });
    console.log("user logout service start2 response", response);

    // No need to remove localStorage tokens anymore - cookies are handled by server

    if (response.data.success) {
      console.log("user logout service start3 finish success");
      return response.data;
    }
    console.log("user logout service start3 finish null");
    return null;
  } catch (error: unknown) {
    console.log("user logout service start4");
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

    const response = await api.post(
      "/user/auth/forgot_password_otp",
      { email },
      {
        withCredentials: true, // Include cookies
      }
    );
    console.log("forgot_password_otp step 2", response);
    return response.data;
  } catch (error: unknown) {
    console.log("forgot_password_otp error", error);
    if (error instanceof AxiosError) {
      console.log("forgot_password_otp error 1", error.response?.data);
      return error.response?.data;
    } else {
      console.log("forgot_password_otp error 2");
      return null;
    }
  }
};

export const verifyForgotPasswordOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    console.log("verifyForgotPasswordOtp 1", email, otp);
    const response = await api.post(
      "/user/auth/otp_verify",
      { otp, email },
      {
        withCredentials: true, // Include cookies
      }
    );
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
    console.log("resetPassword step 1", email, password);

    const response = await api.patch(
      "/user/auth/forgot_password_reset",
      { password, email },
      {
        withCredentials: true, // Include cookies
      }
    );
    console.log("resetPassword step 2", response);
    return response;
  } catch (error: unknown) {
    console.log("resetPassword step 3 error", error);
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};
