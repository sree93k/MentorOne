import { adminAxiosInstance } from "./instances/adminInstance";

const api = adminAxiosInstance;

// Cache for signed URLs to avoid repeated requests
const urlCache = new Map<string, { url: string; expiry: number }>();

export const getAdminSignedUrl = async (
  s3KeyOrUrl: string
): Promise<string> => {
  console.log("🔧 ADMIN getAdminSignedUrl Service Called:");
  console.log("- Input s3KeyOrUrl:", s3KeyOrUrl);

  if (!s3KeyOrUrl) {
    const error = new Error("S3 key or URL is required");
    console.error("❌ getAdminSignedUrl: No input provided");
    throw error;
  }

  // If it's already a regular HTTP URL (not S3), return as is
  if (s3KeyOrUrl.startsWith("http") && !s3KeyOrUrl.includes("amazonaws.com")) {
    console.log("🔧 Not an S3 URL, returning as is:", s3KeyOrUrl);
    return s3KeyOrUrl;
  }

  // Check cache first
  const cached = urlCache.get(s3KeyOrUrl);
  if (cached && cached.expiry > Date.now()) {
    console.log("💾 getAdminSignedUrl: Using cached URL");
    return cached.url;
  }

  try {
    console.log("🔧 ADMIN Making request to backend:");
    console.log("- Endpoint: /admin-media/signed-url");
    console.log("- s3Key parameter:", s3KeyOrUrl);
    console.log("- Using cookies for authentication");

    const response = await api.get("/admin-media/signed-url", {
      params: { s3Key: s3KeyOrUrl },
      // No Authorization header needed - cookies sent automatically
    });

    console.log("🔧 ADMIN Backend Response:");
    console.log("- Status:", response.status);
    console.log("- Status Text:", response.statusText);
    console.log("- Response data:", response.data);

    if (!response.data || !response.data.data || !response.data.data.url) {
      const error = new Error("Invalid response format from backend");
      console.error(
        "❌ getAdminSignedUrl: Invalid response format:",
        response.data
      );
      throw error;
    }

    const signedUrl = response.data.data.url;
    const expiresIn = response.data.data.expiresIn || 3600;

    console.log("✅ ADMIN getAdminSignedUrl: Success");
    console.log("- Original URL/Key:", s3KeyOrUrl);
    console.log("- Signed URL:", signedUrl);
    console.log("- Expires in:", expiresIn, "seconds");

    // Cache the URL (expire 5 minutes before actual expiry for safety)
    urlCache.set(s3KeyOrUrl, {
      url: signedUrl,
      expiry: Date.now() + (expiresIn - 300) * 1000,
    });

    return signedUrl;
  } catch (error: any) {
    console.error("❌ ADMIN getAdminSignedUrl: Error occurred");
    console.error("- Original URL/Key:", s3KeyOrUrl);
    console.error("- Error type:", error.constructor.name);
    console.error("- Error message:", error.message);
    console.error("- Error response:", error.response?.data);
    console.error("- Error status:", error.response?.status);
    console.error("- Full error object:", error);

    throw new Error(`Failed to get admin signed URL: ${error.message}`);
  }
};

// Helper function to get multiple signed URLs at once for admin
export const getAdminBatchSignedUrls = async (
  s3KeysOrUrls: string[]
): Promise<Record<string, string>> => {
  if (!s3KeysOrUrls || s3KeysOrUrls.length === 0) {
    return {};
  }

  const s3Urls = s3KeysOrUrls.filter(
    (url) => url && (url.includes("amazonaws.com") || !url.startsWith("http"))
  );

  const uncachedUrls = s3Urls.filter((url) => {
    const cached = urlCache.get(url);
    return !cached || cached.expiry <= Date.now();
  });

  const result: Record<string, string> = {};
  s3KeysOrUrls.forEach((url) => {
    if (!url) return;

    if (url.startsWith("http") && !url.includes("amazonaws.com")) {
      result[url] = url;
      return;
    }

    const cached = urlCache.get(url);
    if (cached && cached.expiry > Date.now()) {
      result[url] = cached.url;
    }
  });

  if (uncachedUrls.length > 0) {
    try {
      console.log("Making admin batch request for URLs:", uncachedUrls);

      const response = await api.post("/admin-media/batch-signed-urls", {
        s3Keys: uncachedUrls,
      });

      console.log("Admin batch signed URLs response:", response.data);

      response.data.data.forEach((item: any) => {
        if (item.success) {
          result[item.s3Key] = item.url;
          urlCache.set(item.s3Key, {
            url: item.url,
            expiry: Date.now() + 3300 * 1000, // 55 minutes
          });
        } else {
          if (item.s3Key.includes("amazonaws.com")) {
            result[item.s3Key] = item.s3Key;
          }
        }
      });
    } catch (error: any) {
      console.error("Error getting admin batch signed URLs:", error);
      uncachedUrls.forEach((url) => {
        if (url.includes("amazonaws.com")) {
          result[url] = url;
        }
      });
    }
  }

  return result;
};
