// import { EUsers } from "../../entities/userEntity";
// import { IUserRepository } from "../interface/IUserRepository";
// import Users from "../../models/userModel";
// import mongoose from "mongoose";

// export default class UserRepository implements IUserRepository {
//   async createUser(user: EUsers): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - createUser:", user);
//       const createdUser = await Users.create(user);
//       console.log("UserRepository - User created successfully");
//       return createdUser;
//     } catch (error) {
//       console.error("UserRepository - createUser error:", error);
//       throw error;
//     }
//   }

//   // REMOVED: saveRefreshToken and removeRefreshToken methods - now handled by Redis

//   async findByEmail(email: string): Promise<EUsers | null> {
//     try {
//       console.log("Repository - Searching for user with email:", email);
//       const user = await Users.findOne({ email }).select("+password");
//       console.log("Repository - Specific user found:", user ? "Yes" : "No");
//       return user;
//     } catch (error) {
//       console.error("Repository - findByEmail error:", error);
//       throw error;
//     }
//   }

//   async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - googleSignUp:", user);
//       const newUser = await Users.create(user);
//       console.log("UserRepository - Google signup successful");
//       return newUser;
//     } catch (error) {
//       console.error("UserRepository - googleSignUp error:", error);
//       throw error;
//     }
//   }

//   async changePassword(
//     email: string,
//     password: string
//   ): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - changePassword for email:", email);
//       const updatedUser = await Users.findOneAndUpdate(
//         { email },
//         { password },
//         { new: true }
//       ).select("-password");
//       console.log("UserRepository - Password changed successfully");
//       return updatedUser;
//     } catch (error) {
//       console.error("UserRepository - changePassword error:", error);
//       throw error;
//     }
//   }

//   async findById(id: string): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - findById:", id);
//       const user = await Users.findById(id).select("-password");
//       console.log("UserRepository - User found by ID:", user ? "Yes" : "No");
//       return user;
//     } catch (error) {
//       console.error("UserRepository - findById error:", error);
//       throw error;
//     }
//   }

//   async updateUser(data: {
//     id: string;
//     userType: string;
//     experienceId: string;
//     menteeId: string;
//     role: string[];
//   }): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - updateUser:", data);
//       const updatedUser = await Users.findByIdAndUpdate(
//         data.id,
//         {
//           category: data.userType,
//           [`${data.userType}Details`]: data.experienceId,
//           menteeId: data.menteeId,
//           role: data.role,
//           activated: true,
//         },
//         { new: true }
//       ).populate("menteeId");
//       console.log("UserRepository - User updated successfully");
//       return updatedUser;
//     } catch (error) {
//       console.error("UserRepository - updateUser error:", error);
//       throw error;
//     }
//   }

//   async mentorUpdate(data: {
//     id: string;
//     userType: string;
//     experienceId: string;
//     mentorId: string;
//     profilePicture: string;
//     role: string[];
//   }): Promise<EUsers | null> {
//     try {
//       console.log("UserRepository - mentorUpdate:", data);
//       const updatedUser = await Users.findByIdAndUpdate(
//         data.id,
//         {
//           category: data.userType,
//           [`${data.userType}Details`]: data.experienceId,
//           mentorId: data.mentorId,
//           profilePicture: data.profilePicture,
//           role: data.role,
//           activated: true,
//           mentorActivated: true,
//         },
//         { new: true }
//       )
//         .populate("menteeId")
//         .populate("mentorId");
//       console.log("UserRepository - Mentor updated successfully");
//       return updatedUser;
//     } catch (error) {
//       console.error("UserRepository - mentorUpdate error:", error);
//       throw error;
//     }
//   }

//   async getAllMentors(
//     role?: string,
//     page?: number,
//     limit?: number,
//     searchQuery?: string
//   ): Promise<EUsers[]> {
//     try {
//       console.log("UserRepository - getAllMentors:", {
//         role,
//         page,
//         limit,
//         searchQuery,
//       });
//       const skip = page && limit ? (page - 1) * limit : 0;
//       const query: any = {
//         role: { $in: ["mentor"] },
//         mentorActivated: true,
//         isBlocked: false,
//       };

//       if (searchQuery) {
//         query.$or = [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { skills: { $in: [new RegExp(searchQuery, "i")] } },
//         ];
//       }

//       const mentors = await Users.find(query)
//         .populate("mentorId")
//         .skip(skip)
//         .limit(limit || 12);

//       console.log("UserRepository - Mentors fetched:", mentors.length);
//       return mentors;
//     } catch (error) {
//       console.error("UserRepository - getAllMentors error:", error);
//       throw error;
//     }
//   }

