import { EUsers } from "../../entities/userEntity";

export interface inUserAuthService {
    login(user: { email: string; password: string }): Promise<{ 
        userFound: Omit<EUsers, 'password'>; 
        role: string;
    } | null>;

    createUser(user:EUsers):Promise<EUsers| null>
}