import { EUsers } from "../../entities/userEntity";
import { IUserRepository } from "../interface/IUserRepository";
import Users from "../../models/userModel";
import mongoose from "mongoose";

export default class UserRepository implements IUserRepository {
  async createUser(user: EUsers): Promise<EUsers | null> {
    try {
      console.log("UserRepository - createUser:", user);
      const createdUser = await Users.create(user);
      console.log("UserRepository - User created successfully");
      return createdUser;
    } catch (error) {
      console.error("UserRepository - createUser error:", error);
      throw error;
    }
  }

  // REMOVED: saveRefreshToken and removeRefreshToken methods - now handled by Redis

  async findByEmail(email: string): Promise<EUsers | null> {
    try {
      console.log("Repository - Searching for user with email:", email);
      const user = await Users.findOne({ email }).select("+password");
      console.log("Repository - Specific user found:", user ? "Yes" : "No");
      return user;
    } catch (error) {
      console.error("Repository - findByEmail error:", error);
      throw error;
    }
  }

  async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("UserRepository - googleSignUp:", user);
      const newUser = await Users.create(user);
      console.log("UserRepository - Google signup successful");
      return newUser;
    } catch (error) {
      console.error("UserRepository - googleSignUp error:", error);
      throw error;
    }
  }

  async changePassword(
    email: string,
    password: string
  ): Promise<EUsers | null> {
    try {
      console.log("UserRepository - changePassword for email:", email);
      const updatedUser = await Users.findOneAndUpdate(
        { email },
        { password },
        { new: true }
      ).select("-password");
      console.log("UserRepository - Password changed successfully");
      return updatedUser;
    } catch (error) {
      console.error("UserRepository - changePassword error:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<EUsers | null> {
    try {
      console.log("UserRepository - findById:", id);
      const user = await Users.findById(id).select("-password");
      console.log("UserRepository - User found by ID:", user ? "Yes" : "No");
      return user;
    } catch (error) {
      console.error("UserRepository - findById error:", error);
      throw error;
    }
  }

  async updateUser(data: {
    id: string;
    userType: string;
    experienceId: string;
    menteeId: string;
    role: string[];
  }): Promise<EUsers | null> {
    try {
      console.log("UserRepository - updateUser:", data);
      const updatedUser = await Users.findByIdAndUpdate(
        data.id,
        {
          category: data.userType,
          [`${data.userType}Details`]: data.experienceId,
          menteeId: data.menteeId,
          role: data.role,
          activated: true,
        },
        { new: true }
      ).populate("menteeId");
      console.log("UserRepository - User updated successfully");
      return updatedUser;
    } catch (error) {
      console.error("UserRepository - updateUser error:", error);
      throw error;
    }
  }

  async mentorUpdate(data: {
    id: string;
    userType: string;
    experienceId: string;
    mentorId: string;
    profilePicture: string;
    role: string[];
  }): Promise<EUsers | null> {
    try {
      console.log("UserRepository - mentorUpdate:", data);
      const updatedUser = await Users.findByIdAndUpdate(
        data.id,
        {
          category: data.userType,
          [`${data.userType}Details`]: data.experienceId,
          mentorId: data.mentorId,
          profilePicture: data.profilePicture,
          role: data.role,
          activated: true,
          mentorActivated: true,
        },
        { new: true }
      )
        .populate("menteeId")
        .populate("mentorId");
      console.log("UserRepository - Mentor updated successfully");
      return updatedUser;
    } catch (error) {
      console.error("UserRepository - mentorUpdate error:", error);
      throw error;
    }
  }

  async getAllMentors(
    role?: string,
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<EUsers[]> {
    try {
      console.log("UserRepository - getAllMentors:", {
        role,
        page,
        limit,
        searchQuery,
      });
      const skip = page && limit ? (page - 1) * limit : 0;
      const query: any = {
        role: { $in: ["mentor"] },
        mentorActivated: true,
        isBlocked: false,
      };

      if (searchQuery) {
        query.$or = [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { skills: { $in: [new RegExp(searchQuery, "i")] } },
        ];
      }

      const mentors = await Users.find(query)
        .populate("mentorId")
        .skip(skip)
        .limit(limit || 12);

      console.log("UserRepository - Mentors fetched:", mentors.length);
      return mentors;
    } catch (error) {
      console.error("UserRepository - getAllMentors error:", error);
      throw error;
    }
  }

  async countMentors(role?: string, searchQuery?: string): Promise<number> {
    try {
      const query: any = {
        role: { $in: ["mentor"] },
        mentorActivated: true,
        isBlocked: false,
      };

      if (searchQuery) {
        query.$or = [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { skills: { $in: [new RegExp(searchQuery, "i")] } },
        ];
      }

      const count = await Users.countDocuments(query);
      console.log("UserRepository - Mentor count:", count);
      return count;
    } catch (error) {
      console.error("UserRepository - countMentors error:", error);
      throw error;
    }
  }

  async getMentorById(mentorId: string): Promise<EUsers> {
    try {
      console.log("UserRepository - getMentorById:", mentorId);
      const mentor = await Users.findById(mentorId)
        .populate("mentorId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails");

      if (!mentor) {
        throw new Error("Mentor not found");
      }
      console.log("UserRepository - Mentor found by ID");
      return mentor;
    } catch (error) {
      console.error("UserRepository - getMentorById error:", error);
      throw error;
    }
  }

  async updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void> {
    try {
      console.log("UserRepository - updateOnlineStatus:", {
        userId,
        role,
        isOnline,
      });
      await Users.findByIdAndUpdate(userId, {
        "isOnline.status": isOnline,
        "isOnline.role": isOnline ? role : null,
      });
      console.log("UserRepository - Online status updated successfully");
    } catch (error) {
      console.error("UserRepository - updateOnlineStatus error:", error);
      throw error;
    }
  }

  async findUsersByNameOrEmail(searchQuery: string): Promise<any[]> {
    try {
      console.log("UserRepository - findUsersByNameOrEmail:", searchQuery);
      const users = await Users.find({
        $or: [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }).select("firstName lastName email profilePicture");

      console.log("UserRepository - Users found by search:", users.length);
      return users;
    } catch (error) {
      console.error("UserRepository - findUsersByNameOrEmail error:", error);
      throw error;
    }
  }

  async getTopMentors(limit: number): Promise<EUsers[]> {
    try {
      console.log("UserRepository - getTopMentors:", limit);
      const topMentors = await Users.find({
        role: { $in: ["mentor"] },
        mentorActivated: true,
        isBlocked: false,
      })
        .populate("mentorId")
        .sort({ createdAt: -1 })
        .limit(limit);

      console.log("UserRepository - Top mentors fetched:", topMentors.length);
      return topMentors;
    } catch (error) {
      console.error("UserRepository - getTopMentors error:", error);
      throw error;
    }
  }
}
