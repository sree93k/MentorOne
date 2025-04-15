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
      const id = req?.user?.id;
      if (!id) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }
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
      const result = await this.uploadService.uploadProfileImage(
        {
          ...imageFile,
          buffer: resizedImageBuffer,
        },
        id
      );

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
    console.log("uploadImage auth step 1 ...", req.file);

    const url = this.uploadService?.uploadImage(req.file);
    console.log("uploadImage auth step 1 ..", url);

    res.status(200).json({ imageUrl: url });
  };
}

export default new UploadController();
// import { Request, Response, NextFunction } from "express";
// import { inUploadService } from "../../services/interface/inUploadService";
// import imUploadService from "../../services/implementations/imUploadService";

// class UploadController {
//   private uploadService: inUploadService;

//   constructor() {
//     this.uploadService = new imUploadService();
//   }

//   public uploadImage = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       if (!req.file) {
//         res.status(400).json({ message: "No file uploaded" });
//         return;
//       }
//       console.log("uploadImage step 1:", req.file);

//       const file = req.file as Express.MulterS3.File;
//       const url = file.location; // S3 URL
//       const key = file.key; // S3 key

//       // Get user ID from authenticate middleware
//       const userId = req.user?.id; // Assuming authenticate sets req.user
//       if (!userId) {
//         res.status(401).json({ message: "User not authenticated" });
//         return;
//       }

//       // Update profile picture in database and delete old S3 image if exists
//       await this.uploadService.updateProfileImage(file, userId);

//       // Respond with the expected format
//       res.status(200).json({ profilePicture: url });
//     } catch (error) {
//       next(error);
//     }
//   };

//   // Optional: Keep uploadProfileImage if you plan to use it elsewhere
//   public uploadProfileImage = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       if (!req.file) {
//         res.status(400).json({ message: "No file uploaded" });
//         return;
//       }
//       console.log("uploadProfileImage step 1:", req.file);

//       const url = await this.uploadService.uploadProfileImage(req.file);
//       res.status(200).json({ imageUrl: url.url });
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// export default new UploadController();
