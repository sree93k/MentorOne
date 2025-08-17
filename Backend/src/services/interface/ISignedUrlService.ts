/**
 * 🔹 DIP COMPLIANCE: Signed URL Service Interface
 * Defines secure S3 signed URL generation operations
 */
export interface ISignedUrlService {
  // URL Generation
  generateSignedUrl(
    s3Key: string,
    options?: {
      expiresIn?: number; // in seconds, default 1 hour
      responseContentType?: string;
      responseContentDisposition?: 'inline' | 'attachment';
    }
  ): Promise<{
    success: boolean;
    signedUrl?: string;
    error?: string;
    expiresAt?: Date;
  }>;

  generateUploadUrl(
    s3Key: string,
    contentType: string,
    options?: {
      expiresIn?: number;
      fileSizeLimit?: number;
      allowedMimeTypes?: string[];
    }
  ): Promise<{
    success: boolean;
    uploadUrl?: string;
    error?: string;
    expiresAt?: Date;
    uploadId?: string;
  }>;

  // Multi-part Upload
  generateMultipartUploadUrls(
    s3Key: string,
    partCount: number,
    uploadId: string,
    options?: {
      expiresIn?: number;
    }
  ): Promise<{
    success: boolean;
    uploadUrls?: Array<{
      partNumber: number;
      signedUrl: string;
    }>;
    error?: string;
  }>;

  // URL Validation
  validateSignedUrl(
    signedUrl: string,
    s3Key: string
  ): Promise<{
    isValid: boolean;
    isExpired?: boolean;
    expiresAt?: Date;
    error?: string;
  }>;

  // Batch Operations
  generateBatchSignedUrls(
    s3Keys: string[],
    options?: {
      expiresIn?: number;
      responseContentType?: string;
    }
  ): Promise<Array<{
    s3Key: string;
    success: boolean;
    signedUrl?: string;
    error?: string;
  }>>;

  // Access Control
  generateSecureDownloadUrl(
    s3Key: string,
    userId: string,
    options?: {
      expiresIn?: number;
      oneTimeUse?: boolean;
      ipRestriction?: string;
    }
  ): Promise<{
    success: boolean;
    secureUrl?: string;
    downloadToken?: string;
    error?: string;
    expiresAt?: Date;
  }>;
}