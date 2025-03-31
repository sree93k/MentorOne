import UserRepository from "../../repositories/implementations/imUserRepository";
import { inUserRepository } from "../../repositories/interface/inUserRepository";
import { inUploadService } from "../../services/interface/inUploadService";
import {
  UploadResponse,
  uploadToCloudinary,
} from "../../utils/uploadToCloudninary";

export default class UploadService implements inUploadService {
  private userRepository: inUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async uploadSinglePhoto(buffer: Buffer): Promise<UploadResponse> {
    try {
      console.log("uplload service 1");

      const result = await uploadToCloudinary(buffer);
      console.log("uplload service 2");
      return result;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }
}
