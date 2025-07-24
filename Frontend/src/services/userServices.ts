import { userAxiosInstance } from "./instances/userInstance";
import {
  ChatHistoryResponse,
  Notification,
  OnlineStatusResponse,
} from "@/types/user";
import SocketService from "./socketService";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const api = userAxiosInstance;

// Cache for signed URLs to avoid repeated requests
const urlCache = new Map<string, { url: string; expiry: number }>();

export const getSignedUrl = async (s3KeyOrUrl: string): Promise<string> => {
  console.log("🌐 getSignedUrl Service Called:");
  console.log("- Input s3KeyOrUrl:", s3KeyOrUrl);

  if (!s3KeyOrUrl) {
    const error = new Error("S3 key or URL is required");
    console.error("❌ getSignedUrl: No input provided");
    throw error;
  }

  // If it's already a regular HTTP URL (not S3), return as is
  if (s3KeyOrUrl.startsWith("http") && !s3KeyOrUrl.includes("amazonaws.com")) {
    console.log("🌐 Not an S3 URL, returning as is:", s3KeyOrUrl);
    return s3KeyOrUrl;
  }

  // Check cache first
  const cached = urlCache.get(s3KeyOrUrl);
  if (cached && cached.expiry > Date.now()) {
    console.log("💾 getSignedUrl: Using cached URL");
    return cached.url;
  }

  try {
    console.log("🌐 Making request to backend:");
    console.log("- Endpoint: /media/signed-url");
    console.log("- s3Key parameter:", s3KeyOrUrl);
    console.log("- Using cookies for authentication");

    // ✅ CHANGED: No Authorization header needed - cookies sent automatically
    const response = await api.get("/media/signed-url", {
      params: { s3Key: s3KeyOrUrl },
      // No Authorization header needed
    });

    console.log("🌐 Backend Response:");
    console.log("- Status:", response.status);
    console.log("- Status Text:", response.statusText);
    console.log("- Response data:", response.data);

    if (!response.data || !response.data.data || !response.data.data.url) {
      const error = new Error("Invalid response format from backend");
      console.error("❌ getSignedUrl: Invalid response format:", response.data);
      throw error;
    }

    const signedUrl = response.data.data.url;
    const expiresIn = response.data.data.expiresIn || 3600;

    console.log("✅ getSignedUrl: Success");
    console.log("- Original URL/Key:", s3KeyOrUrl);
    console.log("- Signed URL:", signedUrl);
    console.log("- Expires in:", expiresIn, "seconds");

    // Cache the URL (expire 5 minutes before actual expiry for safety)
    urlCache.set(s3KeyOrUrl, {
      url: signedUrl,
      expiry: Date.now() + (expiresIn - 300) * 1000,
    });

    return signedUrl;
  } catch (error: any) {
    console.error("❌ getSignedUrl: Error occurred");
    console.error("- Original URL/Key:", s3KeyOrUrl);
    console.error("- Error type:", error.constructor.name);
    console.error("- Error message:", error.message);
    console.error("- Error response:", error.response?.data);
    console.error("- Error status:", error.response?.status);

    // Fallback to original URL if it's a full S3 URL
    if (s3KeyOrUrl.includes("amazonaws.com")) {
      console.warn("🔧 getSignedUrl: Falling back to original S3 URL");
      return s3KeyOrUrl;
    }

    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
};

// Helper function to get multiple signed URLs at once
export const getBatchSignedUrls = async (
  s3KeysOrUrls: string[]
): Promise<Record<string, string>> => {
  if (!s3KeysOrUrls || s3KeysOrUrls.length === 0) {
    return {};
  }

  // Filter out non-S3 URLs and already cached URLs
  const s3Urls = s3KeysOrUrls.filter(
    (url) => url && (url.includes("amazonaws.com") || !url.startsWith("http"))
  );

  const uncachedUrls = s3Urls.filter((url) => {
    const cached = urlCache.get(url);
    return !cached || cached.expiry <= Date.now();
  });

  // Get cached URLs
  const result: Record<string, string> = {};
  s3KeysOrUrls.forEach((url) => {
    if (!url) return;

    // If it's not an S3 URL, return as is
    if (url.startsWith("http") && !url.includes("amazonaws.com")) {
      result[url] = url;
      return;
    }

    const cached = urlCache.get(url);
    if (cached && cached.expiry > Date.now()) {
      result[url] = cached.url;
    }
  });

  // Fetch uncached URLs
  if (uncachedUrls.length > 0) {
    try {
      console.log("Making batch request for URLs:", uncachedUrls);

      // ✅ CHANGED: No Authorization header needed - cookies sent automatically
      const response = await api.post("/media/batch-signed-urls", {
        s3Keys: uncachedUrls,
      });

      console.log("Batch signed URLs response:", response.data);

      response.data.data.forEach((item: any) => {
        if (item.success) {
          result[item.s3Key] = item.url;
          // Cache the URL
          urlCache.set(item.s3Key, {
            url: item.url,
            expiry: Date.now() + 3300 * 1000, // 55 minutes
          });
        } else {
          // Fallback to original URL if it's a full S3 URL
          if (item.s3Key.includes("amazonaws.com")) {
            result[item.s3Key] = item.s3Key;
          }
        }
      });
    } catch (error: any) {
      console.error("Error getting batch signed URLs:", error);
      // Fallback to original URLs for S3 URLs
      uncachedUrls.forEach((url) => {
        if (url.includes("amazonaws.com")) {
          result[url] = url;
        }
      });
    }
  }

  return result;
};

// Helper function to process data with S3 keys and add signed URLs
export const processDataWithSignedUrls = async <T extends Record<string, any>>(
  data: T[],
  s3KeyFields: string[]
): Promise<T[]> => {
  // Collect all S3 keys
  const allS3Keys = new Set<string>();
  data.forEach((item) => {
    s3KeyFields.forEach((field) => {
      const value = getNestedValue(item, field);
      if (value && typeof value === "string") {
        allS3Keys.add(value);
      }
    });
  });

  // Get signed URLs for all keys
  const signedUrls = await getBatchSignedUrls(Array.from(allS3Keys));

  // Add signed URLs to data
  return data.map((item) => {
    const processedItem = { ...item };
    s3KeyFields.forEach((field) => {
      const s3Key = getNestedValue(item, field);
      if (s3Key && signedUrls[s3Key]) {
        setNestedValue(processedItem, `${field}SignedUrl`, signedUrls[s3Key]);
      }
    });
    return processedItem;
  });
};

// Helper functions for nested object access
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

// ✅ CHANGED: Reset Password - Remove accessToken usage
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    console.log("updateUserPassword step 1", currentPassword, newPassword);

    if (!newPassword || newPassword.length < 6) {
      console.log("Password must be at least 6 characters long");
      return;
    }
    console.log("updateUserPassword step 2 sending.....");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/user/resetPassword", {
      currentPassword,
      newPassword,
    });

    console.log("updateUserPassword step 2 response.....,response", response);
    return response;
  } catch (error: any) {
    console.error("Update password error:", error?.response?.data);
    return error?.response?.data;
  }
};

