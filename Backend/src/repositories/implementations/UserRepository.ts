// import { Model } from "mongoose";
// import { EUsers } from "../../entities/userEntity";
// import { IUserRepository } from "../interface/IUserRepository";
// import BaseRepository from "./BaseRepository";
// import { logger } from "../../utils/logger";
// import { AppError } from "../../errors/appError";
// import { HttpStatus } from "../../constants/HttpStatus";

// export class UserRepository
//   extends BaseRepository<EUsers>
//   implements IUserRepository
// {
//   constructor(model: Model<EUsers>) {
//     super(model);
//   }

//   async createUser(user: Partial<EUsers>): Promise<EUsers | null> {
//     try {
//       const existing = await this.model.findOne({ email: user.email }).exec();
//       if (existing) {
//         throw new AppError(
//           "Account already exists",
//           HttpStatus.BAD_REQUEST,
//           "warn",
//           "ACCOUNT_EXISTS"
//         );
//       }
//       const newUser = await this.model.create(user);
//       return await this.model
//         .findById(newUser._id)
//         .select("-password -refreshToken")
//         .exec();
//     } catch (error) {
//       logger.error("Error creating user", {
//         email: user.email,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to create user",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "CREATE_USER_ERROR"
//           );
//     }
//   }

//   async findByEmail(email: string): Promise<EUsers | null> {
//     try {
//       return await this.model
//         .findOne({ email })
//         .populate(
//           "mentorId menteeId schoolDetails collegeDetails professionalDetails"
//         )
//         .exec();
//     } catch (error) {
//       logger.error("Error finding user by email", {
//         email,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to find user by email",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FIND_USER_EMAIL_ERROR"
//       );
//     }
//   }

//   async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
//     try {
//       return await this.model.create(user);
//     } catch (error) {
//       logger.error("Error creating Google user", {
//         email: user.email,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to create Google user",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "GOOGLE_SIGNUP_ERROR"
//       );
//     }
//   }

//   async changePassword(
//     email: string,
//     password: string
//   ): Promise<EUsers | null> {
//     try {
//       return await this.model
//         .findOneAndUpdate({ email }, { password }, { new: true })
//         .exec();
//     } catch (error) {
//       logger.error("Error changing password", {
//         email,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to change password",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "CHANGE_PASSWORD_ERROR"
//       );
//     }
//   }

//   async findById(id: string): Promise<EUsers | null> {
//     try {
//       return await this.model
//         .findById(id)
//         .select("-refreshToken")
//         .populate(
//           "mentorId menteeId schoolDetails collegeDetails professionalDetails"
//         )
//         .exec();
//     } catch (error) {
//       logger.error("Error finding user by ID", {
//         id,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to find user by ID",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FIND_USER_ID_ERROR"
//       );
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
//       const { id, userType, experienceId, menteeId, role } = data;
//       const updateData: any = { activated: true, menteeId, role };
//       if (userType === "college" || userType === "fresher")
//         updateData.collegeDetails = experienceId;
//       else if (userType === "school") updateData.schoolDetails = experienceId;
//       else if (userType === "professional")
//         updateData.professionalDetails = experienceId;
//       else
//         throw new AppError(
//           "Invalid userType",
//           HttpStatus.BAD_REQUEST,
//           "warn",
//           "INVALID_USERTYPE"
//         );

//       return await this.model
//         .findByIdAndUpdate(id, { $set: updateData }, { new: true })
//         .select("-refreshToken")
//         .populate(
//           "mentorId menteeId schoolDetails collegeDetails professionalDetails"
//         )
//         .exec();
//     } catch (error) {
//       logger.error("Error updating user", {
//         id: data.id,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to update user",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "UPDATE_USER_ERROR"
//           );
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
//       const { id, userType, experienceId, mentorId, profilePicture, role } =
//         data;
//       const updateData: any = {
//         mentorActivated: true,
//         profilePicture,
//         mentorId,
//         role,
//       };
//       if (userType === "college" || userType === "fresher")
//         updateData.collegeDetails = experienceId;
//       else if (userType === "school") updateData.schoolDetails = experienceId;
//       else if (userType === "professional")
//         updateData.professionalDetails = experienceId;
//       else
//         throw new AppError(
//           "Invalid userType",
//           HttpStatus.BAD_REQUEST,
//           "warn",
//           "INVALID_USERTYPE"
//         );

