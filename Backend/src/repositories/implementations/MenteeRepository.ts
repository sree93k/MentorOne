import { EMentee } from "../../entities/menteeEntiry";
import Mentee from "../../models/menteeModel";
import { IMenteeRepository } from "../interface/IMenteeRepository";
import BaseRepository from "./BaseRepository";

export default class MenteeRepository
  extends BaseRepository<EMentee>
  implements IMenteeRepository
{
  constructor() {
    super(Mentee);
  }
  async createMentee(data: {
    joinPurpose: string[];
    careerGoals: string;
    interestedNewcareer: string[];
  }): Promise<EMentee> {
    console.log("Repo create mentee data step 1", data);
    const newMentee = new Mentee({
      joinPurpose: data.joinPurpose,
      careerGoals: data.careerGoals,
      interestedNewcareer: data.interestedNewcareer,
    });
    console.log("Repo create mentee data step 2", newMentee);
    const result = await newMentee.save();
    console.log("Repo create mentee data step 2", result);
    return result;
  }

  async getMentee(id: string): Promise<EMentee | null> {
    console.log("menteeRepo getNebteee steo 1", id);
    const response = await Mentee.findById(id);
    console.log("menteeRepo getNebteee steo 2", response);
    return response;
  }
}
