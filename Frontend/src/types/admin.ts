export interface TAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminPpassword: string;
  profilePicture: string;
}

export interface TAdminLogin {
  adminEmail: string;
  adminPassword: string;
}

export interface TAdminLoginError {
  adminEmail?: string;
  adminPassword?: string;
}
export interface TAdminLoginResponse {
  admin: {
    _id: string;
    firstName: string;
    lastName: string;
    adminEmail: string;
    profilePicture: string;
  };
  accessToken: string;
}