//       return await this.model
//         .findByIdAndUpdate(id, { $set: updateData }, { new: true })
//         .select("-refreshToken")
//         .exec();
//     } catch (error) {
//       logger.error("Error updating mentor", {
//         id: data.id,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to update mentor",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "UPDATE_MENTOR_ERROR"
//           );
//     }
//   }

//   async getAllMentors(
//     role?: string,
//     page: number = 1,
//     limit: number = 12,
//     searchQuery?: string
//   ): Promise<EUsers[]> {
//     try {
//       logger.info("Fetching all mentors", { role, page, limit, searchQuery });
//       const query: any = {
//         mentorId: { $exists: true, $ne: null },
//       };

//       if (role && role.toLowerCase() !== "all") {
//         if (role === "School Student") {
//           query.schoolDetails = { $exists: true, $ne: null };
//         } else if (role === "College Student") {
//           query.collegeDetails = { $exists: true, $ne: null };
//         } else if (role === "Professional") {
//           query.professionalDetails = { $exists: true, $ne: null };
//         }
//       }

//       if (searchQuery) {
//         query.$or = [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { email: { $regex: searchQuery, $options: "i" } },
//           { bio: { $regex: searchQuery, $options: "i" } },
//         ];
//       }

//       const mentors = await this.model
//         .find(query)
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .populate({
//           path: "mentorId",
//           select: "bio skills isApproved",
//         })
//         .populate({
//           path: "schoolDetails",
//           select: "schoolName city class",
//         })
//         .populate({
//           path: "collegeDetails",
//           select: "collegeName city course specializedIn",
//         })
//         .populate({
//           path: "professionalDetails",
//           select: "company jobRole city",
//         })
//         .lean()
//         .exec();

//       return mentors.map((mentor: any) => {
//         let mappedRole = "N/A";
//         let work = "N/A";
//         let badge = "N/A";
//         let workRole = "N/A";

//         if (mentor.professionalDetails) {
//           mappedRole = "Professional";
//           work = mentor.professionalDetails.company || "Unknown";
//           badge = mentor.professionalDetails.jobRole || "N/A";
//           workRole = mentor.professionalDetails.jobRole || "Professional";
//         } else if (mentor.collegeDetails) {
//           mappedRole = "College Student";
//           work = mentor.collegeDetails.collegeName || "Unknown";
//           badge = mentor.collegeDetails.course || "N/A";
//           workRole = mentor.collegeDetails.specializedIn || "N/A";
//         } else if (mentor.schoolDetails) {
//           mappedRole = "School Student";
//           work = mentor.schoolDetails.schoolName || "Unknown";
//           badge = mentor.schoolDetails.schoolName || "N/A";
//           workRole = mentor.schoolDetails.class
//             ? String(mentor.schoolDetails.class)
//             : "N/A";
//         }

//         return {
//           userId: mentor?._id?.toString(),
//           mentorId: mentor.mentorId?._id?.toString(),
//           name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
//           bio: mentor.mentorId?.bio,
//           role: mappedRole,
//           work,
//           workRole,
//           profileImage: mentor.profilePicture || undefined,
//           badge,
//           isBlocked: mentor.isBlocked,
//           isApproved:
//             mentor.mentorId && "isApproved" in mentor.mentorId
//               ? mentor.mentorId.isApproved
//               : "Pending",
//         };
//       });
//     } catch (error) {
//       logger.error("Error fetching mentors", {
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to fetch mentors",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FETCH_MENTORS_ERROR"
//       );
//     }
//   }

//   async countMentors(role?: string, searchQuery?: string): Promise<number> {
//     try {
//       const query: any = {
//         mentorId: { $exists: true, $ne: null },
//       };

//       if (role && role.toLowerCase() !== "all") {
//         if (role === "School Student") {
//           query.schoolDetails = { $exists: true, $ne: null };
//         } else if (role === "College Student") {
//           query.collegeDetails = { $exists: true, $ne: null };
//         } else if (role === "Professional") {
//           query.professionalDetails = { $exists: true, $ne: null };
//         }
//       }

//       if (searchQuery) {
//         query.$or = [
//           { firstName: { $regex: searchQuery, $options: "i" } },
//           { lastName: { $regex: searchQuery, $options: "i" } },
//           { email: { $regex: searchQuery, $options: "i" } },
//           { bio: { $regex: searchQuery, $options: "i" } },
//         ];
//       }

//       return await this.model.countDocuments(query).exec();
//     } catch (error) {
//       logger.error("Error counting mentors", {
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to count mentors",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "COUNT_MENTORS_ERROR"
//       );
//     }
//   }

//   async getMentorById(mentorId: string): Promise<EUsers> {
//     try {
//       logger.info("Fetching mentor by ID", { mentorId });
//       const mentor = await this.model
//         .findOne({
//           _id: mentorId,
//           mentorId: { $exists: true, $ne: null },
//         })
//         .populate({
//           path: "mentorId",
//           select:
//             "bio skills isApproved topTestimonials portfolio linkedinURL featuredArticle youtubeURL",
//           populate: {
//             path: "topTestimonials",
//             model: "Testimonial",
//             select:
//               "_id menteeId mentorId serviceId bookingId comment rating createdAt updatedAt",
//             populate: [
//               {
//                 path: "menteeId",
//                 model: "Users",
//                 select: "firstName lastName",
//               },
//               {
//                 path: "serviceId",
//                 model: "Service",
//                 select: "title type",
//               },
//             ],
//           },
//         })
//         .populate({
//           path: "schoolDetails",
//           select: "schoolName city class",
//         })
//         .populate({
//           path: "collegeDetails",
//           select: "collegeName city course specializedIn",
//         })
//         .populate({
//           path: "professionalDetails",
//           select: "company jobRole city",
//         })
//         .lean()
//         .exec();

//       if (!mentor) {
//         throw new AppError(
//           "Mentor not found",
//           HttpStatus.NOT_FOUND,
//           "warn",
//           "MENTOR_NOT_FOUND"
//         );
//       }

//       let role = "N/A";
//       let work = "N/A";
//       let badge = "N/A";
//       let workRole = "N/A";
//       let education: EUsers["education"] = {};
//       let workExperience: EUsers["workExperience"] = undefined;

//       if (mentor.professionalDetails) {
//         role = "Professional";
//         work = mentor.professionalDetails.company || "Unknown";
//         badge = mentor.professionalDetails.company || "N/A";
//         workRole = mentor.professionalDetails.jobRole || "Professional";
//         workExperience = {
//           company: mentor.professionalDetails.company || "Unknown",
//           jobRole: mentor.professionalDetails.jobRole || "Professional",
//           city: mentor.professionalDetails.city,
//         };
//       } else if (mentor.collegeDetails) {
//         role = "College Student";
//         work = mentor.collegeDetails.collegeName || "Unknown";
//         badge = mentor.collegeDetails.course || "N/A";
//         workRole = mentor.collegeDetails.specializedIn || "N/A";
//         education.collegeName = mentor.collegeDetails.collegeName;
//         education.city = mentor.collegeDetails.city;
//       } else if (mentor.schoolDetails) {
//         role = "School Student";
//         work = mentor.schoolDetails.schoolName || "Unknown";
//         badge = mentor.schoolDetails.schoolName || "N/A";
//         workRole = mentor.schoolDetails.class
//           ? String(mentor.schoolDetails.class)
//           : "N/A";
//         education.schoolName = mentor.schoolDetails.schoolName;
//         education.city = mentor.schoolDetails.city;
//       }

//       return {
//         userId: mentor._id?.toString(),
//         mentorId: mentor.mentorId?._id?.toString() || mentor._id?.toString(),
//         name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
//         role,
//         work,
//         workRole,
//         topTestimonials: mentor.mentorId?.topTestimonials || [],
//         profileImage: mentor.profilePicture || undefined,
//         badge,
//         isBlocked: mentor.isBlocked || false,
//         isApproved:
//           mentor.mentorId && "isApproved" in mentor.mentorId
//             ? mentor.mentorId.isApproved
//             : "Pending",
//         bio: mentor.mentorId?.bio || "No bio available",
//         skills: mentor.mentorId?.skills || [],
//         education: Object.keys(education).length ? education : undefined,
//         workExperience,
//         linkedinURL: mentor.mentorId?.linkedinURL,
//         portfolio: mentor.mentorId?.portfolio,
//         featuredArticle: mentor.mentorId?.featuredArticle,
//         youtubeURL: mentor.mentorId?.youtubeURL,
//       };
//     } catch (error) {
//       logger.error("Error fetching mentor by ID", {
//         mentorId,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw error instanceof AppError
//         ? error
//         : new AppError(
//             "Failed to fetch mentor",
//             HttpStatus.INTERNAL_SERVER,
//             "error",
//             "FETCH_MENTOR_ERROR"
//           );
//     }
//   }

//   async updateOnlineStatus(
//     userId: string,
//     role: "mentor" | "mentee",
//     isOnline: boolean
//   ): Promise<void> {
//     try {
//       const modelName = role === "mentor" ? "Mentor" : "Mentee";
//       await this.model.mongo
//         .model(modelName)
//         .findByIdAndUpdate(userId, { isOnline })
//         .exec();
//     } catch (error) {
//       logger.error("Error updating online status", {
//         userId,
//         role,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to update online status",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "UPDATE_ONLINE_STATUS_ERROR"
//       );
//     }
//   }

//   async findUsersByNameOrEmail(searchQuery: string): Promise<EUsers[]> {
//     try {
//       return await this.model
//         .find({
//           $or: [
//             { firstName: { $regex: searchQuery, $options: "i" } },
//             { lastName: { $regex: searchQuery, $options: "i" } },
//             { email: { $regex: searchQuery, $options: "i" } },
//           ],
//         })
//         .select("_id")
//         .exec();
//     } catch (error) {
//       logger.error("Error finding users by name or email", {
//         searchQuery,
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to find users by name or email",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FIND_USERS_NAME_EMAIL_ERROR"
//       );
//     }
//   }

//   async getTopMentors(limit: number): Promise<EUsers[]> {
//     try {
//       logger.info("Fetching top mentors", { limit });
//       const mentors = await this.model
//         .aggregate([
//           {
//             $match: {
//               role: { $in: ["mentor"] },
//               isBlocked: false,
//               isApproved: "Approved",
//             },
//           },
//           {
//             $lookup: {
//               from: "bookings",
//               localField: "_id",
//               foreignField: "mentorId",
//               as: "bookings",
//             },
//           },
//           {
//             $lookup: {
//               from: "testimonials",
//               localField: "_id",
//               foreignField: "mentorId",
//               as: "testimonials",
//             },
//           },
//           {
//             $lookup: {
//               from: "mentors",
//               localField: "mentorId",
//               foreignField: "_id",
//               as: "mentorDetails",
//             },
//           },
//           {
//             $unwind: "$mentorDetails",
//           },
//           {
//             $addFields: {
//               bookingCount: { $size: "$bookings" },
//               averageRating: { $avg: "$testimonials.rating" },
//             },
//           },
//           {
//             $match: {
//               bookingCount: { $gt: 0 },
//             },
//           },
//           {
//             $sort: {
//               bookingCount: -1,
//               averageRating: -1,
//             },
//           },
//           {
//             $limit: limit,
//           },
//           {
//             $project: {
//               _id: 1,
//               firstName: 1,
//               lastName: 1,
//               profilePicture: 1,
//               mentorId: 1,
//               bio: "$mentorDetails.bio",
//               skills: "$mentorDetails.skills",
//               bookingCount: 1,
//               averageRating: 1,
//               isBlocked: 1,
//               isApproved: 1,
//             },
//           },
//         ])
//         .exec();
//       return mentors as EUsers[];
//     } catch (error) {
//       logger.error("Error fetching top mentors", {
//         error: error instanceof Error ? error.message : String(error),
//       });
//       throw new AppError(
//         "Failed to fetch top mentors",
//         HttpStatus.INTERNAL_SERVER,
//         "error",
//         "FETCH_TOP_MENTORS_ERROR"
//       );
//     }
//   }
// }

import { Model } from "mongoose";
import { Redis } from "ioredis";
import { z } from "zod";
import { EUsers } from "../../entities/userEntity";
import { IUserRepository } from "../interface/IUserRepository";
import BaseRepository from "./BaseRepository";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class UserRepository
  extends BaseRepository<EUsers>
  implements IUserRepository
{
  constructor(model: Model<EUsers>, private readonly redisClient: Redis) {
    super(model);
  }

  async createUser(user: Partial<EUsers>): Promise<EUsers | null> {
    const UserSchema = z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      password: z.string().optional(),
    });

    try {
      UserSchema.parse(user);
      const existing = await this.findOne({ email: user.email });
      if (existing) {
        throw new AppError(
          "Account already exists",
          HttpStatus.BAD_REQUEST,
          "warn",
          "ACCOUNT_EXISTS"
        );
      }
      const newUser = await this.create(user);
      return await this.model.findById(newUser._id).select("-password").exec();
    } catch (error) {
      logger.error("Error creating user", {
        email: user.email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create user",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "CREATE_USER_ERROR"
          );
    }
  }

  async findByEmail(email: string): Promise<EUsers | null> {
    try {
      z.string().email().parse(email);
      return await this.model
        .findOne({ email })
        .populate(
          "mentorId menteeId schoolDetails collegeDetails professionalDetails"
        )
        .exec();
    } catch (error) {
      logger.error("Error finding user by email", {
        email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find user by email",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FIND_USER_EMAIL_ERROR"
          );
    }
  }

  async googleSignUp(user: Partial<EUsers>): Promise<EUsers | null> {
    try {
      const UserSchema = z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      });
      UserSchema.parse(user);
      return await this.create(user);
    } catch (error) {
      logger.error("Error creating Google user", {
        email: user.email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create Google user",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "GOOGLE_SIGNUP_ERROR"
          );
    }
  }

  async changePassword(
    email: string,
    password: string
  ): Promise<EUsers | null> {
    try {
      z.string().email().parse(email);
      z.string().min(6).parse(password);
      return await this.findOneAndUpdate({ email }, { password });
    } catch (error) {
      logger.error("Error changing password", {
        email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to change password",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "CHANGE_PASSWORD_ERROR"
          );
    }
  }

  async findById(id: string): Promise<EUsers | null> {
    try {
      z.string().nonempty().parse(id);
      return await this.model
        .findById(id)
        .select("-password")
        .populate(
          "mentorId menteeId schoolDetails collegeDetails professionalDetails"
        )
        .exec();
    } catch (error) {
      logger.error("Error finding user by ID", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find user by ID",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FIND_USER_ID_ERROR"
          );
    }
  }

  async findMany(query: any, page: number, limit: number): Promise<any[]> {
    try {
      z.number().min(1).parse(page);
      z.number().min(1).parse(limit);
      return await super.findMany(query, page, limit);
    } catch (error) {
      logger.error("Error finding paginated users", {
        query,
        page,
        limit,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find paginated users",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FIND_MANY_USERS_ERROR"
          );
    }
  }

  async updateUser(data: {
    id: string;
    userType: string;
    experienceId: string;
    menteeId: string;
    role: string[];
  }): Promise<EUsers | null> {
    const UpdateSchema = z.object({
      id: z.string().nonempty(),
      userType: z.enum(["school", "college", "fresher", "professional"]),
      experienceId: z.string().nonempty(),
      menteeId: z.string().nonempty(),
      role: z.array(z.enum(["mentee", "mentor"])),
    });

    try {
      const { id, userType, experienceId, menteeId, role } =
        UpdateSchema.parse(data);
      const updateData: any = { activated: true, menteeId, role };
      if (userType === "college" || userType === "fresher")
        updateData.collegeDetails = experienceId;
      else if (userType === "school") updateData.schoolDetails = experienceId;
      else if (userType === "professional")
        updateData.professionalDetails = experienceId;
      else
        throw new AppError(
          "Invalid userType",
          HttpStatus.BAD_REQUEST,
          "warn",
          "INVALID_USERTYPE"
        );

      return await this.update(id, updateData);
    } catch (error) {
      logger.error("Error updating user", {
        id: data.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update user",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "UPDATE_USER_ERROR"
          );
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
    const MentorUpdateSchema = z.object({
      id: z.string().nonempty(),
      userType: z.enum(["school", "college", "fresher", "professional"]),
      experienceId: z.string().nonempty(),
      mentorId: z.string().nonempty(),
      profilePicture: z.string().optional(),
      role: z.array(z.enum(["mentee", "mentor"])),
    });

    try {
      const { id, userType, experienceId, mentorId, profilePicture, role } =
        MentorUpdateSchema.parse(data);
      const updateData: any = {
        mentorActivated: true,
        profilePicture,
        mentorId,
        role,
      };
      if (userType === "college" || userType === "fresher")
        updateData.collegeDetails = experienceId;
      else if (userType === "school") updateData.schoolDetails = experienceId;
      else if (userType === "professional")
        updateData.professionalDetails = experienceId;
      else
        throw new AppError(
          "Invalid userType",
          HttpStatus.BAD_REQUEST,
          "warn",
          "INVALID_USERTYPE"
        );

      return await this.update(id, updateData);
    } catch (error) {
      logger.error("Error updating mentor", {
        id: data.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update mentor",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "UPDATE_MENTOR_ERROR"
          );
    }
  }

  async getAllMentors(
    role?: string,
    page: number = 1,
    limit: number = 12,
    searchQuery?: string
  ): Promise<EUsers[]> {
    const QuerySchema = z.object({
      role: z
        .enum(["School Student", "College Student", "Professional", "all"])
        .optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(12),
      searchQuery: z.string().optional(),
    });

    try {
      const {
        role: validatedRole,
        page: validatedPage,
        limit: validatedLimit,
        searchQuery: validatedSearchQuery,
      } = QuerySchema.parse({ role, page, limit, searchQuery });
      logger.info("Fetching all mentors", {
        role: validatedRole,
        page: validatedPage,
        limit: validatedLimit,
        searchQuery: validatedSearchQuery,
      });

      const query: any = { mentorId: { $exists: true, $ne: null } };
      if (validatedRole && validatedRole.toLowerCase() !== "all") {
        if (validatedRole === "School Student")
          query.schoolDetails = { $exists: true, $ne: null };
        else if (validatedRole === "College Student")
          query.collegeDetails = { $exists: true, $ne: null };
        else if (validatedRole === "Professional")
          query.professionalDetails = { $exists: true, $ne: null };
      }
      if (validatedSearchQuery) {
        query.$or = [
          { firstName: { $regex: validatedSearchQuery, $options: "i" } },
          { lastName: { $regex: validatedSearchQuery, $options: "i" } },
          { email: { $regex: validatedSearchQuery, $options: "i" } },
          { bio: { $regex: validatedSearchQuery, $options: "i" } },
        ];
      }

      const mentors = await this.findMany(query, validatedPage, validatedLimit);
      return mentors.map((mentor: any) => ({
        userId: mentor._id?.toString(),
        mentorId: mentor.mentorId?._id?.toString(),
        name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
        bio: mentor.mentorId?.bio,
        role: mentor.professionalDetails
          ? "Professional"
          : mentor.collegeDetails
          ? "College Student"
          : mentor.schoolDetails
          ? "School Student"
          : "N/A",
        work:
          mentor.professionalDetails?.company ||
          mentor.collegeDetails?.collegeName ||
          mentor.schoolDetails?.schoolName ||
          "N/A",
        workRole:
          mentor.professionalDetails?.jobRole ||
          mentor.collegeDetails?.specializedIn ||
          (mentor.schoolDetails?.class
            ? String(mentor.schoolDetails.class)
            : "N/A"),
        profileImage: mentor.profilePicture || undefined,
        badge:
          mentor.professionalDetails?.company ||
          mentor.collegeDetails?.course ||
          mentor.schoolDetails?.schoolName ||
          "N/A",
        isBlocked: mentor.isBlocked,
        isApproved: mentor.mentorId?.isApproved || "Pending",
      }));
    } catch (error) {
      logger.error("Error fetching mentors", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch mentors",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FETCH_MENTORS_ERROR"
          );
    }
  }

  async countMentors(role?: string, searchQuery?: string): Promise<number> {
    const QuerySchema = z.object({
      role: z
        .enum(["School Student", "College Student", "Professional", "all"])
        .optional(),
      searchQuery: z.string().optional(),
    });

    try {
      const { role: validatedRole, searchQuery: validatedSearchQuery } =
        QuerySchema.parse({ role, searchQuery });
      const query: any = { mentorId: { $exists: true, $ne: null } };
      if (validatedRole && validatedRole.toLowerCase() !== "all") {
        if (validatedRole === "School Student")
          query.schoolDetails = { $exists: true, $ne: null };
        else if (validatedRole === "College Student")
          query.collegeDetails = { $exists: true, $ne: null };
        else if (validatedRole === "Professional")
          query.professionalDetails = { $exists: true, $ne: null };
      }
      if (validatedSearchQuery) {
        query.$or = [
          { firstName: { $regex: validatedSearchQuery, $options: "i" } },
          { lastName: { $regex: validatedSearchQuery, $options: "i" } },
          { email: { $regex: validatedSearchQuery, $options: "i" } },
          { bio: { $regex: validatedSearchQuery, $options: "i" } },
        ];
      }
      return await this.countDocuments(query);
    } catch (error) {
      logger.error("Error counting mentors", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count mentors",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_MENTORS_ERROR"
      );
    }
  }

  async getMentorById(mentorId: string): Promise<EUsers> {
    try {
      z.string().nonempty().parse(mentorId);
      logger.info("Fetching mentor by ID", { mentorId });

      const mentor = await this.model
        .findOne({ _id: mentorId, mentorId: { $exists: true, $ne: null } })
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
              { path: "serviceId", model: "Service", select: "title type" },
            ],
          },
        })
        .populate({ path: "schoolDetails", select: "schoolName city class" })
        .populate({
          path: "collegeDetails",
          select: "collegeName city course specializedIn",
        })
        .populate({
          path: "professionalDetails",
          select: "company jobRole city",
        })
        .lean()
        .exec();

      if (!mentor) {
        throw new AppError(
          "Mentor not found",
          HttpStatus.NOT_FOUND,
          "warn",
          "MENTOR_NOT_FOUND"
        );
      }

      return {
        userId: mentor._id?.toString(),
        mentorId: mentor.mentorId?._id?.toString() || mentor._id?.toString(),
        name: `${mentor.firstName} ${mentor.lastName || ""}`.trim(),
        role: mentor.professionalDetails
          ? "Professional"
          : mentor.collegeDetails
          ? "College Student"
          : mentor.schoolDetails
          ? "School Student"
          : "N/A",
        work:
          mentor.professionalDetails?.company ||
          mentor.collegeDetails?.collegeName ||
          mentor.schoolDetails?.schoolName ||
          "N/A",
        workRole:
          mentor.professionalDetails?.jobRole ||
          mentor.collegeDetails?.specializedIn ||
          (mentor.schoolDetails?.class
            ? String(mentor.schoolDetails.class)
            : "N/A"),
        topTestimonials: mentor.mentorId?.topTestimonials || [],
        profileImage: mentor.profilePicture || undefined,
        badge:
          mentor.professionalDetails?.company ||
          mentor.collegeDetails?.course ||
          mentor.schoolDetails?.schoolName ||
          "N/A",
        isBlocked: mentor.isBlocked || false,
        isApproved: mentor.mentorId?.isApproved || "Pending",
        bio: mentor.mentorId?.bio || "No bio available",
        skills: mentor.mentorId?.skills || [],
        education: {
          schoolName: mentor.schoolDetails?.schoolName,
          collegeName: mentor.collegeDetails?.collegeName,
          city: mentor.schoolDetails?.city || mentor.collegeDetails?.city,
        },
        workExperience: mentor.professionalDetails
          ? {
              company: mentor.professionalDetails.company || "Unknown",
              jobRole: mentor.professionalDetails.jobRole || "Professional",
              city: mentor.professionalDetails.city,
            }
          : undefined,
        linkedinURL: mentor.mentorId?.linkedinURL,
        portfolio: mentor.mentorId?.portfolio,
        featuredArticle: mentor.mentorId?.featuredArticle,
        youtubeURL: mentor.mentorId?.youtubeURL,
      };
    } catch (error) {
      logger.error("Error fetching mentor by ID", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch mentor",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FETCH_MENTOR_ERROR"
          );
    }
  }

  async updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void> {
    try {
      z.string().nonempty().parse(userId);
      z.enum(["mentor", "mentee"]).parse(role);
      z.boolean().parse(isOnline);
      await this.update(userId, { isOnline: { status: isOnline, role } });
    } catch (error) {
      logger.error("Error updating online status", {
        userId,
        role,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update online status",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "UPDATE_ONLINE_STATUS_ERROR"
          );
    }
  }

  async findUsersByNameOrEmail(searchQuery: string): Promise<EUsers[]> {
    try {
      z.string().nonempty().parse(searchQuery);
      return await this.findAll({
        $or: [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      });
    } catch (error) {
      logger.error("Error finding users by name or email", {
        searchQuery,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find users by name or email",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FIND_USERS_NAME_EMAIL_ERROR"
          );
    }
  }

  async getTopMentors(limit: number): Promise<EUsers[]> {
    try {
      z.number().positive().parse(limit);
      logger.info("Fetching top mentors", { limit });

      const mentors = await this.aggregate([
        {
          $match: {
            role: { $in: ["mentor"] },
            isBlocked: false,
            isApproved: "Approved",
          },
        },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "mentorId",
            as: "bookings",
          },
        },
        {
          $lookup: {
            from: "testimonials",
            localField: "_id",
            foreignField: "mentorId",
            as: "testimonials",
          },
        },
        {
          $lookup: {
            from: "mentors",
            localField: "mentorId",
            foreignField: "_id",
            as: "mentorDetails",
          },
        },
        { $unwind: "$mentorDetails" },
        {
          $addFields: {
            bookingCount: { $size: "$bookings" },
            averageRating: { $avg: "$testimonials.rating" },
          },
        },
        { $match: { bookingCount: { $gt: 0 } } },
        { $sort: { bookingCount: -1, averageRating: -1 } },
        { $limit: limit },
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
          },
        },
      ]);

      return mentors as EUsers[];
    } catch (error) {
      logger.error("Error fetching top mentors", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch top mentors",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FETCH_TOP_MENTORS_ERROR"
          );
    }
  }

  async update(
    userId: string,
    payload: Partial<EUsers>
  ): Promise<EUsers | null> {
    try {
      z.string().nonempty().parse(userId);
      return await super.update(userId, payload);
    } catch (error) {
      logger.error("Error updating user", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update user",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "UPDATE_USER_ERROR"
          );
    }
  }

  async countDocuments(query: any): Promise<number> {
    try {
      return await super.countDocuments(query);
    } catch (error) {
      logger.error("Error counting documents", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to count documents",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "COUNT_ERROR"
          );
    }
  }
}
