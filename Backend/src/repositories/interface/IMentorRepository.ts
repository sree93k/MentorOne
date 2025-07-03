// src/repositories/interface/IMentorRepository.ts
import { EMentor } from "../../entities/mentorEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMentorRepository extends IBaseRepository<EMentor> {
  getMentor(id: string): Promise<EMentor | null>;
  updateField(
    id: string,
    field: string,
    value: string,
    reason?: string
  ): Promise<EMentor | null>;
  countDocuments(query: any): Promise<number>;
}
