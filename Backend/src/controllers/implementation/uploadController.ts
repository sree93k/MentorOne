import { Request, Response, NextFunction } from "express";
import { IUploadService } from "../../services/interface/IUploadService";
import UploadService from "../../services/implementations/SecureUploadService";
import sharp from "sharp";
import fs from "fs/promises";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import { HttpStatus } from "../../constants/HttpStatus";

interface AuthUser {
  id: string;
}

class UploadController {
  private uploadService: IUploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  public uploadProfileImage = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UploadController uploadProfileImage step 1", {
        file: req.file,
      });

      const imageFile = req.file;
      if (!imageFile) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "No file uploaded");
      }

      // Resize the image
      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 }) // Resize to max 1024px width
        .toBuffer();
      console.log("UploadController uploadProfileImage step 2", {
        resized: true,
      });

      // Upload the resized buffer
      const result = await this.uploadService.uploadProfileImage({
        ...imageFile,
        buffer: resizedImageBuffer,
      });
      console.log("UploadController uploadProfileImage step 3", { result });

      // Clean up temporary file
      await fs
        .unlink(imageFile.path)
        .catch((err) =>
          console.warn("Failed to delete temporary file:", err.message)
        );

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { imageUrl: result.url },
            "Profile image uploaded successfully"
          )
        );
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);

      // Clean up temporary file in case of error
      if (req.file?.path) {
        await fs
          .unlink(req.file.path)
          .catch((err) =>
            console.warn("Failed to delete temporary file:", err.message)
          );
      }

      next(error);
    }
  };

  public uploadImage = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UploadController uploadImage step 1", { file: req.file });

      const file = req.file as Express.MulterS3.File;
      if (!file) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "No file uploaded");
      }

      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const url = file.location; // S3 URL
      const key = file.key; // S3 key
      console.log("UploadController uploadImage step 2", { url, key });

      // Update profile picture in database and delete old S3 image if exists
      const response = await this.uploadService.updateProfileImage(
        file,
        userId
      );
      console.log("UploadController uploadImage step 3", { response });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { profilePicture: url },
            "Profile image updated successfully"
          )
        );
    } catch (error) {
      console.error("Error in uploadImage:", error);
      next(error);
    }
  };

  public generatePresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UploadController generatePresignedUrl step 1", {
        query: req.query,
      });

      const { fileName, fileType, folder } = req.query as {
        fileName: string;
        fileType: string;
        folder: string;
      };
      if (!fileName || !fileType || !folder) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Missing fileName, fileType, or folder parameter"
        );
      }

      const url = await this.uploadService.S3generatePresignedUrl(
        fileName,
        fileType,
        folder
      );
      console.log("UploadController generatePresignedUrl step 2", { url });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url },
            "Presigned URL generated successfully"
          )
        );
    } catch (error) {
      console.error("Error in generatePresignedUrl:", error);
      next(error);
    }
  };

  public getPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UploadController getPresignedUrl step 1", {
        query: req.query,
      });

      const { key } = req.query as { key: string };
      if (!key) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Missing key parameter");
      }

      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("UploadController getPresignedUrl step 2", { url });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url },
            "Presigned URL fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getPresignedUrl:", error);
      next(error);
    }
  };
}

export default new UploadController();
