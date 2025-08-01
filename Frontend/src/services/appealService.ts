import { userAxiosInstance } from "./instances/userInstance";

export interface AppealSubmissionData {
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category?: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
}

export interface AppealApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
}
// 🆕 NEW: Enhanced appeal data interface
export interface ExistingAppeal {
  _id: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  appealCount: number;
  canReappeal: boolean;
  submittedAt: string;
  adminResponse?: string;
  reviewedAt?: string;
  category: string;
  firstName: string;
  lastName: string;
  email: string;
}
// 🆕 NEW: Enhanced appeal data interface
export interface ExistingAppeal {
  _id: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  appealCount: number;
  canReappeal: boolean;
  submittedAt: string;
  adminResponse?: string;
  reviewedAt?: string;
  category: string;
  firstName: string;
  lastName: string;
}

class AppealService {
  /**
   * Submit new appeal
   */
  async submitAppeal(
    appealData: AppealSubmissionData
  ): Promise<AppealApiResponse> {
    try {
      console.log("📝 AppealService: Starting appeal submission", appealData);

      const response = await userAxiosInstance.post(
        "/user/appeal/submit",
        appealData
      );

      console.log("✅ AppealService: API call successful", response.data);

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

      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit appeal",
        error: error.response?.data?.errors || error.message,
      };
    }
  }

  /**
   * 🔧 ENHANCED: Get appeal status by ID with detailed info
   */
  async getAppealStatus(
    appealId: string
  ): Promise<AppealApiResponse<ExistingAppeal>> {
    try {
      console.log("📋 AppealService: Getting appeal status", { appealId });

      const response = await userAxiosInstance.get(
        `/user/appeal/status/${appealId}`
      );

      console.log("✅ AppealService: Appeal status retrieved", response.data);

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AppealService: Error getting appeal status", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to retrieve appeal status",
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * 🔧 ENHANCED: Get latest appeal by email with detailed info
   */
  async getLatestAppealByEmail(
    email: string
  ): Promise<AppealApiResponse<ExistingAppeal>> {
    try {
      console.log("📋 AppealService: Getting latest appeal by email", {
        email,
      });

      const response = await userAxiosInstance.get(
        `/user/appeal/latest/${encodeURIComponent(email)}`
      );

      console.log("✅ AppealService: Latest appeal retrieved", response.data);

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AppealService: Error getting latest appeal", error);

      return {
        success: false,
        message: error.response?.data?.message || "Failed to get latest appeal",
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Validate appeal form data
   */
  validateAppealData(appealData: Partial<AppealSubmissionData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!appealData.email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appealData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!appealData.firstName || appealData.firstName.trim().length < 1) {
      errors.push("First name is required");
    }

    if (!appealData.lastName || appealData.lastName.trim().length < 1) {
      errors.push("Last name is required");
    }

    if (!appealData.appealMessage) {
      errors.push("Appeal message is required");
    } else if (appealData.appealMessage.trim().length < 10) {
      errors.push("Appeal message must be at least 10 characters");
    } else if (appealData.appealMessage.trim().length > 1000) {
      errors.push("Appeal message must be less than 1000 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getUserInfoFromStorage(emailFromUrl?: string): Partial<AppealSubmissionData> {
    try {
      if (emailFromUrl) {
        return {
          email: emailFromUrl,
          firstName: "",
          lastName: "",
          // ✅ DON'T set appealMessage here
        };
      }

      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          // ✅ DON'T set appealMessage here
        };
      }
      return {};
    } catch (error) {
      console.warn("Could not retrieve user info from storage:", error);
      return emailFromUrl
        ? { email: emailFromUrl, firstName: "", lastName: "" }
        : {};
    }
  }

  /**
   * Format category for display
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
   * 🆕 NEW: Format appeal status for display
   */
  formatAppealStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: "Pending Review",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  }

  /**
   * 🆕 NEW: Get time ago display
   */
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }
}

export default new AppealService();
