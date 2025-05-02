// import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

//resetPassword
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Basic client-side validation
    const accessToken = localStorage.getItem("accessToken");
    console.log("updateUserPassword step 1 ", currentPassword, newPassword);

    if (!newPassword || newPassword.length < 6) {
      console.log("Password must be at least 6 characters long");

      return;
    }
    console.log("updateUserPassword step 2 sending.....");
    const response = await api.put(
      `/user/resetPassword`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updateUserPassword step 2 responsee.....,response", response);
    return response;
  } catch (error) {
    console.error("Update password error:", error?.response?.data);
    return error?.response?.data;
  }
};

//delete profile
export const deleteUserAccount = async () => {
  try {
    console.log("delete account serbice start");
    const accessToken = localStorage.getItem("accessToken");

    const response = await api.delete(`/user/deleteAccount`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status == 200) {
      localStorage.removeItem("accessToken");
    }
    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return error;
  }
};

export const updateUserProfile = async (payload: any) => {
  try {
    console.log("user servcie is updateUserProfile1?????", payload);
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.put("/user/profileEdit", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("user servcie is updateUserProfile 2", response);
    const updateData = response.data.data;
    console.log("user servcie is updateUserProfile 3", updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  bookingId: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  isOnline?: boolean;
}

interface ChatHistoryResponse {
  data: ChatUser[];
  message: string;
  status: number;
}
export const getChatHistory = async (
  dashboard: string
): Promise<ChatHistoryResponse> => {
  try {
    console.log("user service getChatHistory step 1, dashboard:", dashboard);
    const response = await userAxiosInstance.get<ChatHistoryResponse>(
      `/user/${dashboard}/chat-history`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("user service getChatHistory step 2, response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch chat history"
    );
  }
};
