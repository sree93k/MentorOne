import { Router } from "express";
import { RouteFactory } from "../../utils/routeFactory";
import {
  validateContactForm,
  validateMessageId,
  validatePagination,
} from "../../validator/ContactValidator";

const contactRoutes = Router();

// Get controller instance from factory
const contactController = RouteFactory.getContactController();

// =================== PUBLIC ROUTES ===================
// No authentication required

// POST /contact/submit - Submit contact form
contactRoutes.post(
  "/submit",
  validateContactForm,
  contactController.createMessage
);

export default contactRoutes;
