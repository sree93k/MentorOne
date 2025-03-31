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
    user: UserData;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}
