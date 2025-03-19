
import { IAdmin } from "../entities/adminEntity";
import mongoose,{Schema} from "mongoose";


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
    role: {
        type: String,
        default: 'admin'
    },
    adminPassword: {
        type: String,
        required: true
    },


    profilePicture: { type: String }

});  


const Admin = mongoose.model<IAdmin>('dmin', AdminSchema);

export default Admin;