import { Job } from "bull";
import { ReminderJobData, ReminderType } from "../ReminderQueue";
import NotificationService from "../../implementations/NotificationService";
import { sendMail } from "../../../utils/emailService";
import Booking from "../../../models/bookingModel";
import { getIO } from "../../../utils/socket/notification";
import UserRepository from "../../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../../repositories/interface/IUserRepository";
export class BookingReminderProcessor {
  private notificationService: NotificationService;
  private UserRepository: IUserRepository;
  constructor() {
    this.notificationService = new NotificationService();
    this.UserRepository = new UserRepository();
  }

  async processReminderJob(job: Job<ReminderJobData>) {
    const {
      bookingId,
      menteeId,
      mentorId,
      reminderType,
      bookingDate,
      startTime,
      serviceName,
      mentorName,
      menteeName,
    } = job.data;

    try {
      console.log(
        `🔔 Processing ${reminderType} reminder for booking ${bookingId}`
      );

      // Check if booking still exists and is confirmed
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.status !== "confirmed") {
        console.log(
          `❌ Booking ${bookingId} not found or not confirmed, skipping reminder`
        );
        return { success: false, reason: "Booking not confirmed" };
      }

      // Check if reminder already sent
      const reminderField = this.getReminderStatusField(reminderType);
      if (booking.reminderStatus?.[reminderField]) {
        console.log(
          `✅ ${reminderType} reminder already sent for booking ${bookingId}`
        );
        return { success: true, reason: "Already sent" };
      }

      // Send email reminder
      await this.sendEmailReminder(job.data);

      // Send in-app notification
      await this.sendInAppNotification(job.data);

      // Update reminder status in booking
      await this.updateReminderStatus(bookingId, reminderField);

      console.log(
        `✅ Successfully sent ${reminderType} reminder for booking ${bookingId}`
      );
      return { success: true };
    } catch (error: any) {
      console.error(
        `❌ Failed to process ${reminderType} reminder for booking ${bookingId}:`,
        error.message
      );
      throw error;
    }
  }

  private async sendEmailReminder(data: ReminderJobData) {
    const {
      menteeId,
      mentorId,
      reminderType,
      bookingDate,
      startTime,
      serviceName,
      mentorName,
      menteeName,
    } = data;

    // Get email addresses (you'll need to fetch from user service)
    const menteeEmail = await this.getUserEmail(menteeId);
    const mentorEmail = await this.getUserEmail(mentorId);

    const emailTemplate = this.generateReminderEmailTemplate(data);
    const subject = this.getEmailSubject(reminderType);

    // Send to mentee
    if (menteeEmail) {
      await sendMail(
        menteeEmail,
        `Your ${serviceName} session reminder`,
        menteeName,
        subject,
        emailTemplate.mentee
      );
    }

    // Send to mentor
    if (mentorEmail) {
      await sendMail(
        mentorEmail,
        `Your ${serviceName} session reminder`,
        mentorName,
        subject,
        emailTemplate.mentor
      );
    }
  }

  private async sendInAppNotification(data: ReminderJobData) {
    const {
      bookingId,
      menteeId,
      mentorId,
      reminderType,
      startTime,
      serviceName,
    } = data;

    try {
      const io = getIO();
      const message = this.getNotificationMessage(
        reminderType,
        serviceName,
        startTime
      );

      // Send to mentee
      await this.notificationService.createNotification(
        menteeId,
        "booking_reminder",
        message,
        bookingId,
        io
      );

      // Send to mentor
      await this.notificationService.createNotification(
        mentorId,
        "booking_reminder",
        message,
        bookingId,
        io
      );
    } catch (error: any) {
      console.error("Failed to send in-app notification:", error.message);
    }
  }

  private async updateReminderStatus(bookingId: string, field: string) {
    await Booking.findByIdAndUpdate(bookingId, {
      [`reminderStatus.${field}`]: true,
      updatedAt: new Date(),
    });
  }

  private getReminderStatusField(reminderType: ReminderType): string {
    switch (reminderType) {
      case ReminderType.ONE_HOUR_BEFORE:
        return "oneHourSent";
      case ReminderType.THIRTY_MIN_BEFORE:
        return "thirtyMinSent";
      case ReminderType.TEN_MIN_BEFORE:
        return "tenMinSent";
      case ReminderType.SESSION_STARTED:
        return "sessionStartSent";
      default:
        return "thirtyMinSent";
    }
  }

  private getEmailSubject(reminderType: ReminderType): string {
    switch (reminderType) {
      case ReminderType.ONE_HOUR_BEFORE:
        return "Session Starting in 1 Hour - Mentor One";
      case ReminderType.THIRTY_MIN_BEFORE:
        return "Session Starting in 30 Minutes - Mentor One";
      case ReminderType.TEN_MIN_BEFORE:
        return "Session Starting in 10 Minutes - Mentor One";
      case ReminderType.SESSION_STARTED:
        return "Your Session Has Started - Mentor One";
      default:
        return "Session Reminder - Mentor One";
    }
  }

  private getNotificationMessage(
    reminderType: ReminderType,
    serviceName: string,
    startTime: string
  ): string {
    switch (reminderType) {
      case ReminderType.ONE_HOUR_BEFORE:
        return `⏰ Your ${serviceName} session starts in 1 hour at ${startTime}. Please be ready!`;
      case ReminderType.THIRTY_MIN_BEFORE:
        return `🔔 Your ${serviceName} session starts in 30 minutes at ${startTime}. Get ready!`;
      case ReminderType.TEN_MIN_BEFORE:
        return `🚨 Your ${serviceName} session starts in 10 minutes at ${startTime}. Join now!`;
      case ReminderType.SESSION_STARTED:
        return `🎯 Your ${serviceName} session has started! Join your session now.`;
      default:
        return `📅 Session reminder for ${serviceName}`;
    }
  }

  private generateReminderEmailTemplate(data: ReminderJobData) {
    const {
      reminderType,
      bookingDate,
      startTime,
      serviceName,
      mentorName,
      menteeName,
    } = data;
    const CLIENT_HOST_URL =
      process.env.CLIENT_HOST_URL || "https://mentorone.com";

    const formattedDate = new Date(bookingDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeInfo = this.getTimeInfo(reminderType);

    const baseTemplate = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <div style="background-color: #4A90E2; padding: 25px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Mentor One</h1>
          <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0 0;">${
            timeInfo.header
          }</p>
        </div>

        <div style="padding: 30px 40px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
            Dear {{userName}},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 25px;">
            ${timeInfo.message}
          </p>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="color: #4A90E2; margin: 0 0 20px 0; font-size: 20px;">Session Details</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 120px;">Service:</strong>
              <span style="color: #666;">${serviceName}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 120px;">Date:</strong>
              <span style="color: #666;">${formattedDate}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 120px;">Time:</strong>
              <span style="color: #666; font-weight: bold; color: #d32f2f;">${startTime}</span>
            </div>
            
            <div style="margin-bottom: 0;">
              <strong style="color: #333; display: inline-block; width: 120px;">{{partnerLabel}}:</strong>
              <span style="color: #666;">{{partnerName}}</span>
            </div>
          </div>

          ${timeInfo.actionBox}

          <div style="text-align: center; margin-top: 30px;">
            <a href="${CLIENT_HOST_URL}/dashboard" style="display: inline-block; background-color: #4A90E2; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">Go to Dashboard</a>
          </div>
        </div>

        <div style="background-color: #f7f7f7; padding: 20px 40px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Mentor One. All rights reserved.</p>
          <p style="margin-top: 8px;">
            <a href="${CLIENT_HOST_URL}" style="color: #4A90E2; text-decoration: none;">MentorOne.com</a> | 
            <a href="${CLIENT_HOST_URL}/support" style="color: #4A90E2; text-decoration: none; margin-left: 10px;">Support</a>
          </p>
        </div>
      </div>
    `;

    return {
      mentee: baseTemplate
        .replace("{{userName}}", menteeName)
        .replace("{{partnerLabel}}", "Mentor")
        .replace("{{partnerName}}", mentorName),
      mentor: baseTemplate
        .replace("{{userName}}", mentorName)
        .replace("{{partnerLabel}}", "Mentee")
        .replace("{{partnerName}}", menteeName),
    };
  }

  private getTimeInfo(reminderType: ReminderType) {
    switch (reminderType) {
      case ReminderType.ONE_HOUR_BEFORE:
        return {
          header: "⏰ Session Starting in 1 Hour",
          message:
            "Your session is starting in 1 hour. Please prepare any questions or materials you need.",
          actionBox: `<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Get Ready!</strong><br>
              Make sure you have a stable internet connection and join the session on time.
            </p>
          </div>`,
        };
      case ReminderType.THIRTY_MIN_BEFORE:
        return {
          header: "🔔 Session Starting in 30 Minutes",
          message:
            "Your session is starting in 30 minutes. Please be ready to join!",
          actionBox: `<div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #0c5460; font-size: 14px;">
              <strong>Almost Time!</strong><br>
              Check your internet connection and be ready to join your session.
            </p>
          </div>`,
        };
      case ReminderType.TEN_MIN_BEFORE:
        return {
          header: "🚨 Session Starting in 10 Minutes",
          message: "Your session is starting in 10 minutes. Please join now!",
          actionBox: `<div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #721c24; font-size: 14px;">
              <strong>Join Now!</strong><br>
              Your session starts very soon. Click the button above to join your session.
            </p>
          </div>`,
        };
      case ReminderType.SESSION_STARTED:
        return {
          header: "🎯 Your Session Has Started",
          message: "Your session has started! Please join immediately.",
          actionBox: `<div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #155724; font-size: 14px;">
              <strong>Session Live!</strong><br>
              Your session is now active. Join immediately to not miss any content.
            </p>
          </div>`,
        };
      default:
        return {
          header: "📅 Session Reminder",
          message: "This is a reminder for your upcoming session.",
          actionBox: "",
        };
    }
  }
  private async getUserEmail(userId: string): Promise<string | null> {
    try {
      // Import your user repository/service

      const user = await this.UserRepository.findById(userId);
      return user?.email || null;
    } catch (error) {
      console.error("Failed to get user email:", error);
      return null;
    }
  }
}
