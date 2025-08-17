import { Container } from "inversify";
import { TYPES } from "./types";

// Repository Interfaces
import { IUserRepository } from "../repositories/interface/IUserRepository";
import { IUserCrudRepository } from "../repositories/interface/IUserCrudRepository";
import { IMentorQueryRepository } from "../repositories/interface/IMentorQueryRepository";
import { IUserStatusRepository } from "../repositories/interface/IUserStatusRepository";
import { IUserStatsRepository } from "../repositories/interface/IUserStatsRepository";
import { IAdminRespository } from "../repositories/interface/IAdminRespository";
import { IServiceRepository } from "../repositories/interface/IServiceRepository";
import { IMentorRepository } from "../repositories/interface/IMentorRepository";
import { IMenteeRepository } from "../repositories/interface/IMenteeRepository";
import { IBookingRepository } from "../repositories/interface/IBookingRepository";
import { IPaymentRepository } from "../repositories/interface/IPaymentRepository";
import { IMessageRepository } from "../repositories/interface/IMessageRepository";
import { IChatRepository } from "../repositories/interface/IChatRepository";
import { INotifictaionRepository } from "../repositories/interface/INotifictaionRepository";
import { IOTPRepository } from "../repositories/interface/IOTPRepository";
import { IScheduleRepository } from "../repositories/interface/IScheduleRepository";
import { ISlotRepository } from "../repositories/interface/ISlotRepository";
import { IVideoCallRepository } from "../repositories/interface/IVideoCallRepository";
import { IWalletRepository } from "../repositories/interface/IWalletRepository";
import { ITestimonialRepository } from "../repositories/interface/ITestimonialRepository";
import { IPriorityDmRepository } from "../repositories/interface/IPriorityDmRepository";
import { IContactMessageRepository } from "../repositories/interface/IContactMessageRepository";
import { IAppealRepository } from "../repositories/interface/IAppealRepository";
import { IBlockedRepository } from "../repositories/interface/IBlockedRepository";
import { IBotConversationRepository } from "../repositories/interface/IBotConversationRepository";
import { IBotRateLimitRepository } from "../repositories/interface/IBotRateLimitRepository";
import { IPolicyRepository } from "../repositories/interface/IPolicyRepository";
import { ICareerCollege } from "../repositories/interface/ICareerCollege";
import { ICareerSchool } from "../repositories/interface/ICareerSchool";
import { ICareerProfessional } from "../repositories/interface/ICareerProfessional";

// Repository Implementations
import UserRepository from "../repositories/implementations/UserRepository";
import AdminRepository from "../repositories/implementations/AdminRepository";
import ServiceRepository from "../repositories/implementations/ServiceRepository";
import MentorRepository from "../repositories/implementations/MentorRepository";
import MenteeRepository from "../repositories/implementations/MenteeRepository";
import BookingRepository from "../repositories/implementations/BookingRepository";
import PaymentRepository from "../repositories/implementations/PaymentRepository";
import MessageRepository from "../repositories/implementations/MessageRepository";
import ChatRepository from "../repositories/implementations/ChatRepository";
import NotificationRepository from "../repositories/implementations/NotificationRepository";
import OTPRepository from "../repositories/implementations/OTPRepository";
import ScheduleRepository from "../repositories/implementations/ScheduleRepository";
import SlotRepository from "../repositories/implementations/SlotRepository";
import VideoCallRepository from "../repositories/implementations/VideoCallRepository";
import WalletRepository from "../repositories/implementations/WalletRepository";
import TestimonialRepository from "../repositories/implementations/TestimonialRepository";
import PriorityDmRepository from "../repositories/implementations/PriorityDmRepository";
import ContactMessageRepository from "../repositories/implementations/ContactMessageRepository";
import AppealRepository from "../repositories/implementations/AppealRepository";
import BlockedRepository from "../repositories/implementations/BlockedRepository";
import BotConversationRepository from "../repositories/implementations/BotConversationRepository";
import BotRateLimitRepository from "../repositories/implementations/BotRateLimitRepository";
import PolicyRepository from "../repositories/implementations/PolicyRepository";
import CareerCollege from "../repositories/implementations/CareerCollege";
import CareerSchool from "../repositories/implementations/CareerSchool";
import CareerProfessional from "../repositories/implementations/CareerProfessional";

