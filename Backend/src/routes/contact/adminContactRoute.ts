// src/routes/contact/adminContactRoute.ts
import { Router } from "express";
import contactController from "../../controllers/implementation/contactController";
import { authenticate } from "../../middlewares/authenticateAdmin";
import {
  validateMessageId,
  validatePagination,
  validateUpdateMessage,
  validateResponse,
  validateInternalNote,
  validateBulkOperation,
} from "../../validator/ContactValidator";

const adminContactRoutes = Router();

// Apply admin authentication middleware to all routes
adminContactRoutes.use(authenticate);

// =================== MESSAGE MANAGEMENT ===================

// GET /admin/contact/messages - Get all messages with pagination and filters
adminContactRoutes.get(
  "/messages",
  validatePagination,
  contactController.getAllMessages
);

// GET /admin/contact/messages/search - Search messages
adminContactRoutes.get(
  "/messages/search",
  validatePagination,
  contactController.searchMessages
);

// GET /admin/contact/statistics - Get contact statistics
adminContactRoutes.get("/statistics", contactController.getStatistics);

// GET /admin/contact/messages/:id - Get single message by ID
adminContactRoutes.get(
  "/messages/:id",
  validateMessageId,
  contactController.getMessageById
);

// =================== MESSAGE UPDATES ===================

// PATCH /admin/contact/messages/:id/read - Mark message as read
adminContactRoutes.patch(
  "/messages/:id/read",
  validateMessageId,
  contactController.markAsRead
);

// PATCH /admin/contact/messages/:id/response - Add response to message
adminContactRoutes.patch(
  "/messages/:id/response",
  validateResponse,
  contactController.addResponse
);

// PATCH /admin/contact/messages/:id/note - Add internal note
adminContactRoutes.patch(
  "/messages/:id/note",
  validateInternalNote,
  contactController.addInternalNote
);

// PATCH /admin/contact/messages/:id - Update message (status, priority, assignment)
adminContactRoutes.patch(
  "/messages/:id",
  validateUpdateMessage,
  contactController.updateMessage
);

// =================== BULK OPERATIONS ===================

// PATCH /admin/contact/messages/bulk/seen - Bulk mark as seen
adminContactRoutes.patch(
  "/messages/bulk/seen",
  validateBulkOperation,
  contactController.bulkMarkAsSeen
);

// POST /admin/contact/messages/bulk/update-status - Bulk update status
adminContactRoutes.post(
  "/messages/bulk/update-status",
  validateBulkOperation,
  contactController.bulkUpdateStatus
);

// =================== ANALYTICS ===================

// GET /admin/contact/analytics/inquiry-types - Get message count by inquiry type
adminContactRoutes.get(
  "/analytics/inquiry-types",
  contactController.getMessageCountByInquiryType
);

// GET /admin/contact/analytics/response-time - Get average response time
adminContactRoutes.get(
  "/analytics/response-time",
  contactController.getAverageResponseTime
);

// =================== UTILITIES ===================

// GET /admin/contact/messages/export - Export messages
adminContactRoutes.get("/messages/export", contactController.exportMessages);

// DELETE /admin/contact/messages/:id - Archive message (soft delete)
adminContactRoutes.delete(
  "/messages/:id",
  validateMessageId,
  contactController.deleteMessage
);

export default adminContactRoutes;
