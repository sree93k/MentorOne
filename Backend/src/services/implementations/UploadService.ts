import { IUploadService } from "../interface/IUploadService";
import { s3 } from "../../config/awsS3";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import UserRepository from "../../repositories/implementations/UserRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export default class UploadService implements IUploadService {
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
          // Remove any public access
          ACL: "private",
        })
        .promise();

      // Return the S3 key as the URL for backward compatibility
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

      // Update user with S3 key instead of URL
      await this.UserRepository.update(id, { profilePicture: key });

      // Delete old profile picture if exists
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
      } else if (folder === "audio") {
        const outputStream = new PassThrough();
        ffmpeg()
          .input(file)
          .audioCodec("libopus")
          .format("webm")
          .audioBitrate("64k")
          .pipe(outputStream);

        processedFile = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          outputStream.on("data", (chunk) => chunks.push(chunk));
          outputStream.on("end", () => resolve(Buffer.concat(chunks)));
          outputStream.on("error", reject);
        });
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

      // Return only the S3 key
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
        ACL: "private",
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
      console.log("S3generatePresignedUrlForGet called with key:", key);

      // Clean the key - remove any URL prefix if present
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

  // Get signed URL for existing files
  public async getSignedUrlForFile(
    s3Key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    try {
      if (!s3Key) {
        throw new Error("S3 key is required");
      }

      console.log("getSignedUrlForFile called with:", s3Key);

      // If it's already a full URL, extract the key
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

  // Helper method to check if file exists
  // Fixed fileExists method in your UploadService.ts

  public async fileExists(s3Key: string): Promise<boolean> {
    try {
      console.log("Checking if file exists:", s3Key);

      // Clean the key - remove any URL prefix if present
      let cleanKey = s3Key; // ← This line was missing in your code
      if (s3Key.includes("amazonaws.com/")) {
        const urlParts = s3Key.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      console.log("Checking existence for clean key:", cleanKey);

      await s3
        .headObject({
          Bucket: BUCKET_NAME!,
          Key: cleanKey, // ← This was causing the ReferenceError
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
