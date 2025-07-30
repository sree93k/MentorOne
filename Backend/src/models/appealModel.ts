// // // NEW FILE - Create this file
// // import mongoose, { Schema, model, Document } from "mongoose";

// // export interface IAppeal extends Document {
// //   userId: string;
// //   reason: string;
// //   status: "PENDING" | "APPROVED" | "REJECTED";
// //   adminResponse?: string;
// //   submittedAt: Date;
// //   respondedAt?: Date;
// //   respondedBy?: string;
// // }

// // const AppealSchema: Schema<IAppeal> = new Schema(
// //   {
// //     userId: { type: String, required: true },
// //     reason: { type: String, required: true },
// //     status: {
// //       type: String,
// //       enum: ["PENDING", "APPROVED", "REJECTED"],
// //       default: "PENDING",
// //     },
// //     adminResponse: { type: String },
// //     submittedAt: { type: Date, default: Date.now },
// //     respondedAt: { type: Date },
// //     respondedBy: { type: String },
// //   },
// //   {
// //     collection: "Appeals",
// //     timestamps: true,
// //   }
// // );

// // export default model<IAppeal>("Appeal", AppealSchema);
// import mongoose, { Schema, Document } from "mongoose";

// export interface IAppeal extends Document {
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   appealMessage: string;
//   category: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
//   status: "pending" | "approved" | "rejected" | "under_review";
//   submittedAt: Date;
//   reviewedAt?: Date;
//   reviewedBy?: string; // Admin ID
//   adminResponse?: string;
//   adminNotes?: string;
// }

// const appealSchema = new Schema<IAppeal>(
//   {
//     userId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     appealMessage: {
//       type: String,
//       required: true,
//       maxlength: 1000,
//     },
//     category: {
//       type: String,
//       enum: ["wrongful_block", "account_hacked", "misunderstanding", "other"],
//       default: "other",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "under_review"],
//       default: "pending",
//       index: true,
//     },
//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     reviewedAt: {
//       type: Date,
//     },
//     reviewedBy: {
//       type: String, // Admin ID
//     },
//     adminResponse: {
//       type: String,
//       maxlength: 1000,
//     },
//     adminNotes: {
//       type: String,
//       maxlength: 500,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes for better query performance
// appealSchema.index({ userId: 1, status: 1 });
// appealSchema.index({ email: 1, submittedAt: -1 });
// appealSchema.index({ status: 1, submittedAt: -1 });

// export default mongoose.model<IAppeal>("Appeal", appealSchema);
import mongoose, { Schema } from "mongoose";
import { EAppeal } from "../entities/appealEntity";

const appealSchema = new Schema<EAppeal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    appealMessage: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ["wrongful_block", "account_hacked", "misunderstanding", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under_review"],
      default: "pending",
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
    },
    adminResponse: {
      type: String,
      maxlength: 1000,
    },
    adminNotes: {
      type: String,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
appealSchema.index({ userId: 1, status: 1 });
appealSchema.index({ email: 1, submittedAt: -1 });
appealSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<EAppeal>("Appeal", appealSchema);
