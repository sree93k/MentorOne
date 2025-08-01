import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

// ✅ CHANGED: Upload Profile Image - Remove accessToken usage
export const uploadProfileImage = async (formData: FormData) => {
  try {
    console.log("Starting image upload:", formData);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/user/update_profile_image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Image upload response:1st", response);
    console.log("Image upload response:2nd", response.data.data);

    const profileData = {
      profilePicture: response.data.data.imageUrl, // Rename imageUrl to profilePicture
    };

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const userData = await api.put("/user/profileEdit", profileData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Image upload response:3rd", userData);

    return userData; // Expecting { profilePicture: "url" } from backend
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
