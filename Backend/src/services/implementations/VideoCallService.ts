// // import { v4 as uuidv4 } from "uuid";
// // import VideoCallRepository from "../../repositories/implementations/VideoCallRepository";
// // import { ApiError } from "../../middlewares/errorHandler";
// // import { IVideoCallService } from "../interface/IVideoCallService";
// // import NotificationService from "../../services/implementations/NotificationService";
// // import { INotificationService } from "../interface/INotificationService";

// // class VideoCallService implements IVideoCallService {
// //   private videoCallRepository: VideoCallRepository;
// //   private notificationService: NotificationService;
// //   constructor() {
// //     this.videoCallRepository = new VideoCallRepository();
// //     this.notificationService = new NotificationService();
// //   }

// //   async createMeeting(userId: string): Promise<string> {
// //     if (!userId) {
// //       throw new ApiError(400, "Bad Request", "User ID is required");
// //     }

// //     const meetingId = uuidv4();
// //     try {
// //       console.log("VideoCallService meeting creeation step 1");
// //       console.log("meetingId ", meetingId);
// //       console.log("creatorId", userId);

// //       await this.videoCallRepository.createMeeting({
// //         meetingId,
// //         creatorId: userId,
// //         participants: [{ userId, joinedAt: new Date() }],
// //         createdAt: new Date(),
// //       });
// //       console.log(
// //         `VideoCallService: Created meeting ${meetingId} for user ${userId}`
// //       );
// //       return meetingId;
// //     } catch (error: any) {
// //       console.error(`VideoCallService: Failed to create meeting:`, error);
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         "Failed to create meeting: " + error.message
// //       );
// //     }
// //   }

// //   async validateMeeting(meetingId: string): Promise<boolean> {
// //     if (!meetingId) {
// //       throw new ApiError(400, "Bad Request", "Meeting ID is required");
// //     }

// //     try {
// //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
// //       console.log(
// //         `VideoCallService: Validated meeting ${meetingId}: ${
// //           !!meeting && !meeting.endedAt
// //         }`
// //       );
// //       return !!meeting && !meeting.endedAt;
// //     } catch (error: any) {
// //       console.error(
// //         `VideoCallService: Failed to validate meeting ${meetingId}:`,
// //         error
// //       );
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         "Failed to validate meeting: " + error.message
// //       );
// //     }
// //   }

// //   async joinMeeting(
// //     meetingId: string,
// //     userId: string,
// //     userName: string,
// //     peerId: string
// //   ): Promise<any> {
// //     try {
// //       console.log(
// //         `VideoCallService: joinMeeting step 1 - meetingId: ${meetingId}, userId: ${userId}`
// //       );

// //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
// //       console.log(`VideoCallService: joinMeeting step 2 - meeting:`, meeting);
// //       if (!meeting) {
// //         console.log(`VideoCallService: joinMeeting step 3 - Meeting not found`);
// //         throw new ApiError(404, "Not Found", "Meeting not found");
// //       }
// //       console.log(
// //         `VideoCallService: joinMeeting step 4 - Checking existing participant for userId: ${userId}`
// //       );
// //       const existingParticipant = meeting.participants.find(
// //         (p) => p.userId === userId
// //       );
// //       console.log(
// //         `VideoCallService: joinMeeting step 5 - existingParticipant:`,
// //         existingParticipant
// //       );
// //       if (!existingParticipant) {
// //         console.log(
// //           `VideoCallService: joinMeeting step 6 - Adding new participant`
// //         );
// //         const newParticipant = { userId, joinedAt: new Date() };
// //         meeting.participants.push(newParticipant);
// //         console.log(
// //           `VideoCallService: joinMeeting step 7 - Updated participants:`,
// //           meeting.participants
// //         );
// //         const updateResult = await this.videoCallRepository.update(meetingId, {
// //           participants: meeting.participants,
// //         });
// //         console.log(
// //           `VideoCallService: joinMeeting step 8 - Update result:`,
// //           updateResult
// //         );
// //         if (updateResult.modifiedCount === 0) {
// //           console.warn(
// //             `VideoCallService: No changes made to meeting ${meetingId} for user ${userId}`
// //           );
// //         }
// //         console.log(
// //           `VideoCallService: Updated meeting ${meetingId} with new participant ${userId}`,
// //           updateResult
// //         );
// //       } else {
// //         console.log(
// //           `VideoCallService: User ${userId} already in meeting ${meetingId}`
// //         );
// //       }
// //       console.log(`VideoCallService: joinMeeting step 9 - Final success`);
// //       return {
// //         success: true,
// //         message: "Joined meeting successfully",
// //         meeting,
// //       };
// //     } catch (error: any) {
// //       console.error(
// //         `VideoCallService: Error joining meeting ${meetingId}:`,
// //         error
// //       );
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         error.message || "Failed to join meeting"
// //       );
// //     }
// //   }

