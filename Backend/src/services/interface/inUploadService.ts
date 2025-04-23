import { UploadResponse } from "../../utils/uploadToCloudninary";
import { EUsers } from "../../entities/userEntity";
export interface inUploadService {
  uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse>;
  uploadProfileImage(file: Express.Multer.File): Promise<UploadResponse>;
  updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<UploadResponse>;
  // editUserProfile(id: string, payload: any): Promise<EUsers | null>;
  updateImage(file: Express.Multer.File, id: string): Promise<EUsers | null>;
  S3generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
  ): Promise<{ url: string; key: string }>;
}
