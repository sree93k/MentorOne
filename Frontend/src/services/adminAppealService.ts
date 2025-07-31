import { adminAxiosInstance } from "./instances/adminInstance"; // Use admin instance, not user instance

export interface AdminAppealData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  appealMessage: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminResponse?: string;
  adminNotes?: string;
}

export interface AdminAppealApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
}

class AdminAppealService {
  /**
   * Get all appeals with filters
   */
  async getAppeals(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<
    AdminAppealApiResponse<{
      data: AdminAppealData[];
      total: number;
    }>
  > {
    try {
      console.log("📋 AdminAppealService: Fetching appeals", params);

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);

      const response = await adminAxiosInstance.get(
        `/admin/appeals?${queryParams}`
      );

      console.log("✅ AdminAppealService: Appeals fetched successfully", {
        count: response.data.data?.data?.length || 0,
        total: response.data.data?.total || 0,
      });

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AdminAppealService: Error fetching appeals", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch appeals",
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get specific appeal details
   */
  async getAppealDetails(
    appealId: string
  ): Promise<AdminAppealApiResponse<AdminAppealData>> {
    try {
      console.log("📋 AdminAppealService: Fetching appeal details", {
        appealId,
      });

      const response = await adminAxiosInstance.get(
        `/admin/appeals/${appealId}`
      );

      console.log("✅ AdminAppealService: Appeal details fetched successfully");

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AdminAppealService: Error fetching appeal details", {
        appealId,
        error: error.message,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch appeal details",
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Review an appeal
   */
  async reviewAppeal(
    appealId: string,
    decision: "approved" | "rejected",
    adminResponse: string,
    adminNotes?: string
  ): Promise<AdminAppealApiResponse<AdminAppealData>> {
    try {
      console.log("📋 AdminAppealService: Reviewing appeal", {
        appealId,
        decision,
      });

      const response = await adminAxiosInstance.patch(
        `/admin/appeals/${appealId}/review`,
        {
          decision,
          adminResponse,
          adminNotes,
        }
      );

      console.log("✅ AdminAppealService: Appeal reviewed successfully");

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("❌ AdminAppealService: Error reviewing appeal", {
        appealId,
        error: error.message,
        status: error.response?.status,
      });

      return {
        success: false,
        message: error.response?.data?.message || "Failed to review appeal",
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get appeal statistics
   */
  async getAppealStatistics(): Promise<AdminAppealApiResponse> {
    try {
      const response = await adminAxiosInstance.get(
        `/admin/appeals/statistics`
      );

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch statistics",
        error: error.response?.data || error.message,
      };
    }
  }
}

export default new AdminAppealService();
