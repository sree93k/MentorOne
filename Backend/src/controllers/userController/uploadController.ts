// uploadController.ts
import { Request, Response, NextFunction } from "express";
import { inUploadService } from "../../services/interface/inUploadService";
import imUploadService from "../../services/implementations/imUploadService";
import sharp from "sharp";
import fs from "fs"; // Add this import

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

      // Read the file from disk and resize it
      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 }) // Resize to max 1024px width
        .toBuffer();

      // Upload the resized buffer
      const result = await this.uploadService.uploadProfileImage({
        ...imageFile,
        buffer: resizedImageBuffer,
      });

      console.log("upload controller step 5", result);
      res.status(200).json({ imageUrl: result.url });
    } catch (error) {
      next(error);
    }
  };

  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = this.uploadService?.uploadImage(req.file);
    res.status(200).json({ imageUrl: url });
  };
}

export default new UploadController();
