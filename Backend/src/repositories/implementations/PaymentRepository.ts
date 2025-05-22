import Payment from "../../models/paymentModel";
import { ApiError } from "../../middlewares/errorHandler";
import mongoose from "mongoose";
import { IPaymentRepository } from "../interface/IPaymentRepository";

export default class PaymentRepository implements IPaymentRepository {
  async create(data: any) {
    try {
      const payment = new Payment(data);
      return await payment.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create payment", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Payment.findById(id);
    } catch (error: any) {
      throw new ApiError(500, "Failed to find payment", error.message);
    }
  }

  async findByBookingId(bookingId: string) {
    try {
      return await Payment.findOne({ bookingId });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find payment", error.message);
    }
  }

  async findAllByMenteeId(menteeId: string): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("paymentRepository findAllByMenteeId step 1", menteeId);

      // Simple find query to verify data exists
      const paymentRecords = await Payment.find({ menteeId: menteeId });
      console.log("payment step 1", paymentRecords);

      // Modified aggregate pipeline with correct collection names
      const payments = await Payment.aggregate([
        // Match payments for the mentee
        {
          $match: {
            menteeId: new mongoose.Types.ObjectId(menteeId),
          },
        },
        // Log the number of records after match
        {
          $facet: {
            paymentCount: [
              {
                $count: "count",
              },
            ],
            paymentData: [
              // Lookup booking details with correct collection name
              {
                $lookup: {
                  from: "bookings", // Collection name from BookingSchema
                  localField: "bookingId",
                  foreignField: "_id",
                  as: "booking",
                },
              },
              {
                $unwind: {
                  path: "$booking",
                  preserveNullAndEmptyArrays: true, // Keep payments even without bookings
                },
              },
              // Lookup service details with correct collection name
              {
                $lookup: {
                  from: "Service", // Matches exact collection name from ServiceSchema
                  localField: "booking.serviceId",
                  foreignField: "_id",
                  as: "service",
                },
              },
              {
                $unwind: {
                  path: "$service",
                  preserveNullAndEmptyArrays: true, // Keep payments even without services
                },
              },
              // Lookup mentor details with correct collection name
              {
                $lookup: {
                  from: "Users", // Matches exact collection name from UsersSchema
                  localField: "booking.mentorId",
                  foreignField: "_id",
                  as: "mentor",
                },
              },
              {
                $unwind: {
                  path: "$mentor",
                  preserveNullAndEmptyArrays: true, // Keep payments even without mentors
                },
              },
              // Project fields with less strict filtering
              {
                $project: {
                  _id: 1,
                  bookingId: 1,
                  menteeId: 1,
                  amount: 1,
                  status: 1,
                  transactionId: 1,
                  createdAt: 1,
                  bookingDetails: "$booking", // Add full booking details for debugging
                  serviceDetails: "$service", // Add full service details for debugging
                  mentorDetails: "$mentor", // Add full mentor details for debugging
                  serviceName: {
                    $ifNull: ["$service.title", "Unknown Service"],
                  },
                  mentorName: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $ne: [
                              { $ifNull: ["$mentor.firstName", null] },
                              null,
                            ],
                          },
                          {
                            $ne: [
                              { $ifNull: ["$mentor.lastName", null] },
                              null,
                            ],
                          },
                        ],
                      },
                      then: {
                        $concat: [
                          { $ifNull: ["$mentor.firstName", ""] },
                          " ",
                          { $ifNull: ["$mentor.lastName", ""] },
                        ],
                      },
                      else: "Unknown Mentor",
                    },
                  },
                  paymentMode: {
                    $cond: {
                      if: {
                        $ne: [{ $ifNull: ["$transactionId", null] }, null],
                      },
                      then: "Card",
                      else: "Unknown",
                    },
                  },
                  // Add these fields to help with debugging
                  hasBooking: {
                    $cond: {
                      if: { $ifNull: ["$booking", null] },
                      then: true,
                      else: false,
                    },
                  },
                  hasService: {
                    $cond: {
                      if: { $ifNull: ["$service", null] },
                      then: true,
                      else: false,
                    },
                  },
                  hasMentor: {
                    $cond: {
                      if: { $ifNull: ["$mentor", null] },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
              // Sort by createdAt descending
              {
                $sort: { createdAt: -1 },
              },
            ],
          },
        },
      ]);

      // Extract data from facet result
      const matchedCount = payments[0].paymentCount[0]?.count || 0;
      const paymentData = payments[0].paymentData || [];

      console.log("Payments after match:", matchedCount);
      console.log("Payments after full pipeline:", paymentData.length);

      // For debugging, log the first payment with detailed info
      if (paymentData.length > 0) {
        const samplePayment = paymentData[0];
        console.log("Sample payment debugging info:", {
          paymentId: samplePayment._id,
          bookingId: samplePayment.bookingId,
          hasBooking: samplePayment.hasBooking,
          hasService: samplePayment.hasService,
          hasMentor: samplePayment.hasMentor,
          serviceName: samplePayment.serviceName,
          mentorName: samplePayment.mentorName,
        });
      }

      // Clean up the data by removing debugging fields
      const cleanPaymentData = paymentData.map((payment: any) => {
        const {
          bookingDetails,
          serviceDetails,
          mentorDetails,
          hasBooking,
          hasService,
          hasMentor,
          ...cleanPayment
        } = payment;
        return cleanPayment;
      });

      const totalAmount = cleanPaymentData.reduce(
        (sum: number, payment: any) => sum + (payment.amount || 0),
        0
      );
      const totalCount = cleanPaymentData.length;

      console.log("paymentRepository findAllByMenteeId step 2", {
        paymentsCount: cleanPaymentData.length,
        totalAmount,
        totalCount,
      });

      return { payments: cleanPaymentData, totalAmount, totalCount };
    } catch (error: any) {
      console.error("Error in findAllByMenteeId repository:", error);
      throw new ApiError(500, "Failed to fetch mentee payments", error.message);
    }
  }
}
