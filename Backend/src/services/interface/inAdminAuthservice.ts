import { IAdmin } from "../../entities/adminEntity";
import jwt, { JwtPayload } from 'jsonwebtoken';


export interface IAdminAuthService {
    login(user: Partial<IAdmin>): Promise<{ 
        accessToken: string; 
        refreshToken: string; 
        adminFound: Omit<IAdmin, 'password'>; 
        role:string;
    } | null>;

    logout(token:string , id: string) : Promise <IAdmin | null>;

    refreshAccessToken(user: string | jwt.JwtPayload) : Promise <string | null>;
}