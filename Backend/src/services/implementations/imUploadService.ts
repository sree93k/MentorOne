import { inUploadService } from "../../services/interface/inUploadService";
import {
  UploadResponse,
  uploadToCloudinary,
} from "../../utils/uploadToCloudninary";
import * as fs from "fs";
import cloudinary from "../../config/cloudinary";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepository from "../../repositories/implementations/imBaseRepository";
import Users from "../../models/userModel";
import { EUsers } from "../../entities/userEntity";
import { s3 } from "../../config/awsS3";
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
export default class UploadService implements inUploadService {
  private BaseRepository: inBaseRepository<EUsers>;

  constructor() {
    this.BaseRepository = new imBaseRepository<EUsers>(Users);
  }

  //singelphoto
  public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
    const result = await uploadToCloudinary(buffer);
    return result;
  }

  //uploadprofileimage
  public async uploadProfileImage(
    file: Express.Multer.File
  ): Promise<UploadResponse> {
    try {
      // Upload the buffer (which should be the resized image)
      const result = await uploadToCloudinary(file.buffer);

      // If the file was saved to disk, clean it up
      if (file.path) {
        fs.unlinkSync(file.path);
      }

      return result;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }

  //updateProfileImage
  public async updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<UploadResponse> {
    try {
      console.log("updateProfileImage step 1");

      const user = await this.BaseRepository.findById(id);
      if (!user) throw new Error("User not found");
      console.log("updateProfileImage step 2", user);
      const oldPublicId = user.profilePicturePublicId;
      console.log("updateProfileImage step 3", oldPublicId);
      const result = await uploadToCloudinary(file.buffer);
      console.log("updateProfileImage step 4", result);
      const newUrl = result.url;
      console.log("updateProfileImage step 4.5", newUrl);
      const newPublicId = result.public_id;
      console.log("updateProfileImage step 5", newPublicId);
      await this.BaseRepository.update(id, {
        profilePicture: newUrl,
        profilePicturePublicId: newPublicId,
      });
      console.log("updateProfileImage step 6");
      if (oldPublicId) {
        console.log("updateProfileImage step 8");
        await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
          console.error("Failed to delete old image from Cloudinary:", err);
        });
      }
      console.log("updateProfileImage step 9", file);
      if (file.path) fs.unlinkSync(file.path);
      console.log("updateProfileImage step 10", file.path);
      return { url: newUrl, public_id: newPublicId };
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw new Error("Failed to update profile image");
    }
  }

  public async updateImage(
    file: Express.Multer.File,
    id: string
  ): Promise<EUsers | null> {
    try {
      return null;
    } catch (error) {
      return null;
    }
  }

  ///aws s3 bucket
  public async S3generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
  ): Promise<{ url: string; key: string }> {
    try {
      console.log(
        "S3generatePresignedUrl service step 1",
        fileName,
        fileType,
        folder
      );
      const key = `${folder}/${Date.now()}_${fileName}`;
      console.log("S3generatePresignedUrl service step 2", key);
      const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        Expires: 600,
      };
      console.log("S3generatePresignedUrl service step 3", params);
      const url = await s3.getSignedUrlPromise("putObject", params);
      console.log("S3generatePresignedUrl service step 4", url, key);
      return { url, key };
    } catch (error: any) {
      console.log("S3generatePresignedUrl service step 5");
      console.error("Error generating presigned URL:", error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  public async S3generatePresignedUrlForGet(key: string): Promise<string> {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 600,
      };
      const url = await s3.getSignedUrlPromise("getObject", params);
      return url;
    } catch (error: any) {
      console.error("Error generating presigned URL for GET:", error);
      throw new Error(
        `Failed to generate presigned URL for GET: ${error.message}`
      );
    }
  }
}

/////=============================================================

// import imUserRepository from "../../repositories/implementations/imUserRepository";
// import { inUserRepository } from "../../repositories/interface/inUserRepository";
// import { inUploadService } from "../../services/interface/inUploadService";
// import {
//   UploadResponse,
//   uploadToCloudinary,
// } from "../../utils/uploadToCloudninary";
// import * as fs from "fs";
// import Users from "../../models/userModel";
// import { EUsers } from "../../entities/userEntity";
// import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
// import imBaseRepository from "../../repositories/implementations/imBaseRepository";
// // import { S3Repository } from "../../repositories/implementations/S3Repository";
// import { s3 } from "../../config/awsS3";
// export default class UploadService implements inUploadService {
//   private userRepository: inUserRepository;
//   private BaseRepository: inBaseRepository<EUsers>;
//   constructor() {
//     this.userRepository = new imUserRepository();
//     this.BaseRepository = new imBaseRepository<EUsers>(Users);
//   }

//   //@@
//   public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
//     try {
//       console.log("uplload service 1");

//       const result = await uploadToCloudinary(buffer);
//       console.log("uplload service 2");
//       return result;
//     } catch (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       throw new Error("Failed to upload image");
//     }
//   }

//   //@@
//   public async uploadProfileImage(
//     file: Express.Multer.File
//   ): Promise<UploadResponse> {
//     try {
//       // Upload the buffer (which should be the resized image)
//       const result = await uploadToCloudinary(file.buffer);

//       // If the file was saved to disk, clean it up
//       if (file.path) {
//         fs.unlinkSync(file.path);
//       }

//       return result;
//     } catch (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       throw new Error("Failed to upload image");
//     }
//   }

