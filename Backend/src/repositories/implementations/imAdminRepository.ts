import { EAdmin } from "../../entities/adminEntity";
import Admin from "../../models/adminModel";
import { IAdminRepository } from "../interface/inAdminRespository";
import mongoose from "mongoose";

export default class AdminRepository implements IAdminRepository {
    async findByEmail(adminEmail: string): Promise<EAdmin | null> {
        try {
            console.log("Repository - Searching for admin with email:", adminEmail);
            
            // Check database connection
            console.log("Repository - Database connection state:", mongoose.connection.readyState);
            console.log("Repository - Database name:", mongoose.connection.db?.databaseName);
            
    
            
            // Try to find all admins using the model
            const allAdmin = await Admin.find();
            console.log("Repository - Model find result:", allAdmin);
            
            // Try to find the specific admin
            const admin = await Admin.findOne({ adminEmail });
            console.log("Repository - Specific admin found:", admin);
            
            if (admin) {
                console.log("Repository - Admin details:", {
                    email: admin.adminEmail,
                    role: admin.role,
                    hasPassword: !!admin.adminPassword
                });
            }
            
            return admin;
        } catch (error) {
            console.error("Repository - Error finding admin:", error);
            throw error;
        }
    }
}