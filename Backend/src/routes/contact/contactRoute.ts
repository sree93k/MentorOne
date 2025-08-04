import { Router } from "express";
import contactController from "../../controllers/implementation/contactController";
import {
  validateContactForm,
  validateMessageId,
  validatePagination,
} from "../../validator/ContactValidator";

const contactRoutes = Router();

// =================== PUBLIC ROUTES ===================
// No authentication required

// POST /contact/submit - Submit contact form
contactRoutes.post(
  "/submit",
  validateContactForm,
  contactController.createMessage
);

export default contactRoutes;
