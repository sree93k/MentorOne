// import { EAdmin } from "../../entities/adminEntity";

// export interface IAdminRepository {
//   findUserById(userId: string): Promise<EAdmin | null>;
//   findByEmail(adminEmail: string): Promise<EAdmin | null>;
//   removeRefreshToken(
//     userId: string,
//     refreshToken: string
//   ): Promise<EAdmin | null>;
//   saveRefreshToken(
//     userId: string,
//     refreshToken: string
//   ): Promise<EAdmin | null>;
//   findById(id: string): Promise<EAdmin | null>;
// }
// src/repositories/interface/IAdminRepository.ts
import { EAdmin } from "../../entities/adminEntity";

export interface IAdminRepository {
  findUserById(userId: string): Promise<EAdmin | null>;
  findByEmail(adminEmail: string): Promise<EAdmin | null>;
  findById(id: string): Promise<EAdmin | null>;
}
