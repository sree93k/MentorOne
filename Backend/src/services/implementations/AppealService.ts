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

  //   async reviewAppeal(
  //     appealId: string,
  //     adminId: string,
  //     decision: "approved" | "rejected",
  //     adminResponse: string,
  //     adminNotes?: string
  //   ): Promise<{
  //     success: boolean;
  //     data?: EAppeal;
  //     message: string;
  //   }> {
  //     try {
  //       console.log("AppealService: Reviewing appeal", {
  //         appealId,
  //         decision,
  //         adminId,
  //       });

  //       const updateData: UpdateAppealDTO = {
  //         status: decision,
  //         reviewedBy: adminId,
  //         reviewedAt: new Date(),
  //         adminResponse,
  //         adminNotes,
  //       };

  //       const updatedAppeal = await this.appealRepository.updateAppealStatus(
  //         appealId,
  //         updateData
  //       );

  //       if (!updatedAppeal) {
  //         return {
  //           success: false,
  //           message: "Appeal not found",
  //         };
  //       }

  //       // If approved, unblock the user
  //       if (decision === "approved") {
  //         await this.userRepository.updateField(
  //           updatedAppeal.userId,
  //           "isBlocked",
  //           false
  //         );
  //         console.log("AppealService: User unblocked", {
  //           userId: updatedAppeal.userId,
  //         });
  //       }

  //       // Send notification email to user
  //       await this.sendAppealDecisionToUser(updatedAppeal);

  //       console.log("AppealService: Appeal reviewed successfully", {
  //         appealId,
  //         decision,
  //       });

  //       return {
  //         success: true,
  //         data: updatedAppeal,
  //         message: `Appeal ${decision} successfully`,
  //       };
  //     } catch (error: any) {
  //       console.error("AppealService: Error reviewing appeal", error);
  //       return {
  //         success: false,
  //         message: "Failed to review appeal",
  //       };
  //     }
  //   }
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

      // ✅ ADD: Send real-time notifications
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

  //   private async sendAppealDecisionToUser(appeal: EAppeal): Promise<void> {
  //     const isApproved = appeal.status === "approved";
  //     const subject = isApproved
  //       ? "✅ Account Appeal Approved - Access Restored"
  //       : "❌ Account Appeal Decision";

  //     const emailContent = `
  //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //         <h2 style="color: ${isApproved ? "#059669" : "#dc2626"};">
  //           ${isApproved ? "✅" : "❌"} Appeal ${
  //       appeal.status === "approved" ? "Approved" : "Rejected"
  //     }
  //         </h2>
  //         <p>Dear ${appeal.firstName},</p>
  //         <p>Your account appeal has been reviewed.</p>
  //         ${
  //           appeal.adminResponse
  //             ? `<p><strong>Admin Response:</strong> ${appeal.adminResponse}</p>`
  //             : ""
  //         }
  //         ${
  //           isApproved
  //             ? "<p>Your account has been reactivated. You can now log in normally.</p>"
  //             : ""
  //         }
  //         <p><strong>Appeal ID:</strong> ${appeal._id}</p>
  //       </div>
  //     `;

  //     await sendMail(
  //       appeal.email,
  //       subject,
  //       `${appeal.firstName} ${appeal.lastName}`,
  //       subject,
  //       emailContent
  //     );
  //   }
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
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                Login to Your Account
              </a>
            </div>
          </div>
          `
              : `
          <!-- Rejection Info -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
              📧 Still have questions?
            </h4>
            <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0;">
              If you believe this decision is incorrect or have additional information, 
              you can contact our support team at 
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