// //   async leaveMeeting(meetingId: string, userId: string): Promise<void> {
// //     console.log(
// //       `VideoCallService: User ${userId} leaving meeting ${meetingId}`
// //     );
// //     try {
// //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
// //       if (!meeting) {
// //         console.warn(`VideoCallService: Meeting ${meetingId} not found`);
// //         return;
// //       }
// //       await this.videoCallRepository.removeParticipant(meetingId, userId);
// //       console.log(
// //         `VideoCallService: User ${userId} removed from meeting ${meetingId}`
// //       );
// //     } catch (error: any) {
// //       console.error(
// //         `VideoCallService: Error leaving meeting ${meetingId}:`,
// //         error.message,
// //         error.stack
// //       );
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         `Failed to leave meeting: ${error.message}`
// //       );
// //     }
// //   }

// //   async endMeeting(meetingId: string, userId: string): Promise<void> {
// //     if (!meetingId || !userId) {
// //       throw new ApiError(
// //         400,
// //         "Bad Request",
// //         "Meeting ID and User ID are required"
// //       );
// //     }

// //     try {
// //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
// //       if (!meeting) {
// //         throw new ApiError(404, "Not Found", "Meeting not found");
// //       }
// //       if (meeting.creatorId !== userId) {
// //         throw new ApiError(
// //           403,
// //           "Forbidden",
// //           "Only the creator can end the meeting"
// //         );
// //       }
// //       await this.videoCallRepository.endMeeting(meetingId);
// //       console.log(`VideoCallService: Ended meeting ${meetingId}`);
// //     } catch (error: any) {
// //       console.error(
// //         `VideoCallService: Failed to end meeting ${meetingId}:`,
// //         error
// //       );
// //       if (error instanceof ApiError) throw error;
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         "Failed to end meeting: " + error.message
// //       );
// //     }
// //   }

// //   async notifyMentee(
// //     mentorId: string,
// //     menteeId: string,
// //     meetingId: string,
// //     bookingId: string
// //   ): Promise<void> {
// //     try {
// //       console.log("VideoCallService notifyMentee step 1", {
// //         mentorId,
// //         menteeId,
// //         meetingId,
// //         bookingId,
// //       });
// //       await this.notificationService.createNotification({
// //         recipientId: menteeId,
// //         sender: mentorId,
// //         type: "meeting",
// //         message: `Your mentor has started a video call for your booking. Join now!`,
// //         link: `/user/meeting-join/${meetingId}`,
// //         bookingId,
// //       });
// //       console.log("VideoCallService notifyMentee step 2: Notification sent");
// //     } catch (error: any) {
// //       console.error("VideoCallService notifyMentee error:", error);
// //       throw new ApiError(
// //         500,
// //         "Internal Server Error",
// //         "Failed to send notification: " + error.message
// //       );
// //     }
// //   }
// // }

// // export default VideoCallService;
// import { v4 as uuidv4 } from "uuid";
// import VideoCallRepository from "../../repositories/implementations/VideoCallRepository";
// import { ApiError } from "../../middlewares/errorHandler";
// import { IVideoCallService } from "../interface/IVideoCallService";
// import NotificationService from "../../services/implementations/NotificationService";
// import mongoose from "mongoose";

// class VideoCallService implements IVideoCallService {
//   private videoCallRepository: VideoCallRepository;
//   private notificationService: NotificationService;

//   constructor() {
//     this.videoCallRepository = new VideoCallRepository();
//     this.notificationService = new NotificationService();
//   }

//   async createMeeting(
//     userId: string,
//     menteeId?: string,
//     bookingId?: string
//   ): Promise<string> {
//     if (!userId) {
//       throw new ApiError(400, "Bad Request", "User ID is required");
//     }

//     const meetingId = uuidv4();
//     try {
//       console.log("VideoCallService meeting creation step 1");
//       console.log("meetingId ", meetingId);
//       console.log("creatorId", userId);

//       await this.videoCallRepository.createMeeting({
//         meetingId,
//         creatorId: userId,
//         participants: [{ userId, joinedAt: new Date() }],
//         createdAt: new Date(),
//       });
//       console.log(
//         `VideoCallService: Created meeting ${meetingId} for user ${userId}`
//       );

