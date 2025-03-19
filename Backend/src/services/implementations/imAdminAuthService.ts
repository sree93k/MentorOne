import bcrypt from 'bcryptjs'
import { IAdmin } from 'entities/adminEntity'
import { IAdminAuthService } from "../interface/inAdminAuthservice"
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
  } from "../../utils/jwt";
import { IAdminRepository } from '../../repositories/interface/adminRespository';
import AdminRepository from '../../repositories/implementations/adminRepository';
import { JwtPayload } from 'jsonwebtoken';

  export default class AdminAuthService implements IAdminAuthService{

    private AdminRepository: IAdminRepository

    constructor(){
        this.AdminRepository = new AdminRepository()
    }

    async login(user: IAdmin): Promise<{
        accessToken: string;
        refreshToken: string;
        adminFound: Omit<IAdmin, 'password'>; 
        role:string;
    } | null> {
        
        if (!user.adminEmail) {
            throw new Error("adminEmail is null or undefined");
        }
        let adminFound = await this.AdminRepository.findByUserId(user.adminEmail.toString());
    
        if (adminFound && user.adminPassword && (
            adminFound.adminPassword && await bcrypt.compare(user.adminPassword.toString(), adminFound.adminPassword.toString())
        )) {
            const id = adminFound._id?.toString();
            
            const accessToken = generateAccessToken({
                id,
                role: adminFound.role,
            });
    
            const refreshToken = generateRefreshToken({
                id,
                role: adminFound.role,
            });
    
            await this.AdminRepository.saveRefreshToken(id, refreshToken);
    
            const adminObject = adminFound.toObject();

            const { password, ...adminWithoutPassword } = adminObject;
    
            return { accessToken, refreshToken, adminFound: adminWithoutPassword, role: adminFound.role || 'defaultRole' };
        }
    
        return null;
    }

    async logout(token: string , id:string): Promise<IAdmin | null> {

        const admin = await this.AdminRepository.removeRefreshToken(id,token)
        
        return admin ? admin : null
    }

    async refreshAccessToken(userId:string): Promise <string| null> {
        
        const adminFound  = await this.AdminRepository.findById(userId)


        if(adminFound){
            const id = adminFound._id?.toString();
            
            const accessToken = generateAccessToken({
                id,
                role: adminFound.role,
            });

            return accessToken
        }



        return null
    }

    
    
  }