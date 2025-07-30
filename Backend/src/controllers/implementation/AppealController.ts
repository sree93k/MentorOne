import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import ApiResponse from "../../utils/apiResponse";
import { IAppealService } from "../../services/interface/IAppealService";
import AppealService from "../../services/implementations/AppealService";
import {
  CustomValidator,
  ValidationRules,
} from "../../utils/validators/customValidator";

class AppealController {
  private appealService: IAppealService;

  constructor() {
    this.appealService = new AppealService();
  }

  // Validation middleware
  public validateAppealSubmission = CustomValidator.validate([
    ValidationRules.email(true),
    ValidationRules.string("firstName", true, 1, 50),
    ValidationRules.string("lastName", true, 1, 50),
    ValidationRules.string("appealMessage", true, 10, 1000),
    ValidationRules.enum(
      "category",
      ["wrongful_block", "account_hacked", "misunderstanding", "other"],
      false
    ),
  ]);

  public submitAppeal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("AppealController: Appeal submission received", {
        email: req.body.email,
        category: req.body.category,
      });

      const {
        email,
        firstName,
        lastName,
        appealMessage,
        category = "other",
      } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      const result = await this.appealService.submitAppeal({
        userId: "", // Will be set in service
        email,
        firstName,
        lastName,
        appealMessage,
        category,
        ipAddress,
        userAgent,
      });

      const statusCode = result.success
        ? HttpStatus.OK
        : HttpStatus.BAD_REQUEST;

      res.status(statusCode).json(
        new ApiResponse(
          statusCode,
          result.data
            ? {
                appealId: result.appealId,
                estimatedResponseTime: "24-48 hours",
              }
            : null,
          result.message
        )
      );
    } catch (error: any) {
      console.error("AppealController: Error submitting appeal", error);
      next(error);
    }
  };

  public getAppealStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appealId } = req.params;

      if (!appealId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              HttpStatus.BAD_REQUEST,
              null,
              "Appeal ID is required"
            )
          );
        return;
      }

      const result = await this.appealService.getAppealById(appealId);
      const statusCode = result.success ? HttpStatus.OK : HttpStatus.NOT_FOUND;

      res
        .status(statusCode)
        .json(new ApiResponse(statusCode, result.data, result.message));
    } catch (error: any) {
      console.error("AppealController: Error getting appeal status", error);
      next(error);
    }
  };

  // Admin-only methods
  public getAppeals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status as string,
        email: req.query.email as string,
        category: req.query.category as string,
        // Add more filters as needed
      };

      const result = await this.appealService.getAppealsWithFilters(
        filters,
        page,
        limit
      );

      const statusCode = result.success
        ? HttpStatus.OK
        : HttpStatus.BAD_REQUEST;

      res
        .status(statusCode)
        .json(new ApiResponse(statusCode, result.data, result.message));
    } catch (error: any) {
      console.error("AppealController: Error getting appeals", error);
      next(error);
    }
  };

  public reviewAppeal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appealId } = req.params;
      const { decision, adminResponse, adminNotes } = req.body;
      const adminId = req.user?.id;

      if (!adminId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              HttpStatus.UNAUTHORIZED,
              null,
              "Admin authentication required"
            )
          );
        return;
      }

      if (!appealId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              HttpStatus.BAD_REQUEST,
              null,
              "Appeal ID is required"
            )
          );
        return;
      }

      if (!decision || !["approved", "rejected"].includes(decision)) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              HttpStatus.BAD_REQUEST,
              null,
              "Valid decision (approved/rejected) is required"
            )
          );
        return;
      }

      if (!adminResponse || adminResponse.trim().length < 10) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              HttpStatus.BAD_REQUEST,
              null,
              "Admin response must be at least 10 characters"
            )
          );
        return;
      }

      const result = await this.appealService.reviewAppeal(
        appealId,
        adminId,
        decision,
        adminResponse.trim(),
        adminNotes?.trim()
      );

      const statusCode = result.success
        ? HttpStatus.OK
        : HttpStatus.BAD_REQUEST;

      res
        .status(statusCode)
        .json(new ApiResponse(statusCode, result.data, result.message));
    } catch (error: any) {
      console.error("AppealController: Error reviewing appeal", error);
      next(error);
    }
  };

  public getAppealStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.appealService.getAppealStatistics();
      const statusCode = result.success
        ? HttpStatus.OK
        : HttpStatus.BAD_REQUEST;

      res
        .status(statusCode)
        .json(new ApiResponse(statusCode, result.data, result.message));
    } catch (error: any) {
      console.error("AppealController: Error getting statistics", error);
      next(error);
    }
  };
}

export default new AppealController();
