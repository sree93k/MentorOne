import { EUsers } from "../../entities/userEntity";
import { EMentor } from "../../entities/mentorEntity";
export interface inMentorRepository {
  createMentor(mentorData: EMentor): Promise<EMentor | null>;
  getMentor(id: string): Promise<EMentor | null>;
  updateField(
    id: string,
    field: string,
    status: string
  ): Promise<EMentor | null>;
}
