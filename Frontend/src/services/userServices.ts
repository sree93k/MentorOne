import { userAxiosInstance } from "./instances/userInstance";
import SocketService from "./socketService";
import toast from "react-hot-toast";
const api = userAxiosInstance;

export const validateUserSession = async () => {
  try {
    const response = await userAxiosInstance.get("/user/validate_session", {
      withCredentials: true, // Include cookies
    });
    return response;
  } catch (error: unknown) {
    if (error) {
      return error;
    } else {
      return null;
    }
  }
};

export const getLandingPageData = async () => {
  try {
    console.log("menteeService getDashboardData step 1");

    const response = await api.get("/user/home");
    console.log("menteeService getDashboardData step 2", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("menteeService getDashboardData error", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch dashboard data"
    );
  }
};
// Reset Password
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
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
        withCredentials: true, // Use cookies instead of Authorization header
      }
    );
    console.log("updateUserPassword step 2 response.....,response", response);
    return response;
  } catch (error: any) {
    console.error("Update password error:", error?.response?.data);
    return error?.response?.data;
  }
};

// Delete Profile
export const deleteUserAccount = async () => {
  try {
    console.log("delete account service start");

    const response = await api.delete(`/user/deleteAccount`, {
      withCredentials: true, // Use cookies instead of Authorization header
    });
    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return error;
  }
};