// Service Interfaces
import { IUserAuthService } from "../services/interface/IUserAuthService";
import { IUserService } from "../services/interface/IUserService";
import { IMentorService } from "../services/interface/IMentorService";
import { IMenteeService } from "../services/interface/IMenteeService";
import { IAdminService } from "../services/interface/IAdminService";
import { IAdminAuthservice } from "../services/interface/IAdminAuthservice";
import { IServiceServices } from "../services/interface/IServiceServices";
import { IBookingService } from "../services/interface/IBookingService";
import { IPaymentService } from "../services/interface/IPaymentService";
import { IMessageService } from "../services/interface/IMessageService";
import { IChatService } from "../services/interface/IChatService";
import { INotificationService } from "../services/interface/INotificationService";
import { IOTPService } from "../services/interface/IOTPService";
import { ICalenderService } from "../services/interface/ICalenderService";
import { IVideoCallService } from "../services/interface/IVideoCallService";
import { ITestimonialService } from "../services/interface/ITestimonialService";
import { IContactMessageService } from "../services/interface/IContactMessageService";
import { IAppealService } from "../services/interface/IAppealService";
import { IChatbotService } from "../services/interface/IChatbotService";
import { IAIService } from "../services/interface/IAIService";
import { IUploadService } from "../services/interface/IUploadService";

// Service Implementations
import UserAuthService from "../services/implementations/UserAuthService";
import UserService from "../services/implementations/UserService";
import MentorService from "../services/implementations/MentorService";
import MenteeService from "../services/implementations/MenteeService";
import AdminService from "../services/implementations/AdminService";
import AdminAuthService from "../services/implementations/AdminAuthService";
import ServiceServices from "../services/implementations/ServiceServices";
import BookingService from "../services/implementations/BookingService";
import PaymentService from "../services/implementations/PaymentService";
import MessageService from "../services/implementations/MessageService";
import ChatService from "../services/implementations/ChatService";
import NotificationService from "../services/implementations/NotificationService";
import OTPServices from "../services/implementations/OTPService";
import CalenderService from "../services/implementations/CalenderService";
import VideoCallService from "../services/implementations/VideoCallService";
import TestimonialService from "../services/implementations/TestimonialService";
import ContactMessageService from "../services/implementations/ContactMessageService";
import AppealService from "../services/implementations/AppealService";
import ChatbotService from "../services/implementations/ChatbotService";
import AIService from "../services/implementations/AIService";
import SecureUploadService from "../services/implementations/SecureUploadService";

// Utility Services
import { RedisTokenService } from "../services/implementations/RedisTokenService";

// Controller Interfaces
import { IUserAuthController } from "../controllers/interface/IUserAuthController";
import { IUserController } from "../controllers/interface/IUserController";
import { IMentorController } from "../controllers/interface/IMentorController";
import { IMenteeController } from "../controllers/interface/IMenteeController";
import { IAdminController } from "../controllers/interface/IAdminController";
import { IAdminAuthController } from "../controllers/interface/IAdminAuthController";
import { IBookingController } from "../controllers/interface/IBookingController";
import { IPaymentController } from "../controllers/interface/IPaymentController";
import { ISocketController } from "../controllers/interface/ISocketController";
import { INotificationController } from "../controllers/interface/INotificationController";
import { IVideoCallController } from "../controllers/interface/IVideoCallController";
import { IContactController } from "../controllers/interface/IContactController";
import { IAppealController } from "../controllers/interface/IAppealController";
import { IChatbotController } from "../controllers/interface/IChatbotController";
import { IUploadController } from "../controllers/interface/IUploadController";
import { IWebHookController } from "../controllers/interface/IWebHookController";
import { ISecureVideoProxyController } from "../controllers/interface/ISecureVideoProxyController";

// Controller Implementations
import UserAuthController from "../controllers/implementation/userAuthController";
import UserController from "../controllers/implementation/userController";
import MentorController from "../controllers/implementation/mentorController";
import MenteeController from "../controllers/implementation/menteeController";
import AdminController from "../controllers/implementation/adminController";
import { AdminAuthController } from "../controllers/implementation/adminAuthController";
import BookingController from "../controllers/implementation/bookingController";
import PaymentController from "../controllers/implementation/paymentController";
import SocketController from "../controllers/implementation/socketController";
import NotificationController from "../controllers/implementation/notificationController";
import VideoCallController from "../controllers/implementation/videoCallController";
import ContactController from "../controllers/implementation/contactController";
import AppealController from "../controllers/implementation/AppealController";
import ChatbotController from "../controllers/implementation/chatbotController";
import UploadController from "../controllers/implementation/uploadController";
import WebHookController from "../controllers/implementation/webHookController";
import SecureVideoProxyController from "../controllers/implementation/secureVideoProxyController";

