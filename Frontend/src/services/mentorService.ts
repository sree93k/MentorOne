import { userAxiosInstance } from "./instances/userInstance";
import {
  UpdateUserDataPayload,
  Service,
  GetAllServicesParams,
  GetAllServicesResponse,
} from "@/types/mentor";
const api = userAxiosInstance;

// ✅ CHANGED: Upload Image - Remove accessToken usage
export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("image upload stepp1", imageFile);

    // Sanitize file name: replace spaces and special characters
    const sanitizedFileName = imageFile.name
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace non-alphanumeric characters (except ._-)
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    console.log("image upload stepp2.5: Sanitized file name", uniqueFileName);

    const formData = new FormData();
    formData.append("image", imageFile, uniqueFileName); // Use sanitized file name
    console.log("image upload stepp4......", formData);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post("/user/upload_image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("image upload stepp5");
    console.log("Image upload response:", response.data.data);
    return response.data.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// ✅ CHANGED: Upload Mentor Welcome Form - Remove accessToken usage
export const uploadMentorWelcomeForm = async (
  formData: UpdateUserDataPayload,
  id: string
) => {
  try {
    console.log("mentor welcome service 1", formData, id);

    const payload1 = { ...formData, id };
    console.log("mentor welcome service 4", payload1);
    const payload = payload1;
    console.log("Payload to API: sending...........", payload);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/expert/welcomeform", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API response:...........", response);
    console.log("API response inner data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// ✅ CHANGED: Get User Details - Remove accessToken usage
export const getUserDetails = async (userId: string) => {
  console.log("mentor profile service step1", userId);

  // ✅ CHANGED: No Authorization header - cookies sent automatically
  const response = await api.get(`/expert/profile/${userId}`);

  console.log("MMMMMMMMmentor profile service step2 response", response);
  return response.data;
};

// ✅ CHANGED: Update Mentor Data - Remove accessToken usage
export const updateMentorDatas = async (payload: any) => {
  try {
    console.log("user servcie is updateUserProfile1?????", payload);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/expert/update_mentor", payload, {
      headers: {
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

// ✅ CHANGED: Upload to S3 with Presigned URL - Remove accessToken usage
export const uploadToS3WithPresignedUrl = async (
  file: File,
  folder: string
): Promise<{ url: string; key: string }> => {
  try {
    console.log("uploadToS3WithPresignedUrl service step 1");

    console.log("Requesting presigned URL for:", file.name, folder);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: file.type,
        folder,
      },
    });

    const { url, key } = response.data.data.url;
    console.log("Received presigned DATA:", response);
    console.log("Received presigned URL:", url, "Key:", key);

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "x-amz-server-side-encryption": "AES256",
      },
    });
    console.log("S3 upload response status:", uploadResponse.status);
    console.log("S3 upload response ok:", uploadResponse.ok);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("S3 upload error:", errorText);
      throw new Error(`S3 upload failed: ${errorText}`);
    }

    const uploadedUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${key}`;
    console.log("File uploaded successfully:", uploadedUrl);
    
    // 🔒 SECURITY: Return both URL and key for signed URL system
    return { url: uploadedUrl, key };
  } catch (error: any) {
    console.error("Error uploading with presigned URL:", error);
    
    // 🔧 FALLBACK: Try backend upload if presigned URL fails (CORS issues)
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      console.log("🔧 CORS detected, trying backend upload fallback...");
      try {
        return await uploadVideoToBackend(file);
      } catch (backendError: any) {
        console.error("Backend upload fallback also failed:", backendError);
        throw new Error(`Both upload methods failed. Presigned: ${error.message}, Backend: ${backendError.message}`);
      }
    }
    
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// 🔧 BACKEND VIDEO UPLOAD - Fallback for CORS issues
export const uploadVideoToBackend = async (
  file: File
): Promise<{ url: string; key: string }> => {
  try {
    console.log("🔧 uploadVideoToBackend: Starting backend upload", {
      fileName: file.name,
      fileSize: file.size
    });

    const formData = new FormData();
    formData.append('video', file);

    const response = await api.post("/expert/upload-video-backend", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add progress tracking if needed
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`🔧 Upload progress: ${percentCompleted}%`);
        }
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Backend upload failed");
    }

    const { s3Key, videoUrl } = response.data.data;
    
    console.log("✅ uploadVideoToBackend: Success", {
      s3Key,
      videoUrl
    });

    return { 
      url: videoUrl, 
      key: s3Key 
    };

  } catch (error: any) {
    console.error("🚫 uploadVideoToBackend: Error", error);
    throw new Error(`Backend upload failed: ${error.response?.data?.error || error.message}`);
  }
};

// ✅ CHANGED: Get Presigned URL for View - Remove accessToken usage
export const getPresignedUrlForView = async (key: string): Promise<string> => {
  try {
    console.log("getPresignedUrlForView service step 1");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/get-presigned-url", {
      params: { key },
    });

    return response.data.url;
  } catch (error: any) {
    console.error("Error fetching presigned URL for view:", error);
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};

// ✅ CHANGED: Create Service - Remove accessToken usage
export const CreateService = async (formData: FormData) => {
  try {
    console.log("CreateService service step 1", formData);

    const type = formData.get("type") as string;
    const digitalProductType = formData.get("digitalProductType") as
      | string
      | null;
    let pdfUrl: string | null = null;
    let exclusiveContent: any[] = [];

    if (type === "DigitalProducts" && digitalProductType === "documents") {
      const pdfFile = formData.get("pdfFile") as File;
      if (pdfFile) {
        console.log("Uploading PDF:", pdfFile.name);
        const pdfUploadResult = await uploadToS3WithPresignedUrl(pdfFile, "pdfs");
        pdfUrl = pdfUploadResult.url; // Keep using URL for PDFs for now
        console.log("Uploaded PDF URL:", pdfUrl);
        formData.delete("pdfFile");
        formData.append("fileUrl", pdfUrl);
      }
    }

    if (type === "DigitalProducts" && digitalProductType === "videoTutorials") {
      const videoCount = parseInt(formData.get("videoCount") as string, 10);
      const seasons: Record<string, any[]> = {};

      for (let i = 0; i < videoCount; i++) {
        let seasonIndex = 0;
        let episodeIndex = 0;
        let found = false;

        while (seasonIndex < 100 && !found) {
          episodeIndex = 0;
          while (episodeIndex < 100 && !found) {
            const videoKey = `video_${seasonIndex}_${episodeIndex}`;
            const video = formData.get(videoKey) as File;

            if (video) {
              const season = formData.get(`${videoKey}_season`) as string;
              const episode = formData.get(`${videoKey}_episode`) as string;
              const title = formData.get(`${videoKey}_title`) as string;
              const description = formData.get(
                `${videoKey}_description`
              ) as string;

              console.log("Uploading video:", video.name);
              const uploadResult = await uploadToS3WithPresignedUrl(
                video,
                "videos"
              );
              console.log("Uploaded video result:", uploadResult);

              // 🔒 SECURITY: Store only S3 key, not full URL
              const episodeObject = {
                episode,
                title,
                description,
                videoKey: uploadResult.key, // Store only the S3 key
                videoUrl: uploadResult.url, // Keep for backward compatibility temporarily
              };

              if (!seasons[season]) {
                seasons[season] = [];
              }
              seasons[season].push(episodeObject);

              formData.delete(videoKey);
              formData.delete(`${videoKey}_season`);
              formData.delete(`${videoKey}_episode`);
              formData.delete(`${videoKey}_title`);
              formData.delete(`${videoKey}_description`);

              found = true;
            }
            episodeIndex++;
          }
          seasonIndex++;
        }
      }

      exclusiveContent = Object.entries(seasons).map(([season, episodes]) => ({
        season,
        episodes,
      }));

      formData.delete("videoCount");

      const newFormData = new FormData();
      for (const [key, value] of formData.entries()) {
        if (key !== "exclusiveContent") {
          newFormData.append(key, value);
        }
      }

      newFormData.append("exclusiveContent", JSON.stringify(exclusiveContent));
      formData = newFormData;
    }

    console.log("FormData before to create service:", formData);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post("/expert/createService", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Service creation response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating service:", error);
    throw new Error(`Failed to create service: ${error.message}`);
  }
};

// ✅ CHANGED: Get All Services - Remove accessToken usage
export const getAllServices = async (
  params: GetAllServicesParams = {}
): Promise<GetAllServicesResponse> => {
  try {
    console.log(
      "MentorServiceAPI.getAllServices step 1: Making API call with params",
      params
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/allServices", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page: params.page || 1,
        limit: params.limit || 8,
        search: params.search || "",
        type: params.type,
      },
    });

    console.log(
      "MentorServiceAPI.getAllServices step 2: API response",
      response
    );
    return response.data.data;
  } catch (error: any) {
    console.error("MentorServiceAPI.getAllServices error:", error);
    throw new Error("Failed to fetch services");
  }
};

// ✅ CHANGED: Get Service by ID - Remove accessToken usage
export const getServiceById = async (serviceId: string): Promise<Service> => {
  try {
    console.log("getServiceById step 1: Fetching service", serviceId);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/expert/service/${serviceId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("getServiceById step 2: Service fetched", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getServiceById error:", error);
    throw new Error(`Failed to fetch service: ${error.message}`);
  }
};

// ✅ CHANGED: Update Service - Remove accessToken usage
export const updateService = async (
  serviceId: string,
  formData: FormData
): Promise<Service> => {
  try {
    console.log("updateService step 1: Updating service", serviceId);

    const formDataEntries: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      formDataEntries[key] = value instanceof File ? value.name : value;
    }
    console.log("updateService step 2: FormData entries", formDataEntries);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put(
      `/expert/updateService/${serviceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("updateService step 3: Service updated", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("updateService error:", error);
    throw new Error(`Failed to update service: ${error.message}`);
  }
};

// ✅ CHANGED: Get Mentor Calendar - Remove accessToken usage
export const getMentorCalendar = async (mentorId: string) => {
  try {
    console.log("getMentorCalendar step 1: Fetching calendar", mentorId);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/expert/${mentorId}/calendar`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("getMentorCalendar step 2: Calendar fetched", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getMentorCalendar error:", error);
    throw new Error(`Failed to fetch calendar: ${error.message}`);
  }
};

// ✅ CHANGED: Update Policy - Remove accessToken usage
export const updatePolicy = async (mentorId: string, policyData: any) => {
  try {
    console.log("updatePolicy step 1: Updating policy", mentorId, policyData);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put(`/expert/${mentorId}/policy`, policyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("updatePolicy step 2: Policy updated", response.data);
    return response.data;
  } catch (error: any) {
    console.error("updatePolicy error:", error);
    throw new Error(`Failed to update policy: ${error.message}`);
  }
};

// ✅ CHANGED: Create Schedule - Remove accessToken usage
export const createSchedule = async (mentorId: string, scheduleData: any) => {
  try {
    console.log(
      "createSchedule step 1: Creating schedule........step 1",
      mentorId,
      scheduleData
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post(
      `/expert/${mentorId}/schedules`,
      scheduleData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("createSchedule step 2: Schedule created", response);
    return response.data.data;
  } catch (error: any) {
    console.error("createSchedule error:", error);
    throw new Error(`Failed to create schedule: ${error.message}`);
  }
};

// ✅ CHANGED: Update Schedule - Remove accessToken usage
export const updateSchedule = async (
  mentorId: string,
  scheduleId: string,
  scheduleData: any
) => {
  try {
    console.log(
      "updateSchedule step 1: Updating schedule",
      mentorId,
      scheduleId,
      scheduleData
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put(
      `/expert/${mentorId}/schedules/${scheduleId}`,
      scheduleData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("updateSchedule step 2: Schedule updated", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("updateSchedule error:", error);
    throw new Error(`Failed to update schedule: ${error.message}`);
  }
};

// ✅ CHANGED: Delete Schedule - Remove accessToken usage
export const deleteSchedule = async (mentorId: string, scheduleId: string) => {
  try {
    console.log(
      "deleteSchedule step 1: Deleting schedule",
      mentorId,
      scheduleId
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.delete(`/expert/${mentorId}/schedules/${scheduleId}`);

    console.log("deleteSchedule step 2: Schedule deleted");
  } catch (error: any) {
    console.error("deleteSchedule error:", error);
    throw new Error(`Failed to delete schedule: ${error.message}`);
  }
};

// ✅ CHANGED: Add Blocked Dates - Remove accessToken usage
export const addBlockedDates = async (
  mentorId: string,
  dates: { date: string; day: string }[]
) => {
  try {
    console.log(
      "addBlockedDates step 1: Adding blocked dates",
      mentorId,
      dates
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post(
      `/expert/${mentorId}/blocked-dates`,
      { dates },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("addBlockedDates step 2: Blocked dates added", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("addBlockedDates error:", error);
    throw new Error(`Failed to add blocked dates: ${error.message}`);
  }
};

// ✅ CHANGED: Remove Blocked Date - Remove accessToken usage
export const removeBlockedDate = async (
  mentorId: string,
  blockedDateId: string
) => {
  try {
    console.log(
      "removeBlockedDate step 1: Removing blocked date",
      mentorId,
      blockedDateId
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.delete(`/expert/${mentorId}/blocked-dates/${blockedDateId}`);

    console.log("removeBlockedDate step 2: Blocked date removed");
  } catch (error: any) {
    console.error("removeBlockedDate error:", error);
    throw new Error(`Failed to remove blocked date: ${error.message}`);
  }
};

// ✅ CHANGED: Is Approval Checking - Remove accessToken usage
export const isApprovalChecking = async (
  mentorId: string
): Promise<{ isApproved: string | null; approvalReason: string | null }> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/expert/isApprovalChecking/${mentorId}`);

    console.log("isApprovalChecking frontend response:", response.data);
    const data = response.data.data; // Access nested data
    if (!data || typeof data.isApproved === "undefined") {
      console.error("Invalid response structure:", response.data);
      throw new Error("Invalid approval status response from server");
    }
    return {
      isApproved: data.isApproved || null,
      approvalReason: data.approvalReason || null,
    };
  } catch (error: any) {
    console.error("Error checking approval status:", error);
    throw new Error(`Failed to check approval: ${error.message}`);
  }
};

