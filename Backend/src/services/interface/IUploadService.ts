export interface IUploadService {
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
