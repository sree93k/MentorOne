import { EUsers } from "../../entities/userEntity";

export interface inUserRepository {
   findByEmail(email:string):Promise<EUsers | null>
   createUser(user:EUsers):Promise<EUsers | null> 
}
