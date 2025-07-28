import { userAxiosInstance } from "./instances/userInstance";
import { CreatePaymentIntentParams } from "@/types/payment";
const api = userAxiosInstance;

// ✅ CHANGED: Create Payment Intent - Remove accessToken usage
export const createPaymentIntent = async (
  params: CreatePaymentIntentParams
) => {
  try {
    console.log("Payment service createPaymentIntent step 1", params);

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post(
      "/user/payment/create-payment-intent",
      params
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

// ✅ CHANGED: Create Checkout Session - Remove accessToken usage
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
    console.log(
      "&&&&&&&&&&&&&&& Payment service createCheckoutSession step 1",
      payload
    );

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.post(
      "/user/payment/create-checkout-session",
      payload
    );

    console.log("Payment service createCheckoutSession step 2", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    throw error?.response?.data || error;
  }
};

// ✅ CHANGED: Verify Session - Remove accessToken usage
export const verifySession = async (sessionId: string) => {
  try {
    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get(`/user/payment/verify-session/${sessionId}`);

    return response.data;
  } catch (error: any) {
    console.error("Error verifying session:", error);
    throw new Error(error.response?.data?.error || "Failed to verify session");
  }
};

// ✅ CHANGED: Get All Mentee Payments - Remove accessToken usage
export const getAllMenteePayments = async (page: number, limit: number) => {
  try {
    console.log("payment service getAllMenteePayments step 1");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/seeker/payment/mentee-payments", {
      params: {
        page,
        limit,
      },
    });

    console.log(
      "MENTEEPAYMNETpayment service getAllMenteePayments step 2",
      response.data
    );

    if (!response.data.success || !response.data.message) {
      throw new Error(response.data.message || "Invalid response from server");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error in getAllMenteePayments:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch payments"
    );
  }
};

// ✅ CHANGED: Get All Mentor Payments - Remove accessToken usage
export const getAllMentorPayments = async (page: number, limit: number) => {
  try {
    console.log("payment service getAllMentorPayments step 1");

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/expert/payment/mentor-payments", {
      params: {
        page,
        limit,
      },
    });

    console.log(
      "PPPPPPPayment service getAllMentorPayments step 2",
      response.data
    );

    // Ensure response has expected structure
    if (!response.data.success || !response.data.message) {
      throw new Error(response.data.message || "Invalid response from server");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error in getAllMentorPayments:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch payments"
    );
  }
};

// ✅ CHANGED: Get Mentee Wallet - Remove accessToken usage
export const getMenteeWallet = async (page: number, limit: number) => {
  try {
    console.log("payment service getMenteeWallet step 1", { page, limit });

    // ✅ CHANGED: No Authorization header - cookies sent automatically
    const response = await api.get("/seeker/wallet", {
      params: {
        page,
        limit,
      },
    });

    console.log("payment service getMenteeWallet step 2", response.data);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Invalid response from server");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error in getMenteeWallet:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch wallet data"
    );
  }
};
