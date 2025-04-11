import { EUsers } from "../../entities/userEntity";
import { EMentor } from "../../entities/mentorEntity";
import { inMentorRepository } from "../interface/inMentorRepository";
import { ApiError } from "../../middlewares/errorHandler";
import Mentor from "../../models/mentorModel";
import { Stats } from "fs";

export default class MentorRepository implements inMentorRepository {
  async createMentor(mentorData: EMentor): Promise<EMentor | null> {
    console.log("mentor repo statt 1", mentorData);
    //const newMentor = await Mentor.create(mentorData);
    const newMentor = new Mentor(mentorData);
    await newMentor.save();
    console.log("mentor repo statt 2", newMentor);

    return newMentor;
  }

  async getMentor(id: string): Promise<EMentor | null> {
    console.log("mentor getMneter step1 ", id);
    const response = await Mentor.findById(id);
    console.log("mentor getMneter step 2 ", response);
    return response;
  }

  async updateField(
    id: string,
    field: string,
    status: string
  ): Promise<EMentor | null> {
    console.log("mentor repo updateMentorStatus step1", id, status);

    const response = await Mentor.findByIdAndUpdate(
      id,
      {
        $set: { [field]: status },
      },
      { new: true }
    );
    console.log("mentor repo updateMentorStatus repsonse", response);
    return response;
  }
}
