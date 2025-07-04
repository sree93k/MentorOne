// import { Router } from "express";
// import menteeController from "../../controllers/implementation/menteeController";
// import multer from "multer";
// import { authenticate } from "../../middlewares/authenticateuser";
// import uploadController from "../../controllers/implementation/uploadController";
// import bookingController from "../../controllers/implementation/bookingController";
// import paymentController from "../../controllers/implementation/paymentController";
// const menteeRoutes = Router();
// const upload = multer({ dest: "uploads/" });

// menteeRoutes.put(
//   "/welcomeform",
//   authenticate,
//   menteeController.uploadWelcomeForm
// );

// menteeRoutes.get("/profileData", authenticate, menteeController.profileData);

// menteeRoutes.delete(
//   "/deleteAccount",
//   authenticate,
//   menteeController.deleteAccount
// );

// menteeRoutes.get("/allMentors", authenticate, menteeController.getAllMentors);
// menteeRoutes.get("/mentor/:id", menteeController.getMentorById);
// menteeRoutes.post("/bookings", authenticate, bookingController.createBooking);

// menteeRoutes.get("/bookings", authenticate, bookingController.getBookings);

// menteeRoutes.delete(
//   "/bookings/:bookingId",
//   authenticate,
//   bookingController.cancelBooking
// );

// menteeRoutes.get(
//   "/seeker/getbookings",
//   authenticate,
//   menteeController.getBookings.bind(menteeController)
// );

// menteeRoutes.get(
//   "/alltutorials",
//   authenticate,
//   menteeController.getAllTutorials.bind(menteeController)
// );

// menteeRoutes.get(
//   "/exclusivecontent/:id",
//   authenticate,
//   menteeController.getTutorialById.bind(menteeController)
// );

// menteeRoutes.get(
//   "/check-booking/:serviceId",
//   authenticate,
//   menteeController.checkBookingStatus.bind(menteeController)
// );

// menteeRoutes.post(
//   "/initiate-payment",
//   authenticate,
//   menteeController.initiatePayment.bind(menteeController)
// );

// menteeRoutes.post(
//   "/book-service",
//   authenticate,
//   menteeController.bookService.bind(menteeController)
// );

// menteeRoutes.get(
//   "/video-url/:key",
//   authenticate,
//   menteeController.getVideoUrl.bind(menteeController)
// );

// menteeRoutes.get(
//   "/payment/mentee-payments",
//   authenticate,
//   menteeController.getAllMenteePayments
// );

// menteeRoutes.get(
//   "/document/:serviceId",
//   authenticate,
//   menteeController.getDocumentUrl.bind(menteeController)
// );
// menteeRoutes.get(
//   "/mentor/:id/schedule",
//   authenticate,
//   menteeController.getMentorSchedule.bind(menteeController)
// );

// menteeRoutes.get(
//   "/mentor/:id/blocked-dates",
//   authenticate,
//   menteeController.getMentorBlockedDates.bind(menteeController)
// );
// menteeRoutes.get(
//   "/mentor/:mentorId/policy",
//   authenticate,
//   menteeController.getMentorPolicy.bind(menteeController)
// );

// // routes/menteeRoutes.ts
// menteeRoutes.post(
//   "/priority-dm",
//   authenticate,
//   menteeController.createPriorityDM.bind(menteeController)
// );

// menteeRoutes.get(
//   "/priority-dm/:bookingId",
//   authenticate,
//   menteeController.getPriorityDMs.bind(menteeController)
// );

// menteeRoutes.post(
//   "/bookings/:bookingId/reschedule",
//   authenticate,
//   bookingController.requestReschedule.bind(bookingController)
// );

// menteeRoutes.post(
//   "/bookings/:bookingId/testimonial",
//   authenticate,
//   bookingController.submitTestimonial.bind(bookingController)
// );

// menteeRoutes.put(
//   "/testimonials/:testimonialId",
//   authenticate,
//   bookingController.updateTestimonial.bind(bookingController)
// );

// menteeRoutes.get(
//   "/bookings/:bookingId/testimonial",
//   authenticate,
//   bookingController.getTestimonialByBookingId.bind(bookingController)
// );
// menteeRoutes.get(
//   "/testimonials",
//   authenticate,
//   bookingController.getTestimonialsByMentor.bind(bookingController)
// );
// menteeRoutes.get(
//   "/testimonials/mentor/:mentorId/service/:serviceId",
//   bookingController.getTestimonialsByMentorAndService.bind(bookingController)
// );
// menteeRoutes.put(
//   "/bookings/:bookingId/status",
//   authenticate,
//   bookingController.updateBookingServiceStatus.bind(bookingController)
// );

// menteeRoutes.get(
//   "/dashboard-data",
//   authenticate,
//   menteeController.getDashboardData.bind(menteeController)
// );

// menteeRoutes.get("/allServices", authenticate, menteeController.getAllServices);
// menteeRoutes.get("/wallet", authenticate, paymentController.getMenteeWallet);
// export default menteeRoutes;