//   public async updateProfileImage(
//     file: Express.Multer.File,
//     id: string
//   ): Promise<UploadResponse> {
//     try {
//       // Fetch user to get current image details
//       const user = await this.userRepository.findById(id);
//       if (!user) throw new Error("User not found");
//       const oldPublicId = user.profilePicturePublicId;

//       // Upload new image
//       const result = await uploadToCloudinary(file.buffer);
//       const newUrl = result?.secure_url;
//       const newPublicId = result.public_id;

//       // Update database with new image details
//       await this.BaseRepository.update(id, {
//         profilePictureUrl: newUrl,
//         profilePicturePublicId: newPublicId,
//       });

//       // Delete old image from Cloudinary if it exists
//       if (oldPublicId) {
//         try {
//           await cloudinary?.uploader.destroy(oldPublicId);
//           console.log(`Deleted old image with public ID: ${oldPublicId}`);
//         } catch (error) {
//           console.error("Error deleting old image from Cloudinary:", error);
//           // Log error but don’t fail the request
//         }
//       }

//       // Clean up temp file
//       if (file.path) fs.unlinkSync(file.path);

//       return { url: newUrl };
//     } catch (error) {
//       console.error("Error updating profile image:", error);
//       throw new Error("Failed to update profile image");
//     }
//   }

//   public async uploadImage(file: Express.MulterS3.File) {
//     return S3Repository.getFileUrl(file);
//   }
// }
/////=============================================================

// import { inUploadService } from "../../services/interface/inUploadService";
// import { UploadResponse } from "../../utils/uploadToCloudninary"; // Update if needed
// import * as fs from "fs";
// import Users from "../../models/userModel";
// import { EUsers } from "../../entities/userEntity";
// import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
// import imBaseRepository from "../../repositories/implementations/imBaseRepository";
// import { s3 } from "../../config/awsS3";
// import fileTypeFromBuffer from "file-type";

// export default class UploadService implements inUploadService {
//   private BaseRepository: inBaseRepository<EUsers>;

//   constructor() {
//     this.BaseRepository = new imBaseRepository<EUsers>(Users);
//   }

//   /**
//    * Uploads a buffer to S3 (used for Google OAuth profile pictures)
//    * @param buffer Image buffer
//    * @param key S3 object key (e.g., ProfilePicture/user_email.jpg)
//    * @returns S3 URL
//    */
//   public async uploadBufferToS3(buffer: Buffer, key: string): Promise<string> {
//     try {
//       const type = await fileTypeFromBuffer(buffer);
//       const contentType = type ? type.mime : "image/jpeg";

//       const params = {
//         Bucket: process.env.AWS_BUCKET_NAME!, // "mentor-one"
//         Key: key, // e.g., "ProfilePicture/user_email.jpg"
//         Body: buffer,
//         ContentType: contentType,
//         ACL: "public-read", // Make image publicly accessible
//       };

//       const result = await s3.upload(params).promise();
//       return result.Location; // e.g., https://mentor-one.s3.eu-north-1.amazonaws.com/ProfilePicture/user_email.jpg
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       throw new Error("Failed to upload image to S3");
//     }
//   }

//   /**
//    * Placeholder for single photo uploads (not used for profile pictures)
//    */
//   public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
//     throw new Error("Use uploadBufferToS3 for S3 uploads");
//   }

//   /**
//    * Uploads a profile image via multer-s3 (not used for Google OAuth)
//    */
//   public async uploadProfileImage(
//     file: Express.Multer.File
//   ): Promise<UploadResponse> {
//     // This method is typically for form uploads, but since we’re using multer-s3 elsewhere,
//     // it’s not directly called here. Kept for compatibility.
//     if (file.path && fs.existsSync(file.path)) {
//       fs.unlinkSync(file.path);
//     }
//     return { url: "", public_id: "" }; // Placeholder; actual logic is in updateProfileImage
//   }

//   /**
//    * Updates a user’s profile image in S3 and database
//    */
//   public async updateProfileImage(
//     file: Express.MulterS3.File,
//     id: string
//   ): Promise<UploadResponse> {
//     try {
//       // Fetch user to get current profile picture details
//       const user = await this.BaseRepository.findById(id);
//       if (!user) throw new Error("User not found");

//       const oldKey = user.profilePicturePublicId;

//       // File is already uploaded to S3 by multer-s3 middleware
//       const newUrl = file.location; // S3 URL
//       const newKey = file.key; // S3 key

//       // Delete old image from S3 if it exists
//       if (oldKey) {
//         await this.deleteFromS3(oldKey).catch((error) => {
//           console.error(`Error deleting old S3 object ${oldKey}:`, error);
//           // Continue even if deletion fails
//         });
//       }

//       // Update database with new URL and key
//       await this.BaseRepository.update(id, {
//         profilePicture: newUrl,
//         profilePicturePublicId: newKey,
//       });

//       return { url: newUrl, public_id: newKey };
//     } catch (error) {
//       console.error("Error updating profile image:", error);
//       throw new Error("Failed to update profile image");
//     }
//   }

//   /**
//    * Returns S3 URL from multer-s3 file (used in routes with multer)
//    */
//   public async uploadImage(file: Express.MulterS3.File): Promise<string> {
//     return file.location;
//   }

//   /**
//    * Deletes an object from S3
//    */
//   private async deleteFromS3(key: string): Promise<void> {
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: key,
//     };
//     await s3.deleteObject(params).promise();
//   }
// }
