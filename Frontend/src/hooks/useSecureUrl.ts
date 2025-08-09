import { useState, useEffect, useRef, useCallback } from "react";
import { getSignedUrl } from "@/services/userServices";

export const useSecureUrl = (originalUrl: string | null | undefined) => {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const processedUrls = useRef<Set<string>>(new Set()); // NEW: Prevent duplicate requests

  // Memoized URL processing to prevent infinite loops
  const processUrl = useCallback(async (url: string) => {
    // Prevent duplicate processing
    if (processedUrls.current.has(url)) {
      return;
    }

    processedUrls.current.add(url);

    // Cleanup previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check if it's an S3 URL
    const isS3Url = url.includes("amazonaws.com") || url.includes("s3.");

    // If it's not an S3 URL, return as is
    if (!isS3Url) {
      setSecureUrl(url);
      setLoading(false);
      setError(null);
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const signedUrl = await getSignedUrl(url);

      if (!abortControllerRef.current?.signal.aborted) {
        setSecureUrl(signedUrl);
        setError(null);
      }
    } catch (err: any) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error("❌ useSecureUrl: Error getting signed URL:", err);
        setError(err.message || "Failed to load media");
        // Use original URL as fallback
        setSecureUrl(url);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!originalUrl) {
      setSecureUrl(null);
      setLoading(false);
      setError(null);
      processedUrls.current.clear(); // Clear cache when no URL
      return;
    }

    // Only process if we haven't seen this URL before
    if (!processedUrls.current.has(originalUrl)) {
      processUrl(originalUrl);
    } else {
      // URL already processed, just set loading to false
      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [originalUrl, processUrl]);

  return { secureUrl, loading, error };
};

// Hook for profile pictures with fallback
export const useProfilePicture = (
  profilePictureUrl: string | null | undefined
) => {
  const { secureUrl, loading, error } = useSecureUrl(profilePictureUrl);

  // Create fallback avatar if no URL available
  const finalUrl = secureUrl || null; // Don't fallback here, let component handle it

  return {
    profilePictureUrl: finalUrl,
    loading,
    error,
  };
};
