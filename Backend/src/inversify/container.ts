// import { RedisTokenService } from "../services/implementations/RedisTokenService";
// import AdminAuthService from "../services/implementations/AdminAuthService";
// import AdminRepository from "../repositories/implementations/AdminRepository";

// class DIContainer {
//   private static _redisTokenService: RedisTokenService;
//   private static _adminAuthService: AdminAuthService;
//   private static _adminRepository: AdminRepository;

//   public static getRedisTokenService(): RedisTokenService {
//     if (!this._redisTokenService) {
//       this._redisTokenService = new RedisTokenService();
//     }
//     return this._redisTokenService;
//   }

//   public static getAdminRepository(): AdminRepository {
//     if (!this._adminRepository) {
//       this._adminRepository = new AdminRepository();
//     }
//     return this._adminRepository;
//   }

//   public static getAdminAuthService(): AdminAuthService {
//     if (!this._adminAuthService) {
//       const redisTokenService = this.getRedisTokenService();
//       const adminRepository = this.getAdminRepository();
//       this._adminAuthService = new AdminAuthService(
//         redisTokenService,
//         adminRepository
//       );
//     }
//     return this._adminAuthService;
//   }
// }

// export default DIContainer;
import { RedisTokenService } from "../services/implementations/RedisTokenService";
import AdminAuthService from "../services/implementations/AdminAuthService";
import AdminRepository from "../repositories/implementations/AdminRepository";
import UserAuthService from "../services/implementations/UserAuthService";
import UserRepository from "../repositories/implementations/UserRepository";
import OTPRepository from "../repositories/implementations/OTPRepository";

class DIContainer {
  private static _redisTokenService: RedisTokenService;
  private static _adminAuthService: AdminAuthService;
  private static _adminRepository: AdminRepository;
  private static _userAuthService: UserAuthService;
  private static _userRepository: UserRepository;
  private static _otpRepository: OTPRepository;

  public static getRedisTokenService(): RedisTokenService {
    if (!this._redisTokenService) {
      this._redisTokenService = new RedisTokenService();
    }
    return this._redisTokenService;
  }

  public static getAdminRepository(): AdminRepository {
    if (!this._adminRepository) {
      this._adminRepository = new AdminRepository();
    }
    return this._adminRepository;
  }

  public static getAdminAuthService(): AdminAuthService {
    if (!this._adminAuthService) {
      const redisTokenService = this.getRedisTokenService();
      const adminRepository = this.getAdminRepository();
      this._adminAuthService = new AdminAuthService(
        redisTokenService,
        adminRepository
      );
    }
    return this._adminAuthService;
  }

  public static getUserRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  public static getOTPRepository(): OTPRepository {
    if (!this._otpRepository) {
      this._otpRepository = new OTPRepository();
    }
    return this._otpRepository;
  }

  public static getUserAuthService(): UserAuthService {
    if (!this._userAuthService) {
      const redisTokenService = this.getRedisTokenService();
      const userRepository = this.getUserRepository();
      const otpRepository = this.getOTPRepository();
      this._userAuthService = new UserAuthService(
        redisTokenService,
        userRepository,
        otpRepository
      );
    }
    return this._userAuthService;
  }
}

export default DIContainer;
