import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

export const getTestimonialsByMentor = async (
  page: number = 1,
  limit: number = 10
): Promise<{ testimonials: any[]; total: number }> => {
  try {
    const response = await api.get(`/expert/testimonials`, {
      withCredentials: true,
      params: { page, limit },
    });
    return {
      testimonials: response.data.data.testimonials,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch testimonials"
    );
  }
};

export const updateTopTestimonials = async (
  testimonialIds: string[]
): Promise<any> => {
  try {
    console.log("updateTopTestimonials step 1", testimonialIds);

    const response = await api.put(
      `/expert/top-testimonials`,
      { testimonialIds },
      {
        withCredentials: true,
      }
    );
    console.log("updateTopTestimonials step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Error updating top testimonials:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update top testimonials"
    );
  }
};

interface ETestimonial {
  _id: string;
  menteeId: { firstName: string; lastName: string };
  mentorId: string;
  serviceId: { title: string; type: string };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialResponse {
  success: boolean;
  message: string;
  testimonials: ETestimonial[];
  total: number;
  page: number;
  limit: number;
}

export const getMentorServiceTestimonials = async (
  mentorId: string,
  serviceId: string,
  page: number = 1,
  limit: number = 10
): Promise<TestimonialResponse> => {
  try {
    const response = await api.get(
      `/seeker/testimonials/mentor/${mentorId}/service/${serviceId}`,
      {
        withCredentials: true,
        params: { page, limit },
      }
    );
    console.log("getMentorServiceTestimonials response", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("getMentorServiceTestimonials error", error);
    throw error.response?.data?.error || "Failed to fetch testimonials";
  }
};
