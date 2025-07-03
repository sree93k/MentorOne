// import { Container } from "inversify";
// import { Model } from "mongoose";
// import { TYPES } from "./types";

// // Admin-related models
// import AdminModel from "../models/adminModel";

// // Admin-related middleware
// import { AdminAuthMiddleware } from "../middlewares/authenticateAdmin";
// // Admin-related controllers
// import { AdminAuthController } from "../controllers/implementation/adminAuthController";

// // Interfaces
// import { IAdminAuthService } from "../services/interface/IAdminAuthService";
// import { IAdminRepository } from "../repositories/interface/IAdminRepository";

// // Admin-related services
// import { AdminAuthService } from "../services/implementations/AdminAuthService";
// import { RedisTokenService } from "../services/implementations/RedisTokenService"; // Add this import

// // Admin-related repositories
// import AdminRepository from "../repositories/implementations/AdminRepository";

// // Redis
// import redisClient from "../config/redis";
// import { RedisClientType } from "@redis/client";

// const container = new Container();

// // Bind Mongoose models (Admin-related)
// container.bind<Model<any>>(TYPES.AdminModel).toConstantValue(AdminModel);

// // Bind Redis client
// container.bind<RedisClientType>(TYPES.RedisClient).toConstantValue(redisClient);

// // Bind services (Admin-related)
// container
//   .bind<RedisTokenService>(TYPES.RedisTokenService)
//   .to(RedisTokenService); // Add this line
// container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);

// // Bind repositories (Admin-related)
// container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);

// // Bind controllers (Admin-related)
// container
//   .bind<AdminAuthController>(TYPES.AdminAuthController)
//   .to(AdminAuthController);

// // Bind middleware (Admin-related)
// container
//   .bind<AdminAuthMiddleware>(TYPES.AdminAuthMiddleware)
//   .to(AdminAuthMiddleware);

// export { container };
import { Container } from "inversify";
import { Model } from "mongoose";
import { TYPES } from "./types";

// Models
import AdminModel from "../models/adminModel";
import Users from "../models/userModel";
import Mentees from "../models/menteeModel";
import Mentors from "../models/mentorModel";
import BookingModel from "../models/bookingModel";
// Middleware
import { AdminAuthMiddleware } from "../middlewares/authenticateAdmin";

// Controllers
import { AdminAuthController } from "../controllers/implementation/adminAuthController";
import { AdminController } from "../controllers/implementation/adminController";

// Services
import { AdminAuthService } from "../services/implementations/AdminAuthService";
import { AdminService } from "../services/implementations/AdminService";
import { BookingService } from "../services/implementations/Bookingservice";
import { PaymentService } from "../services/implementations/PaymentService";
import { UserService } from "../services/implementations/UserService";
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import { MentorService } from "../services/implementations/MenteeService";

// Repositories
import AdminRepository from "../repositories/implementations/AdminRepository";
import UserRepository from "../repositories/implementations/UserRepository";
import BookingRepository from "../repositories/implementations/BookingRepository";
import PaymentRepository from "../repositories/implementations/PaymentRepository";
import MentorRepository from "../repositories/implementations/MentorRepository";
import BaseRepository from "../repositories/implementations/BaseRepository";

// Interfaces
import { IAdminAuthService } from "../services/interface/IAdminAuthService";
import { IAdminService } from "../services/interface/IAdminService";
import { IBookingService } from "../services/interface/IBookingService";
import { IPaymentService } from "../services/interface/IPaymentService";
import { IUserService } from "../services/interface/IUserService";
import { IMentorService } from "../services/interface/IMentorService";
import { IAdminRepository } from "../repositories/interface/IAdminRepository";
import { IUserRepository } from "../repositories/interface/IUserRepository";
import { IBookingRepository } from "../repositories/interface/IBookingRepository";
import { IPaymentRepository } from "../repositories/interface/IPaymentRepository";
import { IMentorRepository } from "../repositories/interface/IMentorRepository";
import { IBaseRepository } from "../repositories/interface/IBaseRepository";

// Redis
import redisClient from "../config/redis";
import { RedisClientType } from "@redis/client";

const container = new Container();

// Bind Mongoose models
container.bind<Model<any>>(TYPES.AdminModel).toConstantValue(AdminModel);
container.bind<Model<any>>(TYPES.UserModel).toConstantValue(Users);
container.bind<Model<any>>(TYPES.MenteeModel).toConstantValue(Mentees);
container.bind<Model<any>>(TYPES.MentorModel).toConstantValue(Mentors);
container.bind<Model<any>>(TYPES.BookingModel).toConstantValue(BookingModel);
// Bind Redis client
container.bind<RedisClientType>(TYPES.RedisClient).toConstantValue(redisClient);

// Bind services
container
  .bind<IAdminAuthService>(TYPES.IAdminAuthService)
  .to(AdminAuthService)
  .inSingletonScope();
container
  .bind<IAdminService>(TYPES.IAdminService)
  .to(AdminService)
  .inSingletonScope();
container
  .bind<IBookingService>(TYPES.IBookingService)
  .to(BookingService)
  .inSingletonScope();
container
  .bind<IPaymentService>(TYPES.IPaymentService)
  .to(PaymentService)
  .inSingletonScope();
container
  .bind<IUserService>(TYPES.IUserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<IMentorService>(TYPES.IMentorService)
  .to(MentorService)
  .inSingletonScope();
container
  .bind<RedisTokenService>(TYPES.RedisTokenService)
  .to(RedisTokenService)
  .inSingletonScope();

// Bind repositories
container
  .bind<IAdminRepository>(TYPES.IAdminRepository)
  .to(AdminRepository)
  .inSingletonScope();
container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IBookingRepository>(TYPES.IBookingRepository)
  .to(BookingRepository)
  .inSingletonScope();
container
  .bind<IPaymentRepository>(TYPES.IPaymentRepository)
  .to(PaymentRepository)
  .inSingletonScope();
container
  .bind<IMentorRepository>(TYPES.IMentorRepository)
  .to(MentorRepository)
  .inSingletonScope();
container
  .bind<IBaseRepository<any>>(TYPES.IBaseRepository)
  .to(BaseRepository)
  .inSingletonScope();

// Bind controllers
container
  .bind<AdminAuthController>(TYPES.AdminAuthController)
  .to(AdminAuthController)
  .inSingletonScope();
container
  .bind<AdminController>(TYPES.AdminController)
  .to(AdminController)
  .inSingletonScope();

// Bind middleware
container
  .bind<AdminAuthMiddleware>(TYPES.AdminAuthMiddleware)
  .to(AdminAuthMiddleware)
  .inSingletonScope();

export { container };
