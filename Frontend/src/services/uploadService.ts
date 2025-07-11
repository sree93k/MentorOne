import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

export const uploadProfileImage = async (formData: FormData) => {
  try {
    console.log("Starting image upload:", formData);

    const response = await api.put("/user/update_profile_image", formData, {
      withCredentials: true,
    });
    console.log("Image upload response:1st", response);
    console.log("Image upload response:2nd", response.data.data);

    const profileData = {
      profilePicture: response.data.data.imageUrl, // Rename imageUrl to profilePicture
    };

    const userData = await api.put("/user/profileEdit", profileData, {
      withCredentials: true,
    });
    console.log("Image upload response:3rd", userData);

    return userData; // Expecting { profilePicture: "url" } from backend
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
