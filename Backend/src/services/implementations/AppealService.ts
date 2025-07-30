import { IAppealService } from "../interface/IAppealService";
import { IAppealRepository } from "../../repositories/interface/IAppealRepository";
import AppealRepository from "../../repositories/implementations/AppealRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import UserRepository from "../../repositories/implementations/UserRepository";
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
    this.userRepository = new UserRepository();
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

      // Check for recent appeals to prevent spam
      const recentAppeals = await this.appealRepository.findRecentAppealsByUser(
        user._id.toString(),
        24 // 24 hours
      );

      if (recentAppeals.length >= 3) {
        return {
          success: false,
          message:
            "Too many appeals submitted recently. Please wait 24 hours before submitting another appeal.",
        };
      }

      // Create appeal
      const appeal = await this.appealRepository.createAppeal({
        ...appealData,
        userId: user._id.toString(),
      });

      // Send notifications
      await Promise.all([
        this.sendAppealNotificationToAdmin(appeal, user),
        this.sendAppealConfirmationToUser(appeal),
      ]);

      console.log("AppealService: Appeal submitted successfully", {
        appealId: appeal._id,
      });

      return {
        success: true,
        data: appeal,
        message:
          "Appeal submitted successfully. You will receive an email confirmation.",
        appealId: appeal._id.toString(),
      };
    } catch (error: any) {
      console.error("AppealService: Error submitting appeal", error);
      return {
        success: false,
        message: "Failed to submit appeal. Please try again later.",
      };
    }
  }

  async getAppealById(appealId: string): Promise<{
    success: boolean;
    data?: Partial<EAppeal>;
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

      // Return only public data
      const publicData = {
        appealId: appeal._id,
        status: appeal.status,
        submittedAt: appeal.submittedAt,
        reviewedAt: appeal.reviewedAt,
        adminResponse: appeal.adminResponse,
        category: appeal.category,
      };

      return {
        success: true,
        data: publicData,
        message: "Appeal status retrieved successfully",
      };
    } catch (error: any) {
      console.error("AppealService: Error getting appeal", error);
      return {
        success: false,
        message: "Failed to retrieve appeal status",
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
      const result = await this.appealRepository.findAppealsWithFilters(
        filters,
        page,
        limit
      );

      return {
        success: true,
        data: result,
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

  // Private helper methods for email notifications
  private async sendAppealNotificationToAdmin(
    appeal: EAppeal,
    user: any
  ): Promise<void> {
    // Implementation similar to previous version but cleaner
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
    // Implementation similar to previous version
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✅ Appeal Submitted</h2>
        <p>Dear ${appeal.firstName},</p>
        <p>Your appeal has been submitted and will be reviewed within 24-48 hours.</p>
        <p><strong>Appeal ID:</strong> ${appeal._id}</p>
        <a href="${process.env.FRONTEND_URL}/appeal/status/${appeal._id}">Check Status</a>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isApproved ? "#059669" : "#dc2626"};">
          ${isApproved ? "✅" : "❌"} Appeal ${
      appeal.status === "approved" ? "Approved" : "Rejected"
    }
        </h2>
        <p>Dear ${appeal.firstName},</p>
        <p>Your account appeal has been reviewed.</p>
        ${
          appeal.adminResponse
            ? `<p><strong>Admin Response:</strong> ${appeal.adminResponse}</p>`
            : ""
        }
        ${
          isApproved
            ? "<p>Your account has been reactivated. You can now log in normally.</p>"
            : ""
        }
        <p><strong>Appeal ID:</strong> ${appeal._id}</p>
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
