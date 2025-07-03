// import { Router } from "express";
// import { welcomeFormValidator } from "../../validator/MentorValidator";
// import mentorController from "../../controllers/implementation/mentorController";
// import { authenticate } from "../../middlewares/authenticateuser";
// import multer from "multer";
// import bookingController from "../../controllers/implementation/bookingController";
// import paymentController from "../../controllers/implementation/paymentController";
// import { auth } from "../../utils/socket";
// const upload = multer({ storage: multer.memoryStorage() });
// const mentorRoutes = Router();

// mentorRoutes.put(
//   "/welcomeform",
//   authenticate,
//   welcomeFormValidator,
//   mentorController.uploadWelcomeForm
// );

// mentorRoutes.get("/profile/:id", authenticate, mentorController.getProfileData);

// mentorRoutes.post(
//   "/createService",
//   authenticate,
//   upload.any(),
//   mentorController.createService
// );
// mentorRoutes.get(
//   "/generate-presigned-url",
//   authenticate,
//   mentorController.generatePresignedUrl
// );

// mentorRoutes.get(
//   "/get-presigned-url",
//   authenticate,
//   mentorController.getPresignedUrl
// );

// mentorRoutes.get("/allServices", authenticate, mentorController.getAllServices);
// mentorRoutes.get("/service/:id", authenticate, mentorController.getServiceById);
// mentorRoutes.put(
//   "/updateService/:id",
//   authenticate,
//   upload.any(),
//   mentorController.updateService
// );

// mentorRoutes.get(
//   "/:mentorId/calendar",
//   authenticate,
//   mentorController.getMentorCalendar.bind(mentorController)
// );
// mentorRoutes.put(
//   "/:mentorId/policy",
//   authenticate,
//   mentorController.updatePolicy.bind(mentorController)
// );
// mentorRoutes.post(
//   "/:mentorId/schedules",
//   authenticate,
//   mentorController.createSchedule.bind(mentorController)
// );
// mentorRoutes.put(
//   "/:mentorId/schedules/:scheduleId",
//   authenticate,
//   mentorController.updateSchedule.bind(mentorController)
// );
// mentorRoutes.delete(
//   "/:mentorId/schedules/:scheduleId",
//   authenticate,
//   mentorController.deleteSchedule.bind(mentorController)
// );
// mentorRoutes.post(
//   "/:mentorId/blocked-dates",
//   authenticate,
//   mentorController.addBlockedDates.bind(mentorController)
// );
// mentorRoutes.delete(
//   "/:mentorId/blocked-dates/:blockedDateId",
//   authenticate,
//   mentorController.removeBlockedDate.bind(mentorController)
// );

// mentorRoutes.get(
//   "/isApprovalChecking/:mentorId",
//   authenticate,
//   mentorController.isApprovalChecking.bind(mentorController)
// );

// mentorRoutes.get(
//   "/bookings",
//   authenticate,
//   bookingController.getMentorBookings.bind(bookingController)
// );

// mentorRoutes.get(
//   "/payment/mentor-payments",
//   authenticate,
//   paymentController.getAllMentorPayments.bind(paymentController)
// );

// // mentorRoutes.ts
// mentorRoutes.post(
//   "/service/:serviceId/assign-schedule",
//   authenticate,
//   mentorController.assignScheduleToService.bind(mentorController)
// );

// mentorRoutes.post(
//   "/priority-dm/:priorityDMId/reply",
//   authenticate,
//   mentorController.replyToPriorityDM.bind(mentorController)
// );

// mentorRoutes.get(
//   "/priority-dm/:serviceId",
//   authenticate,
//   mentorController.getPriorityDMs.bind(mentorController)
// );

// mentorRoutes.get(
//   "/priority-dm",
//   authenticate,
//   mentorController.getAllPriorityDMsByMentor.bind(mentorController)
// );

// mentorRoutes.get(
//   "/allvideocalls",
//   authenticate,
//   bookingController.getAllVideoCallsByMentor.bind(bookingController)
// );

// mentorRoutes.get(
//   "/testimonials",
//   authenticate,
//   bookingController.getTestimonialsByMentor.bind(mentorController)
// );

// mentorRoutes.put(
//   "/top-testimonials",
//   authenticate,
//   mentorController.updateTopTestimonials.bind(mentorController)
// );
// export default mentorRoutes;