//   async countMentors(role?: string, searchQuery?: string): Promise<number> {
//     try {
//       const query: any = {
//         role: { $in: ["mentor"] },
//         mentorActivated: true,
//         isBlocked: false,
//       };

//       if (searchQuery) {
//         query.$or = [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { skills: { $in: [new RegExp(searchQuery, "i")] } },
//         ];
//       }

//       const count = await Users.countDocuments(query);
//       console.log("UserRepository - Mentor count:", count);
//       return count;
//     } catch (error) {
//       console.error("UserRepository - countMentors error:", error);
//       throw error;
//     }
//   }

//   async getMentorById(mentorId: string): Promise<EUsers> {
//     try {
//       console.log("UserRepository - getMentorById:", mentorId);
//       const mentor = await Users.findById(mentorId)
//         .populate("mentorId")
//         .populate("schoolDetails")
//         .populate("collegeDetails")
//         .populate("professionalDetails");

//       if (!mentor) {
//         throw new Error("Mentor not found");
//       }
//       console.log("UserRepository - Mentor found by ID");
//       return mentor;
//     } catch (error) {
//       console.error("UserRepository - getMentorById error:", error);
//       throw error;
//     }
//   }

//   async updateOnlineStatus(
//     userId: string,
//     role: "mentor" | "mentee",
//     isOnline: boolean
//   ): Promise<void> {
//     try {
//       console.log("UserRepository - updateOnlineStatus:", {
//         userId,
//         role,
//         isOnline,
//       });
//       await Users.findByIdAndUpdate(userId, {
//         "isOnline.status": isOnline,
//         "isOnline.role": isOnline ? role : null,
//       });
//       console.log("UserRepository - Online status updated successfully");
//     } catch (error) {
//       console.error("UserRepository - updateOnlineStatus error:", error);
//       throw error;
//     }
//   }

//   async findUsersByNameOrEmail(searchQuery: string): Promise<any[]> {
//     try {
//       console.log("UserRepository - findUsersByNameOrEmail:", searchQuery);
//       const users = await Users.find({
//         $or: [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { email: { $regex: searchQuery, $options: "i" } },
//         ],
//       }).select("firstName lastName email profilePicture");

//       console.log("UserRepository - Users found by search:", users.length);
//       return users;
//     } catch (error) {
//       console.error("UserRepository - findUsersByNameOrEmail error:", error);
//       throw error;
//     }
//   }

//   async getTopMentors(limit: number): Promise<EUsers[]> {
//     try {
//       console.log("UserRepository - getTopMentors:", limit);
//       const topMentors = await Users.find({
//         role: { $in: ["mentor"] },
//         mentorActivated: true,
//         isBlocked: false,
//       })
//         .populate("mentorId")
//         .sort({ createdAt: -1 })
//         .limit(limit);

//       console.log("UserRepository - Top mentors fetched:", topMentors.length);
//       return topMentors;
//     } catch (error) {
//       console.error("UserRepository - getTopMentors error:", error);
//       throw error;
//     }
//   }
// }
import { EUsers } from "../../entities/userEntity";
import Users from "../../models/userModel";
import { IUserRepository } from "../interface/IUserRepository";
import mongoose from "mongoose";

import Service from "../../models/serviceModel";
export default class UserRepository implements IUserRepository {
  //create user
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
        {
          $pull: { refreshToken: refreshToken },
          $set: { isOnline: { status: false, role: null } },
        },
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
    role: string[];
  }): Promise<EUsers | null> {
    try {
      console.log("Repo updateUser step1");

      const { id, userType, experienceId, menteeId, role } = data;
      let updateData: any = { activated: true, menteeId: menteeId, role: role }; // Common fields

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

      // Filter by role based on details fields
      if (role && role.toLowerCase() !== "all") {
        if (role === "School Student") {
          query.schoolDetails = { $exists: true, $ne: null };
        } else if (role === "College Student") {
          query.collegeDetails = { $exists: true, $ne: null };
        } else if (role === "Professional") {
          query.professionalDetails = { $exists: true, $ne: null };
        }
      }

      // Add search query if provided
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
          role: mappedRole, // Use mappedRole to ensure consistency
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

  async countMentors(role?: string, searchQuery?: string): Promise<number> {
    try {
      const query: any = {
        mentorId: { $exists: true, $ne: null },
      };

      if (role && role.toLowerCase() !== "all") {
        query.role = { $regex: `^${role}$`, $options: "i" }; // Case-insensitive match
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
        // .populate({
        //   path: "mentorId",
        //   select: "bio skills isApproved topTestimonials",
        // })
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

      console.log("the user datat in repo is 1 ", mentor);
      console.log("the user datat in repo is 2", services);

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
            bookings: 1, // For debugging
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
}
