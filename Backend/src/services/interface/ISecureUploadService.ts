/**
 * 🔹 DIP COMPLIANCE: Secure Upload Service Interface
 * Defines secure file upload and signed URL operations with user validation
 */
export interface ISecureUploadService {
  // Profile Image Operations
  uploadProfileImage(
    file: Express.Multer.File
  ): Promise<{
    url: string;
    public_id?: string;
  }>;

  updateProfileImage(
    file: Express.Multer.File,
    id: string
  ): Promise<{
    s3Key: string;
    url?: string;
  }>;

  // General File Upload
  uploadFile(
    file: Buffer,
    fileName: string,
    folder: "images" | "audio" | "videos" | "pdfs",
    mimeType: string
  ): Promise<string>;

  // Presigned URL Generation
  S3generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
  ): Promise<{
    url: string;
    key: string;
  }>;

  S3generatePresignedUrlForGet(
    key: string
  ): Promise<string>;

  // Secure Video Operations
  generateSecureVideoUrl(
    key: string,
    userId: string,
    serviceId: string,
    sessionToken?: string
  ): Promise<{
    url: string;
    expiresAt: Date;
    sessionToken?: string;
  }>;

  // File Access Operations
  getSignedUrlForFile(
    s3Key: string,
    expiresInSeconds?: number
  ): Promise<string>;

  fileExists(
    s3Key: string
  ): Promise<boolean>;
}