import axios from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;
// const api = axios.create({
//   baseURL: import.meta.env.VITE_MENTOR_ONE_API_URL,
//   withCredentials: true,
// });

export const uploadProfileImage = async (formData: FormData) => {
  try {
    console.log("Starting image upload:", formData);
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.put("/user/upload_image", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Image upload response:1st", response);
    console.log("Image upload response:2nd", response.data);

    const userData = await api.put("/seeker/profileEdit", response.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
