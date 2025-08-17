/**
 * 🔹 DIP COMPLIANCE: Secure Video Proxy Service Interface
 * Defines secure video streaming operations with session validation
 */
import { Response } from "express";

export interface ISecureVideoProxyService {
  // Secure Video Streaming
  streamSecureVideo(
    videoKey: string,
    userId: string,
    serviceId: string,
    sessionToken: string,
    res: Response,
    range?: string
  ): Promise<{
    success: boolean;
    error?: string;
    headers?: Record<string, string>;
  }>;

  // Proxy URL Generation
  generateProxyVideoUrl(
    videoKey: string,
    serviceId: string,
    sessionToken: string
  ): string;

  // Secure Video Chunks
  getSecureVideoChunk(
    videoKey: string,
    userId: string,
    serviceId: string,
    sessionToken: string,
    chunkIndex: number,
    chunkSize?: number
  ): Promise<{
    success: boolean;
    data?: Buffer;
    error?: string;
    totalChunks?: number;
  }>;

  // Video Access Validation
  validateVideoAccess(
    videoKey: string,
    userId: string,
    serviceId: string
  ): Promise<boolean>;
}