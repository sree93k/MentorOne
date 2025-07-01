import { RedisTokenService } from "../services/implementations/RedisTokenService";
import AdminAuthService from "../services/implementations/AdminAuthService";
import AdminRepository from "../repositories/implementations/AdminRepository";

class DIContainer {
  private static _redisTokenService: RedisTokenService;
  private static _adminAuthService: AdminAuthService;
  private static _adminRepository: AdminRepository;

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
}

export default DIContainer;
