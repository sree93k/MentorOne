// // import { RedisTokenService } from "../services/implementations/RedisTokenService";
// // import { AdminAuthService } from "../services/implementations/AdminAuthService";
// // import AdminRepository from "../repositories/implementations/AdminRepository";
// // import { AdminAuthController } from "../controllers/implementation/adminAuthController";
// // import { Model } from "mongoose";
// // import { EAdmin } from "../entities/adminEntity";
// // import AdminModel from "../models/adminModel";
// // import { tokenClient } from "../server";
// // import { logger } from "../utils/logger";
// // import { AppError } from "../errors/appError";
// // import { HttpStatus } from "../constants/HttpStatus";

// // interface DIContainer {
// //   adminRepository: AdminRepository;
// //   redisTokenService: RedisTokenService;
// //   adminAuthService: AdminAuthService;
// //   adminAuthController: AdminAuthController;
// // }

// // /**
// //  * Initializes and returns the dependency injection container.
// //  */
// // export function initDIContainer(): DIContainer {
// //   try {
// //     const adminRepository = new AdminRepository(AdminModel as Model<EAdmin>);
// //     const redisTokenService = new RedisTokenService(tokenClient);
// //     const adminAuthService = new AdminAuthService(
// //       adminRepository,
// //       redisTokenService
// //     );
// //     const adminAuthController = new AdminAuthController(adminAuthService);

// //     logger.info("DI container initialized successfully");

// //     return {
// //       adminRepository,
// //       redisTokenService,
// //       adminAuthService,
// //       adminAuthController,
// //     };
// //   } catch (error) {
// //     const errorMessage = error instanceof Error ? error.message : String(error);
// //     logger.error("Failed to initialize DI container", { error: errorMessage });
// //     throw new AppError(
// //       "Failed to initialize dependencies",
// //       HttpStatus.INTERNAL_SERVER,
// //       "error",
// //       "DI_INIT_ERROR"
// //     );
// //   }
// // }
// import {
//   RedisClientType,
//   RedisModules,
//   RedisFunctions,
//   RedisScripts,
// } from "@redis/client";
// import { Model } from "mongoose";
// import { EAdmin } from "../entities/adminEntity";
// import AdminModel from "../models/adminModel";
// import { logger } from "../utils/logger";
// import { AppError } from "../errors/appError";
// import { HttpStatus } from "../constants/HttpStatus";
// import { AdminRepository } from "../repositories/implementations/AdminRepository";
// import { RedisTokenService } from "../services/implementations/RedisTokenService";
// import { AdminAuthService } from "../services/implementations/AdminAuthService";
// import { AdminAuthController } from "../controllers/implementation/adminAuthController";
// import { tokenClient } from "../server";

// interface DIContainer {
//   adminRepository: AdminRepository;
//   redisTokenService: RedisTokenService;
//   adminAuthService: AdminAuthService;
//   adminAuthController: AdminAuthController;
// }

// class DIContainerImpl {
//   private static instance: DIContainer | null = null;
//   private readonly dependencies: DIContainer;

//   private constructor() {
//     try {
//       const adminRepository = new AdminRepository(AdminModel as Model<EAdmin>);
//       const redisTokenService = new RedisTokenService(
//         tokenClient as RedisClientType<
//           RedisModules,
//           RedisFunctions,
//           RedisScripts
//         >
//       );
//       const adminAuthService = new AdminAuthService(
//         adminRepository,
//         redisTokenService
//       );
//       const adminAuthController = new AdminAuthController(adminAuthService);

//       this.dependencies = {
//         adminRepository,
//         redisTokenService,
//         adminAuthService,
//         adminAuthController,
//       };

//       logger.info("DI container initialized successfully");
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       logger.error("Failed to initialize DI container", {
//         error: errorMessage,
//       });
//       throw new AppError(
//         "Failed to initialize dependencies",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "DI_INIT_ERROR"
//       );
//     }
//   }

//   public static getInstance(): DIContainer {
//     if (!DIContainerImpl.instance) {
//       DIContainerImpl.instance = new DIContainerImpl().dependencies;
//     }
//     return DIContainerImpl.instance;
//   }
// }

// export const initDIContainer = (): DIContainer => DIContainerImpl.getInstance();

import {
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from "@redis/client";
import { Model } from "mongoose";
import { EAdmin } from "../entities/adminEntity";
import { EUsers } from "../entities/userEntity";
import { EBooking } from "../entities/bookingEntity";
import { EPayment } from "../entities/paymentEntity";
import { EMentor } from "../entities/mentorEntity";
import AdminModel from "../models/adminModel";
import UserModel from "../models/userModel";
import BookingModel from "../models/bookingModel";
import PaymentModel from "../models/paymentModel";
import MentorModel from "../models/mentorModel";
import { logger } from "../utils/logger";
import { AppError } from "../errors/appError";
import { HttpStatus } from "../constants/HttpStatus";
import { AdminRepository } from "../repositories/implementations/AdminRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { BookingRepository } from "../repositories/implementations/BookingRepository";
import PaymentRepository from "../repositories/implementations/PaymentRepository";
import { MentorRepository } from "../repositories/implementations/MentorRepository";
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import { AdminAuthService } from "../services/implementations/AdminAuthService";
import { AdminService } from "../services/implementations/AdminService";
import { AdminAuthController } from "../controllers/implementation/adminAuthController";
import { AdminController } from "../controllers/implementation/adminController";
import { tokenClient } from "../server";

interface DIContainer {
  adminRepository: AdminRepository;
  userRepository: UserRepository;
  bookingRepository: BookingRepository;
  paymentRepository: PaymentRepository;
  mentorRepository: MentorRepository;
  redisTokenService: RedisTokenService;
  adminAuthService: AdminAuthService;
  adminService: AdminService;
  adminAuthController: AdminAuthController;
  adminController: AdminController;
}

class DIContainerImpl {
  private static instance: DIContainer | null = null;
  private readonly dependencies: DIContainer;

  private constructor() {
    try {
      const adminRepository = new AdminRepository(AdminModel as Model<EAdmin>);
      const userRepository = new UserRepository(UserModel as Model<EUsers>);
      const bookingRepository = new BookingRepository(
        BookingModel as Model<EBooking>
      );
      const paymentRepository = new PaymentRepository(
        PaymentModel as Model<EPayment>
      );
      const mentorRepository = new MentorRepository(
        MentorModel as Model<EMentor>
      );
      const redisTokenService = new RedisTokenService(
        tokenClient as RedisClientType<
          RedisModules,
          RedisFunctions,
          RedisScripts
        >
      );
      const adminAuthService = new AdminAuthService(
        adminRepository,
        redisTokenService
      );
      const adminService = new AdminService(
        adminRepository,
        userRepository,
        bookingRepository,
        paymentRepository,
        mentorRepository
      );
      const adminAuthController = new AdminAuthController(adminAuthService);
      const adminController = new AdminController(adminService);

      this.dependencies = {
        adminRepository,
        userRepository,
        bookingRepository,
        paymentRepository,
        mentorRepository,
        redisTokenService,
        adminAuthService,
        adminService,
        adminAuthController,
        adminController,
      };

      logger.info("DI container initialized successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to initialize DI container", {
        error: errorMessage,
      });
      throw new AppError(
        "Failed to initialize dependencies",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "DI_INIT_ERROR"
      );
    }
  }

  public static getInstance(): DIContainer {
    if (!DIContainerImpl.instance) {
      DIContainerImpl.instance = new DIContainerImpl().dependencies;
    }
    return DIContainerImpl.instance;
  }
}

export const initDIContainer = (): DIContainer => DIContainerImpl.getInstance();
