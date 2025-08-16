import { Router, Request, Response, NextFunction } from "express";
import UploadService from "../../services/implementations/SecureUploadService";
import { authenticate } from "../../middlewares/authenticateuser";
import ApiResponse from "../../utils/apiResponse";
import { HttpStatus } from "../../constants/HttpStatus";
import { ApiError } from "../../middlewares/errorHandler";

const mediaRoutes = Router();
const uploadService = new UploadService();

// All media routes require authentication
mediaRoutes.use(authenticate);

mediaRoutes.get("/test-signed", async (req: Request, res: Response) => {
  try {
    console.log("Testing signed URL without auth...");
    const testKey =
      "images/1752657833299_happy-elementary-student-with-glasses.jpg";

    const signedUrl = await uploadService.S3generatePresignedUrlForGet(testKey);

    res.json({
      success: true,
      key: testKey,
      signedUrl: signedUrl,
    });
  } catch (error: any) {
    console.error("Test signed URL error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
mediaRoutes.get(
  "/signed-url",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔗 === SIGNED URL REQUEST DEBUG ===");
      console.log("- Full request URL:", req.url);
      console.log("- Query parameters:", req.query);
      console.log("- Headers:", {
        authorization: req.headers.authorization ? "Present" : "Missing",
        userAgent: req.headers["user-agent"],
      });

      const { s3Key } = req.query;

      console.log("🔗 Input validation:");
      console.log("- s3Key type:", typeof s3Key);
      console.log("- s3Key value:", s3Key);

      if (!s3Key || typeof s3Key !== "string") {
        console.error("❌ Invalid s3Key parameter");
        throw new ApiError(HttpStatus.BAD_REQUEST, "S3 key is required");
      }

      // Extract key from full URL if needed
      let key = s3Key;
      let originalKey = s3Key;

      console.log("🔗 Key processing:");
      console.log("- Original s3Key:", originalKey);
      console.log(
        "- Contains amazonaws.com:",
        s3Key.includes("amazonaws.com/")
      );

      if (s3Key.includes("amazonaws.com/")) {
        const urlParts = s3Key.split("amazonaws.com/");
        key = urlParts[1];
        console.log("- URL parts after split:", urlParts);
        console.log("- Extracted key:", key);
      }

      console.log("🔗 Final processing:");
      console.log("- Key to use for S3:", key);

      // Temporarily skip file existence check for debugging
      console.log("🔗 Skipping file existence check for debugging");

      try {
        console.log("🔗 Calling uploadService.S3generatePresignedUrlForGet");
        const signedUrl = await uploadService.S3generatePresignedUrlForGet(key);

        console.log("✅ Successfully generated signed URL");
        console.log("- Original s3Key:", originalKey);
        console.log("- Processed key:", key);
        console.log("- Generated URL:", signedUrl);

        const responseData = {
          url: signedUrl,
          expiresIn: 3600,
          originalKey: originalKey,
          processedKey: key,
        };

        console.log("🔗 Sending response:", responseData);

        res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              HttpStatus.OK,
              responseData,
              "Signed URL generated successfully"
            )
          );
      } catch (s3Error: any) {
        console.error("❌ S3 Error during signed URL generation:");
        console.error("- Error type:", s3Error.constructor.name);
        console.error("- Error message:", s3Error.message);
        console.error("- Error stack:", s3Error.stack);
        throw s3Error;
      }
    } catch (error: any) {
      console.error("🔗 === SIGNED URL REQUEST ERROR ===");
      console.error("- Error type:", error.constructor.name);
      console.error("- Error message:", error.message);
      console.error("- Error status:", error.status || error.statusCode);
      console.error("- Full error:", error);
      next(error);
    }
  }
);
// Batch signed URLs endpoint
mediaRoutes.post(
  "/batch-signed-urls",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("=== BATCH SIGNED URLS REQUEST ===");
      console.log("Request body:", req.body);

      const { s3Keys } = req.body;

      if (!Array.isArray(s3Keys)) {
        console.log("ERROR: s3Keys is not an array");
        throw new ApiError(HttpStatus.BAD_REQUEST, "s3Keys must be an array");
      }

      console.log("Processing", s3Keys.length, "keys");

      const signedUrls = await Promise.all(
        s3Keys.map(async (s3Key: string, index: number) => {
          try {
            console.log(`Processing key ${index + 1}/${s3Keys.length}:`, s3Key);

            // Extract S3 key from full URL if needed
            let key = s3Key;
            if (s3Key.includes("amazonaws.com/")) {
              const urlParts = s3Key.split("amazonaws.com/");
              key = urlParts[1];
              console.log(`Extracted key for ${index + 1}:`, key);
            }

            // Check if file exists
            const fileExists = await uploadService.fileExists(key);
            console.log(`File exists for ${index + 1}:`, fileExists);

            if (!fileExists) {
              console.log(`File not found for ${index + 1}:`, key);
              return { s3Key, error: "File not found", success: false };
            }

            const url = await uploadService.S3generatePresignedUrlForGet(key);
            console.log(
              `Generated URL for ${index + 1}:`,
              url ? "SUCCESS" : "FAILED"
            );

            return { s3Key, url, success: true };
          } catch (error: any) {
            console.error(`Error processing key ${index + 1}:`, error.message);
            return { s3Key, error: error.message, success: false };
          }
        })
      );

      console.log(
        "Batch processing complete. Results:",
        signedUrls.map((r) => ({
          s3Key: r.s3Key,
          success: r.success,
          hasUrl: !!r.url,
        }))
      );

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            signedUrls,
            "Batch signed URLs generated successfully"
          )
        );
    } catch (error: any) {
      console.error("=== BATCH SIGNED URLS ERROR ===");
      console.error("Error:", error);
      next(error);
    }
  }
);

// Test endpoint to check if media routes are working
mediaRoutes.get("/test", (req: Request, res: Response) => {
  console.log("Media routes test endpoint hit");
  res.json({
    success: true,
    message: "Media routes are working",
    timestamp: new Date().toISOString(),
  });
});

export default mediaRoutes;
