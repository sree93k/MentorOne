import { IAppealService } from "../interface/IAppealService";
import { IAppealRepository } from "../../repositories/interface/IAppealRepository";
import AppealRepository from "../../repositories/implementations/AppealRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import UserRepository from "../../repositories/implementations/UserRepository"; // ✅ Fixed import
import {
  EAppeal,
  CreateAppealDTO,
  UpdateAppealDTO,
  AppealSearchFilters,
} from "../../entities/appealEntity";
import { IPaginatedResult } from "../../repositories/interface/IBaseRepository";
import { sendMail } from "../../utils/emailService";

export default class AppealService implements IAppealService {
  private appealRepository: IAppealRepository;
  private userRepository: IUserRepository;

  constructor() {
    this.appealRepository = new AppealRepository();
    this.userRepository = new UserRepository(); // ✅ Fixed instantiation
  }

  async submitAppeal(appealData: CreateAppealDTO): Promise<{
    success: boolean;
    data?: EAppeal;
    message: string;
    appealId?: string;
  }> {
    try {
      console.log("AppealService: Submitting appeal", {
        email: appealData.email,
        category: appealData.category,
      });

      // Verify user exists and is blocked
      const user = await this.userRepository.findByEmail(appealData.email);
      if (!user) {
        return {
          success: false,
          message: "User not found with this email address",
        };
      }

      if (!user.isBlocked) {
        return {
          success: false,
          message: "Account is not currently blocked",
        };
      }

      // ✅ Generate block event ID based on user + timestamp
      const blockEventId = `${user._id}_${new Date(user.updatedAt).getTime()}`;

      // ✅ Check existing appeals for this block event
      const existingAppeals = await this.appealRepository.findByQuery({
        userId: user._id.toString(),
        blockEventId: blockEventId,
      });

      console.log("AppealService: Existing appeals found", {
        count: existingAppeals.length,
        blockEventId,
      });

      // ✅ Determine appeal count and validate limits
      let appealCount = 1;
      let previousAppealId = null;
      let canReappeal = true;

      if (existingAppeals.length > 0) {
        const latestAppeal = existingAppeals[existingAppeals.length - 1];

        // Check if user has reached appeal limit
        if (existingAppeals.length >= 2) {
          return {
            success: false,
            message:
              "You have reached the maximum number of appeals for this blocking incident. Please contact support directly.",
          };
        }

        // Check if latest appeal is still pending
        if (
          latestAppeal.status === "pending" ||
          latestAppeal.status === "under_review"
        ) {
          return {
            success: false,
            message:
              "You already have a pending appeal for this blocking incident. Please wait for the review to complete.",
          };
        }

        // Only allow re-appeal if previous was rejected
        if (latestAppeal.status !== "rejected") {
          return {
            success: false,
            message:
              "You can only submit a new appeal if your previous appeal was rejected.",
          };
        }

        appealCount = existingAppeals.length + 1;
        previousAppealId = latestAppeal._id;
        canReappeal = appealCount < 2; // Can re-appeal only once
      }

      // Create appeal with new tracking fields
      const appeal = await this.appealRepository.createAppeal({
        ...appealData,
        userId: user._id.toString(),
        blockEventId,
        appealCount,
        previousAppealId,
        canReappeal,
      });

      // Send notifications
      await Promise.all([
        this.sendAppealNotificationToAdmin(appeal, user),
        this.sendAppealConfirmationToUser(appeal),
      ]);

      console.log("AppealService: Appeal submitted successfully", {
        appealId: appeal._id,
        appealCount,
        canReappeal,
      });

      return {
        success: true,
        data: appeal,
        message:
          appealCount === 1
            ? "Appeal submitted successfully. You will receive an email confirmation."
            : "Re-appeal submitted successfully. This is your final appeal for this blocking incident.",
        appealId: appeal._id.toString(),
      };
    } catch (error: any) {
      console.error("AppealService: Error submitting appeal", error);
      return {
        success: false,
        message: error.message.includes("duplicate key")
          ? "An appeal for this blocking incident already exists."
          : "Failed to submit appeal. Please try again later.",
      };
    }
  }

