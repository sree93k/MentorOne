// import { UploadResponse } from "../../utils/uploadToCloudninary";
// import { EUsers } from "../../entities/userEntity";
// export interface inUploadService {
//   uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse>;
//   uploadProfileImage(file: Express.Multer.File): Promise<UploadResponse>;
//   updateProfileImage(
//     file: Express.Multer.File,
//     id: string
//   ): Promise<UploadResponse>;
//   // editUserProfile(id: string, payload: any): Promise<EUsers | null>;
//   updateImage(file: Express.Multer.File, id: string): Promise<EUsers | null>;
//   S3generatePresignedUrl(
//     fileName: string,
//     fileType: string,
//     folder: string
//   ): Promise<{ url: string; key: string }>;
//   S3generatePresignedUrlForGet(key: string): Promise<string>;
// }
import { EUsers } from "../../entities/userEntity";

export interface inUploadService {
  uploadProfileImage(
    file: Express.Multer.File
  ): Promise<{ url: string; public_id?: string }>;

  updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<{ url: string; public_id?: string }>;

  uploadFile(
    file: Buffer,
    fileName: string,
    folder: "images" | "audio",
    mimeType: string
  ): Promise<string>;

  S3generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
  ): Promise<{ url: string; key: string }>;

  S3generatePresignedUrlForGet(key: string): Promise<string>;
}
