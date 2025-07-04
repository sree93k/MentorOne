import { injectable } from "inversify";
import { EMentee } from "../../entities/menteeEntiry";
import Mentee from "../../models/menteeModel";
import BaseRepository from "../implementations/BaseRepository";
import { IMenteeRepository } from "../interface/IMenteeRepository";

@injectable()
export default class MenteeRepository
  extends BaseRepository<EMentee>
  implements IMenteeRepository
{
  constructor() {
    super(Mentee);
  }

  async createMentee(data: Partial<EMentee>): Promise<EMentee> {
    try {
      return await this.create(data);
    } catch (error: any) {
      throw new Error("Failed to create mentee: " + error.message);
    }
  }

  async getMentee(id: string): Promise<EMentee | null> {
    return this.findById(id);
  }
}
