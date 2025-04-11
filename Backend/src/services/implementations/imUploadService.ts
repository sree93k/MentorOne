// import { inUploadService } from "../../services/interface/inUploadService";
// import {
//   UploadResponse,
//   uploadToCloudinary,
// } from "../../utils/uploadToCloudninary";
// import * as fs from "fs";
// import cloudinary from "../../config/cloudinary";
// import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
// import imBaseRepository from "../../repositories/implementations/imBaseRepository";
// import Users from "../../models/userModel";
// import { EUsers } from "../../entities/userEntity";

// export default class UploadService implements inUploadService {
//   private BaseRepository: inBaseRepository<EUsers>;

//   constructor() {
//     this.BaseRepository = new imBaseRepository<EUsers>(Users);
//   }

//   //singelphoto
//   public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
//     const result = await uploadToCloudinary(buffer);
//     return result;
//   }

//   //uploadprofileimage
//   public async uploadProfileImage(
//     file: Express.Multer.File,
//     id: string
//   ): Promise<UploadResponse> {
//     return this.updateProfileImage(file, id); // Delegate to updateProfileImage
//   }
//   //updateProfileImage
//   public async updateProfileImage(
//     file: Express.Multer.File,
//     id: string
//   ): Promise<UploadResponse> {
//     try {
//       console.log("updateProfileImage step 1");

//       const user = await this.BaseRepository.findById(id);
//       if (!user) throw new Error("User not found");
//       console.log("updateProfileImage step 2", user);
//       const oldPublicId = user.profilePicturePublicId;
//       console.log("updateProfileImage step 3", oldPublicId);
//       const result = await uploadToCloudinary(file.buffer);
//       console.log("updateProfileImage step 4", result);
//       const newUrl = result.url;
//       console.log("updateProfileImage step 4.5", newUrl);
//       const newPublicId = result.public_id;
//       console.log("updateProfileImage step 5", newPublicId);
//       await this.BaseRepository.update(id, {
//         profilePicture: newUrl,
//         profilePicturePublicId: newPublicId,
//       });
//       console.log("updateProfileImage step 6");
//       if (oldPublicId) {
//         console.log("updateProfileImage step 8");
//         await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
//           console.error("Failed to delete old image from Cloudinary:", err);
//         });
//       }
//       console.log("updateProfileImage step 9", file);
//       if (file.path) fs.unlinkSync(file.path);
//       console.log("updateProfileImage step 10", file.path);
//       return { url: newUrl, public_id: newPublicId };
//     } catch (error) {
//       console.error("Error updating profile image:", error);
//       throw new Error("Failed to update profile image");
//     }
//   }
// }

import imUserRepository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { inUploadService } from "../../services/interface/inUploadService";
import {
  UploadResponse,
  uploadToCloudinary,
} from "../../utils/uploadToCloudninary";
import * as fs from "fs";
import Users from "../../models/userModel";
import { EUsers } from "../../entities/userEntity";
import { inBaseRepository } from "../../repositories/interface/inBaseRepository";
import imBaseRepository from "../../repositories/implementations/imBaseRepository";
import { S3Repository } from "../../repositories/implementations/S3Repository";
export default class UploadService implements inUploadService {
  private userRepository: inUserRepository;
  private BaseRepository: inBaseRepository<EUsers>;
  constructor() {
    this.userRepository = new imUserRepository();
    this.BaseRepository = new imBaseRepository<EUsers>(Users);
  }

  //@@
  public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
    try {
      console.log("uplload service 1");

      const result = await uploadToCloudinary(buffer);
      console.log("uplload service 2");
      return result;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }

  //@@
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

  public async updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<UploadResponse> {
    try {
      // Fetch user to get current image details
      const user = await this.userRepository.findById(id);
      if (!user) throw new Error("User not found");
      const oldPublicId = user.profilePicturePublicId;

      // Upload new image
      const result = await uploadToCloudinary(file.buffer);
      const newUrl = result?.secure_url;
      const newPublicId = result.public_id;

      // Update database with new image details
      await this.BaseRepository.update(id, {
        profilePictureUrl: newUrl,
        profilePicturePublicId: newPublicId,
      });

      // Delete old image from Cloudinary if it exists
      if (oldPublicId) {
        try {
          await cloudinary?.uploader.destroy(oldPublicId);
          console.log(`Deleted old image with public ID: ${oldPublicId}`);
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
          // Log error but don’t fail the request
        }
      }

      // Clean up temp file
      if (file.path) fs.unlinkSync(file.path);

      return { url: newUrl };
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw new Error("Failed to update profile image");
    }
  }

  public async uploadImage(file: Express.MulterS3.File) {
    return S3Repository.getFileUrl(file);
  }
}