// ✅ CHANGED: Delete Profile - Remove accessToken usage
export const deleteUserAccount = async () => {
  try {
    console.log("delete account service start");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.delete("/user/deleteAccount");

    // ✅ CHANGED: Don't remove accessToken from localStorage (it's not there)
    if (response.status === 200) {
      // Clear any app-specific data if needed
      localStorage.removeItem("user_preferences");
    }
    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return error;
  }
};

// ✅ CHANGED: Update Profile - Remove accessToken usage
export const updateUserProfile = async (payload: any) => {
  try {
    console.log("user service updateUserProfile1?????", payload);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/user/profileEdit", payload, {
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

// ✅ CHANGED: Get Chat History - Remove accessToken usage
export const getChatHistory = async (
  dashboard: string
): Promise<ChatHistoryResponse> => {
  try {
    console.log("userServices: getChatHistory start", { dashboard });

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get<ChatHistoryResponse>(
      `/user/${dashboard}/chat-history`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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

    // Process data to add signed URLs for profile pictures
    const processedData = await processDataWithSignedUrls(response.data.data, [
      "profilePicture",
    ]);

    console.log("userServices: getChatHistory - Data processed", {
      userCount: processedData.length,
    });

    return { ...response.data, data: processedData };
  } catch (error: any) {
    console.error("userServices: getChatHistory error", {
      dashboard,
      error: error.message || error,
      responseError: error.response?.data?.error,
    });
    throw new Error(
      error.response?.data?.error || "Failed to fetch chat history"
    );
  }
};

// ✅ CHANGED: Upload to S3 - Remove accessToken usage
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

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/user/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: contentType,
        folder,
      },
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

// Update your existing functions to use signed URLs
export const getMediaUrl = async (s3Key: string): Promise<string> => {
  return getSignedUrl(s3Key);
};

export const getPresignedUrlForView = async (key: string): Promise<string> => {
  return getSignedUrl(key);
};

// ✅ CHANGED: Start Video Call - Remove accessToken usage
export const startVideoCall = async (
  menteeId?: string,
  bookingId?: string
): Promise<string> => {
  try {
    console.log("USERSERVICE startVideoCall step 1", { menteeId, bookingId });

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post("/user/video-call/create", {
      menteeId,
      bookingId,
    });

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

// ✅ CHANGED: Validate Meeting - Remove accessToken usage
export const validateMeeting = async (meetingId: string): Promise<boolean> => {
  try {
    console.log("Validating meeting:", meetingId);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/user/video-call/validate/${meetingId}`);

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

// ✅ CHANGED: Join Meeting - Remove accessToken usage
export const joinMeeting = async (meetingId: string): Promise<void> => {
  try {
    console.log("user service joinMeeting step 1");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.post(`/user/video-call/join/${meetingId}`, {});

    console.log("user service joinMeeting step 2");
  } catch (error: any) {
    console.error("Error joining meeting:", error);
    throw new Error(error.response?.data?.message || "Failed to join meeting");
  }
};

// ✅ CHANGED: End Meeting - Remove accessToken usage
export const endMeeting = async (meetingId: string): Promise<void> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.post(`/user/video-call/end/${meetingId}`, {});
  } catch (error: any) {
    console.error("Error ending meeting:", error);
    throw new Error(error.response?.data?.message || "Failed to end meeting");
  }
};

// ✅ CHANGED: Update Online Status - Remove accessToken usage
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

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/user/update-online-status", payload, {
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

// ✅ CHANGED: Get Unread Notifications - Remove accessToken usage
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/user/notifications/unread");

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

// ✅ CHANGED: Mark Notification as Read - Remove accessToken usage
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.post(`/user/notifications/${notificationId}/read`, {});
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
    console.log(
      "🔔 userServices: Initializing basic notifications for user:",
      userId
    );
    SocketService.connect("/notifications", userId);
    SocketService.onNewNotification(callback);
    console.log("✅ userServices: Basic notifications initialized");
  } catch (error: any) {
    console.error(
      "❌ userServices: Failed to initialize basic notifications:",
      error.message
    );
    toast.error("Unable to connect to notifications service");
    throw error;
  }
};
export const isNotificationConnected = (): boolean => {
  return SocketService.isNotificationSocketConnected();
};
export const cleanupNotifications = (): void => {
  console.log("🧹 userServices: Cleaning up notifications");
  try {
    SocketService.offAllNotificationListeners();
    SocketService.disconnect("/notifications");
    console.log("✅ userServices: Notifications cleaned up successfully");
  } catch (error: any) {
    console.error("❌ userServices: Error during notification cleanup:", error);
  }
};
export const reconnectNotifications = (userId: string): void => {
  console.log("🔄 userServices: Reconnecting notifications for user:", userId);
  try {
    SocketService.reconnectNotifications(userId);
    console.log("✅ userServices: Notifications reconnected successfully");
  } catch (error: any) {
    console.error("❌ userServices: Error reconnecting notifications:", error);
  }
};

// ✅ CHANGED: Send Meeting Notification - Remove accessToken usage
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

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.post(
      "/user/video-call/notify",
      {
        menteeId,
        meetingId,
        bookingId,
      },
      {
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

// ✅ CHANGED: Check User Online Status - Remove accessToken usage
export const checkUserOnlineStatus = async (
  userId: string
): Promise<boolean> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get<OnlineStatusResponse>(
      `/user/${userId}/online-status`,
      {
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

export const getNotificationCounts = async (): Promise<{
  mentorCount: number;
  menteeCount: number;
}> => {
  try {
    console.log("📊 userServices: Fetching notification counts");
    const response = await api.get("/user/notifications/counts");
    console.log(
      "📊 userServices: Notification counts response:",
      response.data
    );
    return response.data.data;
  } catch (error: any) {
    console.error(
      "📊 userServices: Error fetching notification counts:",
      error
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch notification counts"
    );
  }
};

// NEW: Get role-specific notifications
export const getRoleSpecificNotifications = async (
  role: "mentor" | "mentee"
): Promise<Notification[]> => {
  try {
    console.log(`🔔 userServices: Fetching ${role} notifications`);
    const response = await api.get(`/user/notifications/unread?role=${role}`);
    console.log(
      `🔔 userServices: ${role} notifications response:`,
      response.data
    );
    return response.data.data;
  } catch (error: any) {
    console.error(
      `🔔 userServices: Error fetching ${role} notifications:`,
      error
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

export const initializeNotificationsWithCounts = (
  userId: string,
  onNewNotification: (notification: any) => void,
  onCountUpdate: (data: {
    role: "mentor" | "mentee";
    increment: number;
  }) => void
): void => {
  try {
    console.log(
      "🔔 userServices: Initializing notifications with counts for user:",
      userId
    );

    // Connect to notification socket
    SocketService.connect("/notifications", userId);

    // Set up notification listeners
    SocketService.onNewNotification(onNewNotification);
    SocketService.onNotificationCountUpdate(onCountUpdate);

    // Get initial counts
    SocketService.getNotificationCounts((response: any) => {
      if (response.success) {
        console.log(
          "📊 userServices: Initial notification counts received:",
          response.counts
        );
        // The counts will be handled in the component via onCountUpdate if needed
      } else {
        console.error(
          "📊 userServices: Failed to get initial counts:",
          response.error
        );
      }
    });

    console.log("✅ userServices: Notifications initialized successfully");
  } catch (error: any) {
    console.error(
      "❌ userServices: Failed to initialize notifications:",
      error.message
    );
    // Don't throw here, just log the error to prevent app crashes
  }
};
// NEW: Clear notification count for role
export const clearNotificationCountForRole = (
  role: "mentor" | "mentee"
): void => {
  console.log(`🧹 userServices: Clearing notification count for ${role}`);
  try {
    SocketService.clearNotificationCount(role, (response: any) => {
      if (response?.success) {
        console.log(
          `✅ userServices: Successfully cleared ${role} notification count`
        );
      } else {
        console.warn(
          `⚠️ userServices: Failed to clear ${role} notification count:`,
          response?.error
        );
      }
    });
  } catch (error: any) {
    console.error(
      `❌ userServices: Error clearing ${role} notification count:`,
      error
    );
  }
};

// Add these new functions to your existing userServices.ts file

// NEW: Get chat unread counts
export const getChatUnreadCounts = async (): Promise<{
  mentorUnreadChats: number;
  menteeUnreadChats: number;
}> => {
  try {
    console.log("📊 userServices: Fetching chat unread counts");
    const response = await api.get("/user/chat/unread-counts");
    console.log("📊 userServices: Chat unread counts response:", response.data);

    // Ensure we return valid numbers
    const data = response.data.data;
    return {
      mentorUnreadChats:
        typeof data.mentorUnreadChats === "number" ? data.mentorUnreadChats : 0,
      menteeUnreadChats:
        typeof data.menteeUnreadChats === "number" ? data.menteeUnreadChats : 0,
    };
  } catch (error: any) {
    console.error("📊 userServices: Error fetching chat unread counts:", error);

    // Return zero counts if there's an error (don't throw)
    return {
      mentorUnreadChats: 0,
      menteeUnreadChats: 0,
    };
  }
};

// NEW: Initialize chat notifications with socket
export const initializeChatNotifications = (
  userId: string,
  onChatNotificationUpdate: (data: {
    userId: string;
    role: "mentor" | "mentee";
    count: number;
    chatId: string;
    senderId?: string;
  }) => void
): Socket | null => {
  try {
    console.log(
      "💬 userServices: Initializing chat notifications for user:",
      userId
    );

    // Check authentication
    const isAuth = checkAuthStatus();
    if (!isAuth) {
      console.log("❌ userServices: Not authenticated for chat notifications");
      return null;
    }

    // Connect to chat socket
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(
        "💬 userServices: Connected to chat socket for notifications"
      );
    });

    socket.on("chatNotificationUpdate", (data) => {
      console.log("💬 userServices: Received chat notification update:", data);
      onChatNotificationUpdate(data);
    });

    socket.on("connect_error", (error) => {
      console.error("💬 userServices: Chat socket connection error:", error);
    });

    console.log("✅ userServices: Chat notifications initialized");
    return socket;
  } catch (error: any) {
    console.error(
      "❌ userServices: Failed to initialize chat notifications:",
      error.message
    );
    return null;
  }
};

// ✅ NEW: Clean up chat notifications
export const cleanupChatNotifications = (socket: Socket | null): void => {
  if (socket) {
    console.log("🧹 userServices: Cleaning up chat notifications");
    try {
      socket.off("chatNotificationUpdate");
      socket.disconnect();
      console.log("✅ userServices: Chat notifications cleaned up");
    } catch (error: any) {
      console.error(
        "❌ userServices: Error cleaning up chat notifications:",
        error
      );
    }
  }
};

// ✅ NEW: Check authentication status (FRONTEND FUNCTION)
export const checkAuthStatus = (): boolean => {
  console.log("🔍 userServices: Checking authentication");
  console.log("🔍 All cookies:", document.cookie);

  // Check the readable cookie
  const isAuthenticated = getCookie("isAuthenticated");
  console.log("🔍 isAuthenticated cookie value:", isAuthenticated);

  const result = isAuthenticated === "true";
  console.log("🔍 checkAuthStatus result:", result);

  return result;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    console.log("🔍 getCookie: Running in server environment");
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    console.log(`🔍 getCookie: Found ${name} =`, cookieValue);
    return cookieValue || null;
  }

  console.log(`🔍 getCookie: ${name} not found`);
  return null;
};

// ✅ NEW: Mark chat as read (for when user opens a specific chat)
export const markChatAsRead = async (chatId: string): Promise<boolean> => {
  try {
    console.log("💬 userServices: Marking chat as read:", chatId);

    const response = await api.post(
      `/user/chat/${chatId}/mark-read`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      console.log("✅ userServices: Chat marked as read successfully");
      return true;
    } else {
      console.error(
        "❌ userServices: Failed to mark chat as read:",
        response.data.message
      );
      return false;
    }
  } catch (error: any) {
    console.error("❌ userServices: Error marking chat as read:", error);
    return false;
  }
};

// ✅ NEW: Get unread message count for a specific chat
export const getChatUnreadMessageCount = async (
  chatId: string
): Promise<number> => {
  try {
    console.log("💬 userServices: Getting unread count for chat:", chatId);

    const response = await api.get(`/user/chat/${chatId}/unread-count`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const count = response.data.data.unreadCount || 0;
    console.log("💬 userServices: Unread count for chat:", chatId, "=", count);
    return count;
  } catch (error: any) {
    console.error("❌ userServices: Error getting chat unread count:", error);
    return 0;
  }
};

export class ChatNotificationManager {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private onUpdateCallback:
    | ((data: {
        userId: string;
        role: "mentor" | "mentee";
        count: number;
        chatId: string;
        senderId?: string;
      }) => void)
    | null = null;

  constructor() {
    console.log("💬 ChatNotificationManager: Initialized");
  }

  // Initialize with user ID and callback
  initialize(
    userId: string,
    onUpdate: (data: {
      userId: string;
      role: "mentor" | "mentee";
      count: number;
      chatId: string;
      senderId?: string;
    }) => void
  ): boolean {
    try {
      console.log("💬 ChatNotificationManager: Initializing for user:", userId);

      this.userId = userId;
      this.onUpdateCallback = onUpdate;

      // Initialize socket connection
      this.socket = initializeChatNotifications(userId, onUpdate);

      return this.socket !== null;
    } catch (error: any) {
      console.error(
        "❌ ChatNotificationManager: Initialization failed:",
        error
      );
      return false;
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Reconnect if disconnected
  reconnect(): void {
    if (this.userId && this.onUpdateCallback) {
      console.log("🔄 ChatNotificationManager: Reconnecting...");
      this.cleanup();
      this.initialize(this.userId, this.onUpdateCallback);
    }
  }

  // Clean up connections
  cleanup(): void {
    console.log("🧹 ChatNotificationManager: Cleaning up");
    if (this.socket) {
      cleanupChatNotifications(this.socket);
      this.socket = null;
    }
    this.userId = null;
    this.onUpdateCallback = null;
  }

  // Get current socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

// ✅ Export singleton instance
export const chatNotificationManager = new ChatNotificationManager();