// ✅ CHANGED: Assign Schedule to Service - Remove accessToken usage
export const assignScheduleToService = async (
  serviceId: string,
  scheduleId: string
): Promise<void> => {
  try {
    console.log("assignScheduleToService step 1: Assigning schedule", {
      serviceId,
      scheduleId,
    });

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    await api.post(
      `/expert/service/${serviceId}/assign-schedule`,
      { scheduleId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "assignScheduleToService step 2: Schedule assigned successfully"
    );
  } catch (error: any) {
    console.error("assignScheduleToService error:", error);
    throw new Error(`Failed to assign schedule: ${error.message}`);
  }
};

// ✅ CHANGED: Reply to Priority DM - Remove accessToken usage
export const replyToPriorityDM = async (
  priorityDMId: string,
  payload: {
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  }
) => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post(
      `/expert/priority-dm/${priorityDMId}/reply`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error replying to PriorityDM:", error);
    throw new Error(
      error.response?.data?.error || "Failed to reply to PriorityDM"
    );
  }
};

// ✅ CHANGED: Get Priority DMs - Remove accessToken usage
export const getPriorityDMs = async (serviceId: string) => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/expert/priority-dm/${serviceId}`);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching PriorityDMs:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch PriorityDMs"
    );
  }
};

// ✅ CHANGED: Get All Priority DMs by Mentor - Remove accessToken usage
export const getAllPriorityDMsByMentor = async (
  page: number = 1,
  limit: number = 8,
  searchQuery: string = "",
  status?: "pending" | "replied",
  sort?: "asc" | "desc"
): Promise<{ priorityDMs: any[]; total: number }> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/priority-dm", {
      params: {
        page,
        limit,
        search: searchQuery,
        status,
        sort,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all PriorityDMs by mentor:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch PriorityDMs"
    );
  }
};