  //   async getAppealById(appealId: string): Promise<{
  //     success: boolean;
  //     data?: any; // ✅ Changed to any for flexibility
  //     message: string;
  //   }> {
  //     try {
  //       const appeal = await this.appealRepository.findById(appealId);

  //       if (!appeal) {
  //         return {
  //           success: false,
  //           message: "Appeal not found",
  //         };
  //       }

  //       // ✅ Return full appeal data for admin or public data for users
  //       return {
  //         success: true,
  //         data: appeal, // Return full appeal object
  //         message: "Appeal retrieved successfully",
  //       };
  //     } catch (error: any) {
  //       console.error("AppealService: Error getting appeal", error);
  //       return {
  //         success: false,
  //         message: "Failed to retrieve appeal",
  //       };
  //     }
  //   }
  async getAppealById(appealId: string): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      const appeal = await this.appealRepository.findById(appealId);

      if (!appeal) {
        return {
          success: false,
          message: "Appeal not found",
        };
      }

      // 🔧 ENHANCED: Return more detailed appeal data for user
      const appealData = {
        _id: appeal._id,
        status: appeal.status,
        appealCount: appeal.appealCount || 1,
        canReappeal: appeal.canReappeal !== false,
        submittedAt: appeal.submittedAt,
        reviewedAt: appeal.reviewedAt,
        adminResponse: appeal.adminResponse,
        category: appeal.category,
        firstName: appeal.firstName,
        lastName: appeal.lastName,
        email: appeal.email,
      };

