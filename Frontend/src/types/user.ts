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
  activated: boolean;
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
  success: boolean;
  data: {
    userFound: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dob: string;
      gender: string;
      role: [string];
      activated: boolean;
      mentorActivated: boolean;
      profilePicture: string;
      bio: string;
      skills: string;
      selfIntro: string;
      achievements: string;
      mentorId: string;
      isBlocked: boolean;
    };
    accessToken: string;
    refreshToken: string; // Add refreshToken since it’s in the response
  };
  message: string;
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

export interface TUserSignUpResponse {
  success: boolean;
  data: {
    userFound: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dob: string;
      gender: string;
      role: [string];
      activated: boolean;
      mentorActivated: boolean;
      profilePicture: string;
      bio: string;
      skills: string;
      selfIntro: string;
      achievements: string;
      mentorId: string;
      isBlocked: boolean;
    };
    accessToken: string;
    refreshToken: string; // Add refreshToken since it’s in the response
  };
  message: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  bookingId: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  isOnline?: boolean;
  bookingStatus?: "pending" | "confirmed" | "completed";
  isActive: boolean;
  otherUserId?: string;
}

export interface ChatHistoryResponse {
  data: ChatUser[];
  message: string;
  statusCode: number;
  success: boolean;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: { firstName: string; lastName: string };
  type: "payment" | "booking" | "chat";
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OnlineStatusResponse {
  statusCode: number;
  data: { isOnline: boolean };
  message: string;
}

export interface ChatNotificationData {
  userId: string;
  role: "mentor" | "mentee";
  count: number;
  chatId: string;
  senderId?: string;
}

export interface ChatUnreadCounts {
  mentorUnreadChats: number;
  menteeUnreadChats: number;
}
