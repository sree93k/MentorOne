import { container } from "../inversify/inversify.config";
import { TYPES } from "../inversify/types";
import { CONTROLLER_TYPES } from "../inversify/controllerTypes";

// Import controller interfaces for type safety
import { IAdminController } from "../controllers/interface/IAdminController";
import { IMentorController } from "../controllers/interface/IMentorController";
import { IUserAuthController } from "../controllers/interface/IUserAuthController";
import { IBookingController } from "../controllers/interface/IBookingController";
import { IPaymentController } from "../controllers/interface/IPaymentController";
import { IMenteeController } from "../controllers/interface/IMenteeController";
import { IAppealController } from "../controllers/interface/IAppealController";
import { IUserController } from "../controllers/interface/IUserController";
import { INotificationController } from "../controllers/interface/INotificationController";
import { IChatbotController } from "../controllers/interface/IChatbotController";
import { IVideoCallController } from "../controllers/interface/IVideoCallController";
import { IUploadController } from "../controllers/interface/IUploadController";
import { IContactController } from "../controllers/interface/IContactController";
import { IWebHookController } from "../controllers/interface/IWebHookController";
import { IAdminAuthController } from "../controllers/interface/IAdminAuthController";
import { ISocketController } from "../controllers/interface/ISocketController";
import { ISecureVideoProxyController } from "../controllers/interface/ISecureVideoProxyController";
import { IAdminAuthservice } from "../services/interface/IAdminAuthservice";

/**
 * 🔹 SOLID COMPLIANCE: Interface-Based Route Factory
 * ✅ DEPENDENCY INVERSION PRINCIPLE: Routes access only interfaces, not implementations
 * ✅ INTERFACE SEGREGATION PRINCIPLE: Type-safe controller interface resolution
 * ✅ SINGLE RESPONSIBILITY: Factory only responsible for DI container resolution
 */
export class RouteFactory {
  /**
   * Get AdminController instance through interface from DI container
   * ✅ SOLID: Routes access IAdminController interface, not implementation
   */
  static getAdminController(): IAdminController {
    try {
      return container.get<IAdminController>(TYPES.IAdminController);
    } catch (error) {
      // Fallback for gradual migration - will be removed once all DI bindings are complete
      console.warn('⚠️ AdminController DI binding not available, using fallback. This should be resolved in production.');
      const AdminController = require("../controllers/implementation/adminController").default;
      return new AdminController();
    }
  }

  /**
   * Get AdminAuthController instance through interface from DI container
   * ✅ SOLID: Routes access IAdminAuthController interface, not implementation
   */
  static getAdminAuthController(): IAdminAuthController {
    try {
      // Try to get from DI container first
      return container.get<IAdminAuthController>(TYPES.IAdminAuthController);
    } catch (error) {
      console.warn('⚠️ AdminAuthController DI binding not available, manually injecting dependencies.');
      // Manually create with dependencies from DI container
      const adminAuthService = container.get<IAdminAuthservice>(TYPES.IAdminAuthService);
      const { AdminAuthController } = require("../controllers/implementation/adminAuthController");
      return new AdminAuthController(adminAuthService);
    }
  }

  /**
   * Get MentorController instance through interface from DI container
   * ✅ SOLID: Routes access IMentorController interface, not implementation
   */
  static getMentorController(): IMentorController {
    try {
      return container.get<IMentorController>(TYPES.IMentorController);
    } catch (error) {
      console.warn('⚠️ MentorController DI binding not available, using fallback.');
      const MentorController = require("../controllers/implementation/mentorController").default;
      return new MentorController();
    }
  }

  /**
   * Get UserAuthController instance through interface from DI container
   * ✅ SOLID: Routes access IUserAuthController interface, not implementation
   */
  static getUserAuthController(): IUserAuthController {
    try {
      return container.get<IUserAuthController>(TYPES.IUserAuthController);
    } catch (error) {
      console.warn('⚠️ UserAuthController DI binding not available, using fallback.');
      const UserAuthController = require("../controllers/implementation/userAuthController").default;
      return new UserAuthController();
    }
  }

  /**
   * Get BookingController instance through interface from DI container
   * ✅ SOLID: Routes access IBookingController interface, not implementation
   */
  static getBookingController(): IBookingController {
    try {
      return container.get<IBookingController>(TYPES.IBookingController);
    } catch (error) {
      console.warn('⚠️ BookingController DI binding not available, using fallback.');
      const BookingController = require("../controllers/implementation/bookingController").default;
      return new BookingController();
    }
  }

  /**
   * Get PaymentController instance through interface from DI container
   * ✅ SOLID: Routes access IPaymentController interface, not implementation
   */
  static getPaymentController(): IPaymentController {
    try {
      return container.get<IPaymentController>(TYPES.IPaymentController);
    } catch (error) {
      console.warn('⚠️ PaymentController DI binding not available, using fallback.');
      const PaymentController = require("../controllers/implementation/paymentController").default;
      return new PaymentController();
    }
  }

