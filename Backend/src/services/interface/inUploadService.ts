import { UploadResponse } from "../../utils/uploadToCloudninary";

export interface inUploadService {
  uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse>;
  uploadProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<UploadResponse>;
  updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<UploadResponse>;
}
