import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { CreateContactMessageDTO, IContactMessageService } from "../../services/interface/IContactMessageService";
import { TYPES } from "../../inversify/types";

@injectable()
class ContactController {
  private contactMessageService: IContactMessageService;

  constructor(
    @inject(TYPES.IContactMessageService) contactMessageService: IContactMessageService
  ) {
    this.contactMessageService = contactMessageService;
  }

  // =================== PUBLIC ROUTES ===================

  // POST /contact/submit - User submits contact form
  createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const messageData: CreateContactMessageDTO = req.body;

      // Server-side validation
      const { name, email, subject, inquiryType, message, agreeToPrivacy } =
        messageData;

      if (!name || !email || !subject || !inquiryType || !message) {
        res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
        return;
      }

      if (!agreeToPrivacy) {
        res.status(400).json({
          success: false,
          message: "Privacy policy agreement is required",
        });
        return;
      }

      const createdMessage = await this.contactMessageService.createMessage(
        messageData
      );

      // ✅ SOCKET.IO: Send real-time notification to admin
      try {
        const io = (req as any).io;
        if (io) {
          console.log(
            "📡 Emitting new contact message to admins:",
            createdMessage.subject
          );

          // Emit to existing notification namespace
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("new_contact_message", {
            type: "new_contact_message",
            message: `New contact message from ${createdMessage.name}`,
            data: {
              id: createdMessage._id,
              name: createdMessage.name,
              email: createdMessage.email,
              subject: createdMessage.subject,
              inquiryType: createdMessage.inquiryType,
              priority: createdMessage.priority,
              isRegisteredUser: createdMessage.isRegisteredUser,
              createdAt: createdMessage.createdAt,
            },
            timestamp: new Date().toISOString(),
          });

          // Update statistics for all admin dashboards
          const statistics = await this.contactMessageService.getStatistics();
          notificationNamespace.emit("contact_statistics_update", statistics);
        }
      } catch (socketError) {
        console.error("⚠️ Socket.IO notification failed:", socketError);
        // Don't fail the request if socket notification fails
      }