  /**
   * Get MenteeController instance through interface from DI container
   * ✅ SOLID: Routes access IMenteeController interface, not implementation
   */
  static getMenteeController(): IMenteeController {
    try {
      return container.get<IMenteeController>(TYPES.IMenteeController);
    } catch (error) {
      console.warn('⚠️ MenteeController DI binding not available, using fallback.');
      const MenteeController = require("../controllers/implementation/menteeController").default;
      return new MenteeController();
    }
  }

  /**
   * Get AppealController instance through interface from DI container
   * ✅ SOLID: Routes access IAppealController interface, not implementation
   */
  static getAppealController(): IAppealController {
    try {
      return container.get<IAppealController>(TYPES.IAppealController);
    } catch (error) {
      console.warn('⚠️ AppealController DI binding not available, using fallback.');
      const AppealController = require("../controllers/implementation/AppealController").default;
      return new AppealController();
    }
  }

  /**
   * Get UserController instance through interface from DI container
   * ✅ SOLID: Routes access IUserController interface, not implementation
   */
  static getUserController(): IUserController {
    try {
      return container.get<IUserController>(TYPES.IUserController);
    } catch (error) {
      console.warn('⚠️ UserController DI binding not available, using fallback.');
      const UserController = require("../controllers/implementation/userController").default;
      return new UserController();
    }
  }

  /**
   * Get NotificationController instance through interface from DI container
   * ✅ SOLID: Routes access INotificationController interface, not implementation
   */
  static getNotificationController(): INotificationController {
    try {
      return container.get<INotificationController>(TYPES.INotificationController);
    } catch (error) {
      console.warn('⚠️ NotificationController DI binding not available, using fallback.');
      const NotificationController = require("../controllers/implementation/notificationController").default;
      return new NotificationController();
    }
  }

  /**
   * Get ChatbotController instance through interface from DI container
   * ✅ SOLID: Routes access IChatbotController interface, not implementation
   */
  static getChatbotController(): IChatbotController {
    try {
      return container.get<IChatbotController>(TYPES.IChatbotController);
    } catch (error) {
      console.warn('⚠️ ChatbotController DI binding not available, using fallback.');
      const ChatbotController = require("../controllers/implementation/chatbotController").default;
      return ChatbotController; // Already instantiated in the export
    }
  }

  /**
   * Get VideoCallController instance through interface from DI container
   * ✅ SOLID: Routes access IVideoCallController interface, not implementation
   */
  static getVideoCallController(): IVideoCallController {
    try {
      return container.get<IVideoCallController>(TYPES.IVideoCallController);
    } catch (error) {
      console.warn('⚠️ VideoCallController DI binding not available, using fallback.');
      const VideoCallController = require("../controllers/implementation/videoCallController").default;
      return new VideoCallController();
    }
  }

  /**
   * Get UploadController instance through interface from DI container
   * ✅ SOLID: Routes access IUploadController interface, not implementation
   */
  static getUploadController(): IUploadController {
    try {
      return container.get<IUploadController>(TYPES.IUploadController);
    } catch (error) {
      console.warn('⚠️ UploadController DI binding not available, using fallback.');
      const UploadController = require("../controllers/implementation/uploadController").default;
      return new UploadController();
    }
  }

  /**
   * Get ContactController instance through interface from DI container
   * ✅ SOLID: Routes access IContactController interface, not implementation
   */
  static getContactController(): IContactController {
    try {
      return container.get<IContactController>(TYPES.IContactController);
    } catch (error) {
      console.warn('⚠️ ContactController DI binding not available, using fallback.');
      const ContactController = require("../controllers/implementation/contactController").default;
      return new ContactController();
    }
  }

  /**
   * Get WebHookController instance through interface from DI container
   * ✅ SOLID: Routes access IWebHookController interface, not implementation
   */
  static getWebHookController(): IWebHookController {
    try {
      return container.get<IWebHookController>(TYPES.IWebHookController);
    } catch (error) {
      console.warn('⚠️ WebHookController DI binding not available, using fallback.');
      const WebHookController = require("../controllers/implementation/webHookController").default;
      return new WebHookController();
    }
  }


  /**
   * Get SocketController instance through interface from DI container
   * ✅ SOLID: Routes access ISocketController interface, not implementation
   */
  static getSocketController(): ISocketController {
    try {
      return container.get<ISocketController>(TYPES.ISocketController);
    } catch (error) {
      console.warn('⚠️ SocketController DI binding not available, using fallback.');
      const SocketController = require("../controllers/implementation/socketController").default;
      return new SocketController();
    }
  }

  /**
   * Get SecureVideoProxyController instance through interface from DI container
   * ✅ SOLID: Routes access ISecureVideoProxyController interface, not implementation
   */
  static getSecureVideoProxyController(): ISecureVideoProxyController {
    try {
      return container.get<ISecureVideoProxyController>(TYPES.ISecureVideoProxyController);
    } catch (error) {
      console.warn('⚠️ SecureVideoProxyController DI binding not available, using fallback.');
      const SecureVideoProxyController = require("../controllers/implementation/secureVideoProxyController").default;
      return SecureVideoProxyController; // Already instantiated in the export
    }
  }
}