// // services/contactServices.ts
// import { userAxiosInstance } from "./instances/userInstance";
// const api = userAxiosInstance;
// interface ContactFormData {
//   name: string;
//   email: string;
//   phone: string;
//   subject: string;
//   inquiryType: string;
//   message: string;
// }

// interface ContactResponse {
//   success: boolean;
//   message: string;
//   data?: any;
// }

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // Contact form submission service
// export const submitContactForm = async (
//   formData: ContactFormData
// ): Promise<ContactResponse> => {
//   try {
//     const response = await api.post(
//       `${API_BASE_URL}/contact/submit`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       success: true,
//       message: "Message sent successfully!",
//       data: response.data,
//     };
//   } catch (error: any) {
//     console.error("Contact form submission error:", error);

//     return {
//       success: false,
//       message:
//         error.response?.data?.message ||
//         "Failed to send message. Please try again.",
//     };
//   }
// };

// // Newsletter subscription service
// export const subscribeToNewsletter = async (
//   email: string
// ): Promise<ContactResponse> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/newsletter/subscribe`, {
//       email,
//     });

//     return {
//       success: true,
//       message: "Successfully subscribed to newsletter!",
//       data: response.data,
//     };
//   } catch (error: any) {
//     console.error("Newsletter subscription error:", error);

//     return {
//       success: false,
//       message:
//         error.response?.data?.message ||
//         "Subscription failed. Please try again.",
//     };
//   }
// };

// // Get contact information (for dynamic updates)
// export const getContactInfo = async () => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/contact/info`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch contact info:", error);
//     return null;
//   }
// };
import {
  ContactFormData,
  ContactResponse,
  ContactStatistics,
} from "@/types/contact";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

// =================== PUBLIC CONTACT FORM SUBMISSION ===================
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP ${response.status}: Failed to send message`
      );
    }

    return {
      success: true,
      message: result.message || "Message sent successfully!",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Contact form submission error:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }

    return {
      success: false,
      message: error.message || "Failed to send message. Please try again.",
    };
  }
};

// =================== ADMIN CONTACT MANAGEMENT SERVICES ===================

export const getContactMessages = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    inquiryType?: string;
    priority?: string;
    isRegisteredUser?: boolean;
    startDate?: string;
    endDate?: string;
  } = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages?${queryParams.toString()}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return await response.json();
  } catch (error) {
    console.error("Get contact messages error:", error);
    throw error;
  }
};

export const getContactMessage = async (id: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/${id}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch message");
    }

    return await response.json();
  } catch (error) {
    console.error("Get contact message error:", error);
    throw error;
  }
};

export const updateContactMessage = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update message");
    }

    return await response.json();
  } catch (error) {
    console.error("Update contact message error:", error);
    throw error;
  }
};

export const addMessageResponse = async (id: string, message: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/${id}/response`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add response");
    }

    return await response.json();
  } catch (error) {
    console.error("Add message response error:", error);
    throw error;
  }
};

export const addInternalNote = async (id: string, note: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/${id}/note`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add note");
    }

    return await response.json();
  } catch (error) {
    console.error("Add internal note error:", error);
    throw error;
  }
};

export const getContactStatistics = async (): Promise<{
  success: boolean;
  data: ContactStatistics;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/contact/statistics`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    return await response.json();
  } catch (error) {
    console.error("Get contact statistics error:", error);
    throw error;
  }
};

export const markMessagesAsSeen = async (ids: string[]) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/bulk/seen`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark messages as seen");
    }

    return await response.json();
  } catch (error) {
    console.error("Mark messages as seen error:", error);
    throw error;
  }
};

export const searchContactMessages = async (
  query: string,
  page = 1,
  limit = 20
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Search contact messages error:", error);
    throw error;
  }
};

export const markAsRead = async (id: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/${id}/read`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark as read");
    }

    return await response.json();
  } catch (error) {
    console.error("Mark as read error:", error);
    throw error;
  }
};

export const bulkUpdateStatus = async (ids: string[], status: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/contact/messages/bulk/update-status`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to bulk update status");
    }

    return await response.json();
  } catch (error) {
    console.error("Bulk update status error:", error);
    throw error;
  }
};
