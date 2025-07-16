// // export interface IUploadService {
// //   uploadProfileImage(
// //     file: Express.Multer.File
// //   ): Promise<{ url: string; public_id?: string }>;

// //   updateProfileImage(
// //     file: Express.Multer.File,
// //     id: string
// //   ): Promise<{ url: string; public_id?: string }>;

// //   uploadFile(
// //     file: Buffer,
// //     fileName: string,
// //     folder: "images" | "audio",
// //     mimeType: string
// //   ): Promise<string>;

// //   S3generatePresignedUrl(
// //     fileName: string,
// //     fileType: string,
// //     folder: string
// //   ): Promise<{ url: string; key: string }>;

// //   S3generatePresignedUrlForGet(key: string): Promise<string>;
// // }
// export interface IUploadService {
//   uploadProfileImage(
//     file: Express.Multer.File
//   ): Promise<{ s3Key: string; url?: string }>;

//   updateProfileImage(
//     file: Express.Multer.File,
//     id: string
//   ): Promise<{ s3Key: string; url?: string }>;

//   uploadFile(
//     file: Buffer,
//     fileName: string,
//     folder: "images" | "audio" | "videos" | "pdfs",
//     mimeType: string
//   ): Promise<string>;

//   S3generatePresignedUrl(
//     fileName: string,
//     fileType: string,
//     folder: string
//   ): Promise<{ url: string; key: string }>;

//   S3generatePresignedUrlForGet(key: string): Promise<string>;

//   getSignedUrlForFile(
//     s3Key: string,
//     expiresInSeconds?: number
//   ): Promise<string>;

//   fileExists(s3Key: string): Promise<boolean>;
// }
export interface IUploadService {
  uploadProfileImage(
    file: Express.Multer.File
  ): Promise<{ url: string; public_id?: string }>;

  updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<{ s3Key: string; url?: string }>;

  uploadFile(
    file: Buffer,
    fileName: string,
    folder: "images" | "audio" | "videos" | "pdfs",
    mimeType: string
  ): Promise<string>;

  S3generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
  ): Promise<{ url: string; key: string }>;

  S3generatePresignedUrlForGet(key: string): Promise<string>;

  getSignedUrlForFile(
    s3Key: string,
    expiresInSeconds?: number
  ): Promise<string>;

  fileExists(s3Key: string): Promise<boolean>;
}
