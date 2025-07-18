// import { userAxiosInstance } from "./instances/userInstance";
// import { TestimonialResponse } from "@/types/testimonial";

// const api = userAxiosInstance;
// export const getTestimonialsByMentor = async (
//   page: number = 1,
//   limit: number = 10
// ): Promise<{ testimonials: any[]; total: number }> => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       throw new Error("No access token found. Please log in again.");
//     }

//     const response = await api.get(`/expert/testimonials`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       params: { page, limit },
//     });
//     return {
//       testimonials: response.data.data.testimonials,
//       total: response.data.data.total,
//     };
//   } catch (error: any) {
//     console.error("Error fetching testimonials:", error);
//     throw new Error(
//       error.response?.data?.error || "Failed to fetch testimonials"
//     );
//   }
// };

// export const updateTopTestimonials = async (
//   testimonialIds: string[]
// ): Promise<any> => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       throw new Error("No access token found. Please log in again.");
//     }
//     console.log("updateTopTestimonials step 1", updateTopTestimonials);

//     const response = await api.put(
//       `/expert/top-testimonials`,
//       { testimonialIds },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     console.log("updateTopTestimonials step 2", response);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error updating top testimonials:", error);
//     throw new Error(
//       error.response?.data?.error || "Failed to update top testimonials"
//     );
//   }
// };

// export const getMentorServiceTestimonials = async (
//   mentorId: string,
//   serviceId: string,
//   page: number = 1,
//   limit: number = 10
// ): Promise<TestimonialResponse> => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await api.get(
//       `/seeker/testimonials/mentor/${mentorId}/service/${serviceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: { page, limit },
//       }
//     );
//     console.log("getMentorServiceTestimonials response", response.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("getMentorServiceTestimonials error", error);
//     throw error.response?.data?.error || "Failed to fetch testimonials";
//   }
// };
// ✅ CRITICAL CHANGES: Remove ALL localStorage.getItem("accessToken") usage
// Replace Authorization headers with automatic cookie sending

import { userAxiosInstance } from "./instances/userInstance";
import { TestimonialResponse } from "@/types/testimonial";

const api = userAxiosInstance;

// ✅ CHANGED: Get Testimonials by Mentor - Remove accessToken usage
export const getTestimonialsByMentor = async (
  page: number = 1,
  limit: number = 10
): Promise<{ testimonials: any[]; total: number }> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/testimonials", {
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

// ✅ CHANGED: Update Top Testimonials - Remove accessToken usage
export const updateTopTestimonials = async (
  testimonialIds: string[]
): Promise<any> => {
  try {
    console.log("updateTopTestimonials step 1", updateTopTestimonials);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.put("/expert/top-testimonials", {
      testimonialIds,
    });

    console.log("updateTopTestimonials step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Error updating top testimonials:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update top testimonials"
    );
  }
};

// ✅ CHANGED: Get Mentor Service Testimonials - Remove accessToken usage
export const getMentorServiceTestimonials = async (
  mentorId: string,
  serviceId: string,
  page: number = 1,
  limit: number = 10
): Promise<TestimonialResponse> => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(
      `/seeker/testimonials/mentor/${mentorId}/service/${serviceId}`,
      {
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
