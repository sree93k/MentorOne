import { userAxiosInstance } from "./instances/userInstance";
import {
  ChatHistoryResponse,
  Notification,
  OnlineStatusResponse,
} from "@/types/user";
import SocketService from "./socketService";
import toast from "react-hot-toast";
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      const error = new Error("No access token found. Please log in again.");
      console.error("❌ getSignedUrl: No access token");
      throw error;
    }

    console.log("🌐 Making request to backend:");
    console.log("- Endpoint: /media/signed-url");
    console.log("- s3Key parameter:", s3KeyOrUrl);
    console.log("- Has access token:", !!accessToken);

    const response = await api.get("/media/signed-url", {
      params: { s3Key: s3KeyOrUrl },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      console.log("Making batch request for URLs:", uncachedUrls);

      const response = await api.post(
        "/media/batch-signed-urls",
        {
          s3Keys: uncachedUrls,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

// Reset Password
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
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
    const accessToken = localStorage.getItem("accessToken");

    const response = await api.delete(`/user/deleteAccount`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      localStorage.removeItem("accessToken");
    }
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
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.put("/user/profileEdit", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const getChatHistory = async (
  dashboard: string
): Promise<ChatHistoryResponse> => {
  try {
    console.log("userServices: getChatHistory start", { dashboard });

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("userServices: getChatHistory - No access token");
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get<ChatHistoryResponse>(
      `/user/${dashboard}/chat-history`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    // Request presigned URL
    const response = await api.get("/user/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: contentType,
        folder,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const startVideoCall = async (
  menteeId?: string,
  bookingId?: string
): Promise<string> => {
  try {
    console.log("USERSERVICE startVideoCall step 1", { menteeId, bookingId });
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.post(
      "/user/video-call/create",
      { menteeId, bookingId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/user/video-call/validate/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    await api.post(
      `/user/video-call/join/${meetingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    await api.post(
      `/user/video-call/end/${meetingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const payload = {
      isOnline,
      role, // Send role as null for logout, or "mentor"/"mentee"
    };

    const response = await api.put("/user/update-online-status", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get("/user/notifications/unread", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    await api.post(
      "/user/video-call/notify",
      { menteeId, meetingId, bookingId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export const checkUserOnlineStatus = async (
  userId: string
): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get<OnlineStatusResponse>(
      `/user/${userId}/online-status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
