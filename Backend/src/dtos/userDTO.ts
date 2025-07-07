// src/dtos/userDTO.ts

export interface UserLoginDTO {
  email: string;
  password: string;
  role: string[];
}

export interface UserSignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  role: string[];
}

export interface UserOTPDTO {
  email: string;
  otp: string;
}

export interface GoogleSignInDTO {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  password: string;
}