//       // Send notification to mentee if menteeId and bookingId are provided
//       if (menteeId && bookingId) {
//         await this.notifyMentee(userId, menteeId, meetingId, bookingId);
//       }

//       return meetingId;
//     } catch (error: any) {
//       console.error(`VideoCallService: Failed to create meeting:`, error);
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         "Failed to create meeting: " + error.message
//       );
//     }
//   }

//   async validateMeeting(meetingId: string): Promise<boolean> {
//     if (!meetingId) {
//       throw new ApiError(400, "Bad Request", "Meeting ID is required");
//     }

//     try {
//       const meeting = await this.videoCallRepository.findMeeting(meetingId);
//       console.log(
//         `VideoCallService: Validated meeting ${meetingId}: ${
//           !!meeting && !meeting.endedAt
//         }`
//       );
//       return !!meeting && !meeting.endedAt;
//     } catch (error: any) {
//       console.error(
//         `VideoCallService: Failed to validate meeting ${meetingId}:`,
//         error
//       );
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         "Failed to validate meeting: " + error.message
//       );
//     }
//   }

//   async joinMeeting(
//     meetingId: string,
//     userId: string,
//     userName: string,
//     peerId: string
//   ): Promise<any> {
//     try {
//       console.log(
//         `VideoCallService: joinMeeting step 1 - meetingId: ${meetingId}, userId: ${userId}`
//       );

//       const meeting = await this.videoCallRepository.findMeeting(meetingId);
//       console.log(`VideoCallService: joinMeeting step 2 - meeting:`, meeting);
//       if (!meeting) {
//         console.log(`VideoCallService: joinMeeting step 3 - Meeting not found`);
//         throw new ApiError(404, "Not Found", "Meeting not found");
//       }
//       console.log(
//         `VideoCallService: joinMeeting step 4 - Checking existing participant for userId: ${userId}`
//       );
//       const existingParticipant = meeting.participants.find(
//         (p) => p.userId === userId
//       );
//       console.log(
//         `VideoCallService: joinMeeting step 5 - existingParticipant:`,
//         existingParticipant
//       );
//       if (!existingParticipant) {
//         console.log(
//           `VideoCallService: joinMeeting step 6 - Adding new participant`
//         );
//         const newParticipant = { userId, joinedAt: new Date() };
//         meeting.participants.push(newParticipant);
//         console.log(
//           `VideoCallService: joinMeeting step 7 - Updated participants:`,
//           meeting.participants
//         );
//         const updateResult = await this.videoCallRepository.update(meetingId, {
//           participants: meeting.participants,
//         });
//         console.log(
//           `VideoCallService: joinMeeting step 8 - Update result:`,
//           updateResult
//         );
//         if (updateResult.modifiedCount === 0) {
//           console.warn(
//             `VideoCallService: No changes made to meeting ${meetingId} for user ${userId}`
//           );
//         }
//         console.log(
//           `VideoCallService: Updated meeting ${meetingId} with new participant ${userId}`,
//           updateResult
//         );
//       } else {
//         console.log(
//           `VideoCallService: User ${userId} already in meeting ${meetingId}`
//         );
//       }
//       console.log(`VideoCallService: joinMeeting step 9 - Final success`);
//       return {
//         success: true,
//         message: "Joined meeting successfully",
//         meeting,
//       };
//     } catch (error: any) {
//       console.error(
//         `VideoCallService: Error joining meeting ${meetingId}:`,
//         error
//       );
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         error.message || "Failed to join meeting"
//       );
//     }
//   }

//   async leaveMeeting(meetingId: string, userId: string): Promise<void> {
//     console.log(
//       `VideoCallService: User ${userId} leaving meeting ${meetingId}`
//     );
//     try {
//       const meeting = await this.videoCallRepository.findMeeting(meetingId);
//       if (!meeting) {
//         console.warn(`VideoCallService: Meeting ${meetingId} not found`);
//         return;
//       }
//       await this.videoCallRepository.removeParticipant(meetingId, userId);
//       console.log(
//         `VideoCallService: User ${userId} removed from meeting ${meetingId}`
//       );
//     } catch (error: any) {
//       console.error(
//         `VideoCallService: Error leaving meeting ${meetingId}:`,
//         error.message,
//         error.stack
//       );
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         `Failed to leave meeting: ${error.message}`
//       );
//     }
//   }

//   async endMeeting(meetingId: string, userId: string): Promise<void> {
//     if (!meetingId || !userId) {
//       throw new ApiError(
//         400,
//         "Bad Request",
//         "Meeting ID and User ID are required"
//       );
//     }

