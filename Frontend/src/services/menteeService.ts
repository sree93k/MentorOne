// services/menteeService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

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

interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  companyBadge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  services?: {
    type: string;
    title: string;
    description: string;
    duration: string;
    price: number;
  }[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

interface ApiResponse {
  status: number;
  data: any;
  message: string;
  total?: number;
}
export const getAllMentors = async (
  page: number = 1,
  limit: number = 12,
  role?: string,
  searchQuery?: string
): Promise<{ mentors: Mentor[]; total: number }> => {
  try {
    console.log("getAllMentors: Fetching mentors from /seeker/allMentors", {
      page,
      limit,
      role,
      searchQuery,
    });
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const params: any = { page, limit };
    if (role && role !== "All") params.role = role;
    if (searchQuery) params.searchQuery = searchQuery;

    const response = await userAxiosInstance.get<ApiResponse>(
      "/seeker/allMentors",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      }
    );
    console.log("getAllMentors: Response received", response.data.data);
    return {
      mentors: response.data.data.mentors as Mentor[],
      total: response.data.data.total || 0,
    };
  } catch (error: any) {
    console.error("getAllMentors error:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(`Failed to fetch mentors: ${error.message}`);
  }
};

export const getMentorById = async (mentorId: string): Promise<Mentor> => {
  try {
    console.log("getMentorById: Fetching mentor from /seeker/mentor", {
      mentorId,
    });
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${mentorId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("getMentorById: Response received", response);
    console.log("getMentorById: Response received", response.data.data);
    return response.data.data as Mentor;
  } catch (error: any) {
    console.error("getMentorById error:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(`Failed to fetch mentor: ${error.message}`);
  }
};
export const getAllTutorials = async (
  page: number = 1,
  limit: number = 12,
  type?: string,
  searchQuery?: string
): Promise<{ tutorials: any[]; total: number }> => {
  try {
    console.log("bookingservice getAllTutorials step 1", {
      page,
      limit,
      type,
      searchQuery,
    });
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const params: any = { page, limit };
    if (type && type !== "All") params.type = type;
    if (searchQuery) params.searchQuery = searchQuery;

    const response = await api.get(`/seeker/alltutorials`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });
    console.log("bookingservice getAllTutorials step 2", response.data.data);
    return response.data.data; // Return { tutorials, total }
  } catch (error: any) {
    console.error("Error fetching tutorials:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch tutorials");
  }
};

export const getTutorialById = async (tutorialId: string) => {
  try {
    console.log("menteeService getTutorialById.. step 1", tutorialId);
    const response = await api.get(`/seeker/exclusivecontent/${tutorialId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("menteeService getTutorialById.. step 2", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching tutorial by ID:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch tutorial details"
    );
  }
};

export const checkBookingStatus = async (serviceId: string) => {
  try {
    console.log("menteeService checkBookingStatus.. step 1", serviceId);
    const response = await api.get(`/seeker/check-booking/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("menteeService checkBookingStatus.. step 2", response);
    return response.data.data.isBooked;
  } catch (error: any) {
    console.error("Error checking booking status:", error);
    throw new Error(
      error.response?.data?.error || "Failed to check booking status"
    );
  }
};

export const getVideoUrl = async (key: string) => {
  try {
    console.log("menteeService getVideoUrl.. step 1", key);
    const response = await api.get(
      `/seeker/video-url/${encodeURIComponent(key)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("menteeService getVideoUrl.. step 2", response);
    return response.data.data.url;
  } catch (error: any) {
    console.error("Error fetching video URL:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch video URL");
  }
};
export const initiatePayment = async (serviceId: string, amount: number) => {
  try {
    console.log("menteeService initiatePayment.. step 1", serviceId, amount);
    const response = await api.post(
      `/seeker/initiate-payment`,
      { serviceId, amount },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("menteeService initiatePayment.. step 2", response);
    return response.data.data; // Expecting { sessionId, url }
  } catch (error: any) {
    console.error("Error initiating payment:", error);
    throw new Error(
      error.response?.data?.error || "Failed to initiate payment"
    );
  }
};

export const createBooking = async (
  serviceId: string,
  mentorId: string,
  sessionId: string
) => {
  try {
    console.log("menteeService createBooking.. step 1", serviceId, sessionId);
    const response = await api.post(
      `/seeker/book-service`,
      { serviceId, mentorId, sessionId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("menteeService createBooking.. step 2", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(error.response?.data?.error || "Failed to create booking");
  }
};
// services/menteeService.ts
export const getMentorSchedule = async (serviceId: string) => {
  try {
    console.log("getMentorSchedule: Fetching schedule for mentor serviceId", {
      serviceId,
    });
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${serviceId}/schedule`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("getMentorSchedule: Response received", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getMentorSchedule error:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(`Failed to fetch mentor schedule: ${error.message}`);
  }
};

export const getMentorBlockedDates = async (mentorId: string) => {
  try {
    console.log("getMentorBlockedDates: Fetching blocked dates for mentor", {
      mentorId,
    });
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${mentorId}/blocked-dates`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("getMentorBlockedDates: Response received", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getMentorBlockedDates error:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(`Failed to fetch mentor blocked dates: ${error.message}`);
  }
};

// services/menteeService.ts
export const createPriorityDM = async (payload: {
  serviceId: string;
  bookingId?: string;
  content: string;
  pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.post("/seeker/priority-dm", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Error creating PriorityDM:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create PriorityDM"
    );
  }
};

export const getPriorityDMs = async (serviceId: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/seeker/priority-dm/${serviceId}`, {
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
