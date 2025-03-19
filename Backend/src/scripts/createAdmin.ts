import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';

dotenv.config();

const AdminSchema = new Schema({
    adminName: {
        type: String,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    profilePicture: { type: String },
    role: {
        type: String,
        default: 'admin'
    },
    refreshToken: [{
        type: String
    }]
});

const Admin = mongoose.model('Admin', AdminSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/MentorOne');
        
        const adminData = {
            adminName: 'Admin',
            adminEmail: 'admin@mentorone.com',
            adminPassword: await bcrypt.hash('Admin@123', 10),
            role: 'admin'
        };

        const admin = await Admin.create(adminData);
        console.log('Admin created successfully:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
