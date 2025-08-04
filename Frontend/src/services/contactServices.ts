// services/contactServices.ts
import { userAxiosInstance } from "./instances/userInstance";
const api = userAxiosInstance;
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Contact form submission service
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/contact/submit`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Message sent successfully!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Contact form submission error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to send message. Please try again.",
    };
  }
};

// Newsletter subscription service
export const subscribeToNewsletter = async (
  email: string
): Promise<ContactResponse> => {
  try {
    const response = await api.post(`${API_BASE_URL}/newsletter/subscribe`, {
      email,
    });

    return {
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Subscription failed. Please try again.",
    };
  }
};

// Get contact information (for dynamic updates)
export const getContactInfo = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/contact/info`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return null;
  }
};