/**
 * 🔹 DIP COMPLIANCE: Complete Inversify DI Container Configuration
 * Centralized dependency injection container following SOLID principles
 */
const container = new Container();

// ================================
// REPOSITORY BINDINGS
// ================================

// User Repository Bindings (ISP Compliant)
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserCrudRepository>(TYPES.IUserCrudRepository).to(UserRepository).inSingletonScope();
container.bind<IMentorQueryRepository>(TYPES.IMentorQueryRepository).to(UserRepository).inSingletonScope();
container.bind<IUserStatusRepository>(TYPES.IUserStatusRepository).to(UserRepository).inSingletonScope();
container.bind<IUserStatsRepository>(TYPES.IUserStatsRepository).to(UserRepository).inSingletonScope();

// Admin Repository Binding
container.bind<IAdminRespository>(TYPES.IAdminRepository).to(AdminRepository).inSingletonScope();

// Repository Bindings - Injectable ones enabled
container.bind<IOTPRepository>(TYPES.IOTPRepository).to(OTPRepository).inSingletonScope();
container.bind<IServiceRepository>(TYPES.IServiceRepository).to(ServiceRepository).inSingletonScope();
container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository).inSingletonScope();
container.bind<IPaymentRepository>(TYPES.IPaymentRepository).to(PaymentRepository).inSingletonScope();
container.bind<IWalletRepository>(TYPES.IWalletRepository).to(WalletRepository).inSingletonScope();
container.bind<ITestimonialRepository>(TYPES.ITestimonialRepository).to(TestimonialRepository).inSingletonScope();

// Core repositories now enabled
container.bind<IAdminRespository>(TYPES.IAdminRepository).to(AdminRepository).inSingletonScope();
container.bind<IMentorRepository>(TYPES.IMentorRepository).to(MentorRepository).inSingletonScope();
container.bind<IMenteeRepository>(TYPES.IMenteeRepository).to(MenteeRepository).inSingletonScope();
container.bind<ISlotRepository>(TYPES.ISlotRepository).to(SlotRepository).inSingletonScope();
container.bind<IScheduleRepository>(TYPES.IScheduleRepository).to(ScheduleRepository).inSingletonScope();
container.bind<IPriorityDmRepository>(TYPES.IPriorityDmRepository).to(PriorityDmRepository).inSingletonScope();
container.bind<ICareerCollege>(TYPES.ICareerCollege).to(CareerCollege).inSingletonScope();
container.bind<ICareerSchool>(TYPES.ICareerSchool).to(CareerSchool).inSingletonScope();
container.bind<ICareerProfessional>(TYPES.ICareerProfessional).to(CareerProfessional).inSingletonScope();
container.bind<IPolicyRepository>(TYPES.IPolicyRepository).to(PolicyRepository).inSingletonScope();
container.bind<IBlockedRepository>(TYPES.IBlockedRepository).to(BlockedRepository).inSingletonScope();
container.bind<IAppealRepository>(TYPES.IAppealRepository).to(AppealRepository).inSingletonScope();

// Essential repositories now enabled
container.bind<IMessageRepository>(TYPES.IMessageRepository).to(MessageRepository).inSingletonScope();
container.bind<IChatRepository>(TYPES.IChatRepository).to(ChatRepository).inSingletonScope();
container.bind<INotifictaionRepository>(TYPES.INotificationRepository).to(NotificationRepository).inSingletonScope();
// container.bind<IScheduleRepository>(TYPES.IScheduleRepository).to(ScheduleRepository).inSingletonScope();
// container.bind<ISlotRepository>(TYPES.ISlotRepository).to(SlotRepository).inSingletonScope();
// container.bind<IVideoCallRepository>(TYPES.IVideoCallRepository).to(VideoCallRepository).inSingletonScope();
// container.bind<IPriorityDmRepository>(TYPES.IPriorityDmRepository).to(PriorityDmRepository).inSingletonScope();
// container.bind<IContactMessageRepository>(TYPES.IContactMessageRepository).to(ContactMessageRepository).inSingletonScope();
// container.bind<IAppealRepository>(TYPES.IAppealRepository).to(AppealRepository).inSingletonScope();
// container.bind<IBlockedRepository>(TYPES.IBlockedRepository).to(BlockedRepository).inSingletonScope();
// container.bind<IBotConversationRepository>(TYPES.IBotConversationRepository).to(BotConversationRepository).inSingletonScope();
// container.bind<IBotRateLimitRepository>(TYPES.IBotRateLimitRepository).to(BotRateLimitRepository).inSingletonScope();

