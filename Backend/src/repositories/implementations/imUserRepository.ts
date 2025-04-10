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
      console.log("step repo user 2", newUser);
      const result = await newUser.save();
      console.log("step repo user 3", result);
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

  //findByEmail
  async findByEmail(email: string): Promise<EUsers | null> {
    console.log("Repository - Searching for user with email:", email);

    const user = await Users.findOne({ email })
      .populate("mentorId")
      .populate("menteeId")
      .populate("schoolDetails")
      .populate("collegeDetails")
      .populate("professionalDetails");

    // const user = await query.exec();
    console.log("Repository - Specific user found:", user);

    return user;
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
      console.log("step 1 repor changepassowrd email ", email);
      console.log("step 1 repor changepassowrd password ", password);
      // const allUsers = await Users.find();

      // console.log("all users data", allUsers);
      // console.log("all users above");

      const userExits = await Users.findOne({ email });
      console.log("user exisrts", userExits);

      const userAfterUpdate = await Users.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
      console.log("step 2 repor changepassowrd sucess", userAfterUpdate);
      console.log("step 3 repor changepassowrd sucess");
      return userAfterUpdate || null;
    } catch (error) {
      console.log("step 1 repor changepassowrd catch errro");
      return null;
    }
  }

  //save refresh token
  async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EUsers | null> {
    try {
      console.log(
        "repo save refreshtoken step 1 userId,refreshtoken",
        userId,
        refreshToken
      );

      const userWithSavedToken = await Users.findByIdAndUpdate(
        userId,
        { $push: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");
      console.log(
        "repo save refreshtoken step 2 userId,refreshtoken",
        userWithSavedToken
      );
      return userWithSavedToken;
    } catch (error) {
      console.log("refreshttoken save error at repo");

      return null;
    }
  }
  //remove refresh token
  async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EUsers | null> {
    try {
      console.log("reop removerefrsh token step 1", userId, refreshToken);

      const userWithRemovedToken = await Users.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");
      console.log("reop removerefrsh token step 1", userWithRemovedToken);
      return userWithRemovedToken;
    } catch (error) {
      console.log("reop removerefrsh token step 3 error", error);
      return null;
    }
  }
  //findbyId
  async findById(id: string): Promise<EUsers | null> {
    try {
      console.log("user repo step1", id);

      const user = await Users.findById(id)
        .select("-refreshToken")
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails");

      console.log("user repo step2@@@@@@@@@@@@@@@", user);
      return user;
    } catch (error) {
      return null;
    }
  }

  async updateUser(data: {
    id: string;
    userType: string;
    experienceId: string;
    menteeId: string;
  }): Promise<EUsers | null> {
    try {
      console.log("Repo updateUser step1");

      const { id, userType, experienceId, menteeId } = data;
      let updateData: any = { activated: true, menteeId: menteeId }; // Common fields

      console.log("Repo updateUser step2");
      // Fetch user (optional, for validation)
      const user = await Users.findById(id).select("-refreshToken");
      if (!user) {
        console.error("User not found for ID:", id);
        return null;
      }
      console.log("Repo updateUser step3");

      // Set type-specific fields
      if (userType === "fresher" || userType === "college") {
        // Adjusted to match frontend
        console.log("Repo updateUser step4 - college/fresher");
        updateData.collegeDetails = experienceId;
      } else if (userType === "school") {
        // Adjusted to match frontend
        console.log("Repo updateUser step4 - school");
        updateData.schoolDetails = experienceId;
      } else if (userType === "professional") {
        console.log("Repo updateUser step5 - professional");
        updateData.professionalDetails = experienceId;
      } else {
        console.error("Invalid userType:", userType);
        return null; // Or throw an error if invalid userType is unacceptable
      }

      console.log("Repo updateUser step6 - updating user with:", updateData);
      // Perform a single update with all changes
      const userAfterUpdate = await Users.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true } // Return the updated document
      )
        .select("-refreshToken")
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails"); // Exclude refreshToken from the result

      console.log("Repo updateUser step7 - userAfterUpdate:", userAfterUpdate);

      if (!userAfterUpdate) {
        console.error("Failed to update user for ID:", id);
        return null;
      }

      console.log("User updated at repo...>>>>>>>>>>>>>>>", userAfterUpdate);
      return userAfterUpdate; // Return the updated user with activated: true
    } catch (error) {
      console.error("Error in updateUser:", error);
      return null;
    }
  }

  async mentorUpdate(data: {
    id: string;
    userType: string;
    experienceId: string;
    mentorId: string;
    imageUrl: string;
  }): Promise<EUsers | null> {
    try {
      const { id, userType, experienceId, imageUrl, mentorId } = data;
      console.log(
        "Repo updateUser step1",
        id,
        userType,
        experienceId,
        mentorId,
        imageUrl
      );
      let updateData: any = {
        mentorActivated: true,
        imageUrl: imageUrl,
        mentorId: mentorId,
      }; // Common fields

      console.log("Repo updateUser step2", updateData);
      // Fetch user (optional, for validation)
      const user = await Users.findById(id).select("-refreshToken");
      if (!user) {
        console.error("User not found for ID:", id);
        return null;
      }
      console.log("Repo updateUser step3", user);

      // Set type-specific fields
      if (userType === "fresher" || userType === "college") {
        // Adjusted to match frontend
        console.log("Repo updateUser step4 - college/fresher");
        updateData.collegeDetails = experienceId;
      } else if (userType === "school") {
        // Adjusted to match frontend
        console.log("Repo updateUser step4 - school");
        updateData.schoolDetails = experienceId;
      } else if (userType === "professional") {
        console.log("Repo updateUser step5 - professional");
        updateData.professionalDetails = experienceId;
      } else {
        console.error("Invalid userType:", userType);
        return null; // Or throw an error if invalid userType is unacceptable
      }

      console.log("Repo updateUser step6 - updating user with:", updateData);
      // Perform a single update with all changes
      const userAfterUpdate = await Users.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true } // Return the updated document
      ).select("-refreshToken"); // Exclude refreshToken from the result

      console.log("Repo updateUser step7 - userAfterUpdate:", userAfterUpdate);

      if (!userAfterUpdate) {
        console.error("Failed to update user for ID:", id);
        return null;
      }

      console.log("User updated at repo...>>>>>>>>>>>>>>>", userAfterUpdate);
      return userAfterUpdate; // Return the updated user with activated: true
    } catch (error) {
      console.error("Error in updateUser:", error);
      return null;
    }
  }
}
