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