      res.status(201).json({
        success: true,
        message:
          "Message sent successfully! We'll get back to you within 24 hours.",
        data: {
          id: createdMessage._id,
          status: createdMessage.status,
          priority: createdMessage.priority,
          isRegisteredUser: createdMessage.isRegisteredUser,
        },
      });
    } catch (error: any) {
      console.error("❌ Create contact message error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
      const search = req.query.search as string;

      // Build filters object
      const filters: any = {};

      // Standard filters
      if (req.query.status) filters.status = req.query.status;
      if (req.query.inquiryType) filters.inquiryType = req.query.inquiryType;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

      // ✅ FIXED: Proper handling of isRegisteredUser parameter
      if (req.query.isRegisteredUser !== undefined) {
        const isRegisteredUserParam = req.query.isRegisteredUser;

        console.log("🔍 Processing isRegisteredUser param:", {
          rawParam: isRegisteredUserParam,
          type: typeof isRegisteredUserParam,
        });

        // Handle string and boolean values
        if (
          isRegisteredUserParam === "true" ||
          isRegisteredUserParam === true
        ) {
          filters.isRegisteredUser = true;
          console.log(
            "🔍 Applied filter: isRegisteredUser = true (Registered Users)"
          );
        } else if (
          isRegisteredUserParam === "false" ||
          isRegisteredUserParam === false
        ) {
          filters.isRegisteredUser = false;
          console.log(
            "🔍 Applied filter: isRegisteredUser = false (Guest Users)"
          );
        }
        // If it's any other value, we don't apply the filter (show all)
      }

      // Handle date range filter
      if (req.query.startDate && req.query.endDate) {
        filters.dateRange = {
          start: new Date(req.query.startDate as string),
          end: new Date(req.query.endDate as string),
        };
      }

      // Handle search filter
      if (search) {
        filters.search = search;
      }

      // ✅ Enhanced debug logging
      console.log("🔍 getAllMessages processing:", {
        page,
        limit,
        allQueryParams: req.query,
        processedFilters: filters,
        isRegisteredUserReceived: req.query.isRegisteredUser,
        isRegisteredUserInFilters: filters.hasOwnProperty("isRegisteredUser"),
      });

      const result = await this.contactMessageService.getAllMessages(
        { page, limit, sortBy, sortOrder },
        filters
      );

      // ✅ Debug logging for results
      console.log("🔍 getAllMessages results:", {
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
        dataCount: result.data.length,
        appliedFilters: filters,
        sampleData: result.data.slice(0, 2).map((msg) => ({
          id: msg._id,
          name: msg.name,
          email: msg.email,
          isRegisteredUser: msg.isRegisteredUser,
        })),
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        appliedFilters: filters, // ✅ Send back applied filters
      });
    } catch (error: any) {
      console.error("❌ Get all messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // GET /admin/contact/messages/:id - Admin gets single message by ID
  getMessageById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      const message = await this.contactMessageService.getMessageById(id);

      // Auto-mark as seen when admin views
      if (!message.isSeen) {
        await this.contactMessageService.markAsSeen(id);
        message.isSeen = true; // Update local object
      }

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      console.error("❌ Get message by ID error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to fetch message",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // PATCH /admin/contact/messages/:id/read - Admin marks message as read
  markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      const message = await this.contactMessageService.markAsRead(id);

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("message_status_updated", {
            messageId: id,
            isRead: true,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: "Message marked as read",
        data: message,
      });
    } catch (error: any) {
      console.error("❌ Mark as read error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to mark message as read",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // PATCH /admin/contact/messages/bulk/seen - Admin bulk marks messages as seen
  bulkMarkAsSeen = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid message IDs array",
        });
        return;
      }

      const updatedCount = await this.contactMessageService.bulkMarkAsSeen(ids);

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("messages_bulk_updated", {
            messageIds: ids,
            action: "marked_as_seen",
            updatedCount,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: `${updatedCount} messages marked as seen`,
        data: { updatedCount },
      });
    } catch (error: any) {
      console.error("❌ Bulk mark as seen error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark messages as seen",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // PATCH /admin/contact/messages/:id/response - Admin adds response to message
  addResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { message: responseMessage } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      if (!responseMessage || responseMessage.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: "Response message is required",
        });
        return;
      }

      // Get admin info from auth middleware
      const adminId =
        (req as any).admin?.id || (req as any).admin?._id || "admin";
      const adminName =
        (req as any).admin?.adminName || (req as any).admin?.name || "Admin";

      const updatedMessage = await this.contactMessageService.addResponse(
        id,
        adminId,
        adminName,
        responseMessage
      );

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("message_response_added", {
            messageId: id,
            adminName,
            response: responseMessage,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: "Response added successfully",
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error("❌ Add response error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to add response",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // PATCH /admin/contact/messages/:id/note - Admin adds internal note
  addInternalNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { note } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      if (!note || note.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: "Note is required",
        });
        return;
      }

      // Get admin info from auth middleware
      const adminId =
        (req as any).admin?.id || (req as any).admin?._id || "admin";
      const adminName =
        (req as any).admin?.adminName || (req as any).admin?.name || "Admin";

      const updatedMessage = await this.contactMessageService.addInternalNote(
        id,
        adminId,
        adminName,
        note
      );

      res.status(200).json({
        success: true,
        message: "Internal note added successfully",
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error("❌ Add internal note error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to add internal note",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // PATCH /admin/contact/messages/:id - Admin updates message (status, priority, assignment)
  updateMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      if (!updates || Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          message: "Update data is required",
        });
        return;
      }

      const updatedMessage = await this.contactMessageService.updateMessage(
        id,
        updates
      );

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("message_updated", {
            messageId: id,
            updates,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: "Message updated successfully",
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error("❌ Update message error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update message",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // GET /admin/contact/statistics - Get contact statistics for dashboard
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.contactMessageService.getStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error: any) {
      console.error("❌ Get statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // GET /admin/contact/messages/search - Search messages
  searchMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      if (q.trim().length < 2) {
        res.status(400).json({
          success: false,
          message: "Search query must be at least 2 characters long",
        });
        return;
      }

      const result = await this.contactMessageService.searchMessages(
        q as string,
        { page, limit }
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error("❌ Search messages error:", error);
      res.status(500).json({
        success: false,
        message: "Search failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // DELETE /admin/contact/messages/:id - Archive message (soft delete)
  deleteMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Message ID is required",
        });
        return;
      }

      // Instead of hard delete, change status to archived
      await this.contactMessageService.changeStatus(id, "archived");

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("message_archived", {
            messageId: id,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: "Message archived successfully",
      });
    } catch (error: any) {
      console.error("❌ Delete message error:", error);

      if (error.message === "Contact message not found") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to archive message",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  };

  // GET /admin/contact/analytics/inquiry-types - Get message count by inquiry type
  getMessageCountByInquiryType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const counts =
        await this.contactMessageService.getMessageCountByInquiryType();

      res.status(200).json({
        success: true,
        data: counts,
      });
    } catch (error: any) {
      console.error("❌ Get message count by inquiry type error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inquiry type statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // GET /admin/contact/analytics/response-time - Get average response time
  getAverageResponseTime = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const averageTime =
        await this.contactMessageService.getAverageResponseTime();

      res.status(200).json({
        success: true,
        data: {
          averageResponseTimeHours: averageTime,
          averageResponseTimeDays: averageTime / 24,
        },
      });
    } catch (error: any) {
      console.error("❌ Get average response time error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate average response time",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // POST /admin/contact/messages/bulk/update-status - Bulk update status
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids, status } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid message IDs array",
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const updatedCount = await this.contactMessageService.bulkUpdateStatus(
        ids,
        status
      );

      // Emit socket event for real-time update
      try {
        const io = (req as any).io;
        if (io) {
          const notificationNamespace = io.of("/notifications");
          notificationNamespace.emit("messages_bulk_status_updated", {
            messageIds: ids,
            status,
            updatedCount,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (socketError) {
        console.error("⚠️ Socket notification failed:", socketError);
      }

      res.status(200).json({
        success: true,
        message: `${updatedCount} messages updated successfully`,
        data: { updatedCount },
      });
    } catch (error: any) {
      console.error("❌ Bulk update status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to bulk update status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  // GET /admin/contact/messages/export - Export messages to CSV
  exportMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { format = "csv" } = req.query;

      // Get all messages
      const result = await this.contactMessageService.getAllMessages(
        { page: 1, limit: 10000 }, // Large limit to get all messages
        {}
      );

      if (format === "csv") {
        // Generate CSV
        const csvHeaders = [
          "ID",
          "Name",
          "Email",
          "Phone",
          "Subject",
          "Inquiry Type",
          "Message",
          "Status",
          "Priority",
          "Registered User",
          "Created At",
          "Updated At",
        ];

        const csvRows = result.data.map((msg) => [
          msg._id,
          msg.name,
          msg.email,
          msg.phone || "",
          msg.subject,
          msg.inquiryType,
          msg.message.replace(/"/g, '""'), // Escape quotes
          msg.status,
          msg.priority,
          msg.isRegisteredUser ? "Yes" : "No",
          new Date(msg.createdAt!).toISOString(),
          new Date(msg.updatedAt!).toISOString(),
        ]);

        const csvContent = [
          csvHeaders.join(","),
          ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
        ].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="contact-messages.csv"'
        );
        res.status(200).send(csvContent);
      } else {
        res.status(400).json({
          success: false,
          message: "Unsupported export format",
        });
      }
    } catch (error: any) {
      console.error("❌ Export messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export messages",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
}

export default ContactController;
