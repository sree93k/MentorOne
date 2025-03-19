import { IAdmin } from "../../entities/adminEntity";

export interface IAdminRepository {


   saveRefreshToken(userId:string,refreshToken:string):Promise<IAdmin | null>;
   findById(userId: string): Promise<IAdmin | null>;
   removeRefreshToken(userId:string,refreshToken:string):Promise<IAdmin | null>;
   findByUserId(userId: string): Promise<IAdmin | null>;

}