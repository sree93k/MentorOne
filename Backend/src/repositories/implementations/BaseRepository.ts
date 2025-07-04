import { Document, Model } from "mongoose";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export default class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {
    if (!model) {
      throw new AppError(
        "Mongoose model is undefined",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "MODEL_UNDEFINED"
      );
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error) {
      logger.error("Error creating document", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to create document",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "CREATE_ERROR"
      );
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      logger.error("Error finding document by ID", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find document by ID",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_BY_ID_ERROR"
      );
    }
  }

  async findOne(query: any): Promise<T | null> {
    try {
      return await this.model.findOne(query).exec();
    } catch (error) {
      logger.error("Error finding document", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find document",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ONE_ERROR"
      );
    }
  }

  async findAll(query: any): Promise<T[]> {
    try {
      return await this.model.find(query).exec();
    } catch (error) {
      logger.error("Error finding all documents", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find documents",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_ERROR"
      );
    }
  }

  async findMany(query: any, page: number, limit: number): Promise<any[]> {
    try {
      return await this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error finding paginated documents", {
        query,
        page,
        limit,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find paginated documents",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_MANY_ERROR"
      );
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      logger.error("Error updating document", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update document",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "UPDATE_ERROR"
      );
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      logger.error("Error deleting document", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to delete document",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "DELETE_ERROR"
      );
    }
  }

  async countDocuments(query: any): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting documents", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count documents",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_ERROR"
      );
    }
  }

  async findOneAndUpdate(query: any, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model
        .findOneAndUpdate(query, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      logger.error("Error updating document", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update document",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "UPDATE_ONE_ERROR"
      );
    }
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      logger.error("Error executing aggregation", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to execute aggregation",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "AGGREGATE_ERROR"
      );
    }
  }
}
