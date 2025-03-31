import cloudinary from "../config/cloudinary";

export interface UploadResponse {
  url: string;
  public_id: string;
}

// Function to upload image buffer to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    console.log("cloudinary 1");
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Mentor_One",
        resource_type: "image", // Explicitly specify as image
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(new Error("Failed to upload image"));
        } else {
          if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            console.log("cloudinary error");
            reject(new Error("Upload result is undefined"));
          }
        }
      }
    );
    console.log("cloudinary 2");
    uploadStream.end(buffer); // Pass the buffer to the stream
  });
};
