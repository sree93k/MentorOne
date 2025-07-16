import { EMentee } from "../../entities/menteeEntiry";

export interface IMenteeRepository {
  createMentee(data: {
    careerGoals: string;
    interestedNewcareer: string[];
    joinPurpose: string[];
  }): Promise<EMentee>;

  getMentee(id: string): Promise<EMentee | null>;
  update(id: string, data: any): Promise<EMentee | null>;
  findById(id: string): Promise<EMentee | null>;
}
