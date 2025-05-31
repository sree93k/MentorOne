// // // repositories/implementations/PriorityDMRepository.ts
// // import mongoose from "mongoose";
// // import { IPriorityDMRepository } from "../interface/IPriorityDmRepository";
// // import { ApiError } from "../../middlewares/errorHandler";
// // import PriorityDMModel from "../../models/priorityDmModel";
// // import { EPriorityDM } from "../../entities/priorityDMEntity";

// // export default class PriorityDMRepository implements IPriorityDMRepository {
// //   async create(data: Partial<EPriorityDM>): Promise<EPriorityDM> {
// //     try {
// //       const priorityDM = await PriorityDMModel.create(data);
// //       return priorityDM;
// //     } catch (error: any) {
// //       console.error("Error in PriorityDMRepository.create:", error);
// //       throw new ApiError(500, `Failed to create PriorityDM: ${error.message}`);
// //     }
// //   }

// //   async findById(id: string): Promise<EPriorityDM | null> {
// //     try {
// //       if (!mongoose.Types.ObjectId.isValid(id)) {
// //         throw new ApiError(400, `Invalid ID format: ${id}`);
// //       }

// //       const priorityDM = await PriorityDMModel.findById(id)
// //         .populate("mentorId", "firstName lastName")
// //         .populate("menteeId", "firstName lastName")
// //         .populate("serviceId")
// //         .populate("bookingId");

// //       return priorityDM;
// //     } catch (error: any) {
// //       console.error("Error in PriorityDMRepository.findById:", error);
// //       throw new ApiError(500, `Failed to fetch PriorityDM: ${error.message}`);
// //     }
// //   }

// //   async findByServiceAndMentee(
// //     serviceId: string,
// //     menteeId: string
// //   ): Promise<EPriorityDM[]> {
// //     try {
// //       if (
// //         !mongoose.Types.ObjectId.isValid(serviceId) ||
// //         !mongoose.Types.ObjectId.isValid(menteeId)
// //       ) {
// //         throw new ApiError(400, "Invalid serviceId or menteeId format");
// //       }

// //       const priorityDMs = await PriorityDMModel.find({
// //         serviceId: new mongoose.Types.ObjectId(serviceId),
// //         menteeId: new mongoose.Types.ObjectId(menteeId),
// //       })
// //         .populate("mentorId", "firstName lastName")
// //         .populate("menteeId", "firstName lastName")
// //         .populate("serviceId")
// //         .populate("bookingId");

// //       return priorityDMs;
// //     } catch (error: any) {
// //       console.error(
// //         "Error in PriorityDMRepository.findByServiceAndMentee:",
// //         error
// //       );
// //       throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
// //     }
// //   }

// //   async findByServiceAndMentor(
// //     serviceId: string,
// //     mentorId: string
// //   ): Promise<EPriorityDM[]> {
// //     try {
// //       if (
// //         !mongoose.Types.ObjectId.isValid(serviceId) ||
// //         !mongoose.Types.ObjectId.isValid(mentorId)
// //       ) {
// //         throw new ApiError(400, "Invalid serviceId or mentorId format");
// //       }

// //       const priorityDMs = await PriorityDMModel.find({
// //         serviceId: new mongoose.Types.ObjectId(serviceId),
// //         mentorId: new mongoose.Types.ObjectId(mentorId),
// //       })
// //         .populate("mentorId", "firstName lastName")
// //         .populate("menteeId", "firstName lastName")
// //         .populate("serviceId")
// //         .populate("bookingId");

// //       return priorityDMs;
// //     } catch (error: any) {
// //       console.error(
// //         "Error in PriorityDMRepository.findByServiceAndMentor:",
// //         error
// //       );
// //       throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
// //     }
// //   }

// //   async update(
// //     id: string,
// //     data: Partial<EPriorityDM>
// //   ): Promise<EPriorityDM | null> {
// //     try {
// //       if (!mongoose.Types.ObjectId.isValid(id)) {
// //         throw new ApiError(400, `Invalid ID format: ${id}`);
// //       }

// //       const updatedDM = await PriorityDMModel.findByIdAndUpdate(
// //         id,
// //         { $set: data },
// //         { new: true, runValidators: true }
// //       )
// //         .populate("mentorId", "firstName lastName")
// //         .populate("menteeId", "firstName lastName")
// //         .populate("serviceId")
// //         .populate("bookingId");

