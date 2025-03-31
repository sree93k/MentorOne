export interface TUsers {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
  gender: string;
  role: [string]; // No error, as no index signature restricts this
  profilePicture: string;
  bio: string;
  skills: string;
  selfIntro: string;
  achievements: string;
  mentorId: string;
  isBlocked: boolean;
}

export interface TUserLogin {
  email: string;
  password: string;
  role: [string];
}

export interface TUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phone: string;
  role: [string]; // No error here either
}

export interface TUserLoginResponse {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    role: [string];
    profilePicture: string;
    bio: string;
    skills: string;
    selfIntro: string;
    achievements: string;
    mentorId: string;
    isBlocked: boolean;
  }; // No error, as user can be an object
  accessToken: string;
}

export interface TUserLoginError {
  email?: string;
  password?: string;
  role?: [string];
}

export interface TUserSignUpError {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  phone?: string;
}