      return {
        success: true,
        data: appealData,
        message: "Appeal retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting appeal", error);
      return {
        success: false,
        message: "Failed to retrieve appeal",
      };
    }
  }

  async getAppealsWithFilters(
    filters: AppealSearchFilters,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    data?: IPaginatedResult<EAppeal>;
    message: string;
  }> {
    try {
      console.log("AppealService: Getting appeals with filters", {
        filters,
        page,
        limit,
      });

      // ✅ Build advanced search query
      const searchQuery: any = {};

      // ✅ FIXED: Text search across multiple fields
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.trim();
        console.log("🔍 Building text search for:", searchTerm);

        searchQuery.$or = [
          { firstName: { $regex: searchTerm, $options: "i" } },
          { lastName: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { appealMessage: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // ✅ FIXED: Status filter
      if (filters.status && filters.status.trim() !== "") {
        console.log("🔍 Adding status filter:", filters.status);
        searchQuery.status = filters.status;
      }

      // ✅ FIXED: Category filter
      if (filters.category && filters.category.trim() !== "") {
        console.log("🔍 Adding category filter:", filters.category);
        searchQuery.category = filters.category;
      }

      // ✅ FIXED: Email filter
      if (filters.email && filters.email.trim() !== "") {
        console.log("🔍 Adding email filter:", filters.email);
        searchQuery.email = { $regex: filters.email, $options: "i" };
      }

      // ✅ FIXED: Date range filter
      if (filters.startDate || filters.endDate) {
        console.log("🔍 Adding date filter:", {
          startDate: filters.startDate,
          endDate: filters.endDate,
        });

        searchQuery.submittedAt = {};

        if (filters.startDate && filters.startDate.trim() !== "") {
          // Set to start of day
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          searchQuery.submittedAt.$gte = startDate;
          console.log("🔍 Start date set to:", startDate);
        }

        if (filters.endDate && filters.endDate.trim() !== "") {
          // Set to end of day
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          searchQuery.submittedAt.$lte = endDate;
          console.log("🔍 End date set to:", endDate);
        }
      }

      console.log(
        "🔍 AppealService: Final search query built",
        JSON.stringify(searchQuery, null, 2)
      );

      const result = await this.appealRepository.findAppealsWithFilters(
        searchQuery,
        page,
        limit
      );

      console.log("AppealService: Appeals retrieved", {
        totalCount: result.totalCount,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        queryUsed: searchQuery,
      });

      // ✅ Ensure compatibility with frontend expectations
      const responseData: IPaginatedResult<EAppeal> = {
        data: result.data,
        total: result.totalCount || 0,
        totalCount: result.totalCount || 0,
        page: result.currentPage || page,
        currentPage: result.currentPage || page,
        limit: limit,
        totalPages: result.totalPages || 0,
        hasNextPage: result.hasNextPage || false,
        hasPreviousPage: result.hasPreviousPage || false,
      };

      return {
        success: true,
        data: responseData,
        message: "Appeals retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting appeals", error);
      return {
        success: false,
        message: "Failed to retrieve appeals",
      };
    }
  }
  async reviewAppeal(
    appealId: string,
    adminId: string,
    decision: "approved" | "rejected",
    adminResponse: string,
    adminNotes?: string
  ): Promise<{
    success: boolean;
    data?: EAppeal;
    message: string;
  }> {
    try {
      console.log("AppealService: Reviewing appeal", {
        appealId,
        decision,
        adminId,
      });

      const updateData: UpdateAppealDTO = {
        status: decision,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminResponse,
        adminNotes,
      };

      const updatedAppeal = await this.appealRepository.updateAppealStatus(
        appealId,
        updateData
      );

      if (!updatedAppeal) {
        return {
          success: false,
          message: "Appeal not found",
        };
      }

      // If approved, unblock the user
      if (decision === "approved") {
        await this.userRepository.updateField(
          updatedAppeal.userId,
          "isBlocked",
          false
        );
        console.log("AppealService: User unblocked", {
          userId: updatedAppeal.userId,
        });
      }

      // Send real-time notifications
      await this.sendRealTimeNotification(
        appealId,
        decision,
        updatedAppeal.userId
      );

      // Send notification email to user
      await this.sendAppealDecisionToUser(updatedAppeal);

      console.log("AppealService: Appeal reviewed successfully", {
        appealId,
        decision,
      });

      return {
        success: true,
        data: updatedAppeal,
        message: `Appeal ${decision} successfully`,
      };
    } catch (error: any) {
      console.error("AppealService: Error reviewing appeal", error);
      return {
        success: false,
        message: "Failed to review appeal",
      };
    }
  }

  // ✅ ADD: Get latest appeal by email
  //   async getLatestAppealByEmail(email: string): Promise<{
  //     success: boolean;
  //     data?: any;
  //     message: string;
  //   }> {
  //     try {
  //       console.log("AppealService: Getting latest appeal for email", { email });

  //       // Find user by email
  //       const user = await this.userRepository.findByEmail(email);
  //       if (!user) {
  //         return {
  //           success: false,
  //           message: "User not found",
  //         };
  //       }

  //       // Find latest appeal for this user
  //       const appeals = await this.appealRepository.findByQuery({
  //         userId: user._id.toString(),
  //       });

  //       if (appeals.length === 0) {
  //         return {
  //           success: false,
  //           message: "No appeals found",
  //         };
  //       }

  //       // Get the most recent appeal
  //       const latestAppeal = appeals.sort(
  //         (a, b) =>
  //           new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  //       )[0];

  //       console.log("AppealService: Latest appeal found", {
  //         appealId: latestAppeal._id,
  //         status: latestAppeal.status,
  //         appealCount: latestAppeal.appealCount,
  //       });

  //       return {
  //         success: true,
  //         data: {
  //           _id: latestAppeal._id,
  //           status: latestAppeal.status,
  //           appealCount: latestAppeal.appealCount || 1,
  //           canReappeal: latestAppeal.canReappeal !== false,
  //           submittedAt: latestAppeal.submittedAt,
  //           adminResponse: latestAppeal.adminResponse,
  //         },
  //         message: "Latest appeal retrieved successfully",
  //       };
  //     } catch (error: any) {
  //       console.error("AppealService: Error getting latest appeal", error);
  //       return {
  //         success: false,
  //         message: "Failed to retrieve latest appeal",
  //       };
  //     }
  //   }
  async getLatestAppealByEmail(email: string): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      console.log("AppealService: Getting latest appeal for email", { email });

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Find latest appeal for this user
      const appeals = await this.appealRepository.findByQuery({
        userId: user._id.toString(),
      });

      if (appeals.length === 0) {
        return {
          success: false,
          message: "No appeals found",
        };
      }

      // Get the most recent appeal
      const latestAppeal = appeals.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0];

      console.log("AppealService: Latest appeal found", {
        appealId: latestAppeal._id,
        status: latestAppeal.status,
        appealCount: latestAppeal.appealCount,
      });

      // 🔧 ENHANCED: Return detailed appeal data
      const appealData = {
        _id: latestAppeal._id,
        status: latestAppeal.status,
        appealCount: latestAppeal.appealCount || 1,
        canReappeal: latestAppeal.canReappeal !== false,
        submittedAt: latestAppeal.submittedAt,
        reviewedAt: latestAppeal.reviewedAt,
        adminResponse: latestAppeal.adminResponse,
        category: latestAppeal.category,
        firstName: latestAppeal.firstName,
        lastName: latestAppeal.lastName,
        email: latestAppeal.email,
      };

      return {
        success: true,
        data: appealData,
        message: "Latest appeal retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting latest appeal", error);
      return {
        success: false,
        message: "Failed to retrieve latest appeal",
      };
    }
  }

  async getAppealStatistics(): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    try {
      const stats = await this.appealRepository.getAppealStatistics();

      return {
        success: true,
        data: stats,
        message: "Appeal statistics retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting statistics", error);
      return {
        success: false,
        message: "Failed to retrieve appeal statistics",
      };
    }
  }

  // ✅ Private helper methods remain the same
  private async sendRealTimeNotification(
    appealId: string,
    status: string,
    userId?: string
  ): Promise<void> {
    try {
      const { getIO } = await import("../../utils/socketManager");
      const io = getIO();

      // Send to admin notification namespace
      io.of("/notifications").emit("appeal_status_update", {
        appealId,
        status,
        timestamp: new Date().toISOString(),
      });

      // If user is online, send to user notification namespace
      if (userId) {
        io.of("/notifications")
          .to(`user_${userId}`)
          .emit("appeal_update", {
            appealId,
            status,
            message: `Your appeal has been ${status}`,
            timestamp: new Date().toISOString(),
          });
      }

      console.log("✅ Real-time appeal notification sent", {
        appealId,
        status,
      });
    } catch (error: any) {
      console.error("❌ Failed to send real-time notification:", error.message);
      // Don't throw - notification failure shouldn't break the appeal process
    }
  }

  private async sendAppealNotificationToAdmin(
    appeal: EAppeal,
    user: any
  ): Promise<void> {
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 New Account Appeal</h2>
        <p><strong>User:</strong> ${appeal.firstName} ${appeal.lastName}</p>
        <p><strong>Email:</strong> ${appeal.email}</p>
        <p><strong>Category:</strong> ${appeal.category}</p>
        <p><strong>Message:</strong> ${appeal.appealMessage}</p>
        <p><strong>Appeal ID:</strong> ${appeal._id}</p>
        <a href="${process.env.FRONTEND_URL}/admin/appeals/${appeal._id}" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Review Appeal
        </a>
      </div>
    `;

    await sendMail(
      "sreekuttan12kaathu@gmail.com",
      `New account appeal from ${appeal.firstName} ${appeal.lastName}`,
      "Admin",
      `🚨 Account Appeal: ${appeal.firstName} ${appeal.lastName}`,
      adminEmailContent
    );
  }

  private async sendAppealConfirmationToUser(appeal: EAppeal): Promise<void> {
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✅ Appeal Submitted</h2>
        <p>Dear ${appeal.firstName},</p>
        <p>Your appeal has been submitted and will be reviewed within 24-48 hours.</p>
        <p><strong>Appeal ID:</strong> ${appeal._id}</p>
      <a href="${process.env.FRONTEND_URL}/appeal/status/${
      appeal._id
    }?email=${encodeURIComponent(appeal.email)}">Check Status</a>
      </div>
    `;

    await sendMail(
      appeal.email,
      "Your account appeal has been submitted",
      `${appeal.firstName} ${appeal.lastName}`,
      "✅ Account Appeal Submitted - MentorOne",
      userEmailContent
    );
  }

  private async sendAppealDecisionToUser(appeal: EAppeal): Promise<void> {
    const isApproved = appeal.status === "approved";
    const subject = isApproved
      ? "✅ Account Appeal Approved - Access Restored"
      : "❌ Account Appeal Decision";

    const emailContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${
          isApproved ? "#059669" : "#dc2626"
        } 0%, ${
      isApproved ? "#047857" : "#b91c1c"
    } 100%); padding: 32px 24px; text-align: center;">
          <div style="background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 32px;">${isApproved ? "✅" : "❌"}</span>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">
            Appeal ${appeal.status === "approved" ? "Approved" : "Rejected"}
          </h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0;">
            ${
              isApproved
                ? "Your access has been restored"
                : "Decision has been made"
            }
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 8px;">
              Hello ${appeal.firstName}
            </h2>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Your account appeal has been reviewed by our team
            </p>
          </div>

          <!-- Decision Details -->
          <div style="background: ${
            isApproved ? "#f0fdf4" : "#fef2f2"
          }; border: 1px solid ${
      isApproved ? "#bbf7d0" : "#fecaca"
    }; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: ${
              isApproved ? "#065f46" : "#dc2626"
            }; font-size: 16px; font-weight: 600; margin: 0 0 12px;">
              ${isApproved ? "🎉 Appeal Approved" : "📋 Appeal Rejected"}
            </h3>
            <div style="background: white; border-radius: 6px; padding: 16px;">
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                <strong>Admin Response:</strong><br>
                ${appeal.adminResponse}
              </p>
            </div>
          </div>

          ${
            isApproved
              ? `
          <!-- Success Actions -->
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #065f46; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
              🚀 What's Next:
            </h4>
            <ul style="color: #047857; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 6px;">Your account has been reactivated</li>
              <li style="margin-bottom: 6px;">You can now log in normally</li>
              <li style="margin-bottom: 6px;">All account features are restored</li>
              <li style="margin-bottom: 6px;">Thank you for your patience</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
     <div style="text-align: center; margin-top: 12px;">
  <a href="${process.env.FRONTEND_URL}/appeal/status/${
                  appeal._id
                }?email=${encodeURIComponent(appeal.email)}" 
     style="color: #065f46; font-size: 13px; text-decoration: underline;">
    View Appeal Details
  </a>
</div>
            </div>
          </div>
          `
              : `
          <!-- Rejection Info -->
<!-- Rejection Info -->
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
  ${
    appeal.canReappeal && appeal.appealCount < 2
      ? `
  <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
    🔄 You can submit a re-appeal
  </h4>
  <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 12px;">
    If you have additional information or believe this decision was incorrect, you can submit one more appeal.
  </p>
  <div style="text-align: center;">
    <a href="${process.env.FRONTEND_URL}/appeal/status/${
          appeal._id
        }?email=${encodeURIComponent(appeal.email)}" 
       style="background: #3b82f6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 13px;">
      Submit Re-appeal
    </a>
  </div>
  <hr style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;">
  `
      : ""
  }
  <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
    📧 Need help?
  </h4>
  <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0;">
    Contact our support team at 
    <a href="mailto:sreekuttan12kaathu@gmail.com" style="color: #1d4ed8;">
      sreekuttan12kaathu@gmail.com
    </a>
  </p>
</div>
          `
          }

          <!-- Appeal Details -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #374151; font-size: 12px; font-weight: 600; margin: 0 0 8px;">Appeal Details:</h4>
            <p style="color: #6b7280; font-size: 11px; margin: 0;">
              Appeal ID: ${appeal._id}<br>
              Reviewed: ${new Date(appeal.reviewedAt!).toLocaleString()}<br>
              Category: ${appeal.category.replace("_", " ").toUpperCase()}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 13px; margin: 0;">
            © ${new Date().getFullYear()} Mentor One. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendMail(
      appeal.email,
      subject,
      `${appeal.firstName} ${appeal.lastName}`,
      subject,
      emailContent
    );
  }
}
