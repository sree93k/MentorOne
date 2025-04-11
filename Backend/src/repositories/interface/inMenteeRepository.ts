import { EMentee } from "../../entities/menteeEntiry";
import { EGoals } from "../../entities/goalsEntity";

export interface inMenteeRepository {
  createMentee(data: {
    careerGoals: string;
    interestedNewcareer: string[];
    joinPurpose: string[];
  }): Promise<EMentee>;

  getMentee(id: string): Promise<EMentee | null>;
}
