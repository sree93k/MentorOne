import { error } from "console";

import { EUsers } from "../../entities/userEntity";
import Users from "../../models/userModel";
import { inUserRepository } from "../interface/inUserRepository";
import mongoose from "mongoose";
import { ApiError } from "../../middlewares/errorHandler"; // Adjust the import path as necessary
import { log } from "winston";

export default class UserRepository implements inUserRepository {
  //create user
  async createUser(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("create user repo start 1");

      const isUserExists = await Users.findOne({ email: user.email });
      console.log("create user repo start 2");
      if (isUserExists) {
        throw new ApiError(400, "Account already exists!");
      }
      console.log("repo started>>>>>>>>>>>>>");
      console.log("step repo user 1 is user: ", user);

      const newUser = new Users(user);
      console.log("step repo user 2");
      const result = await newUser.save();
      console.log("step repo user 3");
      const registeredUser = await Users.findById(result?._id).select(
        "-password -refreshToken"
      );
      console.log("step repo user 4");
      return registeredUser;
    } catch (error) {
      console.error("Repository - Error in Creating User Account:", error);
      return null;
    }
  }

  //save refresh token
  async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EUsers | null> {
    try {
      const userWithSavedToken = await Users.findByIdAndUpdate(
        userId,
        { $push: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");
      return userWithSavedToken;
    } catch (error) {
      return null;
    }
  }
  //findByEmail
  async findByEmail(email: string): Promise<EUsers | null> {
    try {
      console.log("Repository - Searching for user with email:", email);

      // Check database connection
      console.log(
        "Repository - Database connection state:",
        mongoose.connection.readyState
      );
      console.log(
        "Repository - Database name:",
        mongoose.connection.db?.databaseName
      );

      const user = await Users.findOne({ email });
      console.log("Repository - Specific user found:", user);

      return user;
    } catch (error) {
      console.error("Repository - Error finding user:", error);
      throw error;
    }
  }

  async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("google sign in user step 1 user", user);

      // const isUserExists = await Users.findOne({ email: user.email });
      // console.log("google sign in user step 2");
      // if (isUserExists) {
      //   return isUserExists;
      // }
      // console.log("google sign in user step 3 userexists", isUserExists);
      const newUser = new Users(user);
      console.log("google sign in user step 4", newUser);
      const userData = await newUser.save();
      console.log("google sign in user step 5", userData);
      return userData;
    } catch (error) {
      console.log("user repo google signup error", error);

      return null;
    }
  }

  async changePassword(
    email: string,
    password: string
  ): Promise<EUsers | null> {
    try {
      console.log("step 1 repor changepassowrd email ",email);
      console.log("step 1 repor changepassowrd password ",password);
      const allUsers=await Users.find()

      console.log("all users data",allUsers);
      console.log("all users above");
      
      
      const userExits=await Users.findOne({email})
      console.log("user exisrts",userExits);
      
      
      const userAfterUpdate = await Users.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
      console.log("step 2 repor changepassowrd sucess",userAfterUpdate);
      console.log("step 3 repor changepassowrd sucess");
      return userAfterUpdate;
    } catch (error) {
      console.log("step 1 repor changepassowrd catch errro");
      return null;
    }
  }
  async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EUsers | null> {
    try {
      const userWithRemovedToken = await Users.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");

      return userWithRemovedToken;
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<EUsers | null> {
    try {
      const user = await Users.findById(id).select("-refreshToken");

      return user;
    } catch (error) {
      return null;
    }
  }
}
