import axios from "axios";
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

export const getBookings = async () => {
  try {
    console.log("bookingservice getBookings.. step 1");

    const response = await api.get(`/seeker/bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("bookingservice getBookings.. step 2", response);
    return response.data;
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
