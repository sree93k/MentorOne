import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

interface UpdateUserDataPayload {
  userType: string;
  schoolName?: string;
  currentClass?: string;
  course?: string;
  specialization?: string;
  collegeName?: string;
  startYear?: string;
  endYear?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  careerGoal?: string;
  interestedCareer?: string[];
  selectedOptions?: string[];
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  youtubeLink?: string;
  personalWebsite?: string;
  introVideo?: string;
  featuredArticle?: string;
  mentorMotivation?: string;
  greatestAchievement?: string;
  imageUrl?: string;
}

interface Service {
  _id: string;
  title: string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  duration?: number;
  amount: number;
  shortDescription: string;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: Array<{
    season: string;
    episodes: Array<{
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }>;
  }>;
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
}

export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("image upload stepp1", imageFile);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    console.log("image upload stepp1.5", accessToken);
    console.log("image upload stepp2");

    // Sanitize file name: replace spaces and special characters
    const sanitizedFileName = imageFile.name
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace non-alphanumeric characters (except ._-)
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    console.log("image upload stepp2.5: Sanitized file name", uniqueFileName);

    const formData = new FormData();
    console.log("image upload stepp3", formData);
    console.log("image upload stepp3.5", imageFile);
    formData.append("image", imageFile, uniqueFileName); // Use sanitized file name
    console.log("image upload stepp4......", formData);

    const response = await api.post("/user/upload_image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("image upload stepp5");
    console.log("Image upload response:", response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
export const uploadMentorWelcomeForm = async (
  formData: UpdateUserDataPayload,
  id: string
) => {
  try {
    console.log("mentor welcome service 1", formData, id);

    const accessToken = localStorage.getItem("accessToken");
    console.log("mentor welcome service 2", accessToken);
    if (!accessToken) {
      console.log("mentor welcome service 3 error no access toekn");
      throw new Error("No access token found. Please log in again.");
    }
    console.log("mentor welcome service 3", accessToken);
    const payload1 = { ...formData, id };
    console.log("mentor welcome service 4", payload1);
    const { imageFile, ...payload } = payload1;
    console.log("Payload to API: sending...........", payload);

    const response = await api.put("/expert/welcomeform", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const getUserDetails = async (userId: string) => {
  console.log("mentor profile service step1", userId);

  const response = await api.get(`/expert/profile/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  console.log("mentor profile service step2 response", response);
  return response.data;
};

export const updateMentorDatas = async (payload: any) => {
  try {
    console.log("user servcie is updateUserProfile1?????", payload);
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.put("/expert/update_mentor", payload, {
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

export const uploadToS3WithPresignedUrl = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    console.log("uploadToS3WithPresignedUrl service step 1");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    console.log("Requesting presigned URL for:", file.name, folder);
    const response = await api.get("/expert/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: file.type,
        folder,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { url, key } = response.data;
    console.log("Received presigned URL:", url, "Key:", key);

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
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
    return uploadedUrl;
  } catch (error: any) {
    console.error("Error uploading with presigned URL:", error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

export const getPresignedUrlForView = async (key: string): Promise<string> => {
  try {
    console.log("getPresignedUrlForView service step 1");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get("/expert/get-presigned-url", {
      params: { key },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.url;
  } catch (error: any) {
    console.error("Error fetching presigned URL for view:", error);
    throw new Error(`Failed to fetch presigned URL: ${error.message}`);
  }
};

export const CreateService = async (formData: FormData) => {
  try {
    console.log("CreateService service step 1", formData);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

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
        pdfUrl = await uploadToS3WithPresignedUrl(pdfFile, "pdfs");
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
              const videoUrl = await uploadToS3WithPresignedUrl(
                video,
                "videos"
              );
              console.log("Uploaded video URL:", videoUrl);

              const episodeObject = {
                episode,
                title,
                description,
                videoUrl,
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

    const response = await api.post("/expert/createService", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Service creation response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating service:", error);
    throw new Error(`Failed to create service: ${error.message}`);
  }
};

export const getAllServices = async (): Promise<Service[]> => {
  try {
    console.log("MentorServiceAPI.getAllServices step 1: Making API call");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get("/expert/allServices", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

export const getServiceById = async (serviceId: string): Promise<Service> => {
  try {
    console.log("getServiceById step 1: Fetching service", serviceId);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get(`/expert/service/${serviceId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getServiceById step 2: Service fetched", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getServiceById error:", error);
    throw new Error(`Failed to fetch service: ${error.message}`);
  }
};

export const updateService = async (
  serviceId: string,
  formData: FormData
): Promise<Service> => {
  try {
    console.log("updateService step 1: Updating service", serviceId);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const formDataEntries: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      formDataEntries[key] = value instanceof File ? value.name : value;
    }
    console.log("updateService step 2: FormData entries", formDataEntries);

    const response = await api.put(
      `/expert/updateService/${serviceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
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

// Calendar-related functions
export const getMentorCalendar = async (mentorId: string) => {
  try {
    console.log("getMentorCalendar step 1: Fetching calendar", mentorId);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get(`/expert/${mentorId}/calendar`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("getMentorCalendar step 2: Calendar fetched", response.data);
    return response.data;
  } catch (error: any) {
    console.error("getMentorCalendar error:", error);
    throw new Error(`Failed to fetch calendar: ${error.message}`);
  }
};

export const updatePolicy = async (mentorId: string, policyData: any) => {
  try {
    console.log("updatePolicy step 1: Updating policy", mentorId, policyData);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.put(`/expert/${mentorId}/policy`, policyData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export const createSchedule = async (mentorId: string, scheduleData: any) => {
  try {
    console.log(
      "createSchedule step 1: Creating schedule........step 1",
      mentorId,
      scheduleData
    );
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.post(
      `/expert/${mentorId}/schedules`,
      scheduleData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("createSchedule step 2: Schedule created", response);
    return response.data;
  } catch (error: any) {
    console.error("createSchedule error:", error);
    throw new Error(`Failed to create schedule: ${error.message}`);
  }
};

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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.put(
      `/expert/${mentorId}/schedules/${scheduleId}`,
      scheduleData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("updateSchedule step 2: Schedule updated", response.data);
    return response.data;
  } catch (error: any) {
    console.error("updateSchedule error:", error);
    throw new Error(`Failed to update schedule: ${error.message}`);
  }
};

export const deleteSchedule = async (mentorId: string, scheduleId: string) => {
  try {
    console.log(
      "deleteSchedule step 1: Deleting schedule",
      mentorId,
      scheduleId
    );
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    await api.delete(`/expert/${mentorId}/schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("deleteSchedule step 2: Schedule deleted");
  } catch (error: any) {
    console.error("deleteSchedule error:", error);
    throw new Error(`Failed to delete schedule: ${error.message}`);
  }
};

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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.post(
      `/expert/${mentorId}/blocked-dates`,
      { dates },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("addBlockedDates step 2: Blocked dates added", response.data);
    return response.data;
  } catch (error: any) {
    console.error("addBlockedDates error:", error);
    throw new Error(`Failed to add blocked dates: ${error.message}`);
  }
};

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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    await api.delete(`/expert/${mentorId}/blocked-dates/${blockedDateId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("removeBlockedDate step 2: Blocked date removed");
  } catch (error: any) {
    console.error("removeBlockedDate error:", error);
    throw new Error(`Failed to remove blocked date: ${error.message}`);
  }
};

export const isApprovalChecking = async (
  mentorId: string
): Promise<{ isApproved: string | null; approvalReason: string | null }> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get(`/expert/isApprovalChecking/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
// mentorService.ts
export const assignScheduleToService = async (
  serviceId: string,
  scheduleId: string
): Promise<void> => {
  try {
    console.log("assignScheduleToService step 1: Assigning schedule", {
      serviceId,
      scheduleId,
    });

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    await api.post(
      `/expert/service/${serviceId}/assign-schedule`,
      { scheduleId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export const replyToPriorityDM = async (
  priorityDMId: string,
  payload: {
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  }
) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.post(
      `/expert/priority-dm/${priorityDMId}/reply`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export const getPriorityDMs = async (serviceId: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/expert/priority-dm/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching PriorityDMs:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch PriorityDMs"
    );
  }
};

export const getAllPriorityDMsByMentor = async (
  page: number = 1,
  limit: number = 8,
  searchQuery: string = "",
  status?: "pending" | "replied",
  sort?: "asc" | "desc"
): Promise<{ priorityDMs: any[]; total: number }> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/expert/priority-dm`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
