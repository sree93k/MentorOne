import { Model } from "mongoose";
import { inBaseRepository } from "../interface/inBaseRepository";

export default class BaseRepository<T> implements inBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  get models(): Model<T> {
    return this.model;
  }

  getModel(): Model<T> {
    return this.model;
  }
  async create(item: T): Promise<T> {
    const createdItem = new this.model(item);
    return createdItem;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }
  async findByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email }).exec();
  }
  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async updateField(
    id: string,
    field: keyof T,
    value: string
  ): Promise<T | null> {
    console.log("base rrpoo ", id, field, value);

    return await this.model
      .findByIdAndUpdate(id, { $set: { [field]: value } } as any, { new: true })
      .exec();
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
