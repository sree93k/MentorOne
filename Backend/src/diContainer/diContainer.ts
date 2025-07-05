import { RedisClientType } from "@redis/client";
import { Model } from "mongoose";
import { EAdmin } from "../entities/adminEntity";
import { EUsers } from "../entities/userEntity";
import { EBooking } from "../entities/bookingEntity";
import { EPayment } from "../entities/paymentEntity";
import { EService } from "../entities/serviceEntity";
import { EMentor } from "../entities/mentorEntity";
import AdminModel from "../models/adminModel";
import UserModel from "../models/userModel";
import BookingModel from "../models/bookingModel";
import PaymentModel from "../models/paymentModel";
import ServiceModel from "../models/serviceModel";
import MentorModel from "../models/mentorModel";
import { logger } from "../utils/logger";
import { AppError } from "../errors/appError";
import { HttpStatus } from "../constants/HttpStatus";
import { AdminRepository } from "../repositories/implementations/AdminRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { BookingRepository } from "../repositories/implementations/BookingRepository";
import { PaymentRepository } from "../repositories/implementations/PaymentRepository";
import { ServiceRepository } from "../repositories/implementations/ServiceRepository";
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import { AdminAuthService } from "../services/implementations/AdminAuthService";
import { AdminService } from "../services/implementations/AdminService";
import { ServiceServices } from "../services/implementations/ServiceServices";
import { AdminAuthController } from "../controllers/implementation/adminAuthController";
import { AdminController } from "../controllers/implementation/adminController";
import { IChatService } from "../services/interface/IChatService";
import { tokenClient } from "../config/redisClients";

interface DIContainer {
  adminRepository: AdminRepository;
  userRepository: UserRepository;
  bookingRepository: BookingRepository;
  paymentRepository: PaymentRepository;
  serviceRepository: ServiceRepository;
  redisTokenService: RedisTokenService;
  adminAuthService: AdminAuthService;
  adminService: AdminService;
  serviceServices: ServiceServices;
  adminAuthController: AdminAuthController;
  adminController: AdminController;
  chatService: IChatService;
}

class DIContainerImpl {
  private static instance: DIContainer | null = null;
  private readonly dependencies: DIContainer;

