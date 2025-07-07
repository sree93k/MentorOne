// export const TYPES = {
//   IAdminAuthService: Symbol.for("IAdminAuthService"),
//   AdminAuthController: Symbol.for("AdminAuthController"),
//   IAdminRepository: Symbol.for("IAdminRepository"),
//   IMentorRepository: Symbol.for("IMentorRepository"),
//   IMenteeRepository: Symbol.for("IMenteeRepository"),
//   IServiceRepository: Symbol.for("IServiceRepository"),
//   IBookingRepository: Symbol.for("IBookingRepository"),
//   IUserRepository: Symbol.for("IUserRepository"),
//   IAdminAuthController: Symbol.for("IAdminAuthController"),
// };
export const TYPES = {
  // Admin Services
  IAdminAuthService: Symbol.for("IAdminAuthService"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  IAdminRepository: Symbol.for("IAdminRepository"),
  IAdminAuthController: Symbol.for("IAdminAuthController"),

  // User Services
  IUserAuthService: Symbol.for("IUserAuthService"),
  UserAuthController: Symbol.for("UserAuthController"),
  IUserRepository: Symbol.for("IUserRepository"),
  IUserAuthController: Symbol.for("IUserAuthController"),
  IOTPRepository: Symbol.for("IOTPRepository"),

  // Common Services
  IRedisTokenService: Symbol.for("IRedisTokenService"),

  // Other Services
  IMentorRepository: Symbol.for("IMentorRepository"),
  IMenteeRepository: Symbol.for("IMenteeRepository"),
  IServiceRepository: Symbol.for("IServiceRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
};
