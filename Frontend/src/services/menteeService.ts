// services/menteeService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;
// const api = axios.create({
//   baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
//   withCredentials: true,
// });
interface UpdateUserDataPayload {
  userType: string;
  schoolName?: string;
  class?: string;
  course?: string;
  specializedIn?: string;
  collegeName?: string;
  startDate?: string;
  endDate?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  careerGoals?: string;
  interestedNewcareer?: string[];
  goals?: string[];
}
export const uploadMenteeWelcomeForm = async (
  formData: UpdateUserDataPayload,
  id: string,
  accessToken: string
) => {
  try {
    console.log("mentee welcome service 1");

    // const accessToken = localStorage.getItem("accessToken");
    console.log("mentee acess token", accessToken);

    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    //welcomeform
    // Filter fields based on userType
    const filteredFormData: Partial<UpdateUserDataPayload> = {
      userType: formData.userType,
      city: formData.city,
      careerGoals: formData.careerGoals,
      interestedNewcareer: formData.interestedNewcareer,
      goals: formData.goals,
    };

    if (formData.userType === "school") {
      filteredFormData.schoolName = formData.schoolName;
      filteredFormData.class = formData.class;
    } else if (
      formData.userType === "college" ||
      formData.userType === "fresher"
    ) {
      filteredFormData.course = formData.course;
      filteredFormData.specializedIn = formData.specializedIn;
      filteredFormData.collegeName = formData.collegeName;
      filteredFormData.startDate = formData.startDate;
      filteredFormData.endDate = formData.endDate;
    } else if (formData.userType === "professional") {
      filteredFormData.experience = formData.experience;
      filteredFormData.jobRole = formData.jobRole;
      filteredFormData.company = formData.company;
      filteredFormData.currentlyWorking = formData.currentlyWorking;
    }

    const payload = { ...filteredFormData, id, activated: true };
    console.log("Payload to API:", payload);

    const response = await api.put(`/seeker/welcomeform`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API response:", response);
    console.log("API response inner data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// upload_profile_image
export const uploadProfileImage = async (
  formData: FormData,
  accessToken: string
) => {
  try {
    console.log("Starting image upload:", formData, accessToken);
    const response = await api.put("/seeker/upload_profile_image", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Image upload response:", response.data);
    return response.data; // Expecting { profilePicture: "url" } from backend
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const userProfileData = async () => {
  try {
    console.log("mentee service userProfileData step1 ");
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.get("/seeker/profileData", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.user;
  } catch (error) {
    console.error("Error uuserProfileData service >>:", error);
    throw error;
  }
};

// export const uploadProfileImage = async (
//   formData: FormData,
//   accessToken: string
// ) => {
//   try {
//     if (!accessToken) throw new Error("No access token available");
//     console.log("Starting image upload:", formData, accessToken);
//     const response = await api.put("/seeker/upload_profile_image", formData, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Image upload response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading profile image:", error);
//     if (error.response?.status === 401) {
//       toast.error("Session expired. Please log in again.");
//       // Optionally redirect to login
//       // window.location.href = "/login";
//     }
//     throw error;
//   }
// };

//profileEdit
// export const updateUserProfile = async (payload: any) => {
//   try {
//     console.log("mentee servcie is updateUserProfile1?????", payload);
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await api.put("/seeker/profileEdit", payload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("mentee servcie is updateUserProfile 2", response);
//     const updateData = response.data.data;
//     console.log("mentee servcie is updateUserProfile 3", updateData);
//     return updateData;
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     throw error;
//   }
// };
