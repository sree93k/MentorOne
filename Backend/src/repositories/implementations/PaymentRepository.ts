import { injectable } from "inversify";
import Payment from "../../models/paymentModel";
import mongoose from "mongoose";
import { IPaymentRepository } from "../interface/IPaymentRepository";
import BaseRepository from "./BaseRepository";
import { EPayment } from "../../entities/paymentEntity";

@injectable()
export default class PaymentRepository
  extends BaseRepository<EPayment>
  implements IPaymentRepository
{
  constructor() {
    super(Payment);
  }
  async create(data: any) {
    try {
      const payment = new Payment(data);
      return await payment.save();
    } catch (error: any) {
      throw new Error("Failed to create payment", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Payment.findById(id);
    } catch (error: any) {
      throw new Error("Failed to find payment", error.message);
    }
  }

  async findByBookingId(bookingId: string) {
    try {
      return await Payment.findOne({ bookingId });
    } catch (error: any) {
      throw new Error("Failed to find payment", error.message);
    }
  }
  //mentor payments
  async findAllByMentorId(mentorId: string): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("paymentRepository findAllByMentorId step 1", mentorId);

      const payments = await Payment.aggregate([
        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        {
          $unwind: {
            path: "$booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "booking.mentorId": new mongoose.Types.ObjectId(mentorId),
          },
        },
        {
          $lookup: {
            from: "Service",
            localField: "booking.serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $unwind: {
            path: "$service",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "menteeId",
            foreignField: "_id",
            as: "mentee",
          },
        },
        {
          $unwind: {
            path: "$mentee",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            bookingId: 1,
            menteeId: {
              _id: "$mentee._id",
              firstName: "$mentee.firstName",
              lastName: "$mentee.lastName",
            },
            amount: 1,
            total: 1,
            status: 1,
            transactionId: 1,
            createdAt: 1,
            serviceDetails: {
              _id: "$service._id",
              title: "$service.title",
              type: "$service.type",
            },
            serviceName: {
              $ifNull: ["$service.title", "Unknown Service"],
            },
            menteeName: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ["$mentee.firstName", null] }, null] },
                    { $ne: [{ $ifNull: ["$mentee.lastName", null] }, null] },
                  ],
                },
                then: {
                  $concat: [
                    { $ifNull: ["$mentee.firstName", ""] },
                    " ",
                    { $ifNull: ["$mentee.lastName", ""] },
                  ],
                },
                else: "Unknown Mentee",
              },
            },
            paymentMode: {
              $cond: {
                if: { $ne: [{ $ifNull: ["$transactionId", null] }, null] },
                then: "Card",
                else: "Unknown",
              },
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      const totalAmount = payments.reduce(
        (sum: number, payment: any) => sum + (payment.amount || 0),
        0
      );
      const totalCount = payments.length;

      console.log("paymentRepository findAllByMentorId step 2", {
        paymentsCount: payments.length,
        totalAmount,
        totalCount,
      });

      return { payments, totalAmount, totalCount };
    } catch (error: any) {
      console.error("Error in findAllByMentorId repository:", error);
      throw new Error("Failed to fetch mentor payments", error.message);
    }
  }

  async findAllByMenteeId(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("paymentRepository findAllByMenteeId step 1", menteeId);

      // Get total count and total amount for all payments (not paginated)
      const totalResult = await Payment.aggregate([
        {
          $match: {
            menteeId: new mongoose.Types.ObjectId(menteeId),
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
            totalCount: { $count: {} },
          },
        },
      ]);

      const totalAmount = totalResult[0]?.totalAmount || 0;
      const totalCount = totalResult[0]?.totalCount || 0;

      // Paginated query
      const payments = await Payment.aggregate([
        {
          $match: {
            menteeId: new mongoose.Types.ObjectId(menteeId),
          },
        },
        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        {
          $unwind: {
            path: "$booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Service",
            localField: "booking.serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $unwind: {
            path: "$service",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "booking.mentorId",
            foreignField: "_id",
            as: "mentor",
          },
        },
        {
          $unwind: {
            path: "$mentor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            bookingId: 1,
            menteeId: 1,
            amount: 1,
            total: 1,
            status: 1,
            transactionId: 1,
            createdAt: 1,
            serviceName: {
              $ifNull: ["$service.title", "Unknown Service"],
            },
            mentorName: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ["$mentor.firstName", null] }, null] },
                    { $ne: [{ $ifNull: ["$mentor.lastName", null] }, null] },
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
                if: { $ne: [{ $ifNull: ["$transactionId", null] }, null] },
                then: "Card",
                else: "Unknown",
              },
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      console.log("paymentRepository findAllByMenteeId step 2", {
        paymentsCount: payments.length,
        totalAmount,
        totalCount,
      });

      return { payments, totalAmount, totalCount };
    } catch (error: any) {
      console.error("Error in findAllByMenteeId repository:", error);
      throw new Error("Failed to fetch mentee payments", error.message);
    }
  }
  //all payments admin

  async findAllPayments(
    skip: number,
    limit: number,
    query: any
  ): Promise<any[]> {
    try {
      console.log("paymentRepository findAllPayments step 1", {
        skip,
        limit,
        query,
      });

      const payments = await Payment.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        {
          $unwind: {
            path: "$booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Service",
            localField: "booking.serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $unwind: {
            path: "$service",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "booking.mentorId",
            foreignField: "_id",
            as: "mentor",
          },
        },
        {
          $unwind: {
            path: "$mentor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "menteeId",
            foreignField: "_id",
            as: "mentee",
          },
        },
        {
          $unwind: {
            path: "$mentee",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            bookingId: 1,
            menteeId: "$mentee",
            amount: 1,
            status: 1,
            total: 1,
            transactionId: 1,
            createdAt: 1,
            serviceDetails: "$service",
            mentorDetails: "$mentor",
            serviceName: {
              $ifNull: ["$service.title", "Unknown Service"],
            },
            mentorName: {
              $cond: {
                if: {
                  $and: [
                    {
                      $ne: [{ $ifNull: ["$mentor.firstName", null] }, null],
                    },
                    {
                      $ne: [{ $ifNull: ["$mentor.lastName", null] }, null],
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
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      console.log("paymentRepository findAllPayments step 2", payments.length);
      return payments;
    } catch (error: any) {
      console.error("Error in findAllPayments repository:", error);
      throw new Error("Failed to fetch payments", error.message);
    }
  }

  async countAllPayments(query: any): Promise<number> {
    try {
      return await Payment.countDocuments(query).exec();
    } catch (error: any) {
      console.error("Error in countAllPayments repository:", error);
      throw new Error("Failed to count payments", error.message);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      return await Payment.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      throw new Error("Failed to update payment", error.message);
    }
  }

  async updateByBookingId(bookingId: string, data: any): Promise<any> {
    try {
      console.log("Payment repository updateByBookingId step 1");

      const response = await Payment.findOneAndUpdate(
        { bookingId }, // Query filter object
        data, // Update data (remove the wrapping object)
        { new: true } // Options
      );

      console.log("Payment repository updateByBookingId step 2", response);
      return response;
    } catch (error: any) {
      throw new Error("Failed to update payment", error.message);
    }
  }
}
