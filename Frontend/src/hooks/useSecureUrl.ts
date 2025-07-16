import { useState, useEffect, useRef } from "react";
import { getSignedUrl } from "@/services/userServices";

export const useSecureUrl = (originalUrl: string | null | undefined) => {
  console.log("🔧 useSecureUrl Hook Called:");
  console.log("- originalUrl:", originalUrl);

  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log("🔧 useSecureUrl Effect Running:");
    console.log("- originalUrl:", originalUrl);

    // Cleanup previous request
    if (abortControllerRef.current) {
      console.log("🔧 Aborting previous request");
      abortControllerRef.current.abort();
    }

    if (!originalUrl) {
      console.log("🔧 No original URL provided, resetting state");
      setSecureUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check if it's an S3 URL
    const isS3Url =
      originalUrl.includes("amazonaws.com") || originalUrl.includes("s3.");
    console.log("🔧 URL Analysis:");
    console.log("- isS3Url:", isS3Url);
    console.log(
      "- contains amazonaws.com:",
      originalUrl.includes("amazonaws.com")
    );
    console.log("- contains s3.:", originalUrl.includes("s3."));

    // If it's not an S3 URL, return as is
    if (!isS3Url) {
      console.log("🔧 Not an S3 URL, using original URL");
      setSecureUrl(originalUrl);
      setLoading(false);
      setError(null);
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    console.log("🔧 Starting signed URL request for S3 URL");
    setLoading(true);
    setError(null);

    getSignedUrl(originalUrl)
      .then((url) => {
        if (!abortControllerRef.current?.signal.aborted) {
          console.log("✅ useSecureUrl: Successfully got signed URL");
          console.log("- Original URL:", originalUrl);
          console.log("- Signed URL:", url);
          setSecureUrl(url);
          setError(null);
        } else {
          console.log("🔧 Request was aborted");
        }
      })
      .catch((err) => {
        if (!abortControllerRef.current?.signal.aborted) {
          console.error("❌ useSecureUrl: Error getting signed URL:", err);
          console.error("- Original URL:", originalUrl);
          console.error("- Error message:", err.message);
          setError(err.message || "Failed to load media");
          // Fallback to original URL
          console.log("🔧 Using original URL as fallback");
          setSecureUrl(originalUrl);
        }
      })
      .finally(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          console.log("🔧 useSecureUrl: Request completed");
          setLoading(false);
        }
      });

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [originalUrl]);

  console.log("🔧 useSecureUrl Hook State:");
  console.log("- secureUrl:", secureUrl);
  console.log("- loading:", loading);
  console.log("- error:", error);

  return { secureUrl, loading, error };
};

// Hook for profile pictures with fallback
export const useProfilePicture = (
  profilePictureUrl: string | null | undefined
) => {
  console.log("🖼️ useProfilePicture Hook Called:");
  console.log("- profilePictureUrl:", profilePictureUrl);

  const { secureUrl, loading, error } = useSecureUrl(profilePictureUrl);

  const finalUrl = secureUrl || "/default-avatar.png";

  console.log("🖼️ useProfilePicture Results:");
  console.log("- secureUrl from useSecureUrl:", secureUrl);
  console.log("- finalUrl (with fallback):", finalUrl);
  console.log("- loading:", loading);
  console.log("- error:", error);

  return {
    profilePictureUrl: finalUrl,
    loading,
    error,
  };
};
