import { UploadResponse } from "../../utils/uploadToCloudninary";
import { EUsers } from "../../entities/userEntity";
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
  editUserProfile(id: string, payload: any): Promise<EUsers | null>;
}
// import { UploadResponse } from "../../utils/uploadToCloudninary";

// export interface inUploadService {
//   uploadBufferToS3(buffer: Buffer, key: string): Promise<string>;
//   uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse>;
//   uploadProfileImage(file: Express.Multer.File): Promise<UploadResponse>;
//   updateProfileImage(
//     file: Express.MulterS3.File,
//     id: string
//   ): Promise<UploadResponse>;
//   uploadImage(file: Express.MulterS3.File): Promise<string>;
// }
