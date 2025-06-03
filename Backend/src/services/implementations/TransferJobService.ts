// import schedule from "node-schedule";
// import BookingRepository from "../../repositories/implementations/BookingRepository";
// import PaymentService from "../../services/implementations/PaymentService";

// export class TransferJob {
//   private bookingRepository: BookingRepository;
//   private paymentService: PaymentService;

//   constructor() {
//     this.bookingRepository = new BookingRepository();
//     this.paymentService = new PaymentService();
//   }

//   start() {
//     // Run every hour to check for completed services
//     schedule.scheduleJob("0 * * * *", async () => {
//       console.log("Running transfer job...");
//       try {
//         const bookings = await this.bookingRepository.findCompletedBookings();
//         for (const booking of bookings) {
//           const payment = await this.paymentRepository.findByBookingId(
//             booking._id
//           );
//           if (payment && payment.status === "completed") {
//             await this.paymentService.transferToMentor(
//               payment._id.toString(),
//               booking.mentorId.toString(),
//               payment.amount
//             );
//             console.log(
//               `Transferred payment ${payment._id} for booking ${booking._id}`
//             );
//           }
//         }
//       } catch (error: any) {
//         console.error("Error in transfer job:", error);
//       }
//     });
//   }
// }
