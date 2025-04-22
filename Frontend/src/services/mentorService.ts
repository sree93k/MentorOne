import axios from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;
import AWS from "aws-sdk";

// services/mentorService.ts
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
  imageUrl?: string; // Added to store the image URL
}

//upload image
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

///uploadMentorWelcomeForm
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
export const getUserDetails = async (userId: string) => {
  console.log("mentor profile service step1", userId);

  const response = await api.get(`/expert/profile/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }, // Add auth if needed
  });
  console.log("mentor profile service step2 response", response);
  return response.data; // Expected: { firstName, lastName, email, etc. }
};

export const updateUserDetails = async (userId: string, data: any) => {
  console.log("mentor profile update service step1", userId, data);
  const response = await api.put(`/expert/profileupdate${userId}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  console.log("mentor profile update service step2", response);
  return response.data;
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

// Create Service Function
export const CreateService = async (formData: FormData) => {
  try {
    console.log("hello");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    // Send data to backend
    const response = await api.post("/expert/createService", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};
export const uploadToS3WithPresignedUrl = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    console.log("hiii");

    const response = await api.get("/expert/generate-presigned-url", {
      params: {
        fileName: file.name,
        fileType: file.type,
        folder,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const { url, key } = response.data;

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading with presigned URL:", error);
    throw new Error("Failed to upload file to S3");
  }
};