// ================================
// SERVICE BINDINGS (Core services now enabled)
// ================================
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService).inSingletonScope();
container.bind<IOTPService>(TYPES.IOTPService).to(OTPServices).inSingletonScope();
container.bind<IUploadService>(TYPES.IUploadService).to(SecureUploadService).inSingletonScope();
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService).inSingletonScope();
container.bind<IServiceServices>(TYPES.IServiceServices).to(ServiceServices).inSingletonScope();
container.bind<IBookingService>(TYPES.IBookingService).to(BookingService).inSingletonScope();
container.bind<IPaymentService>(TYPES.IPaymentService).to(PaymentService).inSingletonScope();

// Core services now enabled
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<IMentorService>(TYPES.IMentorService).to(MentorService).inSingletonScope();
container.bind<ICalenderService>(TYPES.ICalenderService).to(CalenderService).inSingletonScope();
container.bind<ITestimonialService>(TYPES.ITestimonialService).to(TestimonialService).inSingletonScope();
container.bind<IMenteeService>(TYPES.IMenteeService).to(MenteeService).inSingletonScope();
container.bind<IAppealService>(TYPES.IAppealService).to(AppealService).inSingletonScope();

// Enable remaining services with @injectable now added
container.bind<IMessageService>(TYPES.IMessageService).to(MessageService).inSingletonScope();
container.bind<IChatService>(TYPES.IChatService).to(ChatService).inSingletonScope();
container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService).inSingletonScope();

// TODO: Enable after adding @injectable to these services:
// container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService).inSingletonScope();
// container.bind<IVideoCallService>(TYPES.IVideoCallService).to(VideoCallService).inSingletonScope();
// container.bind<IContactMessageService>(TYPES.IContactMessageService).to(ContactMessageService).inSingletonScope();
// container.bind<IChatbotService>(TYPES.IChatbotService).to(ChatbotService).inSingletonScope();
// container.bind<IAIService>(TYPES.IAIService).to(AIService).inSingletonScope();

// ================================
// UTILITY SERVICE BINDINGS
// ================================
container.bind<RedisTokenService>(TYPES.RedisTokenService).to(RedisTokenService).inSingletonScope();

// ================================
// CONTROLLER BINDINGS - Core Controllers Working with DI
// ================================
// NOTE: These controllers are now using proper dependency injection!
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController).inSingletonScope();
container.bind<IMentorController>(TYPES.IMentorController).to(MentorController).inSingletonScope();
container.bind<IMenteeController>(TYPES.IMenteeController).to(MenteeController).inSingletonScope();
container.bind<IAdminController>(TYPES.IAdminController).to(AdminController).inSingletonScope();
container.bind<IBookingController>(TYPES.IBookingController).to(BookingController).inSingletonScope();
container.bind<IPaymentController>(TYPES.IPaymentController).to(PaymentController).inSingletonScope();
container.bind<IUploadController>(TYPES.IUploadController).to(UploadController).inSingletonScope();
container.bind<IAppealController>(TYPES.IAppealController).to(AppealController).inSingletonScope();

// Enable controllers with working dependencies
container.bind<ISocketController>(TYPES.ISocketController).to(SocketController).inSingletonScope();
container.bind<INotificationController>(TYPES.INotificationController).to(NotificationController).inSingletonScope();
container.bind<IWebHookController>(TYPES.IWebHookController).to(WebHookController).inSingletonScope();

// TODO: Enable after their service dependencies are made @injectable:
// container.bind<IUserController>(TYPES.IUserController).to(UserController).inSingletonScope();
// container.bind<IAdminAuthController>(TYPES.IAdminAuthController).to(AdminAuthController).inSingletonScope();
// container.bind<IVideoCallController>(TYPES.IVideoCallController).to(VideoCallController).inSingletonScope();
// container.bind<IContactController>(TYPES.IContactController).to(ContactController).inSingletonScope();
// container.bind<IChatbotController>(TYPES.IChatbotController).to(ChatbotController).inSingletonScope();
// container.bind<ISecureVideoProxyController>(TYPES.ISecureVideoProxyController).to(SecureVideoProxyController).inSingletonScope();

export { container };