import { error } from "console";
import { EUsers } from "../../entities/userEntity";
import Users from "../../models/userModel";
import { inUserRepository } from "../interface/inUserRepository";
import mongoose from "mongoose";
import { ApiError } from "../../middlewares/errorHandler"; // Adjust the import path as necessary

export default class UserRepository implements inUserRepository {
    async findByEmail(email: string): Promise<EUsers | null> {
        try {
            console.log("Repository - Searching for user with email:", email);
            
            // Check database connection
            console.log("Repository - Database connection state:", mongoose.connection.readyState);
            console.log("Repository - Database name:", mongoose.connection.db?.databaseName);
            

                   // Try to find the all users
                   const allUsers = await Users.findOne({ email });
                   console.log("Repository - All user found:", allUsers);
            
            // Try to find the specific user
            const user = await Users.findOne({ email });
            console.log("Repository - Specific user found:", user);
            
            if (user) {
                console.log("Repository - user details:", {
                    email: user.email,
                    role: user.role,
                    hasPassword: !!user.password
                });
            }
            
            return user;
        } catch (error) {
            console.error("Repository - Error finding user:", error);
            throw error;
        }
    }



    async createUser(user: EUsers): Promise<EUsers | null> {
        try {
            const existingUser = await Users.findOne({ email: user.email });
            if (existingUser) {
                throw new ApiError(400, "Account already exists!", "Please Try To Login!");
            }

            const newUser = new Users(user);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Repository - Error in Creating User Account:", error);
            throw error;
        }
    }
}