//     try {
//       const meeting = await this.videoCallRepository.findMeeting(meetingId);
//       if (!meeting) {
//         throw new ApiError(404, "Not Found", "Meeting not found");
//       }
//       if (meeting.creatorId !== userId) {
//         throw new ApiError(
//           403,
//           "Forbidden",
//           "Only the creator can end the meeting"
//         );
//       }
//       await this.videoCallRepository.endMeeting(meetingId);
//       console.log(`VideoCallService: Ended meeting ${meetingId}`);
//     } catch (error: any) {
//       console.error(
//         `VideoCallService: Failed to end meeting ${meetingId}:`,
//         error
//       );
//       if (error instanceof ApiError) throw error;
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         "Failed to end meeting: " + error.message
//       );
//     }
//   }

//   async notifyMentee(
//     mentorId: string,
//     menteeId: string,
//     meetingId: string,
//     bookingId: string
//   ): Promise<void> {
//     try {
//       console.log("VideoCallService notifyMentee step 1", {
//         mentorId,
//         menteeId,
//         meetingId,
//         bookingId,
//       });

//       // Fetch mentor details for sender object
//       const User = mongoose.model("Users");
//       const mentor = await User.findById(mentorId).select("firstName lastName");
//       if (!mentor) {
//         throw new ApiError(404, "Not Found", "Mentor not found");
//       }

//       await this.notificationService.createNotification(
//         menteeId,
//         "meeting",
//         `Your mentor has started a video call for your booking. Join now!`,
//         bookingId, // Use bookingId as relatedId
//         undefined, // io is optional, not needed here
//         {
//           firstName: mentor.firstName,
//           lastName: mentor.lastName,
//           id: mentorId,
//         }
//       );
//       console.log("VideoCallService notifyMentee step 2: Notification sent");
//     } catch (error: any) {
//       console.error("VideoCallService notifyMentee error:", error);
//       throw new ApiError(
//         500,
//         "Internal Server Error",
//         "Failed to send notification: " + error.message
//       );
//     }
//   }
// }

// export default new VideoCallService();
import { v4 as uuidv4 } from "uuid";
import VideoCallRepository from "../../repositories/implementations/VideoCallRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { IVideoCallService } from "../interface/IVideoCallService";
import NotificationService from "../../services/implementations/NotificationService";
import mongoose from "mongoose";

class VideoCallService implements IVideoCallService {
  private videoCallRepository: VideoCallRepository;
  private notificationService: NotificationService;
  private bookingRepository: BookingRepository;

  constructor() {
    this.videoCallRepository = new VideoCallRepository();
    this.notificationService = new NotificationService();
    this.bookingRepository = new BookingRepository();
  }

