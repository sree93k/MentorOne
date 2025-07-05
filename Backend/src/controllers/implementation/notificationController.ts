// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../../middlewares/errorHandler";
// import NotificationService from "../../services/implementations/NotificationService";
// import ApiResponse from "../../utils/apiResponse";
// import { HttpStatus } from "../../constants/HttpStatus";

// interface AuthUser {
//   id: string;
// }

// class NotificationController {
//   private notificationService: NotificationService;

//   constructor() {
//     this.notificationService = new NotificationService();
//   }

//   public getUnreadNotifications = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }
//       console.log("NotificationController getUnreadNotifications step 1", {
//         userId,
//       });

//       const notifications =
//         await this.notificationService.getUnreadNotifications(userId);
//       console.log("NotificationController getUnreadNotifications step 2", {
//         notifications,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             notifications,
//             "Unread notifications fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getUnreadNotifications:", error);
//       next(error);
//     }
//   };

//   public markNotificationAsRead = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const userId = req.user?.id;
//       const { notificationId } = req.params;
//       if (!userId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }
//       if (!notificationId) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Notification ID is required"
//         );
//       }
//       console.log("NotificationController markNotificationAsRead step 1", {
//         notificationId,
//         userId,
//       });

//       await this.notificationService.markNotificationAsRead(
//         notificationId,
//         userId
//       );
//       console.log("NotificationController markNotificationAsRead step 2");

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             null,
//             "Notification marked as read successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in markNotificationAsRead:", error);
//       next(error);
//     }
//   };
// }

// export default new NotificationController();
