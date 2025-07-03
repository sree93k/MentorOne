// import { AdminController } from "../controllers/implementation/adminController";
// import { IAdminService } from "../services/interface/IAdminService";

// const TYPES = {
//   // Models (Admin-related)
//   AdminModel: Symbol.for("AdminModel"),

//   // Repositories (Admin-related)
//   IAdminRepository: Symbol.for("IAdminRepository"),

//   // Services (Admin-related)
//   IAdminAuthService: Symbol.for("IAdminAuthService"),
//   RedisTokenService: Symbol.for("RedisTokenService"), // Add this line
//   IAdminService: Symbol.for("IAdminService"),
//   IBookingService: Symbol.for("IBookingService"),
//   IPaymentService: Symbol.for("IPaymentService"),
//   // Controllers (Admin-related)
//   AdminAuthController: Symbol.for("AdminAuthController"),
//   AdminController: Symbol.for("AdminController"),

//   // Middleware (Admin-related)
//   AdminAuthMiddleware: Symbol.for("AdminAuthMiddleware"),

//   // Redis Client
//   RedisClient: Symbol.for("RedisClient"),
// };

// export { TYPES };
export const TYPES = {
  // Models
  AdminModel: Symbol.for("AdminModel"),
  UserModel: Symbol.for("UserModel"),
  MenteeModel: Symbol.for("MenteeModel"),
  MentorModel: Symbol.for("MentorModel"),
  BookingModel: Symbol.for("BookingModel"),
  // Repositories
  IAdminRepository: Symbol.for("IAdminRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
  IPaymentRepository: Symbol.for("IPaymentRepository"),
  IMentorRepository: Symbol.for("IMentorRepository"),
  IBaseRepository: Symbol.for("IBaseRepository"),

  // Services
  IAdminAuthService: Symbol.for("IAdminAuthService"),
  IAdminService: Symbol.for("IAdminService"),
  IBookingService: Symbol.for("IBookingService"),
  IPaymentService: Symbol.for("IPaymentService"),
  IUserService: Symbol.for("IUserService"),
  IMentorService: Symbol.for("IMentorService"),
  RedisTokenService: Symbol.for("RedisTokenService"),

  // Controllers
  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminController: Symbol.for("AdminController"),

  // Middleware
  AdminAuthMiddleware: Symbol.for("AdminAuthMiddleware"),

  // Redis Client
  RedisClient: Symbol.for("RedisClient"),
};
