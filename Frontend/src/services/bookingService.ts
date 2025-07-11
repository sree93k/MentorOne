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
      withCredentials: true,
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

    const response = await api.get(`/seeker/bookings`, {
      withCredentials: true,
      params: { page, limit, searchQuery },
    });
    console.log("BOOOKINGSERVICE getBookings.. step 2", response.data.data);
    return {
      data: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch bookings");
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await api.delete(`/seeker/bookings/${bookingId}`, {
      withCredentials: true,
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
      withCredentials: true,
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

    const response = await api.get(`/expert/bookings`, {
      withCredentials: true,
      params: { page, limit },
    });
    console.log("getBookingsByMentor step 2: Bookings fetched", response.data);
    return {
      data: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error("getBookingsByMentor error:", error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
};

export const allVideoCallBookings = async () => {
  try {
    console.log("bookingservice allVideoCallBookings step 1");

    const response = await api.get(`/expert/allvideocalls`, {
      withCredentials: true,
    });

    console.log("bookingservice allVideoCallBookings step 2", response.data);
    return response.data.data; // Return the data directly
  } catch (error: any) {
    console.error("bookingservice allVideoCallBookings error:", error);
    throw new Error(`Failed to fetch videocall bookings: ${error.message}`);
  }
};

export const updateStatus = async (bookingId: string, payload: any) => {
  try {
    console.log("bookingservice updateStatus step 1");

    console.log("bookingservice updateStatus step 1.1", bookingId);
    console.log("bookingservice updateStatus step 1.2", payload);

    const response = await api.put(
      `/user/booking/${bookingId}/updatereshedule`,
      { payload },
      {
        withCredentials: true,
      }
    );
    console.log("bookingservice updateStatus step 2");
    return response;
  } catch (error) {
    console.error("bookingservice  updateStatus error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch  updateStatus: ${error.message}`);
    } else {
      throw new Error("Failed to fetch  updateStatus: Unknown error");
    }
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
        withCredentials: true,
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

    const response = await api.get(`/seeker/bookings/with-testimonials`, {
      withCredentials: true,
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
    const response = await api.post(
      `/seeker/bookings/${bookingId}/testimonial`,
      { comment, rating },
      {
        withCredentials: true,
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
    const response = await api.put(
      `/seeker/testimonials/${testimonialId}`,
      { comment, rating },
      {
        withCredentials: true,
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
    console.log("getTestimonialByBookingId BookingId step1", bookingId);

    const response = await api.get(
      `/seeker/bookings/${bookingId}/testimonial`,
      {
        withCredentials: true,
      }
    );
    console.log("getTestimonialByBookingId BookingId step 2", response);
    return response.data.data.testimonial;
  } catch (error: any) {
    console.error("Error fetching testimonial:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch testimonial"
    );
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "rescheduled" | "cancelled"
): Promise<any> => {
  try {
    console.log("updateBookingStatus step 1", { bookingId, status });

    const response = await api.put(
      `/user/booking/${bookingId}/updatestatus`,
      { status },
      {
        withCredentials: true,
      }
    );
    console.log("updateBookingStatus step 2, response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("updateBookingStatus error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update booking status"
    );
  }
};

export const getBookingData = async (
  dashboard: "mentor" | "mentee",
  bookingId: String
) => {
  try {
    const response = await api.get(`/user/bookings/:${bookingId}`, {
      params: { dashboard },
      withCredentials: true,
    });
    console.log("getBookingData response:", {
      dashboard,
      status: response.status,
      data: response.data,
    });
    return response.data;
  } catch (error: any) {
    console.error("getBookingData error:", error);
    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch booking data";
    throw new Error(message);
  }
};
