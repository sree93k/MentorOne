import { userAxiosInstance } from "./instances/userInstance";
import {
  UpdateUserDataPayload,
  Mentor,
  ApiResponse,
  Service,
  DashboardData,
} from "@/types/mentee";

const api = userAxiosInstance;

export const uploadMenteeWelcomeForm = async (
  formData: UpdateUserDataPayload,
  id: string // Keep this parameter for backwards compatibility
) => {
  try {
    console.log("mentee welcome service 1");
    console.log("mentee access token");

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

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/seeker/welcomeform", payload, {
      headers: {
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

export const uploadProfileImage = async (
  formData: FormData,
  accessToken: string // Keep this parameter for backwards compatibility
) => {
  try {
    console.log("Starting image upload:", formData, accessToken);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/seeker/upload_profile_image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Image upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const userProfileData = async () => {
  try {
    console.log("mentee service userProfileData step1");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/seeker/profileData", {
      headers: {
        "Content-Type": "application/json", // Fixed: was multipart/form-data
      },
    });

    console.log(
      "mentee service userProfileData step2.....",
      response.data.data.user
    );
    return response.data.data.user;
  } catch (error) {
    console.error("Error userProfileData service >>:", error);
    throw error;
  }
};

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

    const params: any = { page, limit };
    if (role && role !== "All") params.role = role;
    if (searchQuery) params.searchQuery = searchQuery;

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await userAxiosInstance.get<ApiResponse>(
      "/seeker/allMentors",
      {
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

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${mentorId}`
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

    const params: any = { page, limit };
    if (type && type !== "All") params.type = type;
    if (searchQuery) params.searchQuery = searchQuery;

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/seeker/alltutorials", { params });

    console.log("bookingservice getAllTutorials step 2", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching tutorials:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch tutorials");
  }
};

// ✅ APPLY SAME PATTERN TO ALL REMAINING FUNCTIONS:
// Remove localStorage.getItem("accessToken") and Authorization headers

export const getTutorialById = async (tutorialId: string) => {
  try {
    console.log("menteeService getTutorialById.. step 1", tutorialId);
    const response = await api.get(`/seeker/exclusivecontent/${tutorialId}`);
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
    const response = await api.get(`/seeker/check-booking/${serviceId}`);
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
      `/seeker/video-url/${encodeURIComponent(key)}`
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
    const response = await api.post("/seeker/initiate-payment", {
      serviceId,
      amount,
    });
    console.log("menteeService initiatePayment.. step 2", response);
    return response.data.data;
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
    const response = await api.post("/seeker/book-service", {
      serviceId,
      mentorId,
      sessionId,
    });
    console.log("menteeService createBooking.. step 2", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(error.response?.data?.error || "Failed to create booking");
  }
};

export const getMentorSchedule = async (serviceId: string) => {
  try {
    console.log("getMentorSchedule: Fetching schedule for mentor serviceId", {
      serviceId,
    });
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${serviceId}/schedule`
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
    const response = await userAxiosInstance.get<ApiResponse>(
      `/seeker/mentor/${mentorId}/blocked-dates`
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

export const createPriorityDM = async (payload: {
  serviceId: string;
  bookingId?: string;
  content: string;
  pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
}) => {
  try {
    const response = await api.post("/seeker/priority-dm", payload, {
      headers: {
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

export const getPriorityDMs = async (bookingId: string) => {
  try {
    const response = await api.get(`/seeker/priority-dm/${bookingId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching PriorityDMs:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch PriorityDMs"
    );
  }
};

export const getMentorPolicy = async (mentorId: string) => {
  try {
    const response = await api.get(`/seeker/mentor/${mentorId}/policy`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching getMentorPolicy:", error);
    throw new Error(error?.message || "Failed to fetch getMentorPolicy");
  }
};

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log("menteeService getDashboardData step 1");
    const response = await api.get<ApiResponse>("/seeker/dashboard-data", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("menteeService getDashboardData step 2", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("menteeService getDashboardData error", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch dashboard data"
    );
  }
};

export const getAllServices = async (
  page: number = 1,
  limit: number = 12,
  type?: string,
  searchQuery?: string,
  oneToOneType?: string,
  digitalProductType?: string
): Promise<{ services: Service[]; total: number }> => {
  try {
    console.log("getAllServices: Fetching services", {
      page,
      limit,
      type,
      searchQuery,
      oneToOneType,
      digitalProductType,
    });

    const params: any = { page, limit };
    if (type && type !== "All") params.type = type;
    if (searchQuery) params.searchQuery = searchQuery;
    if (oneToOneType) params.oneToOneType = oneToOneType;
    if (digitalProductType) params.digitalProductType = digitalProductType;

    const response = await api.get("/seeker/allServices", { params });
    console.log("getAllServices: Response received", response.data.data);
    return {
      services: response.data.data.services as Service[],
      total: response.data.data.total || 0,
    };
  } catch (error: any) {
    console.error("getAllServices error:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
};
