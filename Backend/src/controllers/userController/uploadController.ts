// uploadController.ts
import { Request, Response, NextFunction } from "express";
import { inUploadService } from "../../services/interface/inUploadService";
import imUploadService from "../../services/implementations/imUploadService";
import sharp from "sharp";
import fs from "fs"; // Add this import
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";

class UploadController {
  private uploadService: inUploadService;

  constructor() {
    this.uploadService = new imUploadService();
  }

  public uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("upload controller step 1", req.file);

      const imageFile = req.file;
      if (!imageFile) {
        console.log("upload controller step 2 no file");
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      console.log("upload controller step 3");
      // Read the file from disk and resize it
      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 }) // Resize to max 1024px width
        .toBuffer();
      console.log("upload controller step 4");
      // Upload the resized buffer
      const result = await this.uploadService.uploadProfileImage({
        ...imageFile,
        buffer: resizedImageBuffer,
      });

      console.log("upload controller step 5", result);
      res.status(200).json({ imageUrl: result.url });
    } catch (error) {
      console.log("upload controller step cath error");
      next(error);
    }
  };

  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      console.log("uploadImage conmtroller step 1:", req.file);

      const file = req.file as Express.MulterS3.File;
      const url = file.location; // S3 URL
      const key = file.key; // S3 key
      console.log("uploadImage conmtroller step 12", file, url, key);

      // Get user ID from authenticate middleware
      const userId = req.user?.id; // Assuming authenticate sets req.user
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      // Update profile picture in database and delete old S3 image if exists
      const response = await this.uploadService.updateProfileImage(
        file,
        userId
      );
      console.log("uploadImage conmtroller step final repsonse is :", response);
      // Respond with the expected format
      res.status(200).json({ profilePicture: url });
    } catch (error) {
      next(error);
    }
  };

  public generatePresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("generatePresignedUrl controller step 1");

      const { fileName, fileType, folder } = req.query as {
        fileName: string;
        fileType: string;
        folder: string;
      };
      console.log("generatePresignedUrl controller step 2");
      if (!fileName || !fileType || !folder) {
        console.log("generatePresignedUrl controller step 3");
        throw new ApiError(
          400,
          "Missing fileName, fileType, or folder parameter"
        );
      }
      console.log("generatePresignedUrl controller step 4");
      const url = await this.uploadService.S3generatePresignedUrl(
        fileName,
        fileType,
        folder
      );
      console.log("generatePresignedUrl controller step 5");
      res.json(url);
    } catch (error) {
      console.log("generatePresignedUrl controller step 6");
      next(error);
    }
  };

  public getPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("getPresignedUrl ocntroller step 1");

      const { key } = req.query as { key: string };
      console.log("getPresignedUrl ocntroller step 2");
      if (!key) {
        console.log("getPresignedUrl ocntroller step 3");
        throw new ApiError(400, "Missing key parameter");
      }
      console.log("getPresignedUrl ocntroller step 4");
      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("getPresignedUrl ocntroller step 5");
      res.json({ url });
    } catch (error) {
      console.log("getPresignedUrl ocntroller step 6");
      next(error);
    }
  };
}

export default new UploadController();
