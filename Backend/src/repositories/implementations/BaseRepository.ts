import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  IBaseRepository,
  IQueryOptions,
  IUpdateOptions,
  IPaginatedResult,
  IUpdateResult,
  IDeleteResult,
} from "../interface/IBaseRepository";

export default class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected readonly model: Model<T>;
  protected readonly modelName: string;

  constructor(model: Model<T>) {
    this.model = model;
    this.modelName = model.modelName;
  }

  protected getModel(): Model<T> {
    return this.model;
  }

  async create(entity: Partial<T>, options?: QueryOptions): Promise<T> {
    try {
      const createdEntity = new this.model(entity);
      return await createdEntity.save(options);
    } catch (error) {
      throw this.handleError(error, "create");
    }
  }

  async createMany(
    entities: Partial<T>[],
    options?: QueryOptions
  ): Promise<T[]> {
    try {
      return await this.model.create(entities, options);
    } catch (error) {
      throw this.handleError(error, "createMany");
    }
  }

  async findById(id: string, options?: IQueryOptions): Promise<T | null> {
    try {
      this.validateObjectId(id);

      let query = this.model.findById(id);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "findById");
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: IQueryOptions
  ): Promise<T | null> {
    try {
      let query = this.model.findOne(filter);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "findOne");
    }
  }

  async find(filter: FilterQuery<T>, options?: IQueryOptions): Promise<T[]> {
    try {
      let query = this.model.find(filter);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "find");
    }
  }

  async findAll(options?: IQueryOptions): Promise<T[]> {
    try {
      return await this.find({}, options);
    } catch (error) {
      throw this.handleError(error, "findAll");
    }
  }

  async findPaginated(
    filter: FilterQuery<T>,
    page: number = 1,
    limit: number = 10,
    options?: IQueryOptions
  ): Promise<IPaginatedResult<T>> {
    try {
      this.validatePaginationParams(page, limit);

      const skip = (page - 1) * limit;

      // Execute count and find queries in parallel
      const [total, data] = await Promise.all([
        this.count(filter),
        this.find(filter, { ...options, skip, limit }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      throw this.handleError(error, "findPaginated");
    }
  }

  async update(
    id: string,
    update: UpdateQuery<T>,
    options: IUpdateOptions = { new: true }
  ): Promise<T | null> {
    try {
      this.validateObjectId(id);

      let query = this.model.findByIdAndUpdate(id, update, options);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "updateById");
    }
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: IUpdateOptions = { new: true }
  ): Promise<T | null> {
    try {
      this.validateObjectId(id);

      let query = this.model.findByIdAndUpdate(id, update, options);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "updateById");
    }
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: IUpdateOptions = { new: true }
  ): Promise<T | null> {
    try {
      let query = this.model.findOneAndUpdate(filter, update, options);
      query = this.applyQueryOptions(query, options);

      return await query.exec();
    } catch (error) {
      throw this.handleError(error, "updateOne");
    }
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<IUpdateResult> {
    try {
      const result = await this.model.updateMany(filter, update, options);
      return {
        acknowledged: result.acknowledged,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount || 0,
        upsertedId: result.upsertedId,
      };
    } catch (error) {
      throw this.handleError(error, "updateMany");
    }
  }

  async deleteById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      this.validateObjectId(id);
      return await this.model.findByIdAndDelete(id, options).exec();
    } catch (error) {
      throw this.handleError(error, "deleteById");
    }
  }

  async deleteOne(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete(filter, options).exec();
    } catch (error) {
      throw this.handleError(error, "deleteOne");
    }
  }

  async deleteMany(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<IDeleteResult> {
    try {
      const result = await this.model.deleteMany(filter, options);
      return {
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw this.handleError(error, "deleteMany");
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw this.handleError(error, "count");
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter);
      return result !== null;
    } catch (error) {
      throw this.handleError(error, "exists");
    }
  }

  async aggregate<R = any>(
    pipeline: any[],
    options?: QueryOptions
  ): Promise<R[]> {
    try {
      return await this.model.aggregate(pipeline, options);
    } catch (error) {
      throw this.handleError(error, "aggregate");
    }
  }

  async distinct<R = any>(
    field: string,
    filter?: FilterQuery<T>
  ): Promise<R[]> {
    try {
      return await this.model.distinct(field, filter);
    } catch (error) {
      throw this.handleError(error, "distinct");
    }
  }

  protected applyQueryOptions(query: any, options?: IQueryOptions): any {
    if (!options) return query;

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((pop) => {
          if (typeof pop === "string") {
            query = query.populate(pop);
          } else {
            query = query.populate(pop);
          }
        });
      } else {
        query = query.populate(options.populate);
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.lean) {
      query = query.lean();
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    return query;
  }

  protected validateObjectId(id: string): void {
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
  }

  protected validatePaginationParams(page: number, limit: number): void {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("Page must be a positive integer");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be a positive integer between 1 and 100");
    }
  }

  protected handleError(error: any, operation: string): Error {
    const message = `${this.modelName}Repository.${operation} failed: ${error.message}`;

    // Log error for debugging (in production, use proper logging service)
    console.error(`[${this.modelName}Repository] ${operation} error:`, {
      message: error.message,
      stack: error.stack,
      operation,
    });

    // Return formatted error
    if (error.name === "ValidationError") {
      return new Error(`Validation failed: ${error.message}`);
    }

    if (error.name === "CastError") {
      return new Error(`Invalid data format: ${error.message}`);
    }

    if (error.code === 11000) {
      return new Error("Duplicate key error: Record already exists");
    }

    return new Error(message);
  }

  protected withTransaction(session: any): this {
    return this;
  }
}
