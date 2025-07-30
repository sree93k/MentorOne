import { Server } from "socket.io";
import { getIO } from "../../utils/socketManager";
import { sendMail } from "../../utils/emailService";
import UserRepository from "../../repositories/implementations/UserRepository";

export class UserEjectionService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async ejectUser(
    userId: string,
    reason: string,
    adminId: string,
    blockData?: {
      category?: string;
      adminNote?: string;
      adminIP?: string;
      timestamp?: string;
    }
  ): Promise<void> {
    try {
      console.log("🚨 UserEjectionService: Starting enhanced user ejection", {
        userId,
        reason,
        adminId,
        blockData,
        timestamp: new Date().toISOString(),
      });

      // Get user details for enhanced notification
      const user = await this.userRepository.findById(userId);
      if (!user) {
        console.error("❌ UserEjectionService: User not found:", userId);
        return;
      }

      // 🎯 ENHANCED: Create comprehensive block notification
      const enhancedBlockData = {
        reason: reason || "Account blocked by administrator",
        category: blockData?.category || "terms_violation",
        adminEmail: "sreekuttan12kaathu@gmail.com",
        timestamp: blockData?.timestamp || new Date().toISOString(),
        canAppeal: true,
        adminId,
        adminIP: blockData?.adminIP || "unknown",
        adminNote: blockData?.adminNote || "",
        userData: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.role || [],
        },
      };

      console.log("🚨 UserEjectionService: Enhanced block data prepared", {
        userId,
        category: enhancedBlockData.category,
        hasAdminNote: !!enhancedBlockData.adminNote,
      });

      // 🎯 PHASE 2: Real-time ejection with enhanced data
      await this.sendRealTimeEjection(userId, enhancedBlockData);

      // 🎯 ENHANCED: Send comprehensive email notification
      await this.sendEnhancedBlockEmail(user, enhancedBlockData);

      // 🎯 LOG: Create audit trail
      console.log("✅ UserEjectionService: Enhanced ejection completed", {
        userId,
        userEmail: user.email,
        category: enhancedBlockData.category,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("❌ UserEjectionService: Enhanced ejection failed", {
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async sendRealTimeEjection(
    userId: string,
    blockData: any
  ): Promise<void> {
    try {
      console.log("📡 UserEjectionService: Sending real-time ejection", {
        userId,
        category: blockData.category,
      });

      const io = getIO();

      // 🎯 BROADCAST: Send to all user's connected sockets
      const socketsToNotify = [`/notifications`, `/chat`, `/video`];

      for (const namespace of socketsToNotify) {
        const targetNamespace = io.of(namespace);

        // Send to user's specific room
        targetNamespace.to(`user_${userId}`).emit("account_blocked", {
          reason: blockData.reason,
          category: blockData.category,
          adminEmail: blockData.adminEmail,
          timestamp: blockData.timestamp,
          canAppeal: blockData.canAppeal,
          severity: this.getCategorySeverity(blockData.category),
        });

        console.log(`📡 UserEjectionService: Sent to ${namespace} namespace`);
      }

      // 🎯 FALLBACK: Direct socket emission to all connections
      // const allSockets = await io.in(`user_${userId}`).allSockets();
      const notificationNS = io.of("/notifications");
      const allSockets = await notificationNS.in(`user_${userId}`).allSockets();
      console.log(
        `📡 UserEjectionService: Found ${allSockets.size} active sockets for user ${userId}`
      );
      let totalSockets = 0;
      for (const namespace of socketsToNotify) {
        const ns = io.of(namespace);
        const sockets = await ns.in(`user_${userId}`).allSockets();
        totalSockets += sockets.size;
        console.log(
          `📡 UserEjectionService: ${namespace} has ${sockets.size} sockets for user ${userId}`
        );
      }
      console.log(
        `📡 UserEjectionService: Total sockets across all namespaces: ${totalSockets}`
      );
      io.emit("force_disconnect_user", {
        userId,
        reason: blockData.reason,
        timestamp: blockData.timestamp,
      });

      console.log(
        "✅ UserEjectionService: Real-time ejection sent successfully"
      );
    } catch (error: any) {
      console.error("❌ UserEjectionService: Real-time ejection failed", {
        error: error.message,
        userId,
      });
      // Don't throw - ejection should continue even if real-time fails
    }
  }

  private async sendEnhancedBlockEmail(
    user: any,
    blockData: any
  ): Promise<void> {
    try {
      const categoryLabels: { [key: string]: string } = {
        spam: "Spam/Unsolicited Messages",
        harassment: "Harassment/Abusive Behavior",
        inappropriate_content: "Inappropriate Content",
        terms_violation: "Terms of Service Violation",
        fraud: "Fraudulent Activity",
        security: "Security Concerns",
        other: "Policy Violation",
      };

      const categoryLabel =
        categoryLabels[blockData.category] || "Policy Violation";
      const severity = this.getCategorySeverity(blockData.category);
      const severityColor =
        severity === "high"
          ? "#dc2626"
          : severity === "medium"
          ? "#ea580c"
          : "#0ea5e9";

      const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); border: 1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${severityColor} 0%, ${severityColor}dd 100%); padding: 32px 24px; text-align: center; position: relative;">
          <div style="background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 32px;">🛡️</span>
          </div>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Account Suspended</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0; font-weight: 500;">Immediate Action Required</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 8px;">
              Hello ${user.firstName} ${user.lastName}
            </h2>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Your account access has been temporarily restricted
            </p>
          </div>

          <!-- Violation Details -->
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #dc2626; font-size: 18px; margin-right: 8px;">⚠️</span>
              <h3 style="color: #dc2626; font-size: 16px; font-weight: 600; margin: 0;">
                Violation: ${categoryLabel}
              </h3>
            </div>
            <div style="background: white; border-radius: 6px; padding: 16px; border-left: 4px solid ${severityColor};">
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                <strong>Reason:</strong> ${blockData.reason}
              </p>
            </div>
          </div>

          <!-- Severity Badge -->
          <div style="text-align: center; margin: 20px 0;">
            <span style="background: ${severityColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              ${severity} Priority
            </span>
          </div>

          <!-- What happens now -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📋</span>
              What happens now:
            </h4>
            <ul style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 6px;">Your account access is immediately suspended</li>
              <li style="margin-bottom: 6px;">All active sessions have been terminated</li>
              <li style="margin-bottom: 6px;">Account data is preserved per our privacy policy</li>
              <li style="margin-bottom: 6px;">You may appeal this decision (see below)</li>
            </ul>
          </div>

          <!-- Appeal Process -->
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📧</span>
              Appeal This Decision
            </h4>
            <p style="color: #1e40af; font-size: 13px; line-height: 1.6; margin: 0;">
              If you believe this suspension is incorrect, please contact our support team at 
              <a href="mailto:${
                blockData.adminEmail
              }" style="color: #1d4ed8; font-weight: 600; text-decoration: none;">
                ${blockData.adminEmail}
              </a>
              with your account details and explanation.
            </p>
          </div>

          <!-- Footer Info -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; margin-top: 24px;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">
              Suspension Date: ${new Date(
                blockData.timestamp
              ).toLocaleString()}<br>
              Reference ID: ${blockData.adminId || "N/A"}<br>
              <a href="${
                process.env.CLIENT_HOST_URL
              }/terms" style="color: #3b82f6; text-decoration: none;">Terms of Service</a> • 
              <a href="${
                process.env.CLIENT_HOST_URL
              }/privacy" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 13px; margin: 0;">
            © ${new Date().getFullYear()} Mentor One. All rights reserved.
          </p>
          <p style="margin: 8px 0 0;">
            <a href="${
              process.env.CLIENT_HOST_URL || "https://mentorone.com"
            }" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
              MentorOne.com
            </a>
          </p>
        </div>
      </div>
      `;

      const subject = `🚨 Account Suspended - ${categoryLabel} [${severity.toUpperCase()}]`;
      const textMessage = `Your Mentor One account has been suspended due to: ${categoryLabel}. Reason: ${blockData.reason}. Contact ${blockData.adminEmail} to appeal.`;

      await sendMail(
        user.email,
        textMessage,
        `${user.firstName} ${user.lastName}`,
        subject,
        emailHtml
      );

      console.log("📧 UserEjectionService: Enhanced email sent successfully", {
        email: user.email,
        category: blockData.category,
        severity,
      });
    } catch (error: any) {
      console.error("❌ UserEjectionService: Email sending failed", {
        error: error.message,
        userEmail: user.email,
      });
      // Don't throw - ejection should continue even if email fails
    }
  }

  private getCategorySeverity(category: string): "high" | "medium" | "low" {
    const severityMap: { [key: string]: "high" | "medium" | "low" } = {
      harassment: "high",
      fraud: "high",
      security: "high",
      spam: "medium",
      inappropriate_content: "medium",
      terms_violation: "medium",
      other: "low",
    };

    return severityMap[category] || "medium";
  }
}
