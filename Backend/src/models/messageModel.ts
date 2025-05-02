// import mongoose, { Schema } from "mongoose";

// const MessageSchema = new Schema({
//   senderId: {
//     type: Schema.Types.ObjectId,
//     ref: "Users", // Reference to Users model
//     required: true,
//   },
//   recipientId: {
//     type: Schema.Types.ObjectId,
//     ref: "Users", // Reference to Users model
//     required: true,
//   },
//   bookingId: {
//     type: Schema.Types.ObjectId,
//     ref: "Booking", // Link to Booking for context
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   read: {
//     type: Boolean,
//     default: false,
//   },
// });

// export default mongoose.model("Message", MessageSchema);
import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: { type: String, trim: true, required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
