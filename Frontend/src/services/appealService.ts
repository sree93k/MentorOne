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

class AppealService {
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

  async getAppealStatus(appealId: string): Promise<AppealApiResponse> {
    try {
      const response = await userAxiosInstance.get(
        `/user/appeal/status/${appealId}`
      );
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to retrieve appeal status",
        error: error.response?.data || error.message,
      };
    }
  }

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

  getUserInfoFromStorage(): Partial<AppealSubmissionData> {
    try {
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
      return {};
    } catch (error) {
      console.warn("Could not retrieve user info from storage:", error);
      return {};
    }
  }

  formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      wrongful_block: "Wrongful Block",
      account_hacked: "Account Hacked",
      misunderstanding: "Misunderstanding",
      other: "Other",
    };
    return categoryMap[category] || category;
  }
}

export default new AppealService();