// //       return updatedDM;
// //     } catch (error: any) {
// //       console.error("Error in PriorityDMRepository.update:", error);
// //       throw new ApiError(500, `Failed to update PriorityDM: ${error.message}`);
// //     }
// //   }
// // }
// // repositories/implementations/PriorityDMRepository.ts
// import mongoose from "mongoose";
// import { IPriorityDMRepository } from "../interface/IPriorityDmRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import PriorityDMModel from "../../models/priorityDmModel";
// import { EPriorityDM } from "../../entities/priorityDMEntity";

// export default class PriorityDMRepository implements IPriorityDMRepository {
//   async create(data: Partial<EPriorityDM>): Promise<EPriorityDM> {
//     try {
//       const priorityDM = await PriorityDMModel.create(data);
//       return priorityDM;
//     } catch (error: any) {
//       console.error("Error in PriorityDMRepository.create:", error);
//       throw new ApiError(500, `Failed to create PriorityDM: ${error.message}`);
//     }
//   }

//   async findById(id: string): Promise<EPriorityDM | null> {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ApiError(400, `Invalid ID format: ${id}`);
//       }

//       const priorityDM = await PriorityDMModel.findById(id)
//         .populate("mentorId", "firstName lastName profilePicture")
//         .populate("menteeId", "firstName lastName profilePicture")
//         .populate("serviceId", "title")
//         .populate("bookingId");

//       return priorityDM;
//     } catch (error: any) {
//       console.error("Error in PriorityDMRepository.findById:", error);
//       throw new ApiError(500, `Failed to fetch PriorityDM: ${error.message}`);
//     }
//   }

//   async findByServiceAndMentee(
//     serviceId: string,
//     menteeId: string
//   ): Promise<EPriorityDM[]> {
//     try {
//       if (
//         !mongoose.Types.ObjectId.isValid(serviceId) ||
//         !mongoose.Types.ObjectId.isValid(menteeId)
//       ) {
//         throw new ApiError(400, "Invalid serviceId or menteeId format");
//       }

//       const priorityDMs = await PriorityDMModel.find({
//         serviceId: new mongoose.Types.ObjectId(serviceId),
//         menteeId: new mongoose.Types.ObjectId(menteeId),
//       })
//         .populate("mentorId", "firstName lastName profilePicture")
//         .populate("menteeId", "firstName lastName profilePicture")
//         .populate("serviceId", "title")
//         .populate("bookingId");

//       return priorityDMs;
//     } catch (error: any) {
//       console.error(
//         "Error in PriorityDMRepository.findByServiceAndMentee:",
//         error
//       );
//       throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
//     }
//   }

//   async findByServiceAndMentor(
//     serviceId: string,
//     mentorId: string
//   ): Promise<EPriorityDM[]> {
//     try {
//       if (
//         !mongoose.Types.ObjectId.isValid(serviceId) ||
//         !mongoose.Types.ObjectId.isValid(mentorId)
//       ) {
//         throw new ApiError(400, "Invalid serviceId or mentorId format");
//       }

//       const priorityDMs = await PriorityDMModel.find({
//         serviceId: new mongoose.Types.ObjectId(serviceId),
//         mentorId: new mongoose.Types.ObjectId(mentorId),
//       })
//         .populate("mentorId", "firstName lastName profilePicture")
//         .populate("menteeId", "firstName lastName profilePicture")
//         .populate("serviceId", "title")
//         .populate("bookingId");

//       return priorityDMs;
//     } catch (error: any) {
//       console.error(
//         "Error in PriorityDMRepository.findByServiceAndMentor:",
//         error
//       );
//       throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
//     }
//   }

//   async findByMentor(mentorId: string): Promise<EPriorityDM[]> {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(mentorId)) {
//         throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
//       }

//       const priorityDMs = await PriorityDMModel.find({
//         mentorId: new mongoose.Types.ObjectId(mentorId),
//       })
//         .populate("mentorId", "firstName lastName profilePicture")
//         .populate("menteeId", "firstName lastName profilePicture")
//         .populate("serviceId", "title")
//         .populate("bookingId");

//       return priorityDMs;
//     } catch (error: any) {
//       console.error("Error in PriorityDMRepository.findByMentor:", error);
//       throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
//     }
//   }

