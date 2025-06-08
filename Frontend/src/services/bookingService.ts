import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

interface SaveBookingParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  sessionId: string;
  amount: number;
}

interface UpdateSlotPayload {
  isAvailable?: boolean;
  menteeId?: string;
}

export const saveBooking = async (params: SaveBookingParams) => {
  try {
    console.log("Booking service saveBooking step 1", params);
    const response = await api.post(`/seeker/bookings`, params, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("Booking service saveBooking step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Error saving booking:", error);
    throw new Error(error.response?.data?.error || "Failed to save booking");
  }
};

export const checkSlotStatus = async (
  mentorId: string,
  day: string,
  slotIndex: number
) => {
  try {
    const response = await api.get(`/user/schedule/check-slot`, {
      params: { mentorId, day, slotIndex },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error checking slot status:", error);
    throw new Error(
      error.response?.data?.error || "Failed to check slot status"
    );
  }
};

export const updateSlot = async (
  scheduleId: string,
  slotIndex: number,
  payload: UpdateSlotPayload
) => {
  try {
    const response = await api.patch(
      `/user/schedule/update-slot`,
      { scheduleId, slotIndex, ...payload },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating slot:", error);
    throw new Error(error.response?.data?.error || "Failed to update slot");
  }
};

export const getBookings = async (
  page: number = 1,
  limit: number = 12,
  searchQuery: string = ""
): Promise<{ data: any[]; total: number }> => {
  try {
    console.log("bookingservice getBookings.. step 1", {
      page,
      limit,
      searchQuery,
    });

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/seeker/bookings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { page, limit, searchQuery },
    });
    console.log("bookingservice getBookings.. step 2", response);
    return {
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch bookings");
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await api.delete(`/seeker/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    throw new Error(error.response?.data?.error || "Failed to cancel booking");
  }
};

export const getDocumentUrl = async (serviceId: string): Promise<string> => {
  try {
    console.log("bookingservice getDocumentUrl step 1", serviceId);
    const response = await api.get(`/seeker/document/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("bookingservice getDocumentUrl step 2", response);
    if (!response.data.success || !response.data.data.url) {
      throw new Error(response.data.error || "Failed to fetch document URL");
    }
    return response.data.data.url;
  } catch (error: any) {
    console.error("Error fetching document URL:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch document URL"
    );
  }
};

export const getBookingsByMentor = async (
  mentorId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: any[]; total: number }> => {
  try {
    console.log(
      "getBookingsByMentor step 1: Fetching bookings",
      mentorId,
      page,
      limit
    );
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get(`/expert/bookings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: { page, limit },
    });
    console.log("getBookingsByMentor step 2: Bookings fetched", response.data);
    return {
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error: any) {
    console.error("getBookingsByMentor error:", error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
};
export const allVideoCallBookings = async () => {
  try {
    console.log("bookingservice allVideoCallBookings step 1");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.get(`/expert/allvideocalls`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("bookingservice allVideoCallBookings step 2", response.data);
    return response.data; // Return the data directly
  } catch (error: any) {
    console.error("bookingservice allVideoCallBookings error:", error);
    throw new Error(`Failed to fetch videocall bookings: ${error.message}`);
  }
};

export const updateStatus = async (bookingId: string, payload: any) => {
  try {
    console.log("bookingservice updateStatus step 1");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    const response = await api.patch(
      `/user/booking/${bookingId}/updatestatus`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("bookingservice updateStatus step 2");
    return response;
  } catch (error) {
    console.error("bookingservice  updateStatus error:", error);
    throw new Error(`Failed to fetch  updateStatus: ${error.message}`);
  }
};
interface RescheduleRequestParams {
  requestedDate?: string;
  requestedTime?: string;
  requestedSlotIndex?: number;
  mentorDecides: boolean;
}

export const requestReschedule = async (
  bookingId: string,
  params: RescheduleRequestParams
) => {
  try {
    console.log("Booking service requestReschedule step 1", {
      bookingId,
      params,
    });
    const response = await api.post(
      `/seeker/bookings/${bookingId}/reschedule`,
      params,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("Booking service requestReschedule step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Error requesting reschedule:", error);
    throw new Error(
      error.response?.data?.error || "Failed to request reschedule"
    );
  }
};

export const getBookingsWithTestimonials = async (
  page: number = 1,
  limit: number = 12,
  searchQuery: string = ""
): Promise<{ data: any[]; total: number }> => {
  try {
    console.log("bookingservice getBookingsWithTestimonials.. step 1", {
      page,
      limit,
      searchQuery,
    });

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.get(`/seeker/bookings/with-testimonials`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { page, limit, searchQuery },
    });
    console.log(
      "bookingservice getBookingsWithTestimonials.. step 2",
      response
    );
    return {
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch bookings");
  }
};

export const submitTestimonial = async (
  bookingId: string,
  rating: number,
  comment: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.post(
      `/seeker/bookings/${bookingId}/testimonial`,
      { comment, rating },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error submitting testimonial:", error);
    throw new Error(
      error.response?.data?.error || "Failed to submit testimonial"
    );
  }
};

export const updateTestimonial = async (
  testimonialId: string,
  rating: number,
  comment: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await api.put(
      `/seeker/testimonials/${testimonialId}`,
      { comment, rating },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update testimonial"
    );
  }
};

export const getTestimonialByBookingId = async (
  bookingId: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    console.log("getTestimonialByBookingId BookingId ", bookingId);

    const response = await api.get(
      `/seeker/bookings/${bookingId}/testimonial`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.testimonial;
  } catch (error: any) {
    console.error("Error fetching testimonial:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch testimonial"
    );
  }
};
