import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;
export const getTestimonialsByMentor = async (
  page: number = 1,
  limit: number = 10
): Promise<{ testimonials: any[]; total: number }> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/expert/testimonials`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { page, limit },
    });
    return {
      testimonials: response.data.testimonials,
      total: response.data.total,
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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.put(
      `/expert/top-testimonials`,
      { testimonialIds },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating top testimonials:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update top testimonials"
    );
  }
};
