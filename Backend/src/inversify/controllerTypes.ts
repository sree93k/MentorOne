/**
 * 🔹 SOLID COMPLIANCE: Controller Interface Types
 * Industry-standard dependency injection types for controller interfaces
 */

export const CONTROLLER_TYPES = {
  // Authentication Controllers
  IUserAuthController: Symbol.for("IUserAuthController"),
  IAdminAuthController: Symbol.for("IAdminAuthController"),
  
  // Core Controllers
  IUserController: Symbol.for("IUserController"),
  IAdminController: Symbol.for("IAdminController"),
  IMentorController: Symbol.for("IMentorController"),
  IMenteeController: Symbol.for("IMenteeController"),
  
  // Business Logic Controllers
  IBookingController: Symbol.for("IBookingController"),
  IPaymentController: Symbol.for("IPaymentController"),
  INotificationController: Symbol.for("INotificationController"),
  IUploadController: Symbol.for("IUploadController"),
  
  // Communication Controllers
  ISocketController: Symbol.for("ISocketController"),
  IChatbotController: Symbol.for("IChatbotController"),
  IVideoCallController: Symbol.for("IVideoCallController"),
  ISecureVideoProxyController: Symbol.for("ISecureVideoProxyController"),
  
  // Support Controllers
  IContactController: Symbol.for("IContactController"),
  IAppealController: Symbol.for("IAppealController"),
  
  // Integration Controllers
  IWebHookController: Symbol.for("IWebHookController"),
} as const;

export type ControllerType = typeof CONTROLLER_TYPES[keyof typeof CONTROLLER_TYPES];