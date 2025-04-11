import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
  withCredentials: true,
});

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
    console.log("image upload stepp1");

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
    console.log("image upload stepp4", formData);
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
