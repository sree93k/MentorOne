import { s3 } from "../../config/awsS3";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

interface UploadResult {
  success: boolean;
  s3Key?: string;
  videoUrl?: string;
  error?: string;
}

class BackendUploadService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

  /**
   * 🔧 BACKEND VIDEO UPLOAD
   * Alternative to direct S3 upload when CORS issues occur
   */
  public async uploadVideoFile(
    file: Express.Multer.File,
    folder: string = 'videos'
  ): Promise<UploadResult> {
    try {
      console.log("🔧 BackendUploadService: Starting file upload", {
        fileName: file.originalname,
        fileSize: file.size,
        folder
      });

      // Generate unique filename
      const timestamp = Date.now();
      const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const s3Key = `${folder}/${timestamp}_${cleanFileName}`;

      // Upload parameters
      const uploadParams = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype || 'video/mp4',
        ACL: 'private' // Keep videos private
      };

      console.log("🔧 BackendUploadService: Uploading to S3", {
        key: s3Key,
        bucket: this.BUCKET_NAME,
        contentType: file.mimetype
      });

      // Upload to S3
      const uploadResult = await s3.upload(uploadParams).promise();

      const result: UploadResult = {
        success: true,
        s3Key,
        videoUrl: uploadResult.Location
      };

      console.log("✅ BackendUploadService: Upload successful", {
        s3Key,
        location: uploadResult.Location
      });

      return result;

    } catch (error: any) {
      console.error("🚫 BackendUploadService: Upload failed", error);
      return {
        success: false,
        error: error.message || "Failed to upload video"
      };
    }
  }

  /**
   * 🔧 UPLOAD MULTIPLE FILES
   * Handle multiple video uploads
   */
  public async uploadMultipleVideoFiles(
    files: Express.Multer.File[],
    folder: string = 'videos'
  ): Promise<UploadResult[]> {
    console.log("🔧 BackendUploadService: Uploading multiple files", {
      fileCount: files.length
    });

    const uploadPromises = files.map(file => this.uploadVideoFile(file, folder));
    const results = await Promise.all(uploadPromises);

    const successful = results.filter(r => r.success).length;
    console.log("🔧 BackendUploadService: Batch upload completed", {
      total: files.length,
      successful,
      failed: files.length - successful
    });

    return results;
  }

  /**
   * 🗑️ DELETE VIDEO FILE
   * Remove video from S3
   */
  public async deleteVideoFile(s3Key: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("🗑️ BackendUploadService: Deleting file", { s3Key });

      const deleteParams = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      };

      await s3.deleteObject(deleteParams).promise();

      console.log("✅ BackendUploadService: File deleted successfully", { s3Key });
      return { success: true };

    } catch (error: any) {
      console.error("🚫 BackendUploadService: Delete failed", error);
      return {
        success: false,
        error: error.message || "Failed to delete video"
      };
    }
  }

  /**
   * 🔧 MULTER CONFIGURATION FOR BACKEND UPLOAD
   * Memory storage for processing before S3 upload
   */
  public getMulterConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB limit
        files: 10 // Max 10 files per request
      },
      fileFilter: (req, file, cb) => {
        // Allow video files
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only video files are allowed'));
        }
      }
    });
  }
}

export default new BackendUploadService();