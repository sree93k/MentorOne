// src/repositories/interface/IUserRepository.ts
import { EUsers } from "../../entities/userEntity";
import { FilterQuery } from "mongoose";

export interface IUserRepository {
  findMany(query: any, page: number, limit: number): Promise<EUsers[]>;
  countDocuments(query: any): Promise<number>;
  countMentors(role?: string, searchQuery?: string): Promise<number>;
  findById(id: string): Promise<EUsers | null>;
  update(id: string, updates: Partial<EUsers>): Promise<EUsers | null>;
}
