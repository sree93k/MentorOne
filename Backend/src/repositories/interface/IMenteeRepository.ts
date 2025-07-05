import { EMentee } from "../../entities/menteeEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMenteeRepository extends IBaseRepository<EMentee> {
  createMentee(data: Partial<EMentee>): Promise<EMentee>;
  getMentee(id: string): Promise<EMentee | null>;
}
