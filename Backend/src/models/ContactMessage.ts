// src/models/ContactMessage.ts
import mongoose, { Schema, Document } from "mongoose";
import { ContactMessage } from "../entities/ContactMessage";

interface ContactMessageDocument extends ContactMessage, Document {}

const AdminResponseSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    ref: "Admin",
  },
  adminName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InternalNoteSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    ref: "Admin",
  },
  adminName: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      sparse: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    inquiryType: {
      type: String,
      required: true,
      enum: [
        "general",
        "mentorship",
        "courses",
        "partnership",
        "support",
        "feedback",
        "media",
      ],
      index: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    preferredContact: {
      type: String,
      required: true,
      enum: ["email", "phone", "whatsapp"],
      default: "email",
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "archived"],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    assignedTo: {
      type: String,
      ref: "Admin",
      sparse: true,
      index: true,
    },
    attachments: [
      {
        type: String,
        maxlength: 500,
      },
    ],
    responses: [AdminResponseSchema],
    internalNotes: [InternalNoteSchema],
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRegisteredUser: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ inquiryType: 1, status: 1 });
ContactMessageSchema.index({ isRead: 1, isSeen: 1 });
ContactMessageSchema.index({ isRegisteredUser: 1, status: 1 });
ContactMessageSchema.index({ assignedTo: 1, status: 1 });
ContactMessageSchema.index({ email: 1, status: 1 });

// Text search index
ContactMessageSchema.index(
  {
    name: "text",
    email: "text",
    subject: "text",
    message: "text",
  },
  {
    weights: {
      name: 10,
      email: 8,
      subject: 5,
      message: 1,
    },
  }
);

// Pre-save middleware for priority assignment
ContactMessageSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("inquiryType")) {
    switch (this.inquiryType) {
      case "support":
      case "partnership":
        this.priority = "high";
        break;
      case "mentorship":
      case "courses":
        this.priority = "medium";
        break;
      case "general":
      case "feedback":
        this.priority = "low";
        break;
      default:
        this.priority = "medium";
    }
  }
  next();
});

export default mongoose.model<ContactMessageDocument>(
  "ContactMessage",
  ContactMessageSchema
);
