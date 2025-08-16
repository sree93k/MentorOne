// 🔒 SECURE BLOB VIDEO SERVICE - Complete URL Protection
// This service downloads video in chunks and creates blob URLs to prevent direct access
import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

interface VideoChunk {
  data: ArrayBuffer;
  index: number;
  totalChunks: number;
}

interface BlobVideoOptions {
  onProgress?: (loaded: number, total: number) => void;
  onError?: (error: string) => void;
  chunkSize?: number;
}

class SecureBlobVideoService {
  private activeLoads: Map<string, boolean> = new Map();
  private blobUrls: Map<string, string> = new Map();

  /**
   * 🔒 SECURE BLOB VIDEO LOADING - Prevents URL exposure completely
   * Downloads video in chunks and creates a blob URL for secure playback
   */
  public async loadVideoAsBlob(
    videoKey: string,
    serviceId: string,
    sessionToken: string,
    options: BlobVideoOptions = {}
  ): Promise<string | null> {
    try {
      const loadId = `${videoKey}-${serviceId}`;
      
      // Prevent multiple simultaneous loads of the same video
      if (this.activeLoads.get(loadId)) {
        console.log("🔒 SecureBlobVideo: Already loading this video");
        return null;
      }

      this.activeLoads.set(loadId, true);

      console.log("🔒 SecureBlobVideo: Starting secure blob video load", {
        videoKey: videoKey.substring(0, 30) + "...",
        serviceId
      });

      // Clean up any existing blob URL for this video
      this.cleanupBlobUrl(loadId);

      const chunkSize = options.chunkSize || 1024 * 1024; // 1MB default
      const chunks: VideoChunk[] = [];
      let totalChunks = 0;
      let chunkIndex = 0;

      // Download video chunks sequentially
      while (true) {
        try {
          console.log(`🔒 SecureBlobVideo: Loading chunk ${chunkIndex}`);

          const response = await api.get(
            `/seeker/secure-video-chunk/${encodeURIComponent(videoKey)}/${chunkIndex}`,
            {
              params: { serviceId, sessionToken, chunkSize },
              responseType: 'arraybuffer',
              timeout: 30000, // 30 second timeout per chunk
            }
          );

          // Extract chunk information from headers
          totalChunks = parseInt(response.headers['x-total-chunks'] || '0');
          const currentChunkIndex = parseInt(response.headers['x-chunk-index'] || '0');

          chunks.push({
            data: response.data,
            index: currentChunkIndex,
            totalChunks
          });

          console.log(`🔒 SecureBlobVideo: Chunk ${chunkIndex} loaded (${response.data.byteLength} bytes)`);

          // Update progress
          if (options.onProgress) {
            const loaded = chunks.length;
            options.onProgress(loaded, totalChunks);
          }

          // Check if we've loaded all chunks
          if (chunkIndex + 1 >= totalChunks) {
            console.log(`🔒 SecureBlobVideo: All ${totalChunks} chunks loaded`);
            break;
          }

          chunkIndex++;
        } catch (chunkError: any) {
          console.error(`🔒 SecureBlobVideo: Error loading chunk ${chunkIndex}:`, chunkError);
          
          if (chunkError.response?.status === 404 && chunkIndex > 0) {
            // No more chunks available, we're done
            console.log("🔒 SecureBlobVideo: No more chunks, video fully loaded");
            break;
          }
          
          throw chunkError;
        }
      }

      // Combine all chunks into a single blob
      console.log("🔒 SecureBlobVideo: Combining chunks into blob");
      
      const combinedBuffer = new Uint8Array(
        chunks.reduce((total, chunk) => total + chunk.data.byteLength, 0)
      );

      let offset = 0;
      for (const chunk of chunks) {
        combinedBuffer.set(new Uint8Array(chunk.data), offset);
        offset += chunk.data.byteLength;
      }

      // Create blob with video MIME type
      const videoBlob = new Blob([combinedBuffer], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(videoBlob);

      console.log("🔒 SecureBlobVideo: Blob URL created", {
        blobSize: videoBlob.size,
        blobUrl: blobUrl.substring(0, 50) + "..."
      });

      // Store blob URL for cleanup
      this.blobUrls.set(loadId, blobUrl);
      this.activeLoads.delete(loadId);

      return blobUrl;

    } catch (error: any) {
      console.error("🔒 SecureBlobVideo: Error creating blob video:", error);
      
      const loadId = `${videoKey}-${serviceId}`;
      this.activeLoads.delete(loadId);
      
      if (options.onError) {
        options.onError(error.message || "Failed to load video");
      }
      
      return null;
    }
  }

  /**
   * 🔒 PROGRESSIVE BLOB LOADING - Start playing while downloading
   * Loads first few chunks quickly to start playback, then continues in background
   */
  public async loadVideoProgressiveBlob(
    videoKey: string,
    serviceId: string,
    sessionToken: string,
    videoElement: HTMLVideoElement,
    options: BlobVideoOptions = {}
  ): Promise<boolean> {
    try {
      console.log("🔒 SecureBlobVideo: Starting progressive blob loading");

      // Load first 3-5 chunks for initial playback
      const initialChunks = 5;
      const chunks: ArrayBuffer[] = [];

      for (let i = 0; i < initialChunks; i++) {
        try {
          const response = await api.get(
            `/seeker/secure-video-chunk/${encodeURIComponent(videoKey)}/${i}`,
            {
              params: { serviceId, sessionToken },
              responseType: 'arraybuffer',
              timeout: 10000,
            }
          );

          chunks.push(response.data);
          
          if (options.onProgress) {
            options.onProgress(i + 1, initialChunks);
          }

        } catch (error) {
          console.log(`🔒 SecureBlobVideo: Chunk ${i} not available, stopping initial load`);
          break;
        }
      }

      if (chunks.length === 0) {
        throw new Error("No video chunks available");
      }

      // Create initial blob for quick playback start
      const combinedSize = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
      const combinedBuffer = new Uint8Array(combinedSize);
      
      let offset = 0;
      for (const chunk of chunks) {
        combinedBuffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      const initialBlob = new Blob([combinedBuffer], { type: 'video/mp4' });
      const initialBlobUrl = URL.createObjectURL(initialBlob);

      console.log("🔒 SecureBlobVideo: Initial blob created for quick start");

      // Set video source to initial blob
      videoElement.src = initialBlobUrl;

      // Continue loading remaining chunks in the background
      this.loadRemainingChunksInBackground(
        videoKey, 
        serviceId, 
        sessionToken, 
        videoElement, 
        initialChunks,
        options
      );

      return true;

    } catch (error: any) {
      console.error("🔒 SecureBlobVideo: Error in progressive loading:", error);
      
      if (options.onError) {
        options.onError(error.message || "Failed to load video progressively");
      }
      
      return false;
    }
  }

  /**
   * Load remaining video chunks in background and update video source
   */
  private async loadRemainingChunksInBackground(
    videoKey: string,
    serviceId: string,
    sessionToken: string,
    videoElement: HTMLVideoElement,
    startChunk: number,
    options: BlobVideoOptions
  ): Promise<void> {
    try {
      console.log("🔒 SecureBlobVideo: Loading remaining chunks in background");

      const allChunks: ArrayBuffer[] = [];
      let chunkIndex = 0;
      let totalChunks = 0;

      // Re-download all chunks (including initial ones for complete video)
      while (true) {
        try {
          const response = await api.get(
            `/seeker/secure-video-chunk/${encodeURIComponent(videoKey)}/${chunkIndex}`,
            {
              params: { serviceId, sessionToken },
              responseType: 'arraybuffer',
              timeout: 30000,
            }
          );

          totalChunks = parseInt(response.headers['x-total-chunks'] || '0');
          allChunks.push(response.data);

          if (chunkIndex + 1 >= totalChunks) {
            break;
          }

          chunkIndex++;
        } catch (error) {
          console.log("🔒 SecureBlobVideo: Background loading complete");
          break;
        }
      }

      // Create complete blob
      const combinedSize = allChunks.reduce((total, chunk) => total + chunk.byteLength, 0);
      const combinedBuffer = new Uint8Array(combinedSize);
      
      let offset = 0;
      for (const chunk of allChunks) {
        combinedBuffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      const completeBlob = new Blob([combinedBuffer], { type: 'video/mp4' });
      const completeBlobUrl = URL.createObjectURL(completeBlob);

      // Update video source to complete blob (seamlessly)
      const currentTime = videoElement.currentTime;
      const wasPlaying = !videoElement.paused;

      videoElement.src = completeBlobUrl;
      videoElement.currentTime = currentTime;

      if (wasPlaying) {
        videoElement.play();
      }

      console.log("🔒 SecureBlobVideo: Complete video blob loaded in background");

    } catch (error) {
      console.error("🔒 SecureBlobVideo: Error loading background chunks:", error);
    }
  }

  /**
   * Clean up blob URL to prevent memory leaks
   */
  public cleanupBlobUrl(videoId: string): void {
    const existingUrl = this.blobUrls.get(videoId);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      this.blobUrls.delete(videoId);
      console.log("🔒 SecureBlobVideo: Cleaned up blob URL");
    }
  }

  /**
   * Clean up all blob URLs
   */
  public cleanupAllBlobUrls(): void {
    for (const [id, url] of this.blobUrls.entries()) {
      URL.revokeObjectURL(url);
    }
    this.blobUrls.clear();
    console.log("🔒 SecureBlobVideo: Cleaned up all blob URLs");
  }

  /**
   * Check if video is currently being loaded
   */
  public isLoading(videoKey: string, serviceId: string): boolean {
    const loadId = `${videoKey}-${serviceId}`;
    return this.activeLoads.get(loadId) || false;
  }
}

export default new SecureBlobVideoService();