  async createMeeting(
    userId: string,
    menteeId?: string,
    bookingId?: string
  ): Promise<string> {
    if (!userId) {
      throw new ApiError(400, "Bad Request", "User ID is required");
    }

    const meetingId = uuidv4();
    try {
      console.log("VideoCallService meeting creation step 1");
      console.log("meetingId ", meetingId);
      console.log("creatorId", userId);
      console.log("bookingId", bookingId);

      await this.videoCallRepository.createMeeting({
        meetingId,
        creatorId: userId,
        bookingId,
        participants: [{ userId, joinedAt: new Date() }],
        createdAt: new Date(),
      });
      console.log(
        `VideoCallService: Created meeting ${meetingId} for user ${userId}${
          bookingId ? ` with booking ${bookingId}` : ""
        }`
      );

      // Update booking with meetingId if provided
      if (bookingId) {
        await this.bookingRepository.update(bookingId, { meetingId });
        console.log(`Updated booking ${bookingId} with meetingId ${meetingId}`);
      }

      // Send notification to mentee if menteeId and bookingId are provided
      if (menteeId && bookingId) {
        await this.notifyMentee(userId, menteeId, meetingId, bookingId);
      }

      return meetingId;
    } catch (error: any) {
      console.error(`VideoCallService: Failed to create meeting:`, error);
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to create meeting: " + error.message
      );
    }
  }

  async validateMeeting(meetingId: string): Promise<boolean> {
    if (!meetingId) {
      throw new ApiError(400, "Bad Request", "Meeting ID is required");
    }

    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      console.log(
        `VideoCallService: Validated meeting ${meetingId}: ${
          !!meeting && !meeting.endedAt
        }`
      );
      return !!meeting && !meeting.endedAt;
    } catch (error: any) {
      console.error(
        `VideoCallService: Failed to validate meeting ${meetingId}:`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to validate meeting: " + error.message
      );
    }
  }

  async joinMeeting(
    meetingId: string,
    userId: string,
    userName: string,
    peerId: string
  ): Promise<any> {
    try {
      console.log(
        `VideoCallService: joinMeeting step 1 - meetingId: ${meetingId}, userId: ${userId}`
      );

      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      console.log(`VideoCallService: joinMeeting step 2 - meeting:`, meeting);
      if (!meeting) {
        console.log(`VideoCallService: joinMeeting step 3 - Meeting not found`);
        throw new ApiError(404, "Not Found", "Meeting not found");
      }
      console.log(
        `VideoCallService: joinMeeting step 4 - Checking existing participant for userId: ${userId}`
      );
      const existingParticipant = meeting.participants.find(
        (p) => p.userId === userId
      );
      console.log(
        `VideoCallService: joinMeeting step 5 - existingParticipant:`,
        existingParticipant
      );
      if (!existingParticipant) {
        console.log(
          `VideoCallService: joinMeeting step 6 - Adding new participant`
        );
        const newParticipant = { userId, joinedAt: new Date() };
        meeting.participants.push(newParticipant);
        console.log(
          `VideoCallService: joinMeeting step 7 - Updated participants:`,
          meeting.participants
        );
        const updateResult = await this.videoCallRepository.update(meetingId, {
          participants: meeting.participants,
        });
        console.log(
          `VideoCallService: joinMeeting step 8 - Update result:`,
          updateResult
        );
        if (updateResult.modifiedCount === 0) {
          console.warn(
            `VideoCallService: No changes made to meeting ${meetingId} for user ${userId}`
          );
        }
        console.log(
          `VideoCallService: Updated meeting ${meetingId} with new participant ${userId}`,
          updateResult
        );
      } else {
        console.log(
          `VideoCallService: User ${userId} already in meeting ${meetingId}`
        );
      }
      console.log(`VideoCallService: joinMeeting step 9 - Final success`);
      return {
        success: true,
        message: "Joined meeting successfully",
        meeting,
      };
    } catch (error: any) {
      console.error(
        `VideoCallService: Error joining meeting ${meetingId}:`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error",
        error.message || "Failed to join meeting"
      );
    }
  }

  async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    console.log(
      `VideoCallService: User ${userId} leaving meeting ${meetingId}`
    );
    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      if (!meeting) {
        console.warn(`VideoCallService: Meeting ${meetingId} not found`);
        return;
      }
      await this.videoCallRepository.removeParticipant(meetingId, userId);
      console.log(
        `VideoCallService: User ${userId} removed from meeting ${meetingId}`
      );
    } catch (error: any) {
      console.error(
        `VideoCallService: Error leaving meeting ${meetingId}:`,
        error.message,
        error.stack
      );
      throw new ApiError(
        500,
        "Internal Server Error",
        `Failed to leave meeting: ${error.message}`
      );
    }
  }

  async endMeeting(meetingId: string, userId: string): Promise<void> {
    if (!meetingId || !userId) {
      throw new ApiError(
        400,
        "Bad Request",
        "Meeting ID and User ID are required"
      );
    }

    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      if (!meeting) {
        throw new ApiError(404, "Not Found", "Meeting not found");
      }
      if (meeting.creatorId !== userId) {
        throw new ApiError(
          403,
          "Forbidden",
          "Only the creator can end the meeting"
        );
      }
      await this.videoCallRepository.endMeeting(meetingId);
      console.log(`VideoCallService: Ended meeting ${meetingId}`);
    } catch (error: any) {
      console.error(
        `VideoCallService: Failed to end meeting ${meetingId}:`,
        error
      );
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to end meeting: " + error.message
      );
    }
  }

  async notifyMentee(
    mentorId: string,
    menteeId: string,
    meetingId: string,
    bookingId: string
  ): Promise<void> {
    try {
      console.log("VideoCallService notifyMentee step 1", {
        mentorId,
        menteeId,
        meetingId,
        bookingId,
      });

      // Fetch mentor details for sender object
      const User = mongoose.model("Users");
      const mentor = await User.findById(mentorId).select("firstName lastName");
      if (!mentor) {
        throw new ApiError(404, "Not Found", "Mentor not found");
      }

      await this.notificationService.createNotification(
        menteeId,
        "meeting",
        `Your mentor has started a video call for your booking. Join now!`,
        meetingId, // Use meetingId as relatedId
        undefined, // io is optional
        {
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          id: mentorId,
        }
      );
      console.log("VideoCallService notifyMentee step 2: Notification sent");
    } catch (error: any) {
      console.error("VideoCallService notifyMentee error:", error);
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to send notification: " + error.message
      );
    }
  }
}

export default VideoCallService;
