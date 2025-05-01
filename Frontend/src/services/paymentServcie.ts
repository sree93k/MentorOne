// // import axios, { AxiosError, AxiosResponse } from "axios";
// import { userAxiosInstance } from "./instances/userInstance";
// const api = userAxiosInstance;

// interface CreatePaymentIntentParams {
//   amount: number;
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
//   customerEmail?: string;
//   customerName?: string;
//   customerPhone?: string | number;
// }

// interface SaveBookingParams {
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
//   paymentIntentId: string;
//   amount: number;
// }

// export const createPaymentIntent = async (
//   params: CreatePaymentIntentParams
// ) => {
//   try {
//     console.log("Payment service createPaymentIntent step 1", params);

//     const response = await api.post(
//       `/user/payment/create-payment-intent`,
//       params,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );
//     console.log("Payment service createPaymentIntent step 2", response);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error creating payment intent:", error);
//     throw new Error(
//       error.response?.data?.error || "Failed to create payment intent"
//     );
//   }
// };

// export const saveBooking = async (params: SaveBookingParams) => {
//   try {
//     console.log("Payment service saveBooking step 1", params);
//     const response = await api.post(`/user/payment/save-booking`, params, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//     });
//     console.log("Payment service saveBooking step 2", response);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error saving booking:", error);
//     throw new Error(error.response?.data?.error || "Failed to save booking");
//   }
// };

// // Create Checkout Session (for Stripe Checkout, optional)
// export const createCheckoutSession = async (payload: {
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   amount: number;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
// }) => {
//   try {
//     console.log("Payment service createCheckoutSession step 1", payload);
//     const accessToken = localStorage.getItem("accessToken");
//     console.log("access Token is ", accessToken);

//     const response = await api.post(
//       "/user/payment/create-checkout-session",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     console.log("Payment service createCheckoutSession step 2", response);
//     return response.data;
//   } catch (error: any) {
//     console.error("Create checkout session error:", error);
//     throw error?.response?.data || error;
//   }
// };

// export const checkSlotStatus = async (
//   mentorId: string,
//   day: string,
//   slotIndex: number
// ) => {
//   try {
//     const response = await api.get(
//       `${import.meta.env.VITE_API_URL}/user/schedule/check-slot`,
//       {
//         params: { mentorId, day, slotIndex },
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Error checking slot status:", error);
//     throw new Error(
//       error.response?.data?.error || "Failed to check slot status"
//     );
//   }
// };

// export const updateSlot = async (
//   scheduleId: string,
//   slotIndex: number,
//   payload: UpdateSlotPayload
// ) => {
//   try {
//     const response = await api.patch(
//       `${import.meta.env.VITE_API_URL}/user/schedule/update-slot`,
//       { scheduleId, slotIndex, ...payload },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Error updating slot:", error);
//     throw new Error(error.response?.data?.error || "Failed to update slot");
//   }
// };
import axios from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

interface CreatePaymentIntentParams {
  amount: number;
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string | number;
}

export const createPaymentIntent = async (
  params: CreatePaymentIntentParams
) => {
  try {
    console.log("Payment service createPaymentIntent step 1", params);
    const response = await api.post(
      `/user/payment/create-payment-intent`,
      params,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("Payment service createPaymentIntent step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create payment intent"
    );
  }
};

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
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string | number;
}) => {
  try {
    console.log("Payment service createCheckoutSession step 1", payload);
    const accessToken = localStorage.getItem("accessToken");
    console.log("access Token is ", accessToken);

    const response = await api.post(
      `/user/payment/create-checkout-session`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Payment service createCheckoutSession step 2", response);
    return response.data;
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    throw error?.response?.data || error;
  }
};

export const verifySession = async (sessionId: string) => {
  try {
    const response = await api.get(
      `/user/payment/verify-session/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error verifying session:", error);
    throw new Error(error.response?.data?.error || "Failed to verify session");
  }
};
