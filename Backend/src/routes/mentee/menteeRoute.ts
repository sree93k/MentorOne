import { Router } from "express";
import menteeController from "../../controllers/menteeController/menteeController";
import multer from "multer";
import { authenticate } from "../../middlewares/authenticateuser";
import uploadController from "../../controllers/userController/uploadController";
import bookingController from "../../controllers/bookingController/bookingController";
const menteeRoutes = Router();
const upload = multer({ dest: "uploads/" });

menteeRoutes.put(
  "/welcomeform",
  authenticate,
  menteeController.uploadWelcomeForm
);

menteeRoutes.get("/profileData", authenticate, menteeController.profileData);

menteeRoutes.delete(
  "/deleteAccount",
  authenticate,
  menteeController.deleteAccount
);

menteeRoutes.get("/allMentors", authenticate, menteeController.getAllMentors);
menteeRoutes.get("/mentor/:id", menteeController.getMentorById);
menteeRoutes.post("/bookings", authenticate, bookingController.createBooking);

menteeRoutes.get("/bookings", authenticate, bookingController.getBookings);

menteeRoutes.delete(
  "/bookings/:bookingId",
  authenticate,
  bookingController.deleteBooking
);

menteeRoutes.get(
  "/seeker/getbookings",
  authenticate,
  menteeController.getBookings.bind(menteeController)
);

menteeRoutes.get(
  "/alltutorials",
  authenticate,
  menteeController.getAllTutorials.bind(menteeController)
);

menteeRoutes.get(
  "/exclusivecontent/:id",
  authenticate,
  menteeController.getTutorialById.bind(menteeController)
);

export default menteeRoutes;