// Update Profile
export const updateUserProfile = async (payload: any) => {
  try {
    console.log("user service updateUserProfile1?????", payload);
    const response = await api.put("/user/profileEdit", payload, {
      withCredentials: true, // Use cookies instead of Authorization header
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("user service updateUserProfile 2", response);
    const updateData = response.data.data;
    console.log("user service updateUserProfile 3", updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Chat History
interface ChatUser {
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

interface ChatHistoryResponse {
  data: ChatUser[];
  message: string;
  statusCode: number;
  success: boolean;
}

// export const getChatHistory = async (
//   dashboard: string
// ): Promise<ChatHistoryResponse> => {
//   try {
//     console.log("userServices: getChatHistory start", { dashboard });

//     const response = await api.get<ChatHistoryResponse>(
//       `/user/${dashboard}/chat-history`,
//       {
//         withCredentials: true, // Use cookies instead of Authorization header
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
export const getChatHistory = async (
  dashboard: string
): Promise<ChatHistoryResponse> => {
  try {
    console.log("userServices: getChatHistory start", { dashboard });

    const response = await api.get<ChatHistoryResponse>(
      `/user/${dashboard}/chat-history`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "userServices: getChatHistory - Full API response",
      response.data
    );

    console.log("userServices: getChatHistory - API response", {
      statusCode: response.data.statusCode,
      dataCount: response.data.data.length,
      message: response.data.message,
    });

    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.error("userServices: getChatHistory - Invalid response format", {
        data: response.data.data,
      });
      throw new Error("Invalid chat history response format");
    }

    // Ensure isOnline is boolean
    const updatedData = response.data.data.map((user) => ({
      ...user,
      isOnline: user.isOnline ?? false,
    }));

    console.log("userServices: getChatHistory - Data processed", {
      userCount: updatedData.length,
    });

    return { ...response.data, data: updatedData };
    // } catch (error: any) {
    //   console.error("userServices: getChatHistory error", {
    //     dashboard,
    //     error: error.message || error,
    //     responseError: error.response?.data?.error,
    //   });
    //   throw new Error(
    //     error.response?.data?.error || "Failed to fetch chat history"
    //   );
    // }
  } catch (error: any) {
    console.error("userServices: getChatHistory error details", {
      dashboard,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const uploadToS3WithPresignedUrl = async (
  file: File,
  folder: "images" | "audio",
  contentType: string
): Promise<string> => {
  try {
    console.log("uploadToS3WithPresignedUrl: Starting", {
      fileName: file.name,
      fileType: contentType,
      folder,
    });

    // Request presigned URL
    const response = await api.get("/user/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: contentType,
        folder,
      },
      withCredentials: true, // Use cookies instead of Authorization header
    });

    console.log(
      "uploadToS3WithPresignedUrl: Presigned URL response",
      response.data
    );

    // Destructure url and key from response.data.url
    const { url, key } = response.data.data.url || {};
    if (!url || !key) {
      throw new Error("Invalid presigned URL response: Missing url or key");
    }

    // Upload to S3
    console.log("uploadToS3WithPresignedUrl: Uploading to", url);
    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("uploadToS3WithPresignedUrl: S3 upload failed", {
        status: uploadResponse.status,
        errorText,
      });
      throw new Error(`S3 upload failed: ${errorText}`);
    }

    const s3Url = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${key}`;
    console.log("uploadToS3WithPresignedUrl: Success", { s3Url });
    return s3Url;
  } catch (error: any) {
    console.error("uploadToS3WithPresignedUrl: Error", {
      message: error.message,
      response: error.response?.data,
    });
    toast.error(error.message || "Failed to upload file");
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

export const getMediaUrl = async (s3Key: string): Promise<string> => {
  try {
    console.log("getMediaUrl: Starting", { s3Key });
    const response = await api.get("/user/get-presigned-url", {
      params: { key: s3Key },
      withCredentials: true, // Use cookies instead of Authorization header
    });
    console.log("getMediaUrl response:", response.data);
    const url = response.data.data?.url;
    if (!url) {
      throw new Error("Invalid presigned URL response: Missing url");
    }
    return url;
  } catch (error: any) {
    console.error("getMediaUrl: Error", {
      message: error.message,
      response: error.response?.data,
    });
    toast.error(error.message || "Failed to fetch media URL");
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};

export const getPresignedUrlForView = async (key: string): Promise<string> => {
  try {
    console.log("getPresignedUrlForView: Starting", { key });
    const response = await api.get("/user/get-presigned-url", {
      params: { key },
      withCredentials: true, // Use cookies instead of Authorization header
    });
    console.log("getPresignedUrlForView response:", response.data);
    const url = response.data.data?.url;
    if (!url) {
      throw new Error("Invalid presigned URL response: Missing url");
    }
    return url;
  } catch (error: any) {
    console.error("getPresignedUrlForView: Error", {
      message: error.message,
      response: error.response?.data,
    });
    toast.error(error.message || "Failed to fetch media URL");
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};

export const startVideoCall = async (
  menteeId?: string,
  bookingId?: string
): Promise<string> => {
  try {
    console.log("USERSERVICE startVideoCall step 1", { menteeId, bookingId });

    const response = await api.post(
      "/user/video-call/create",
      { menteeId, bookingId },
      {
        withCredentials: true, // Use cookies instead of Authorization header
      }
    );

    console.log("USERSERVICE startVideoCall step 2", response);

    if (!response.data.success || !response.data.data.meetingId) {
      throw new Error("Failed to create meeting room");
    }

    return response.data.data.meetingId;
  } catch (error: any) {
    console.error("Error creating meeting:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create meeting room"
    );
  }
};

export const validateMeeting = async (meetingId: string): Promise<boolean> => {
  try {
    console.log("Validating meeting:", meetingId);

    const response = await api.get(`/user/video-call/validate/${meetingId}`, {
      withCredentials: true, // Use cookies instead of Authorization header
    });

    console.log("Validation response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to validate meeting");
    }

    return response.data.data.isValid;
  } catch (error: any) {
    console.error("Error validating meeting:", error);

    if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.response?.status === 404) {
      return false;
    }

    throw new Error(
      error.response?.data?.message || "Failed to validate meeting"
    );
  }
};

export const joinMeeting = async (meetingId: string): Promise<void> => {
  try {
    console.log("user service joinMeeting step 1");
    await api.post(
      `/user/video-call/join/${meetingId}`,
      {},
      {
        withCredentials: true, // Use cookies instead of Authorization header
      }
    );
    console.log("user service joinMeeting step 2");
  } catch (error: any) {
    console.error("Error joining meeting:", error);
    throw new Error(error.response?.data?.message || "Failed to join meeting");
  }
};

export const endMeeting = async (meetingId: string): Promise<void> => {
  try {
    await api.post(
      `/user/video-call/end/${meetingId}`,
      {},
      {
        withCredentials: true, // Use cookies instead of Authorization header
      }
    );
  } catch (error: any) {
    console.error("Error ending meeting:", error);
    throw new Error(error.response?.data?.message || "Failed to end meeting");
  }
};

// Update Online Status
export const updateOnlineStatus = async (
  isOnline: boolean,
  role: string | null
): Promise<any> => {
  try {
    console.log("updateOnlineStatus step 1:", { isOnline, role });

    const payload = {
      isOnline,
      role, // Send role as null for logout, or "mentor"/"mentee"
    };

    const response = await api.put("/user/update-online-status", payload, {
      withCredentials: true, // Use cookies instead of Authorization header
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("updateOnlineStatus step 2, response:", response.data);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update online status"
      );
    }

    return response.data.data; // Return updated user data
  } catch (error: any) {
    console.error("Error updating online status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update online status"
    );
  }
};

interface Notification {
  _id: string;
  recipient: string;
  sender?: { firstName: string; lastName: string };
  type: "payment" | "booking" | "chat";
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get("/user/notifications/unread", {
      withCredentials: true, // Use cookies instead of Authorization header
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  try {
    await api.post(
      `/user/notifications/${notificationId}/read`,
      {},
      {
        withCredentials: true, // Use cookies instead of Authorization header
      }
    );
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark notification as read"
    );
  }
};

export const initializeNotifications = (
  userId: string,
  callback: (notification: Notification) => void
): void => {
  try {
    SocketService.connect("/notifications", userId);
    SocketService.onNewNotification(callback);
  } catch (error: any) {
    console.error("Failed to initialize notifications:", error.message);
    toast.error("Unable to connect to notifications service");
    throw error;
  }
};

export const cleanupNotifications = (): void => {
  SocketService.disconnect("/notifications");
};

export const sendMeetingNotification = async (
  menteeId: string,
  meetingId: string,
  bookingId: string
): Promise<void> => {
  try {
    console.log("sendMeetingNotification step 1", {
      menteeId,
      meetingId,
      bookingId,
    });
    await api.post(
      "/user/video-call/notify",
      { menteeId, meetingId, bookingId },
      {
        withCredentials: true, // Use cookies instead of Authorization header
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "sendMeetingNotification step 2: Notification sent successfully"
    );
  } catch (error: any) {
    console.error("sendMeetingNotification error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to send meeting notification"
    );
  }
};

interface OnlineStatusResponse {
  statusCode: number;
  data: { isOnline: boolean };
  message: string;
}

export const checkUserOnlineStatus = async (
  userId: string
): Promise<boolean> => {
  try {
    const response = await api.get<OnlineStatusResponse>(
      `/user/${userId}/online-status`,
      {
        withCredentials: true, // Use cookies instead of Authorization header
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("checkUserOnlineStatus: API response", response.data);
    if (response.data.statusCode !== 200) {
      throw new Error(response.data.message || "Failed to check online status");
    }

    return response.data.data.isOnline;
  } catch (error: any) {
    console.error("checkUserOnlineStatus: Error", error.message || error);
    throw error;
  }
};
