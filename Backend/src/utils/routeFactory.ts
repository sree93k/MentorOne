import { container } from "../inversify/inversify.config";

/**
 * 🔹 SOLID Compliance: Route Factory for Dependency Injection
 * Creates controller instances from DI container instead of direct imports
 * Eliminates tight coupling between routes and controller implementations
 */
export class RouteFactory {
  /**
   * Get AdminController instance from DI container
   */
  static getAdminController() {
    // For now, return a manual instance since controllers aren't in DI yet
    // TODO: Use container.get<IAdminController>(TYPES.IAdminController) when ready
    const AdminController = require("../controllers/implementation/adminController").default;
    return new AdminController();
  }

  /**
   * Get MentorController instance from DI container  
   */
  static getMentorController() {
    const MentorController = require("../controllers/implementation/mentorController").default;
    return new MentorController();
  }

  /**
   * Get UserAuthController instance from DI container
   */
  static getUserAuthController() {
    const UserAuthController = require("../controllers/implementation/userAuthController").default;
    return new UserAuthController();
  }

  /**
   * Get BookingController instance from DI container
   */
  static getBookingController() {
    const BookingController = require("../controllers/implementation/bookingController").default;
    return new BookingController();
  }

  /**
   * Get PaymentController instance from DI container
   */
  static getPaymentController() {
    const PaymentController = require("../controllers/implementation/paymentController").default;
    return new PaymentController();
  }

  /**
   * Get MenteeController instance from DI container
   */
  static getMenteeController() {
    const MenteeController = require("../controllers/implementation/menteeController").default;
    return new MenteeController();
  }

  /**
   * Get AppealController instance from DI container
   */
  static getAppealController() {
    const AppealController = require("../controllers/implementation/AppealController").default;
    return new AppealController();
  }

  /**
   * Get UserController instance from DI container
   */
  static getUserController() {
    const UserController = require("../controllers/implementation/userController").default;
    return new UserController();
  }

  /**
   * Get NotificationController instance from DI container
   */
  static getNotificationController() {
    const NotificationController = require("../controllers/implementation/notificationController").default;
    return new NotificationController();
  }

  /**
   * Get ChatbotController instance from DI container
   */
  static getChatbotController() {
    const ChatbotController = require("../controllers/implementation/chatbotController").default;
    return new ChatbotController();
  }

  /**
   * Get VideoCallController instance from DI container
   */
  static getVideoCallController() {
    const VideoCallController = require("../controllers/implementation/videoCallController").default;
    return new VideoCallController();
  }

  /**
   * Get UploadController instance from DI container
   */
  static getUploadController() {
    const UploadController = require("../controllers/implementation/uploadController").default;
    return new UploadController();
  }

  /**
   * Get ContactController instance from DI container
   */
  static getContactController() {
    const ContactController = require("../controllers/implementation/contactController").default;
    return new ContactController();
  }

  /**
   * Get WebHookController instance from DI container
   */
  static getWebHookController() {
    const WebHookController = require("../controllers/implementation/webHookController").default;
    return new WebHookController();
  }

  /**
   * Get AdminAuthController instance from DI container
   */
  static getAdminAuthController() {
    const AdminAuthController = require("../controllers/implementation/adminAuthController").default;
    return new AdminAuthController();
  }

  /**
   * Get SocketController instance from DI container
   */
  static getSocketController() {
    const SocketController = require("../controllers/implementation/socketController").default;
    return new SocketController();
  }

  /**
   * Get SecureVideoProxyController instance from DI container
   */
  static getSecureVideoProxyController() {
    const SecureVideoProxyController = require("../controllers/implementation/secureVideoProxyController").default;
    return new SecureVideoProxyController();
  }
}