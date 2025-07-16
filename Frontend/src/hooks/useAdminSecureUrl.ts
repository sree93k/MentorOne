import { useState, useEffect, useRef } from "react";
import { getAdminSignedUrl } from "@/services/adminMediaService";

export const useAdminSecureUrl = (originalUrl: string | null | undefined) => {
  console.log("🔧 useAdminSecureUrl Hook Called:");
  console.log("- originalUrl:", originalUrl);

  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log("🔧 useAdminSecureUrl Effect Running:");
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

    console.log("🔧 Starting admin signed URL request for S3 URL");
    setLoading(true);
    setError(null);

    getAdminSignedUrl(originalUrl)
      .then((url) => {
        if (!abortControllerRef.current?.signal.aborted) {
          console.log("✅ useAdminSecureUrl: Successfully got signed URL");
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
          console.error("❌ useAdminSecureUrl: Error getting signed URL:", err);
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
          console.log("🔧 useAdminSecureUrl: Request completed");
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

  console.log("🔧 useAdminSecureUrl Hook State:");
  console.log("- secureUrl:", secureUrl);
  console.log("- loading:", loading);
  console.log("- error:", error);

  return { secureUrl, loading, error };
};

// Hook for profile pictures with fallback for admin
export const useAdminProfilePicture = (
  profilePictureUrl: string | null | undefined
) => {
  console.log("🖼️ useAdminProfilePicture Hook Called:");
  console.log("- profilePictureUrl:", profilePictureUrl);

  const { secureUrl, loading, error } = useAdminSecureUrl(profilePictureUrl);

  const finalUrl = secureUrl || "/default-avatar.png";

  console.log("🖼️ useAdminProfilePicture Results:");
  console.log("- secureUrl from useAdminSecureUrl:", secureUrl);
  console.log("- finalUrl (with fallback):", finalUrl);
  console.log("- loading:", loading);
  console.log("- error:", error);

  return {
    profilePictureUrl: finalUrl,
    loading,
    error,
  };
};
