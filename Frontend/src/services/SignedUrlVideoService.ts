import { 
  createVideoSession, 
  generateVideoSignedUrl, 
  generateTutorialSignedUrls, 
  refreshVideoSignedUrl 
} from './menteeService';

interface VideoSession {
  sessionToken: string;
  expiresAt: string;
  message: string;
}

interface SignedUrlData {
  signedUrl: string;
  expiresAt: Date;
  expirationMinutes: number;
}

interface TutorialSignedUrls {
  signedUrls: Array<{
    episodeId: string;
    signedUrl: string | null;
    expiresAt: Date | null;
    error: string | null;
  }>;
  totalEpisodes: number;
  validUrls: number;
  expirationMinutes: number;
}

class SignedUrlVideoService {
  private sessionTokens: Map<string, VideoSession> = new Map();
  private urlCache: Map<string, { url: string; expiresAt: Date }> = new Map();

  /**
   * 🔒 CREATE VIDEO SESSION AND GET SIGNED URL
   * One-step function to create session and get signed URL
   */
  public async getSecureVideoUrl(
    videoKey: string,
    serviceId: string
  ): Promise<string> {
    try {
      console.log('🔒 SignedUrlVideoService: Getting secure video URL', {
        videoKey: videoKey.substring(0, 30) + '...',
        serviceId
      });

      // Check if we have a valid cached URL
      const cacheKey = `${serviceId}_${videoKey}`;
      const cached = this.urlCache.get(cacheKey);
      if (cached && cached.expiresAt > new Date(Date.now() + 60000)) { // 1 minute buffer
        console.log('🔒 SignedUrlVideoService: Using cached URL');
        return cached.url;
      }

      // Get or create session
      let session = this.sessionTokens.get(serviceId);
      if (!session || new Date(session.expiresAt) <= new Date()) {
        console.log('🔒 SignedUrlVideoService: Creating new session');
        session = await createVideoSession(serviceId);
        this.sessionTokens.set(serviceId, session);
      }

      // Generate signed URL
      const signedUrlData: SignedUrlData = await generateVideoSignedUrl(
        videoKey,
        serviceId,
        session.sessionToken
      );

      // Cache the URL
      this.urlCache.set(cacheKey, {
        url: signedUrlData.signedUrl,
        expiresAt: new Date(signedUrlData.expiresAt)
      });

      console.log('✅ SignedUrlVideoService: Secure URL generated successfully');
      return signedUrlData.signedUrl;

    } catch (error: any) {
      console.error('🚫 SignedUrlVideoService: Error getting secure video URL', error);
      throw new Error(error.message || 'Failed to get secure video URL');
    }
  }

  /**
   * 🔒 GET ALL TUTORIAL SIGNED URLS
   * Get signed URLs for all episodes in a tutorial
   */
  public async getTutorialSignedUrls(
    tutorialId: string,
    serviceId: string
  ): Promise<TutorialSignedUrls> {
    try {
      console.log('🔒 SignedUrlVideoService: Getting tutorial signed URLs', {
        tutorialId,
        serviceId
      });

      // Get or create session
      let session = this.sessionTokens.get(serviceId);
      if (!session || new Date(session.expiresAt) <= new Date()) {
        console.log('🔒 SignedUrlVideoService: Creating new session for tutorial');
        session = await createVideoSession(serviceId);
        this.sessionTokens.set(serviceId, session);
      }

      // Generate signed URLs for all episodes
      const tutorialUrls: TutorialSignedUrls = await generateTutorialSignedUrls(
        tutorialId,
        session.sessionToken
      );

      console.log('✅ SignedUrlVideoService: Tutorial signed URLs generated successfully', {
        validUrls: tutorialUrls.validUrls,
        totalEpisodes: tutorialUrls.totalEpisodes
      });

      return tutorialUrls;

    } catch (error: any) {
      console.error('🚫 SignedUrlVideoService: Error getting tutorial signed URLs', error);
      throw new Error(error.message || 'Failed to get tutorial signed URLs');
    }
  }

  /**
   * 🔒 REFRESH SIGNED URL
   * Refresh an expired signed URL
   */
  public async refreshSignedUrl(
    videoKey: string,
    serviceId: string
  ): Promise<string> {
    try {
      console.log('🔒 SignedUrlVideoService: Refreshing signed URL', {
        videoKey: videoKey.substring(0, 30) + '...',
        serviceId
      });

      // Get current session
      const session = this.sessionTokens.get(serviceId);
      if (!session) {
        throw new Error('No active session found. Please refresh the page.');
      }

      // Refresh the signed URL
      const signedUrlData: SignedUrlData = await refreshVideoSignedUrl(
        videoKey,
        serviceId,
        session.sessionToken
      );

      // Update cache
      const cacheKey = `${serviceId}_${videoKey}`;
      this.urlCache.set(cacheKey, {
        url: signedUrlData.signedUrl,
        expiresAt: new Date(signedUrlData.expiresAt)
      });

      console.log('✅ SignedUrlVideoService: Signed URL refreshed successfully');
      return signedUrlData.signedUrl;

    } catch (error: any) {
      console.error('🚫 SignedUrlVideoService: Error refreshing signed URL', error);
      throw new Error(error.message || 'Failed to refresh signed URL');
    }
  }

  /**
   * 🔒 EXTRACT S3 KEY FROM VIDEO URL
   * Convert existing video URLs to S3 keys for signed URL generation
   */
  public extractS3KeyFromUrl(videoUrl: string): string | null {
    try {
      if (!videoUrl) return null;

      // Handle direct S3 URLs
      if (videoUrl.includes('amazonaws.com/')) {
        const urlParts = videoUrl.split('amazonaws.com/');
        return urlParts[1] || null;
      }

      // Handle relative paths
      if (videoUrl.startsWith('videos/')) {
        return videoUrl;
      }

      // Handle file names without path
      if (!videoUrl.includes('/') && videoUrl.includes('.')) {
        return `videos/${videoUrl}`;
      }

      return null;
    } catch (error) {
      console.error('🚫 SignedUrlVideoService: Error extracting S3 key', error);
      return null;
    }
  }

  /**
   * 🔒 CHECK URL EXPIRATION
   * Check if a cached URL is still valid
   */
  public isUrlValid(videoKey: string, serviceId: string): boolean {
    const cacheKey = `${serviceId}_${videoKey}`;
    const cached = this.urlCache.get(cacheKey);
    return cached ? cached.expiresAt > new Date(Date.now() + 60000) : false; // 1 minute buffer
  }

  /**
   * 🔒 CLEAR CACHE
   * Clear all cached URLs (useful for logout or session changes)
   */
  public clearCache(): void {
    this.urlCache.clear();
    this.sessionTokens.clear();
    console.log('🔒 SignedUrlVideoService: Cache cleared');
  }

  /**
   * 🔒 GET SESSION INFO
   * Get current session information
   */
  public getSessionInfo(serviceId: string): VideoSession | null {
    return this.sessionTokens.get(serviceId) || null;
  }
}

export default new SignedUrlVideoService();