import { injectable, inject } from "inversify";
import { IAdminService } from "../interface/IAdminService";
import Users from "../../models/userModel";
import Mentor from "../../models/mentorModel";
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { sendMail } from "../../utils/emailService";
import { IServiceServices } from "../interface/IServiceServices";
import { IBookingService } from "../interface/IBookingService";
import { EBooking } from "../../entities/bookingEntity";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IMenteeService } from "../interface/IMenteeService";
import { IMentorService } from "../interface/IMentorService";
import { EService } from "../../entities/serviceEntity";
import { UserEjectionService } from "./UserEjectionService";
import { TYPES } from "../../inversify/types";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 🔹 DIP COMPLIANCE: Injectable Admin Service
 * Uses dependency injection for all service dependencies
 */
@injectable()
export default class AdminService implements IAdminService {
  private ServiceService: IServiceServices;
  private BookingService: IBookingService;
  private UserRepository: IUserRepository;
  private MenteeServcie: IMenteeService;
  private MentorService: IMentorService;

  constructor(
    @inject(TYPES.IServiceServices) serviceService: IServiceServices,
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.IBookingService) bookingService: IBookingService,
    @inject(TYPES.IMenteeService) menteeService: IMenteeService,
    @inject(TYPES.IMentorService) mentorService: IMentorService
  ) {
    this.ServiceService = serviceService;
    this.UserRepository = userRepository;
    this.BookingService = bookingService;
    this.MenteeServcie = menteeService;
    this.MentorService = mentorService;
  }

  async fetchAllUsers(
    page: number,
    limit: number,
    role?: string,
    status?: string
  ): Promise<{
    users: Omit<EUsers, "password">[];
    total: number;
    totalMentors: number;
    totalMentees: number;
    totalBoth: number;
    approvalPending: number;
  } | null> {
    try {
      console.log("all users service ************************************");

      // Build MongoDB query for users
      const query: any = {};

      // Role filter
      if (role) {
        if (role === "mentee") {
          query.role = { $eq: ["mentee"] };
        } else if (role === "mentor") {
          query.role = { $eq: ["mentor"] };
        } else if (role === "both") {
          query.role = { $all: ["mentor", "mentee"] };
        }
      }

      // Status filter
      if (status) {
        query.isBlocked = status === "Blocked" ? true : false;
      }

      // Use Users model instead of rawModel
      const total = await Users.countDocuments(query);
      const totalMentors = await Users.countDocuments({
        ...query,
        role: { $eq: ["mentor"] },
      });
      const totalMentees = await Users.countDocuments({
        ...query,
        role: { $eq: ["mentee"] },
      });
      const totalBoth = await Users.countDocuments({
        ...query,
        role: { $all: ["mentor", "mentee"] },
      });

      // Use Mentor model instead of mentorModel
      const approvalPending = await Mentor.countDocuments({
        isApproved: "Pending",
      });

      // Log mentor data for debugging
      const pendingMentors = await Mentor.find({ isApproved: "Pending" })
        .select("_id isApproved")
        .exec();
      console.log("admin service pending mentors:", pendingMentors);
      console.log("admin service approvalPending count:", approvalPending);

      // Fetch paginated users with population
      const allUsers = await Users.find(query)
        .populate("mentorId")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      console.log("all users new list>>>>>>>>>>>>>", allUsers);

      // Remove password from response
      const usersWithoutPassword = allUsers.map((user: any) => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });

      return {
        users: usersWithoutPassword,
        total,
        totalMentors,
        totalMentees,
        totalBoth,
        approvalPending,
      };
    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
      return null;
    }
  }

  async getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
    serviceData: EService[] | null;
    bookingData: EBooking[] | null;
  } | null> {
    try {
      console.log("AdminService getUserDatas step 1:", id);
      const user = await this.UserRepository.findById(id);
      console.log("AdminService getUserDatas step 2:", user);
      if (!user) {
        console.log("AdminService getUserDatas: User not found");
        return null;
      }

      let menteeData: EMentee | null = null;
      let mentorData: EMentor | null = null;
      let serviceData: EService[] | null = null;
      let bookingData: EBooking[] | null = null;

      // Fetch mentee data if user has mentee role
      if (user.role?.includes("mentee") && user.menteeId) {
        menteeData = await this.MenteeServcie.findMenteeById(
          user.menteeId._id.toString()
        );
        console.log(
          "AdminService getUserDatas step 3 - menteeData:",
          menteeData
        );
      }

      // Fetch booking data if user has mentee role
      if (user.role?.includes("mentee") && user.menteeId) {
        bookingData = await this.BookingService.findByMentee(id);
        console.log(
          "AdminService getUserDatas step 4 - bookingData:",
          bookingData
        );
      }

      // Fetch mentor data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        mentorData = await this.MentorService.findMentorById(
          user.mentorId._id.toString()
        );
        console.log(
          "AdminService getUserDatas step 5 - mentorData:",
          mentorData
        );
      }

      // Fetch service data if user has mentor role
      if (user.role?.includes("mentor") && user.mentorId) {
        // Use ServiceService instead of directly accessing repository
        const params = {
          page: 1,
          limit: 100, // Get all services for admin view
          search: "",
          type: "all",
        };
        const serviceResponse =
          await this.ServiceService.getAllServicesByMentor(id, params);
        console.log(
          "AdminService getUserDatas step 6 - serviceData:",
          serviceResponse
        );
        // Extract services array from response
        serviceData = serviceResponse ? serviceResponse.services : null;
      }

      console.log("AdminService getUserDatas final response:", {
        user,
        menteeData,
        mentorData,
        serviceData,
        bookingData,
      });

      return { user, menteeData, mentorData, serviceData, bookingData };
    } catch (error) {
      console.error("Error in getUserDatas:", error);
      return null;
    }
  }

  async mentorStatusChange(
    id: string,
    status: string,
    reason: string = ""
  ): Promise<{ mentorData: EMentor | null } | null> {
    try {
      console.log(
        "mentor service ....mentorStatusChange step 1...",
        id,
        status,
        reason
      );
      const updateData = {
        field: "isApproved",
        status,
        reason,
      };
      const updateMentor = await this.MentorService.updateMentor(
        id,
        updateData
      );
      console.log(
        "adminside service mentorStatusChange service is ",
        updateMentor
      );
      const userData = await this.UserRepository.findByField("mentorId", id);
      console.log("user data is ", userData);
      const user = userData?.[0];
      if (!user) {
        console.warn("No user found with mentorId:", id);
        return { mentorData: updateMentor };
      }
      // Send email  if status is updated
      if (updateMentor && (status === "Approved" || status === "Rejected")) {
        const message =
          status === "Approved"
            ? `Your mentor status has been updated to "${status}".`
            : `Your mentor status has been updated to "${status}" and the reason: ${
                reason || "No reason provided"
              }.`;
        console.log("user emails  is ", user?.email, "and message", message);

        const capitalizeFirstLetter = (str: string): string => {
          if (!str) return str;
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        const name = `${capitalizeFirstLetter(
          user?.firstName
        )} ${capitalizeFirstLetter(user?.lastName)}`;
        const OTPDetails = await sendMail(
          user?.email,
          message,
          name,
          "Mentor One Status Updated"
        );
        console.log("Email sent:", OTPDetails);
        // If Rejected, deactivate mentor in user model
        if (status === "Rejected") {
          await this.UserRepository.update(user._id, {
            mentorActivated: false,
            refreshToken: "",
          } as any);
          console.log("User deactivated as mentor and refresh token cleared.");
        }
      }

      return { mentorData: updateMentor };
    } catch (error) {
      console.error("Error in mentorStatusChange:", error);
      return null;
    }
  }

  // async userStatusChange(
  //   id: string,
  //   status: string
  // ): Promise<{ userData: EUsers | null } | null> {
  //   try {
  //     console.log("userStatusChange start ", id, status);

  //     const updateUser = await this.UserRepository.updateField(
  //       id,
  //       "isBlocked",
  //       status
  //     );
  //     console.log("userStatusChange response is ", updateUser);

  //     return { userData: updateUser };
  //   } catch (error) {
  //     console.error("Error in userStatusChange:", error);
  //     return null;
  //   }
  // }
  // FIND this method and REPLACE it
  // async userStatusChange(
  //   id: string,
  //   status: boolean,
  //   reason?: string
  // ): Promise<{ userData: EUsers | null } | null> {
  //   try {
  //     console.log("userStatusChange start ", id, status, reason);

  //     const updateUser = await this.UserRepository.updateField(
  //       id,
  //       "isBlocked",
  //       status
  //     );

  //     // 🆕 ADD: Real-time ejection when blocking
  //     if (status && updateUser) {
  //       const userEjectionService = new UserEjectionService();
  //       await userEjectionService.ejectUser(
  //         id,
  //         reason || "Account blocked by administrator",
  //         "admin-id"
  //       );
  //     }

  //     console.log("userStatusChange response is ", updateUser);
  //     return { userData: updateUser };
  //   } catch (error) {
  //     console.error("Error in userStatusChange:", error);
  //     return null;
  //   }
  // }
  // async userStatusChange(
  //   id: string,
  //   status: boolean,
  //   blockData?: {
  //     reason?: string;
  //     category?: string;
  //     adminNote?: string;
  //     adminId?: string;
  //     adminIP?: string;
  //     timestamp?: string;
  //   }
  // ): Promise<{ userData: EUsers | null } | null> {
  //   try {
  //     console.log("🚨 Enhanced userStatusChange start", {
  //       id,
  //       status,
  //       blockData,
  //     });

  //     const updateUser = await this.UserRepository.updateField(
  //       id,
  //       "isBlocked",
  //       status
  //     );

  //     // Enhanced blocking with real-time ejection
  //     if (status && updateUser && blockData) {
  //       console.log("🚨 Initiating enhanced user ejection");

  //       const userEjectionService = new UserEjectionService();
  //       await userEjectionService.ejectUser(
  //         id,
  //         blockData.reason || "Account blocked by administrator",
  //         blockData.adminId || "admin"
  //       );

  //       // Send enhanced email notification
  //       await this.sendEnhancedBlockEmail(updateUser, blockData);

  //       // Create audit log with enhanced data
  //       await this.createEnhancedAuditLog(id, blockData);
  //     }

  //     console.log("✅ Enhanced userStatusChange completed", updateUser);
  //     return { userData: updateUser };
  //   } catch (error) {
  //     console.error("❌ Error in enhanced userStatusChange:", error);
  //     return null;
  //   }
  // }
  async userStatusChange(
    id: string,
    status: boolean,
    blockData?: {
      reason?: string;
      category?: string;
      adminNote?: string;
      adminId?: string;
      adminIP?: string;
      timestamp?: string;
    }
  ): Promise<{ userData: EUsers | null } | null> {
    try {
      console.log("🚨 Enhanced userStatusChange start", {
        id,
        status,
        blockData,
      });

      const updateUser = await this.UserRepository.updateField(
        id,
        "isBlocked",
        status
      );

      // Enhanced blocking with comprehensive real-time ejection
      if (status && updateUser && blockData) {
        console.log("🚨 Initiating enhanced user ejection with full data");

        const userEjectionService = new UserEjectionService();
        await userEjectionService.ejectUser(
          id,
          blockData.reason || "Account blocked by administrator",
          blockData.adminId || "admin",
          {
            category: blockData.category,
            adminNote: blockData.adminNote,
            adminIP: blockData.adminIP,
            timestamp: blockData.timestamp,
          }
        );

        console.log("✅ Enhanced user ejection completed successfully");
      }

      console.log("✅ Enhanced userStatusChange completed", updateUser);
      return { userData: updateUser };
    } catch (error) {
      console.error("❌ Error in enhanced userStatusChange:", error);
      return null;
    }
  }
  private async sendEnhancedBlockEmail(
    user: EUsers,
    blockData: {
      reason?: string;
      category?: string;
      adminNote?: string;
      adminId?: string;
      adminIP?: string;
      timestamp?: string;
    }
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
        categoryLabels[blockData.category || "other"] || "Policy Violation";

      const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
      <div style="background-color: #dc2626; padding: 25px 20px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">⚠️ Account Suspended</h1>
      </div>
      
      <div style="padding: 30px 40px;">
        <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
          Dear ${user.firstName} ${user.lastName},
        </p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0;">
            Your account has been <strong>temporarily suspended</strong> due to: <strong>${categoryLabel}</strong>
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;"><strong>Reason:</strong></p>
          <p style="font-size: 16px; color: #374151; margin: 8px 0 0 0;">${
            blockData.reason
          }</p>
        </div>
        
        <div style="background-color: #eff6ff; border: 1px solid #3b82f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="font-size: 14px; color: #1e40af; margin: 0;">
            <strong>📧 Need Help?</strong><br>
            If you believe this is a mistake, please contact our support team at 
            <a href="mailto:sreekuttan12kaathu@gmail.com" style="color: #1e40af;">sreekuttan12kaathu@gmail.com</a>
            with your account details and an explanation.
          </p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-top: 30px;">
          Please review our Terms of Service and Community Guidelines to ensure this doesn't happen again.
        </p>
      </div>
      
      <div style="background-color: #f7f7f7; padding: 20px 40px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Mentor One. All rights reserved.</p>
        <p style="margin-top: 8px;">
          <a href="${
            process.env.CLIENT_HOST_URL || "https://mentorone.com"
          }" style="color: #4A90E2; text-decoration: none;">MentorOne.com</a>
        </p>
      </div>
    </div>
    `;

      const subject = `🚨 Account Suspended - ${categoryLabel}`;
      const textMessage = `Your account has been suspended due to: ${categoryLabel}. Reason: ${blockData.reason}. Contact sreekuttan12kaathu@gmail.com for assistance.`;

      await sendMail(
        user.email,
        textMessage,
        `${user.firstName} ${user.lastName}`,
        subject,
        emailHtml
      );

      console.log("📧 Enhanced block notification email sent to:", user.email);
    } catch (error) {
      console.error("❌ Error sending enhanced block email:", error);
    }
  }

  private async createEnhancedAuditLog(
    userId: string,
    blockData: {
      reason?: string;
      category?: string;
      adminNote?: string;
      adminId?: string;
      adminIP?: string;
      timestamp?: string;
    }
  ): Promise<void> {
    try {
      // Import AuditLog model (you already have this from earlier code)
      const AuditLog = (await import("../../models/auditLogModel")).default;

      await AuditLog.create({
        adminId: blockData.adminId || "unknown-admin",
        targetUserId: userId,
        action: "BLOCKED",
        reason: blockData.reason || "No reason provided",
        timestamp: new Date(),
        ipAddress: blockData.adminIP || "unknown-ip",
        metadata: {
          category: blockData.category || "other",
          adminNote: blockData.adminNote || "",
          actionType: "ENHANCED_BLOCK",
          timestamp: blockData.timestamp || new Date().toISOString(),
        },
      });

      console.log("📋 Enhanced audit log created for user:", userId);
    } catch (error) {
      console.error("❌ Error creating enhanced audit log:", error);
    }
  }
}
