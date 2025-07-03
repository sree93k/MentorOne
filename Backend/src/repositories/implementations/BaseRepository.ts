import { injectable } from "inversify";
import { Document, Model } from "mongoose";

@injectable()
export default class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    if (!model) {
      throw new Error("Mongoose model is undefined");
    }
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(query: any): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async findAll(query: any): Promise<T[]> {
    return this.model.find(query).exec();
  }
  async findMany(query: any, page: number, limit: number): Promise<any[]> {
    return this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async countDocuments(query: any): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async findOneAndUpdate(query: any, data: Partial<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      query,
      { $set: data },
      { new: true }
    );
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return await this.model.aggregate(pipeline).exec();
  }
}
