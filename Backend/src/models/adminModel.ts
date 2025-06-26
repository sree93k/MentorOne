import { EAdmin } from "../entities/adminEntity";
import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    adminName: {
      type: String,
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: [String],
      default: ["admin"],
    },
    adminPassword: {
      type: String,
      required: true,
    },

    profilePicture: { type: String },
  },
  {
    collection: "Admin",
  }
);

const Admin = mongoose.model<EAdmin>("Admin", AdminSchema);

export default Admin;
