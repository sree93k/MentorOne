import { EMentor } from "../../entities/mentorEntity";
import { IMentorRepository } from "../interface/IMentorRepository";
import Mentor from "../../models/mentorModel";
import OnlineService from "../../models/onlineServiceModel";
import DigitalProduct from "../../models/digitalProductsModel";
// import VideoTutorial from "../../models/videoTutorialModel";
import Service from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";
import BaseRepository from "./BaseRepository";

export default class MentorRepository
  extends BaseRepository<EMentor>
  implements IMentorRepository
{
  constructor() {
    super(Mentor);
  }
  async createMentor(mentorData: EMentor): Promise<EMentor | null> {
    console.log("mentor repo statt 1", mentorData);

    const newMentor = new Mentor(mentorData);
    await newMentor.save();
    console.log("mentor repo statt 2", newMentor);

    return newMentor;
  }

  async getMentor(id: string): Promise<EMentor | null> {
    console.log("mentor getMneter step1 ", id);
    const response = await Mentor.findById(id);
    console.log("mentor getMneter step 2 ");
    return response;
  }

  async updateField(
    id: string,
    field: string,
    status: string,
    reason: string = ""
  ): Promise<EMentor | null> {
    console.log("mentor repo updateMentorStatus step1", id, status, reason);

    const updateFields: { [key: string]: string } = { [field]: status };
    if (reason) {
      updateFields.approvalReason = reason;
    }

    const response = await Mentor.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
      },
      { new: true }
    );
    console.log("mentor repo updateMentorStatus repsonse", response);
    return response;
  }
  //create servcie
  async createService(service: Partial<EService>): Promise<EService | null> {
    try {
      console.log("createService repo step 1", service);
      const newService = new Service(service);
      console.log("createService repo step 2");
      await newService.save();
      console.log("createService repo step 3");
      return newService;
    } catch (error) {
      console.log("createService repo step 4");
      console.error("Error creating service:", error);
      throw new Error("Failed to create service");
    }
  }

  async createOnlineService(
    onlineService: Record<string, any>
  ): Promise<string> {
    try {
      console.log("createOnlineService repo step 1");
      const newOnlineService = new OnlineService(onlineService);
      console.log("createOnlineService repo step 2");
      await newOnlineService.save();
      console.log("createOnlineService repo step 3");
      return newOnlineService._id.toString();
    } catch (error) {
      console.log("createOnlineService repo step 4");
      console.error("Error creating online service:", error);
      throw new Error("Failed to create online service");
    }
  }

  async createDigitalProduct(
    digitalProduct: Record<string, any>
  ): Promise<string> {
    try {
      console.log("createDigitalProduct repo step 1");
      const newDigitalProduct = new DigitalProduct(digitalProduct);
      console.log("createDigitalProduct repo step 2");
      await newDigitalProduct.save();
      console.log("createDigitalProduct repo step 3");
      return newDigitalProduct._id.toString();
    } catch (error) {
      console.log("createDigitalProduct repo step 4");
      console.error("Error creating digital product:", error);
      throw new Error("Failed to create digital product");
    }
  }

  // async createVideoTutorial(
  //   videoTutorial: Record<string, any>
  // ): Promise<string> {
  //   try {
  //     console.log("createVideoTutorial repo step 1");
  //     const newVideoTutorial = new VideoTutorial(videoTutorial);
  //     console.log("createVideoTutorial repo step 2");
  //     await newVideoTutorial.save();
  //     console.log("createVideoTutorial repo step 3");
  //     return newVideoTutorial._id.toString();
  //   } catch (error) {
  //     console.log("createVideoTutorial repo step 4");
  //     console.error("Error creating video tutorial:", error);
  //     throw new Error("Failed to create video tutorial");
  //   }
  // }

  async findById(id: string): Promise<EMentor | null> {
    try {
      return await Mentor.findById(id);
    } catch (error: any) {
      throw new Error("Failed to find mentor", error.message);
    }
  }

  async update(id: string, data: any): Promise<EMentor> {
    try {
      console.log("UPdate mentor rpsository step 1", id, data);

      const mentor = await Mentor.findByIdAndUpdate(id, data, { new: true });
      console.log("UPdate mentor rpsository step 2", mentor);
      if (!mentor) {
        throw new Error("Mentor not found");
      }
      return mentor;
    } catch (error: any) {
      throw new Error("Failed to update mentor", error.message);
    }
  }
}