//   async update(
//     id: string,
//     data: Partial<EPriorityDM>
//   ): Promise<EPriorityDM | null> {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ApiError(400, `Invalid ID format: ${id}`);
//       }

//       const updatedDM = await PriorityDMModel.findByIdAndUpdate(
//         id,
//         { $set: data },
//         { new: true, runValidators: true }
//       )
//         .populate("mentorId", "firstName lastName profilePicture")
//         .populate("menteeId", "firstName lastName profilePicture")
//         .populate("serviceId", "title")
//         .populate("bookingId");

//       return updatedDM;
//     } catch (error: any) {
//       console.error("Error in PriorityDMRepository.update:", error);
//       throw new ApiError(500, `Failed to update PriorityDM: ${error.message}`);
//     }
//   }
// }
// src/repositories/implementations/PriorityDMRepository.ts
import mongoose from "mongoose";
import { IPriorityDMRepository } from "../interface/IPriorityDmRepository";
import { ApiError } from "../../middlewares/errorHandler";
import PriorityDMModel from "../../models/priorityDmModel";
import { EPriorityDM } from "../../entities/priorityDMEntity";

export default class PriorityDMRepository implements IPriorityDMRepository {
  async create(data: Partial<EPriorityDM>): Promise<EPriorityDM> {
    try {
      const priorityDM = await PriorityDMModel.create(data);
      return priorityDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.create:", error);
      throw new ApiError(500, `Failed to create PriorityDM: ${error.message}`);
    }
  }

  async findById(id: string): Promise<EPriorityDM | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, `Invalid ID format: ${id}`);
      }

      const priorityDM = await PriorityDMModel.findById(id)
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return priorityDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.findById:", error);
      throw new ApiError(500, `Failed to fetch PriorityDM: ${error.message}`);
    }
  }

  async findByServiceAndMentee(
    serviceId: string,
    menteeId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(serviceId) ||
        !mongoose.Types.ObjectId.isValid(menteeId)
      ) {
        throw new ApiError(400, "Invalid serviceId or menteeId format");
      }

      const priorityDMs = await PriorityDMModel.find({
        serviceId: new mongoose.Types.ObjectId(serviceId),
        menteeId: new mongoose.Types.ObjectId(menteeId),
      })
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return priorityDMs;
    } catch (error: any) {
      console.error(
        "Error in PriorityDMRepository.findByServiceAndMentee:",
        error
      );
      throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
    }
  }

  async findByServiceAndMentor(
    serviceId: string,
    mentorId: string
  ): Promise<EPriorityDM[]> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(serviceId) ||
        !mongoose.Types.ObjectId.isValid(mentorId)
      ) {
        throw new ApiError(400, "Invalid serviceId or mentorId format");
      }

      const priorityDMs = await PriorityDMModel.find({
        serviceId: new mongoose.Types.ObjectId(serviceId),
        mentorId: new mongoose.Types.ObjectId(mentorId),
      })
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return priorityDMs;
    } catch (error: any) {
      console.error(
        "Error in PriorityDMRepository.findByServiceAndMentor:",
        error
      );
      throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
    }
  }

  async findByMentor(mentorId: string): Promise<EPriorityDM[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400, "Invalid mentorId format");
      }
      console.log(
        "prioritydm repositoey , findby mentor  resposne step 1",
        mentorId
      );

      const priorityDMs = await PriorityDMModel.find({
        mentorId: new mongoose.Types.ObjectId(mentorId),
      })
        .populate("mentorId", "firstName lastName profilePicture")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");
      console.log(
        "prioritydm repositoey , findby mentor  resposne step 2 ",
        priorityDMs
      );

      return priorityDMs;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.findByMentor:", error);
      throw new ApiError(500, `Failed to fetch PriorityDMs: ${error.message}`);
    }
  }

  async update(
    id: string,
    data: Partial<EPriorityDM>
  ): Promise<EPriorityDM | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, `Invalid ID format: ${id}`);
      }

      const updatedDM = await PriorityDMModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName profilePicture")
        .populate("serviceId")
        .populate("bookingId");

      return updatedDM;
    } catch (error: any) {
      console.error("Error in PriorityDMRepository.update:", error);
      throw new ApiError(500, `Failed to update PriorityDM: ${error.message}`);
    }
  }
}
