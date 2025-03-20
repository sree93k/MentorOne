import { EUsers } from "../entities/userEntity";
import mongoose, {  Schema } from "mongoose";

// Define the schema
const UsersSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { 
    type: String, 
    enum: ["male", "female"], // Restrict gender to "male" or "female"
    required: true 
  },
  role: { 
    type: [String], // Array of strings
    enum: ["mentee", "mentor"], // Restrict values to "mentee" or "mentor"
    validate: {
      validator: (value: string[]) => value.length <= 2, // Max length of 2
    },
    default: ["mentee"] // Default role
  },
  profilePicture: { 
    type: String,
    default: function (this: any) {
      // Set default profile picture based on gender
      return this.gender === "male"
        ? "https://www.svgrepo.com/show/192247/man-user.svg"
        : "https://www.svgrepo.com/show/384671/account-avatar-profile-user-14.svg";
    }
  },
  refreshToken: { type: [String], default: [] }, // Array of strings for refresh tokens
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now } // Use Date.now for dynamic default
}, {
  collection: 'Users' // Explicitly specify the collection name
});

// Create the model
const Users = mongoose.model<EUsers>("Users", UsersSchema);

export default Users;