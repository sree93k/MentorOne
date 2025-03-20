import bcrypt from 'bcryptjs'
import { EUsers } from '../../entities/userEntity'
import { inUserAuthService } from "../interface/inUserAuthService"
import { inUserRepository } from '../../repositories/interface/inUserRepository';
import imUserRepository from '../../repositories/implementations/imUserRepository';

export default class UserAuthService implements inUserAuthService {
    private UserRepository: inUserRepository

    constructor() {
        this.UserRepository = new imUserRepository()
    }

    async login(user: { email: string; password: string }): Promise<{
        userFound: Omit<EUsers, 'password'>; 
        role: string;
    } | null> {
        console.log("Service - Login attempt for email:", user.email);
        
        if (!user.email) {
            console.log("Service - Error: email is required");
            throw new Error("email is required");
        }

        const userFound = await this.UserRepository.findByEmail(user.email);
        console.log("Service - User found:", userFound ? "Yes" : "No");
    
        if (userFound && user.password && userFound.password) {
            console.log("Service - Comparing passwords");
            console.log("Service - Input password:", user.password);
            console.log("Service - Stored password hash:", userFound.password);
            
            const isPasswordValid = await bcrypt.compare(user.password, userFound.password);
            console.log("Service - Password valid:", isPasswordValid);
            
            if (isPasswordValid) {
                console.log("Service - Login successful");
                const userObject = userFound.toObject();
                const { password, ...userWithoutPassword } = userObject;
                return { 
                    userFound: userWithoutPassword, 
                    role: userFound.role || 'null' 
                };
            }
        }
    
        console.log("Service - Login failed");
        return null;
    }  
    
    
    async createUser(user: EUsers): Promise<EUsers | null> {
        try {
            const result = await this.UserRepository.createUser(user);
            return result;
        } catch (error) {
            console.log("error at UserAuthService", error);
            return null;
        }
    }
}
