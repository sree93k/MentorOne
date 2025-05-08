// // import axios, { AxiosError, AxiosResponse } from "axios";
// import { userAxiosInstance } from "./instances/userInstance";
// const api = userAxiosInstance;

// //resetPassword
// export const updateUserPassword = async (
//   currentPassword: string,
//   newPassword: string
// ) => {
//   try {
//     // Basic client-side validation
//     const accessToken = localStorage.getItem("accessToken");
//     console.log("updateUserPassword step 1 ", currentPassword, newPassword);

//     if (!newPassword || newPassword.length < 6) {
//       console.log("Password must be at least 6 characters long");

//       return;
//     }
//     console.log("updateUserPassword step 2 sending.....");
//     const response = await api.put(
//       `/user/resetPassword`,
//       { currentPassword, newPassword },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     console.log("updateUserPassword step 2 responsee.....,response", response);
//     return response;
//   } catch (error) {
//     console.error("Update password error:", error?.response?.data);
//     return error?.response?.data;
//   }
// };

// //delete profile
// export const deleteUserAccount = async () => {
//   try {
//     console.log("delete account serbice start");
//     const accessToken = localStorage.getItem("accessToken");

//     const response = await api.delete(`/user/deleteAccount`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     if (response.status == 200) {
//       localStorage.removeItem("accessToken");
//     }
//     return response;
//   } catch (error) {
//     console.error("Delete account error:", error);
//     return error;
//   }
// };

// export const updateUserProfile = async (payload: any) => {
//   try {
//     console.log("user servcie is updateUserProfile1?????", payload);
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await api.put("/user/profileEdit", payload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("user servcie is updateUserProfile 2", response);
//     const updateData = response.data.data;
//     console.log("user servcie is updateUserProfile 3", updateData);
//     return updateData;
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     throw error;
//   }
// };

// interface ChatUser {
//   id: string;
//   name: string;
//   avatar: string;
//   bookingId: string;
//   lastMessage?: string;
//   timestamp?: string;
//   unread?: number;
//   isOnline?: boolean;
// }

// interface ChatHistoryResponse {
//   data: ChatUser[];
//   message: string;
//   status: number;
// }
// export const getChatHistory = async (
//   dashboard: string
// ): Promise<ChatHistoryResponse> => {
//   try {
//     console.log("user service getChatHistory step 1, dashboard:", dashboard);
//     const response = await userAxiosInstance.get<ChatHistoryResponse>(
//       `/user/${dashboard}/chat-history`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("user service getChatHistory step 2, response:", response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error fetching chat history:", error);
//     throw new Error(
//       error.response?.data?.error || "Failed to fetch chat history"
//     );
//   }
// };
// export const uploadToS3WithPresignedUrl = async (
//   file: File,
//   folder: "images" | "audio"
// ): Promise<string> => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       throw new Error("No access token found. Please log in again.");
//     }

//     const response = await api.get("/user/generate-presigned-url", {
//       params: {
//         fileName: file.name,
//         fileType: file.type,
//         folder,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const { url, key } = response.data;

//     const uploadResponse = await fetch(url, {
//       method: "PUT",
//       body: file,
//       headers: {
//         "Content-Type": file.type,
//       },
//     });

//     if (!uploadResponse.ok) {
//       const errorText = await uploadResponse.text();
//       throw new Error(`S3 upload failed: ${errorText}`);
//     }

//     return `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
//       import.meta.env.VITE_AWS_REGION
//     }.amazonaws.com/${key}`;
//   } catch (error: any) {
//     console.error("Error uploading with presigned URL:", error);
//     throw new Error(`Failed to upload file to S3: ${error.message}`);
//   }
// };

// export const getMediaUrl = async (s3Key: string) => {
//   const response = await api.get(`${import.meta.env.VITE_API_URL}/media/url`, {
//     params: { s3Key },
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//     },
//   });
//   return response.data.url;
// };
// export const getPresignedUrlForView = async (key: string): Promise<string> => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       throw new Error("No access token found. Please log in again.");
//     }
//     const response = await api.get("/user/get-presigned-url", {
//       params: { key },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data.url;
//   } catch (error: any) {
//     console.error("Error fetching presigned URL for view:", error);
//     throw new Error(`Failed to fetch presigned URL: ${error.message}`);
//   }
// };
import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

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
  } catch (error) {
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
}

interface ChatHistoryResponse {
  data: ChatUser[];
  message: string;
  statusCode: number;
  success: boolean;
}

export const getChatHistory = async (
  dashboard: string
): Promise<ChatHistoryResponse> => {
  try {
    console.log("user service getChatHistory step 1, dashboard:", dashboard);
    const response = await api.get<ChatHistoryResponse>(
      `/user/${dashboard}/chat-history`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("user service getChatHistory step 2, response:", response.data);
    // Ensure the response data matches the expected structure
    if (!response.data.data || !Array.isArray(response.data.data)) {
      throw new Error("Invalid chat history response format");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch chat history"
    );
  }
};

// Upload to S3
export const uploadToS3WithPresignedUrl = async (
  file: File,
  folder: "images" | "audio",
  contentType: string
): Promise<string> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

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
    const { url, key } = response.data;

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`S3 upload failed: ${errorText}`);
    }

    return `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error("Error uploading with presigned URL:", error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// Get Presigned URL for Media
export const getMediaUrl = async (s3Key: string): Promise<string> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get("/user/get-presigned-url", {
      params: { key: s3Key },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getMediaUrl response:", response.data);
    return response.data.url;
  } catch (error: any) {
    console.error("Error fetching presigned URL for media:", error);
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};

// Get Presigned URL for View (kept for compatibility)
export const getPresignedUrlForView = async (key: string): Promise<string> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get("/user/get-presigned-url", {
      params: { key },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getPresignedUrlForView response:", response.data);
    return response.data.url;
  } catch (error: any) {
    console.error("Error fetching presigned URL for view:", error);
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};
