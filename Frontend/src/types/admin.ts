export interface TAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminPassword: string;
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

// export interface TAdminLoginResponse {
//   success: boolean;
//   data?: {
//     adminFound: object;
//     accessToken: string;
//   };
//   error?: string;
// }

interface Admin {
  _id: string; // Match API response
  adminEmail: string; // Match API response
  adminName: string; // Match API response
  role: "admin";
  firstName?: string; // Optional fields from response
  lastName?: string;
  profilePicture?: string;
  __v?: number; // Optional MongoDB version key
}

export interface TAdminLoginResponse {
  success: boolean;
  data?: {
    adminFound: Admin; // Use the updated Admin type
    accessToken: string;
  };
  error?: string;
}
// export interface TAdminLoginResponse {
//   success: boolean;
//   data?: {
//     adminFound: {
//       _id: string;
//       adminName: string;
//       adminEmail: string;
//       role: string;
//       __v: number;
//       firstName?: string;
//       lastName?: string;
//       profilePicture?: string;
//     };
//     accessToken: string;
//   };
//   error?: string;
// }
