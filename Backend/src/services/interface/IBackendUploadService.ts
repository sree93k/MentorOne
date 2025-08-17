/**
 * 🔹 DIP COMPLIANCE: Backend Upload Service Interface
 * Defines server-side video upload operations with S3 integration
 */
export interface IBackendUploadService {
  // Video File Upload
  uploadVideoFile(
    file: Express.Multer.File,
    folder?: string
  ): Promise<{
    success: boolean;
    s3Key?: string;
    videoUrl?: string;
    error?: string;
  }>;

  // Multiple Files Upload
  uploadMultipleVideoFiles(
    files: Express.Multer.File[],
    folder?: string
  ): Promise<Array<{
    success: boolean;
    s3Key?: string;
    videoUrl?: string;
    error?: string;
  }>>;

  // File Deletion
  deleteVideoFile(
    s3Key: string
  ): Promise<{
    success: boolean;
    error?: string;
  }>;

  // Multer Configuration
  getMulterConfig(): any;
}