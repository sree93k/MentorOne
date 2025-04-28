// import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

// Create Payment Intent (for in-page payment)
export const createPaymentIntent = async (payload: {
  amount: number;
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.post(
      "/user/payment/create-payment-intent",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    throw error?.response?.data || error;
  }
};

// Save Booking (for in-page payment)
export const saveBooking = async (payload: {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  paymentIntentId: string;
  amount: number;
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.post("/user/payment/save-booking", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Save booking error:", error);
    throw error?.response?.data || error;
  }
};

// Create Checkout Session (for Stripe Checkout, optional)
export const createCheckoutSession = async (payload: {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  amount: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    console.log("access Token is ", accessToken);

    const response = await api.post(
      "/user/payment/create-checkout-session",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    throw error?.response?.data || error;
  }
};
