import { UploadResponse } from "../../utils/uploadToCloudninary";

export interface inUploadService {
  uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse>;
}
