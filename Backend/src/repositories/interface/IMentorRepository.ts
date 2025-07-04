import { EMentor } from "../../entities/mentorEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMentorRepository extends IBaseRepository<EMentor> {
  createMentor(data: Partial<EMentor>): Promise<EMentor>;
  getMentor(id: string): Promise<EMentor | null>;
  updateField(
    id: string,
    field: string,
    status: string,
    reason?: string
  ): Promise<EMentor | null>;
}
