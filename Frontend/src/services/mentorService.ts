import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

//============================

// Other unrelated functions (kept for completeness)
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
//============================
export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("image upload stepp1", imageFile);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    console.log("image upload stepp1.5", accessToken);
    console.log("image upload stepp2");
    const formData = new FormData();
    console.log("image upload stepp3", formData);
    console.log("image upload stepp3.5", imageFile);
    formData.append("image", imageFile);
    console.log("image upload stepp4......", formData);
    const response = await api.post("/user/upload_image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("image upload stepp5");
    console.log("Image upload response:", response.data);
    return response.data.imageUrl; // Adjust based on your backend's response structure
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
//============================
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
    // const payload = { ...formData, id, mentorActivated: true };
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
    return response.data.data; // Return updated user data
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
//============================
export const getUserDetails = async (userId: string) => {
  console.log("mentor profile service step1", userId);

  const response = await api.get(`/expert/profile/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }, // Add auth if needed
  });
  console.log("mentor profile service step2 response", response);
  return response.data; // Expected: { firstName, lastName, email, etc. }
};

//updateMentorDatas
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

const uploadToS3WithPresignedUrl = async (
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

//============================
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
      // Process videos using the new naming convention
      const videoCount = parseInt(formData.get("videoCount") as string, 10);

      // Keep track of seasons we've seen to group episodes
      const seasons: Record<string, any[]> = {};

      // Process each video
      for (let i = 0; i < videoCount; i++) {
        // Find all video entries by iterating through potential indices
        let seasonIndex = 0;
        let episodeIndex = 0;
        let found = false;

        // Find the right indices for this video (i)
        while (seasonIndex < 100 && !found) {
          // arbitrary limit
          episodeIndex = 0;
          while (episodeIndex < 100 && !found) {
            // arbitrary limit
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

              // Create episode object
              const episodeObject = {
                episode,
                title,
                description,
                videoUrl,
              };

              // Add to seasons map
              if (!seasons[season]) {
                seasons[season] = [];
              }
              seasons[season].push(episodeObject);

              // Clean up FormData
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

      // Convert seasons map to expected array format
      exclusiveContent = Object.entries(seasons).map(([season, episodes]) => ({
        season,
        episodes,
      }));

      // Clean up FormData
      formData.delete("videoCount");

      // Create a new FormData object with the correct structure
      const newFormData = new FormData();

      // Copy all fields except exclusiveContent
      for (const [key, value] of formData.entries()) {
        if (key !== "exclusiveContent") {
          newFormData.append(key, value);
        }
      }

      // Add exclusiveContent as a properly structured object
      newFormData.append("exclusiveContent", JSON.stringify(exclusiveContent));

      // Replace the original FormData
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

interface Service {
  _id: string;
  title: string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  duration?: number;
  amount: number;
  shortDescription: string;
  digitalProductType?: "documents" | "videoTutorials";
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
}

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
    return response.data.data; // Matches backend ApiResponse structure
  } catch (error: any) {
    console.error("MentorServiceAPI.getAllServices error:", error);
    throw new Error("Failed to fetch services");
  }
};
