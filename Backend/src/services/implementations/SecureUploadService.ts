import { IUploadService } from "../interface/IUploadService";
import { s3 } from "../../config/awsS3";
import sharp from "sharp";
import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

interface SecureVideoUrl {
  url: string;
  expiresAt: Date;
  sessionToken?: string;
}

export default class SecureUploadService implements IUploadService {
  private UserRepository: IUserRepository;

  constructor() {
    this.UserRepository = new UserRepository();
  }

  public async uploadProfileImage(
    file: Express.Multer.File
  ): Promise<{ url: string; public_id?: string }> {
    try {
      const compressedImage = await sharp(file.buffer)
        .resize({ width: 1024 })
        .jpeg({ quality: 80 })
        .toBuffer();

      const key = `images/${Date.now()}_${file.originalname}`;

      await s3
        .upload({
          Bucket: BUCKET_NAME!,
          Key: key,
          Body: compressedImage,
          ContentType: file.mimetype,
          ACL: "private",
        })
        .promise();

      const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return { url };
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload image");
    }
  }

  public async updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<{ s3Key: string; url?: string }> {
    try {
      const user = await this.UserRepository.findById(id);
      if (!user) throw new Error("User not found");

      const compressedImage = await sharp(file.buffer)
        .resize({ width: 1024 })
        .jpeg({ quality: 80 })
        .toBuffer();

      const key = `images/${Date.now()}_${file.originalname}`;

      await s3
        .upload({
          Bucket: BUCKET_NAME!,
          Key: key,
          Body: compressedImage,
          ContentType: file.mimetype,
          ACL: "private",
        })
        .promise();

      await this.UserRepository.update(id, { profilePicture: key });

      if (user.profilePicture && user.profilePicture.includes("/")) {
        const oldKey = user.profilePicture.includes("amazonaws.com")
          ? user.profilePicture.split("/").slice(-2).join("/")
          : user.profilePicture;

        try {
          await s3
            .deleteObject({ Bucket: BUCKET_NAME!, Key: oldKey })
            .promise();
        } catch (deleteError) {
          console.warn("Failed to delete old profile image:", deleteError);
        }
      }

      return { s3Key: key };
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw new Error("Failed to update profile image");
    }
  }

  public async uploadFile(
    file: Buffer,
    fileName: string,
    folder: "images" | "audio" | "videos" | "pdfs",
    mimeType: string
  ): Promise<string> {
    try {
      let processedFile = file;

      if (folder === "images") {
        processedFile = await sharp(file)
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toBuffer();
      }

      const key = `${folder}/${Date.now()}_${fileName}`;

      await s3
        .upload({
          Bucket: BUCKET_NAME!,
          Key: key,
          Body: processedFile,
          ContentType: mimeType,
          ACL: "private",
        })
        .promise();

      return key;
    } catch (error) {
      console.error(`Error uploading ${folder} to S3:`, error);
      throw new Error(`Failed to upload ${folder}`);
    }
  }

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
        Expires: 600, // 10 minutes
        ServerSideEncryption: "AES256",
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

  /**
   * Generate secure presigned URL for video viewing with short expiration
   */
  public async generateSecureVideoUrl(
    key: string,
    userId: string,
    serviceId: string,
    sessionToken?: string
  ): Promise<SecureVideoUrl> {
    try {
      console.log("SecureUploadService: Generating secure video URL", {
        key: key.substring(0, 20) + "...",
        userId,
        serviceId,
        hasSessionToken: !!sessionToken,
      });

      // Clean the key - remove any URL prefix if present
      let cleanKey = key;
      if (key.includes("amazonaws.com/")) {
        const urlParts = key.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      console.log("SecureUploadService: Using clean key", cleanKey);

      // Create signed URL with short expiration (2 hours)
      const expirationTime = 2 * 60 * 60; // 2 hours in seconds
      const expiresAt = new Date(Date.now() + expirationTime * 1000);

      const params = {
        Bucket: BUCKET_NAME,
        Key: cleanKey,
        Expires: expirationTime,
        // Add custom headers for additional security
        ResponseContentType: "video/mp4",
        ResponseContentDisposition: "inline", // Prevent downloading
      };

      console.log("SecureUploadService: S3 params", params);
      const url = await s3.getSignedUrlPromise("getObject", params);
      console.log(
        "SecureUploadService: Generated signed URL (truncated)",
        url.substring(0, 50) + "..."
      );

      return {
        url,
        expiresAt,
        sessionToken,
      };
    } catch (error: any) {
      console.error(
        "SecureUploadService: Error generating secure video URL:",
        error
      );
      throw new Error(`Failed to generate secure video URL: ${error.message}`);
    }
  }

  /**
   * Standard presigned URL generation (keeping for backward compatibility)
   */
  public async S3generatePresignedUrlForGet(key: string): Promise<string> {
    try {
      console.log("S3generatePresignedUrlForGet called with key:", key);

      let cleanKey = key;
      if (key.includes("amazonaws.com/")) {
        const urlParts = key.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      console.log("Using clean key:", cleanKey);

      const params = {
        Bucket: BUCKET_NAME,
        Key: cleanKey,
        Expires: 3600, // 1 hour for viewing
      };

      console.log("S3 params:", params);
      const url = await s3.getSignedUrlPromise("getObject", params);
      console.log("Generated signed URL:", url);

      return url;
    } catch (error: any) {
      console.error("Error generating presigned URL for GET:", error);
      throw new Error(
        `Failed to generate presigned URL for GET: ${error.message}`
      );
    }
  }

  public async getSignedUrlForFile(
    s3Key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    try {
      if (!s3Key) {
        throw new Error("S3 key is required");
      }

      console.log("getSignedUrlForFile called with:", s3Key);

      let key = s3Key;
      if (s3Key.includes("amazonaws.com/")) {
        const urlParts = s3Key.split("amazonaws.com/");
        key = urlParts[1];
      }

      console.log("Using key for signed URL:", key);

      const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: expiresInSeconds,
      };

      const signedUrl = await s3.getSignedUrlPromise("getObject", params);
      console.log("Generated signed URL:", signedUrl);

      return signedUrl;
    } catch (error: any) {
      console.error("Error generating signed URL for file:", error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  public async fileExists(s3Key: string): Promise<boolean> {
    try {
      console.log("Checking if file exists:", s3Key);

      let cleanKey = s3Key;
      if (s3Key.includes("amazonaws.com/")) {
        const urlParts = s3Key.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      console.log("Checking existence for clean key:", cleanKey);

      await s3
        .headObject({
          Bucket: BUCKET_NAME!,
          Key: cleanKey,
        })
        .promise();

      console.log("File exists:", cleanKey);
      return true;
    } catch (error: any) {
      console.log("File does not exist or error checking:", s3Key, error.code);
      return false;
    }
  }
}
