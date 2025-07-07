// export interface DecodedGoogleToken {
//   email: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
// }

// interface UserData {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string[];
// }

// export interface GoogleSignInRequest {
//   email: string;
//   firstName: string;
//   lastName: string;
//   profilePicture: string;
// }

// export interface GoogleSignInData {
//   statusCode: number;
//   data: {
//     userFound: boolean | { user: UserData };
//     user: UserData;
//   };
//   message: string;
//   success: boolean;
// }
export interface DecodedGoogleToken {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string[];
  mentorActivated?: boolean; // Added this property
}

export interface GoogleSignInRequest {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface GoogleSignInData {
  statusCode: number;
  data: {
    userFound: UserData; // Changed from 'user' to 'userFound'
  };
  message: string;
  success: boolean;
}
