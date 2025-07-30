import { userAxiosInstance } from "./instances/userInstance";

export interface AppealSubmissionData {
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category?: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
}

export interface AppealStatusData {
  appealId: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  adminResponse?: string;
  category: string;
}

export interface AppealApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
}

class AppealService {
  /**
   * Submit a new appeal
   */
  async submitAppeal(
    appealData: AppealSubmissionData
  ): Promise<AppealApiResponse> {
    try {
      console.log("📝 AppealService: Submitting appeal", {
        email: appealData.email,
        category: appealData.category,
        messageLength: appealData.appealMessage.length,
      });

      const response = await userAxiosInstance.post(
        "/user/appeal/submit",
        appealData
      );

      console.log("✅ AppealService: Appeal submitted successfully", {
        appealId: response.data.data?.appealId,
        success: response.data.success,
      });

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AppealService: Error submitting appeal", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Return user-friendly error messages
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit appeal. Please try again later.";

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data?.errors || error.message,
      };
    }
  }

  /**
   * Check appeal status by ID
   */
  async getAppealStatus(
    appealId: string
  ): Promise<AppealApiResponse<AppealStatusData>> {
    try {
      console.log("🔍 AppealService: Checking appeal status", { appealId });

      const response = await userAxiosInstance.get(
        `/user/appeal/status/${appealId}`
      );

      console.log("✅ AppealService: Appeal status retrieved", {
        appealId,
        status: response.data.data?.status,
      });

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AppealService: Error getting appeal status", {
        appealId,
        error: error.message,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || "Failed to retrieve appeal status.";

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Validate appeal submission data
   */
  validateAppealData(appealData: Partial<AppealSubmissionData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!appealData.email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appealData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Name validation
    if (!appealData.firstName || appealData.firstName.trim().length < 1) {
      errors.push("First name is required");
    }

    if (!appealData.lastName || appealData.lastName.trim().length < 1) {
      errors.push("Last name is required");
    }

    // Message validation
    if (!appealData.appealMessage) {
      errors.push("Appeal message is required");
    } else if (appealData.appealMessage.trim().length < 10) {
      errors.push("Appeal message must be at least 10 characters");
    } else if (appealData.appealMessage.trim().length > 1000) {
      errors.push("Appeal message must be less than 1000 characters");
    }

    // Category validation (optional)
    if (appealData.category) {
      const validCategories = [
        "wrongful_block",
        "account_hacked",
        "misunderstanding",
        "other",
      ];
      if (!validCategories.includes(appealData.category)) {
        errors.push("Invalid appeal category");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get user info from localStorage (for form pre-filling)
   */
  getUserInfoFromStorage(): Partial<AppealSubmissionData> {
    try {
      // Try to get user info from various storage sources
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        };
      }

      // Fallback: Try to get from Redux state or other sources
      // This would depend on your state management setup
      return {};
    } catch (error) {
      console.warn("Could not retrieve user info from storage:", error);
      return {};
    }
  }

  /**
   * Format appeal category for display
   */
  formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      wrongful_block: "Wrongful Block",
      account_hacked: "Account Hacked",
      misunderstanding: "Misunderstanding",
      other: "Other",
    };

    return categoryMap[category] || category;
  }

  /**
   * Format appeal status for display
   */
  formatStatus(status: string): {
    label: string;
    color: string;
    icon: string;
  } {
    const statusMap: {
      [key: string]: { label: string; color: string; icon: string };
    } = {
      pending: {
        label: "Pending Review",
        color: "yellow",
        icon: "⏳",
      },
      under_review: {
        label: "Under Review",
        color: "blue",
        icon: "👀",
      },
      approved: {
        label: "Approved",
        color: "green",
        icon: "✅",
      },
      rejected: {
        label: "Rejected",
        color: "red",
        icon: "❌",
      },
    };

    return (
      statusMap[status] || {
        label: status,
        color: "gray",
        icon: "❓",
      }
    );
  }
}

export default new AppealService();
