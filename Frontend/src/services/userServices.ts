// import axios, { AxiosError, AxiosResponse } from "axios";
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;

//resetPassword
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Basic client-side validation
    const accessToken = localStorage.getItem("accessToken");
    console.log("updateUserPassword step 1 ", currentPassword, newPassword);

    if (!newPassword || newPassword.length < 6) {
      console.log("Password must be at least 6 characters long");

      return;
    }
    console.log("updateUserPassword step 2 sending.....");
    const response = await api.put(
      `/user/resetPassword`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updateUserPassword step 2 responsee.....,response", response);
    return response;
  } catch (error) {
    console.error("Update password error:", error?.response?.data);
    return error?.response?.data;
  }
};

//delete profile
export const deleteUserAccount = async () => {
  try {
    console.log("delete account serbice start");
    const accessToken = localStorage.getItem("accessToken");

    const response = await api.delete(`/user/deleteAccount`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status == 200) {
      localStorage.removeItem("accessToken");
    }
    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return error;
  }
};

export const updateUserProfile = async (payload: any) => {
  try {
    console.log("user servcie is updateUserProfile1?????", payload);
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.put("/user/profileEdit", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("user servcie is updateUserProfile 2", response);
    const updateData = response.data.data;
    console.log("user servcie is updateUserProfile 3", updateData);
    return updateData;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// // Create Payment Intent (for in-page payment)
// export const createPaymentIntent = async (payload: {
//   amount: number;
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
// }) => {
//   try {
//     const accessToken = localStorage.getItem("auth_token");
//     const response = await api.post(
//       "/user/payment/create-payment-intent",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Create payment intent error:", error);
//     throw error?.response?.data || error;
//   }
// };

// // Save Booking (for in-page payment)
// export const saveBooking = async (payload: {
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
// }) => {
//   try {
//     const accessToken = localStorage.getItem("auth_token");
//     const response = await api.post("/user/payment/save-booking", payload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error("Save booking error:", error);
//     throw error?.response?.data || error;
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
//     const accessToken = localStorage.getItem("auth_token");
//     const response = await api.post(
//       "/user/payment/create-checkout-session",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Create checkout session error:", error);
//     throw error?.response?.data || error;
//   }
// };
