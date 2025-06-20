import { IUploadService } from "../interface/IUploadService";

import * as fs from "fs";

import { IBaseRepository } from "../../repositories/interface/IBaseRepository";
import BaseRepository from "../../repositories/implementations/BaseRepository";
import Users from "../../models/userModel";
import { EUsers } from "../../entities/userEntity";
import { s3 } from "../../config/awsS3";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export default class UploadService implements IUploadService {
  private BaseRepository: IBaseRepository<EUsers>;

  constructor() {
    this.BaseRepository = new BaseRepository<EUsers>(Users);
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
  ): Promise<{ url: string; public_id?: string }> {
    try {
      const user = await this.BaseRepository.findById(id);
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
        })
        .promise();
      const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      await this.BaseRepository.update(id, { profilePicture: url });
      if (user.profilePicture) {
        const oldKey = user.profilePicture.split("/").slice(-2).join("/");
        await s3.deleteObject({ Bucket: BUCKET_NAME!, Key: oldKey }).promise();
      }
      return { url };
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw new Error("Failed to update profile image");
    }
  }

  public async uploadFile(
    file: Buffer,
    fileName: string,
    folder: "images" | "audio",
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
        })
        .promise();
      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
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