  private constructor() {
    try {
      console.log("🔍 DI Container Constructor - START");

      // Validate tokenClient
      console.log("🔍 Checking tokenClient availability...");
      if (!tokenClient) {
        console.log("❌ tokenClient is null/undefined");
        throw new AppError(
          "Redis tokenClient is not available",
          HttpStatus.INTERNAL_SERVER,
          "error",
          "REDIS_TOKEN_CLIENT_UNDEFINED"
        );
      }
      console.log("✅ tokenClient exists");

      console.log("🔍 Checking tokenClient connection...");
      console.log("tokenClient.isOpen:", tokenClient.isOpen);
      console.log("tokenClient.isReady:", tokenClient.isReady);

      if (!tokenClient.isOpen) {
        console.log("❌ tokenClient is not connected");
        throw new AppError(
          "Redis tokenClient is not connected",
          HttpStatus.INTERNAL_SERVER,
          "error",
          "REDIS_TOKEN_CLIENT_NOT_CONNECTED"
        );
      }
      console.log("✅ tokenClient is connected");

      logger.info("Starting DI container initialization...");
      console.log("🔍 Starting repository initialization...");

      console.log("🔍 Creating AdminRepository...");
      const adminRepository = new AdminRepository(AdminModel as Model<EAdmin>);
      console.log("✅ AdminRepository created");

      console.log("🔍 Creating UserRepository...");
      const userRepository = new UserRepository(UserModel as Model<EUsers>);
      console.log("✅ UserRepository created");

      console.log("🔍 Creating BookingRepository...");
      const bookingRepository = new BookingRepository(
        BookingModel as Model<EBooking>
      );
      console.log("✅ BookingRepository created");

      console.log("🔍 Creating PaymentRepository...");
      const paymentRepository = new PaymentRepository(
        PaymentModel as Model<EPayment>
      );
      console.log("✅ PaymentRepository created");

      console.log("🔍 Creating ServiceRepository...");
      const serviceRepository = new ServiceRepository(
        ServiceModel as Model<EService>
      );
      console.log("✅ ServiceRepository created");

      console.log("🔍 Creating RedisTokenService...");
      const redisTokenService = new RedisTokenService(tokenClient);
      console.log("✅ RedisTokenService created");

      console.log("🔍 Creating AdminAuthService...");
      const adminAuthService = new AdminAuthService(
        adminRepository,
        redisTokenService
      );
      console.log("✅ AdminAuthService created");

      console.log("🔍 Creating ServiceServices...");
      const serviceServices = new ServiceServices(serviceRepository);
      console.log("✅ ServiceServices created");

      console.log("🔍 Creating AdminService...");
      const adminService = new AdminService(
        userRepository,
        bookingRepository,
        paymentRepository,
        serviceServices
      );
      console.log("✅ AdminService created");

      console.log("🔍 Creating AdminAuthController...");
      const adminAuthController = new AdminAuthController(adminAuthService);
      console.log("✅ AdminAuthController created");

      console.log("🔍 Creating AdminController...");
      const adminController = new AdminController(adminService);
      console.log("✅ AdminController created");

      console.log("🔍 Loading ChatService...");
      // Delay ChatService import to avoid early instantiation
      console.log("🔍 Requiring ChatService module...");
      const {
        default: ChatService,
      } = require("../services/implementations/ChatService");
      console.log("✅ ChatService module loaded");

      console.log("🔍 Creating ChatService instance...");
      const chatService = new ChatService();
      console.log("✅ ChatService instance created");

      console.log("🔍 Assembling dependencies object...");
      this.dependencies = {
        adminRepository,
        userRepository,
        bookingRepository,
        paymentRepository,
        serviceRepository,
        redisTokenService,
        adminAuthService,
        adminService,
        serviceServices,
        adminAuthController,
        adminController,
        chatService,
      };
      console.log("✅ Dependencies object assembled");

      logger.info("DI container initialized successfully");
      console.log("🔍 DI Container Constructor - COMPLETE");
    } catch (error) {
      console.log("❌ DI Container Constructor - ERROR:", error);
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
    console.log("🔍 DIContainer.getInstance() called");
    if (!DIContainerImpl.instance) {
      console.log("🔍 No existing instance, creating new one...");
      DIContainerImpl.instance = new DIContainerImpl().dependencies;
      console.log("✅ New instance created");
    } else {
      console.log("✅ Using existing instance");
    }
    return DIContainerImpl.instance;
  }

  public static resetInstance(): void {
    console.log("🔍 DIContainer.resetInstance() called");
    DIContainerImpl.instance = null;
  }
}
// export async function initDIContainer(): Promise<DIContainer> {
//   console.log("🔍 initDIContainer() function called");

//   // Add stack trace to see where this is being called from
//   console.log("📍 Call stack:");
//   console.trace();

//   console.log("🔍 Checking tokenClient in initDIContainer...");
//   if (!tokenClient) {
//     console.log("❌ tokenClient is null/undefined in initDIContainer");
//     throw new AppError(
//       "Redis tokenClient is not available",
//       HttpStatus.INTERNAL_SERVER,
//       "error",
//       "REDIS_TOKEN_CLIENT_UNDEFINED"
//     );
//   }
//   console.log("✅ tokenClient exists in initDIContainer");

//   console.log("🔍 Checking tokenClient connection in initDIContainer...");
//   console.log("tokenClient.isOpen:", tokenClient.isOpen);
//   console.log("tokenClient.isReady:", tokenClient.isReady);

//   if (!tokenClient.isOpen) {
//     console.log("❌ tokenClient is not connected in initDIContainer");
//     throw new AppError(
//       "Redis tokenClient is not connected",
//       HttpStatus.INTERNAL_SERVER,
//       "error",
//       "REDIS_TOKEN_CLIENT_NOT_CONNECTED"
//     );
//   }
//   console.log("✅ tokenClient is connected in initDIContainer");

//   console.log("🔍 Calling DIContainerImpl.getInstance()...");
//   const container = DIContainerImpl.getInstance();
//   console.log("✅ initDIContainer() completed successfully");

//   return container;
// }

let isServerStarted = false;

export function setServerStarted(started: boolean) {
  isServerStarted = started;
}

export async function initDIContainer(): Promise<DIContainer> {
  console.log("🔍 initDIContainer() function called");

  // Guard against early calls
  if (!isServerStarted) {
    console.log(
      "⚠️ Server not started yet, skipping DI container initialization"
    );
    throw new AppError(
      "DI Container can only be initialized after server startup",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "DI_CONTAINER_EARLY_INIT"
    );
  }

  console.log("🔍 Checking tokenClient in initDIContainer...");
  if (!tokenClient) {
    console.log("❌ tokenClient is null/undefined in initDIContainer");
    throw new AppError(
      "Redis tokenClient is not available",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "REDIS_TOKEN_CLIENT_UNDEFINED"
    );
  }
  console.log("✅ tokenClient exists in initDIContainer");

  console.log("🔍 Checking tokenClient connection in initDIContainer...");
  console.log("tokenClient.isOpen:", tokenClient.isOpen);
  console.log("tokenClient.isReady:", tokenClient.isReady);

  if (!tokenClient.isOpen) {
    console.log("❌ tokenClient is not connected in initDIContainer");
    throw new AppError(
      "Redis tokenClient is not connected",
      HttpStatus.INTERNAL_SERVER,
      "error",
      "REDIS_TOKEN_CLIENT_NOT_CONNECTED"
    );
  }
  console.log("✅ tokenClient is connected in initDIContainer");

  console.log("🔍 Calling DIContainerImpl.getInstance()...");
  const container = DIContainerImpl.getInstance();
  console.log("✅ initDIContainer() completed successfully");

  return container;
}

export const resetDIContainer = (): void => {
  DIContainerImpl.resetInstance();
};
