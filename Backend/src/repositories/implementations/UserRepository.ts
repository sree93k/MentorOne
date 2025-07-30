import { EUsers } from "../../entities/userEntity";
import Users from "../../models/userModel";
import { IUserRepository } from "../interface/IUserRepository";
import mongoose from "mongoose";
import BaseRepository from "./BaseRepository";
import Service from "../../models/serviceModel";

export default class UserRepository
  extends BaseRepository<EUsers>
  implements IUserRepository
{
  constructor() {
    super(Users);
  }

  async createUser(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("create user repo start 1");

      const isUserExists = await Users.findOne({ email: user.email });
      console.log("create user repo start 2");
      if (isUserExists) {
        throw new Error("Account already exists!");
      }
      console.log("repo started>>>>>>>>>>>>>");
      console.log("step repo user 1 is user: ", user);

      const newUser = new Users(user);
      console.log("step repo user 2", newUser);
      const result = await newUser.save();
      console.log("step repo user 3", result);

      // ✅ CHANGED: Remove refreshToken from select (no longer stored in MongoDB)
      const registeredUser = await Users.findById(result?._id).select(
        "-password"
      );
      console.log("step repo user 4");
      return registeredUser;
    } catch (error) {
      console.error("Repository - Error in Creating User Account:", error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<EUsers | null> {
    console.log("Repository - Searching for user with email:", email);

    const user = await Users.findOne({ email })
      .populate("mentorId")
      .populate("menteeId")
      .populate("schoolDetails")
      .populate("collegeDetails")
      .populate("professionalDetails");

    console.log("Repository - Specific user found:", user);
    return user;
  }

  async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      console.log("google sign in user step 1 user", user);

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
      console.log("step 1 repo changepassword email ", email);
      console.log("step 1 repo changepassword password ", password);

      const userExists = await Users.findOne({ email });
      console.log("user exists", userExists);

      const userAfterUpdate = await Users.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
      console.log("step 2 repo changepassword success", userAfterUpdate);
      console.log("step 3 repo changepassword success");
      return userAfterUpdate || null;
    } catch (error) {
      console.log("step 1 repo changepassword catch error");
      return null;
    }
  }

  // ✅ REMOVED: saveRefreshToken method (no longer storing in MongoDB)
  // ✅ REMOVED: removeRefreshToken method (no longer storing in MongoDB)

  async findById(id: string): Promise<EUsers | null> {
    try {
      console.log("user repo step1", id);

      // ✅ CHANGED: Remove refreshToken from select (no longer stored in MongoDB)
      const user = await Users.findById(id)
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
    role: string[];
  }): Promise<EUsers | null> {
    try {
      console.log("Repo updateUser step1");

      const { id, userType, experienceId, menteeId, role } = data;
      let updateData: any = { activated: true, menteeId: menteeId, role: role };

      console.log("Repo updateUser step2");
      // ✅ CHANGED: Remove refreshToken from select
      const user = await Users.findById(id);
      if (!user) {
        console.error("User not found for ID:", id);
        return null;
      }
      console.log("Repo updateUser step3");

      // Set type-specific fields
      if (userType === "fresher" || userType === "college") {
        console.log("Repo updateUser step4 - college/fresher");
        updateData.collegeDetails = experienceId;
      } else if (userType === "school") {
        console.log("Repo updateUser step4 - school");
        updateData.schoolDetails = experienceId;
      } else if (userType === "professional") {
        console.log("Repo updateUser step5 - professional");
        updateData.professionalDetails = experienceId;
      } else {
        console.error("Invalid userType:", userType);
        return null;
      }

      console.log("Repo updateUser step6 - updating user with:", updateData);
      const userAfterUpdate = await Users.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true }
      )
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails");

      console.log("Repo updateUser step7 - userAfterUpdate:", userAfterUpdate);

      if (!userAfterUpdate) {
        console.error("Failed to update user for ID:", id);
        return null;
      }

      console.log("User updated at repo...>>>>>>>>>>>>>>>", userAfterUpdate);
      return userAfterUpdate;
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
    profilePicture: string;
    role: string[];
  }): Promise<EUsers | null> {
    try {
      const { id, userType, experienceId, profilePicture, mentorId, role } =
        data;
      console.log(
        "Repo updateUser step1",
        id,
        userType,
        experienceId,
        mentorId,
        profilePicture
      );

      let updateData: any = {
        mentorActivated: true,
        profilePicture: profilePicture,
        mentorId: mentorId,
        role: role,
      };

      console.log("Repo updateUser step2", updateData);
      // ✅ CHANGED: Remove refreshToken from select
      const user = await Users.findById(id);
      if (!user) {
        console.error("User not found for ID:", id);
        return null;
      }
      console.log("Repo updateUser step3", user);

      // Set type-specific fields
      if (userType === "fresher" || userType === "college") {
        console.log("Repo updateUser step4 - college/fresher");
        updateData.collegeDetails = experienceId;
      } else if (userType === "school") {
        console.log("Repo updateUser step4 - school");
        updateData.schoolDetails = experienceId;
      } else if (userType === "professional") {
        console.log("Repo updateUser step5 - professional");
        updateData.professionalDetails = experienceId;
      } else {
        console.error("Invalid userType:", userType);
        return null;
      }

      console.log("Repo updateUser step6 - updating user with:", updateData);
      const userAfterUpdate = await Users.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true }
      );

      console.log("Repo updateUser step7 - userAfterUpdate:", userAfterUpdate);

      if (!userAfterUpdate) {
        console.error("Failed to update user for ID:", id);
        return null;
      }

      console.log("User updated at repo...>>>>>>>>>>>>>>>", userAfterUpdate);
      return userAfterUpdate;
    } catch (error) {
      console.error("Error in updateUser:", error);
      return null;
    }
  }

  // ✅ REST OF THE METHODS REMAIN THE SAME - just removing refreshToken references where needed

  async getAllMentors(
    role?: string,
    page: number = 1,
    limit: number = 12,
    searchQuery?: string
  ): Promise<EUsers[]> {
    try {
      console.log("getAllMentors repo step 1", {
        role,
        page,
        limit,
        searchQuery,
      });

      const query: any = {
        mentorId: { $exists: true, $ne: null },
      };

      if (role && role.toLowerCase() !== "all") {
        if (role === "School Student") {
          query.schoolDetails = { $exists: true, $ne: null };
        } else if (role === "College Student") {
          query.collegeDetails = { $exists: true, $ne: null };
        } else if (role === "Professional") {
          query.professionalDetails = { $exists: true, $ne: null };
        }
      }

      if (searchQuery) {
        query.$or = [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { bio: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const mentors = await Users.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "mentorId",
          select: "bio skills isApproved",
        })
        .populate({
          path: "schoolDetails",
          select: "schoolName city class",
        })
        .populate({
          path: "collegeDetails",
          select: "collegeName city course specializedIn",
        })
        .populate({
          path: "professionalDetails",
          select: "company jobRole city",
        })
        .lean();

      console.log("getAllMentors repo step 2: Found mentors", mentors.length);

      return mentors.map((mentor) => {
        let mappedRole = "N/A";
        let work = "N/A";
        let badge = "N/A";
        let workRole = "N/A";

        if (mentor.professionalDetails) {
          mappedRole = "Professional";
          work = mentor.professionalDetails.company || "Unknown";
          badge = mentor.professionalDetails.jobRole || "N/A";
          workRole = mentor.professionalDetails.jobRole || "Professional";
        } else if (mentor.collegeDetails) {
          mappedRole = "College Student";
          work = mentor.collegeDetails.collegeName || "Unknown";
          badge = mentor.collegeDetails.course || "N/A";
          workRole = mentor.collegeDetails.specializedIn || "N/A";
        } else if (mentor.schoolDetails) {
          mappedRole = "School Student";
          work = mentor.schoolDetails.schoolName || "Unknown";
          badge = mentor.schoolDetails.schoolName || "N/A";
          workRole = mentor.schoolDetails.class
            ? String(mentor.schoolDetails.class)
            : "N/A";
        }

        return {
          userId: mentor?._id?.toString(),
          mentorId: mentor.mentorId?._id?.toString(),
          name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
          bio: mentor.mentorId?.bio,
          role: mappedRole,
          work,
          workRole,
          profileImage: mentor.profilePicture || undefined,
          badge,
          isBlocked: mentor.isBlocked,
          isApproved:
            mentor.mentorId && "isApproved" in mentor.mentorId
              ? mentor.mentorId.isApproved
              : "Pending",
        };
      });
    } catch (error: any) {
      console.error("getAllMentors repo step 3: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to fetch mentors: ${error.message}`);
    }
  }

  // ✅ ALL OTHER METHODS REMAIN THE SAME
  // (continuing with existing methods but removing refreshToken references)

  async countMentors(role?: string, searchQuery?: string): Promise<number> {
    try {
      const query: any = {
        mentorId: { $exists: true, $ne: null },
      };

      if (role && role.toLowerCase() !== "all") {
        query.role = { $regex: `^${role}$`, $options: "i" };
      }

      if (searchQuery) {
        query.$or = [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { bio: { $regex: searchQuery, $options: "i" } },
        ];
      }

      return await Users.countDocuments(query);
    } catch (error: any) {
      console.error("countMentors repo error", { message: error.message });
      throw new Error(`Failed to count mentors: ${error.message}`);
    }
  }

  async getMentorById(mentorId: string): Promise<EUsers> {
    try {
      console.log("getMentorById repo step 1", mentorId);
      const mentor = await Users.findOne({
        _id: mentorId,
        mentorId: { $exists: true, $ne: null },
      })
        .populate({
          path: "mentorId",
          select:
            "bio skills isApproved topTestimonials portfolio linkedinURL featuredArticle youtubeURL",
          populate: {
            path: "topTestimonials",
            model: "Testimonial",
            select:
              "_id menteeId mentorId serviceId bookingId comment rating createdAt updatedAt",
            populate: [
              {
                path: "menteeId",
                model: "Users",
                select: "firstName lastName",
              },
              {
                path: "serviceId",
                model: "Service",
                select: "title type",
              },
            ],
          },
        })
        .populate({
          path: "schoolDetails",
          select: "schoolName city class",
        })
        .populate({
          path: "collegeDetails",
          select: "collegeName city course specializedIn",
        })
        .populate({
          path: "professionalDetails",
          select: "company jobRole city",
        })
        .lean();

      if (!mentor) {
        console.log("getMentorById repo step 2: Mentor not found");
        throw new Error("Mentor not found");
      }

      const services = await Service.find({
        mentorId: mentor._id,
        $or: [
          {
            type: "1-1Call",
            slot: { $exists: true, $ne: null },
          },
          {
            type: { $in: ["DigitalProducts", "priorityDM"] },
          },
        ],
      }).lean();

      console.log("getMentorById repo step 2.5", mentor);
      console.log("getMentorById repo step 3: Found services", services);

      let role = "N/A";
      let work = "N/A";
      let badge = "N/A";
      let workRole = "N/A";
      let education: EUsers["education"] = {};
      let workExperience: EUsers["workExperience"] = undefined;

      if (mentor.professionalDetails) {
        console.log("professionalDetails");
        role = "Professional";
        work = mentor.professionalDetails.company || "Unknown";
        badge = mentor.professionalDetails.company || "N/A";
        workRole = mentor.professionalDetails.jobRole || "Professional";
        workExperience = {
          company: mentor.professionalDetails.company || "Unknown",
          jobRole: mentor.professionalDetails.jobRole || "Professional",
          city: mentor.professionalDetails.city,
        };
      } else if (mentor.collegeDetails) {
        console.log("collegeDetails");
        role = "College Student";
        work = mentor.collegeDetails.collegeName || "Unknown";
        badge = mentor.collegeDetails.course || "N/A";
        workRole = mentor.collegeDetails.specializedIn || "N/A";
        education.collegeName = mentor.collegeDetails.collegeName;
        education.city = mentor.collegeDetails.city;
      } else if (mentor.schoolDetails) {
        console.log("schoolDetails");
        role = "School Student";
        work = mentor.schoolDetails.schoolName || "Unknown";
        badge = mentor.schoolDetails.schoolName || "N/A";
        workRole = mentor.schoolDetails.class
          ? String(mentor.schoolDetails.class)
          : "N/A";
        education.schoolName = mentor.schoolDetails.schoolName;
        education.city = mentor.schoolDetails.city;
      }

      console.log("the user data in repo is 1 ", mentor);
      console.log("the user data in repo is 2", services);

      return {
        userData: mentor?._id?.toString(),
        mentorData: mentor.mentorId?._id?.toString() || mentor?._id?.toString(),
        name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
        role,
        work,
        workRole,
        topTestimonials: mentor.mentorId?.topTestimonials || [],
        profileImage: mentor.profilePicture || undefined,
        badge,
        isBlocked: mentor.isBlocked || false,
        isApproved:
          mentor.mentorId && "isApproved" in mentor.mentorId
            ? mentor.mentorId.isApproved
            : "Pending",
        bio: mentor.mentorId?.bio || "No bio available",
        skills: mentor.mentorId?.skills || [],
        services: services,
        education: Object.keys(education).length ? education : undefined,
        workExperience,
        linkedinURL: mentor?.mentorId?.linkedinURL,
        portfolio: mentor?.mentorId?.portfolio,
        featuredArticle: mentor?.mentorId?.featuredArticle,
        youtubeURL: mentor?.mentorId?.youtubeURL,
      };
    } catch (error: any) {
      console.error("getMentorById repo step 5: Error", {
        message: error.message,
        stack: error.stack,
      });
      throw error instanceof Error
        ? error
        : new Error(`Failed to fetch mentor: ${error.message}`);
    }
  }

  async updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void> {
    try {
      const modelName = role === "mentor" ? "Mentor" : "Mentee";
      await mongoose.model(modelName).findByIdAndUpdate(userId, { isOnline });
    } catch (error: any) {
      throw new Error("Failed to update online status", error.message);
    }
  }

  async findUsersByNameOrEmail(searchQuery: string): Promise<any[]> {
    return await Users.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("_id")
      .exec();
  }

  async getTopMentors(limit: number): Promise<EUsers[]> {
    try {
      console.log("UserRepository getTopMentors step 1", { limit });
      const mentors = await Users.aggregate([
        {
          $match: {
            role: { $in: ["mentor"] },
            isBlocked: false,
            isApproved: "Approved",
          },
        },
        {
          $lookup: {
            from: "Booking",
            localField: "_id",
            foreignField: "mentorId",
            as: "bookings",
          },
        },
        {
          $lookup: {
            from: "Testimonial",
            localField: "_id",
            foreignField: "mentorId",
            as: "testimonials",
          },
        },
        {
          $lookup: {
            from: "Mentor",
            localField: "mentorId",
            foreignField: "_id",
            as: "mentorDetails",
          },
        },
        {
          $unwind: "$mentorDetails",
        },
        {
          $addFields: {
            bookingCount: { $size: "$bookings" },
            averageRating: { $avg: "$testimonials.rating" },
          },
        },
        {
          $match: {
            bookingCount: { $gt: 0 },
          },
        },
        {
          $sort: {
            bookingCount: -1,
            averageRating: -1,
          },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            mentorId: 1,
            bio: "$mentorDetails.bio",
            skills: "$mentorDetails.skills",
            bookingCount: 1,
            averageRating: 1,
            isBlocked: 1,
            isApproved: 1,
            bookings: 1,
            mentorDetails: 1,
          },
        },
      ]).exec();
      console.log("UserRepository getTopMentors step 2", mentors.length);
      return mentors;
    } catch (error: any) {
      console.error("UserRepository getTopMentors error", error);
      throw new Error("Failed to fetch top mentors", error.message);
    }
  }

  async findByField<K extends keyof EUsers>(
    field: K,
    value: string
  ): Promise<EUsers[] | null> {
    try {
      const query = { [field]: value } as any;
      const users = await Users.find(query)
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails")
        .exec();

      return users.length > 0 ? users : null;
    } catch (error) {
      console.error("Error in findByField:", error);
      return null;
    }
  }

  async update(id: string, data: Partial<EUsers>): Promise<EUsers | null> {
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      )
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails")
        .exec();

      return updatedUser;
    } catch (error) {
      console.error("Error in update:", error);
      return null;
    }
  }

  async updateField(
    id: string,
    field: keyof EUsers,
    value: any
  ): Promise<EUsers | null> {
    try {
      console.log("UserRepository updateField:", id, field, value);

      const updateData = { [field]: value };
      const updatedUser = await Users.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails")
        .exec();

      return updatedUser;
    } catch (error) {
      console.error("Error in updateField:", error);
      return null;
    }
  }

  async countAllUsers(query: any = {}): Promise<number> {
    try {
      return await Users.countDocuments(query);
    } catch (error) {
      console.error("Error in countAllUsers:", error);
      return 0;
    }
  }

  async countUsersByRole(role: string): Promise<number> {
    try {
      let query: any = {};

      if (role === "mentee") {
        query.role = { $eq: ["mentee"] };
      } else if (role === "mentor") {
        query.role = { $eq: ["mentor"] };
      } else if (role === "both") {
        query.role = { $all: ["mentor", "mentee"] };
      }

      return await Users.countDocuments(query);
    } catch (error) {
      console.error("Error in countUsersByRole:", error);
      return 0;
    }
  }

  async getAllUsersWithPagination(
    query: any = {},
    page: number = 1,
    limit: number = 10
  ): Promise<EUsers[]> {
    try {
      return await Users.find(query)
        .populate("mentorId")
        .populate("menteeId")
        .populate("schoolDetails")
        .populate("collegeDetails")
        .populate("professionalDetails")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error("Error in getAllUsersWithPagination:", error);
      return [];
    }
  }
}
