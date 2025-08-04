// src/utils/socket/contactSocket.ts (Extends existing notification namespace)
import { Server } from "socket.io";
import { ContactMessageService } from "../../services/implementations/ContactMessageService";
import { IUserService } from "../../services/interface/IUserService";
import UserService from "../../services/implementations/UserService";

const userService: IUserService = new UserService();
const contactMessageService = new ContactMessageService(userService);

export const extendNotificationSocketForContact = (
  notificationNamespace: any
) => {
  console.log("🔧 Extending notification socket for contact messages...");

  // Add contact-specific listeners to existing notification socket
  notificationNamespace.on("connection", (socket: any) => {
    console.log("👤 Client connected to notification socket:", socket.id);

    // Handle contact notification subscription for admins
    socket.on("subscribe_contact_notifications", async (adminId: string) => {
      try {
        socket.join(`admin_contact_${adminId}`);
        socket.join("admin_contact"); // General admin contact room
        console.log(`👨‍💼 Admin ${adminId} subscribed to contact notifications`);

        // Send initial contact statistics
        const stats = await contactMessageService.getStatistics();
        socket.emit("contact_statistics", stats);
      } catch (error) {
        console.error("❌ Error subscribing to contact notifications:", error);
      }
    });

    socket.on("unsubscribe_contact_notifications", (adminId: string) => {
      socket.leave(`admin_contact_${adminId}`);
      socket.leave("admin_contact");
      console.log(
        `👨‍💼 Admin ${adminId} unsubscribed from contact notifications`
      );
    });

    // Handle admin requesting latest statistics
    socket.on("request_contact_statistics", async () => {
      try {
        const stats = await contactMessageService.getStatistics();
        socket.emit("contact_statistics", stats);
        console.log("📊 Sent updated contact statistics to admin:", stats);
      } catch (error) {
        console.error("❌ Error fetching contact statistics:", error);
        socket.emit("contact_error", {
          message: "Failed to fetch contact statistics",
        });
      }
    });

    // Handle admin viewing messages (bulk mark as seen)
    socket.on("admin_viewing_messages", async (messageIds: string[]) => {
      try {
        if (Array.isArray(messageIds) && messageIds.length > 0) {
          await contactMessageService.bulkMarkAsSeen(messageIds);

          // Broadcast updated statistics to all admins
          const stats = await contactMessageService.getStatistics();
          notificationNamespace
            .to("admin_contact")
            .emit("contact_statistics_update", {
              unseenCount: stats.unseenCount,
              unreadCount: stats.unreadCount,
              hasNewMessages: stats.hasNewMessages,
            });

          console.log(`📋 Admin marked ${messageIds.length} messages as seen`);
        }
      } catch (error) {
        console.error("❌ Error marking messages as seen:", error);
      }
    });

    // Handle real-time message status updates
    socket.on(
      "update_message_status",
      async (data: { messageId: string; status: string }) => {
        try {
          await contactMessageService.changeStatus(data.messageId, data.status);

          // Broadcast the update to all admins
          notificationNamespace
            .to("admin_contact")
            .emit("message_status_updated", {
              messageId: data.messageId,
              status: data.status,
              timestamp: new Date().toISOString(),
            });

          console.log(
            `📝 Message ${data.messageId} status updated to ${data.status}`
          );
        } catch (error) {
          console.error("❌ Error updating message status:", error);
          socket.emit("contact_error", {
            message: "Failed to update message status",
          });
        }
      }
    );
  });
};

// Function to notify all admins of new contact message
export const notifyAdminsNewMessage = (
  notificationNamespace: any,
  messageData: any
) => {
  console.log(
    "📢 Broadcasting new contact message to admins:",
    messageData.subject
  );

  const notificationData = {
    type: "new_contact_message",
    message: `New ${messageData.inquiryType} inquiry from ${messageData.name}`,
    data: {
      id: messageData._id,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      inquiryType: messageData.inquiryType,
      priority: messageData.priority,
      isRegisteredUser: messageData.isRegisteredUser,
      createdAt: messageData.createdAt,
    },
    timestamp: new Date().toISOString(),
  };

  // Emit to all admins in the contact room
  notificationNamespace
    .to("admin_contact")
    .emit("new_contact_message", notificationData);

  console.log("✅ Contact notification sent to all admins");
};

// Function to broadcast contact statistics updates
export const broadcastContactStatistics = async (
  notificationNamespace: any
) => {
  try {
    const stats = await contactMessageService.getStatistics();

    const statisticsData = {
      unseenCount: stats.unseenCount,
      unreadCount: stats.unreadCount,
      hasNewMessages: stats.hasNewMessages,
      totalMessages: stats.totalMessages,
      newMessages: stats.newMessages,
      inProgressMessages: stats.inProgressMessages,
      resolvedMessages: stats.resolvedMessages,
      timestamp: new Date().toISOString(),
    };

    notificationNamespace
      .to("admin_contact")
      .emit("contact_statistics_update", statisticsData);
    console.log("📊 Broadcasted contact statistics update:", statisticsData);
  } catch (error) {
    console.error("❌ Error broadcasting contact statistics:", error);
  }
};

export default {
  extendNotificationSocketForContact,
  notifyAdminsNewMessage,
  broadcastContactStatistics,
};
