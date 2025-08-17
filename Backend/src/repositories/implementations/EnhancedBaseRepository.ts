/**
 * 🔹 INDUSTRY STANDARD: Enhanced Base Repository
 * Type-safe, comprehensive base repository implementation
 */

import { Model, Document, FilterQuery, UpdateQuery, QueryOptions, Types } from "mongoose";
import { 
  RepositoryError, 
  RepositoryErrorFactory, 
  RepositoryLogger,
  RepositoryErrorCode 
} from "../errors/RepositoryError";
import {
  PaginationParams,
  PaginatedResponse,
  FindOptions,
  CreateResult,
  UpdateResult,
  DeleteResult,
  BulkUpdateResult,
  BulkDeleteResult,
  SearchParams,
  SearchResult,
  AggregationResult,
  ValidationResult,
  HealthStatus,
  RepositoryContext,
  PerformanceMetrics,
  DeepPartial,
  IRepositoryBase
} from "../types/RepositoryTypes";

/**
 * 🔹 ENHANCED BASE REPOSITORY
 * Comprehensive, type-safe base repository with industry-standard features
 */
export abstract class EnhancedBaseRepository<TEntity extends Document> 
  implements IRepositoryBase<TEntity> {
  
  protected readonly model: Model<TEntity>;
  protected readonly entityName: string;
  protected readonly performanceMetrics: PerformanceMetrics[] = [];

  constructor(model: Model<TEntity>) {
    this.model = model;
    this.entityName = model.modelName;
  }

  /**
   * 🔹 UTILITY METHODS
   */
  
  /**
   * Validate MongoDB ObjectId
   */
  protected validateObjectId(id: string, operation: string = 'validation'): void {
    if (!Types.ObjectId.isValid(id)) {
      throw RepositoryErrorFactory.validationError(
        `Invalid ObjectId format: ${id}`,
        operation,
        this.entityName,
        undefined,
        { providedId: id }
      );
    }
  }

  /**
   * Validate pagination parameters
   */
  protected validatePaginationParams(pagination: PaginationParams): void {
    const { page, limit } = pagination;
    
    if (!Number.isInteger(page) || page < 1) {
      throw RepositoryErrorFactory.validationError(
        'Page must be a positive integer',
        'pagination',
        this.entityName,
        undefined,
        { page, limit }
      );
    }
    
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      throw RepositoryErrorFactory.validationError(
        'Limit must be a positive integer between 1 and 1000',
        'pagination',
        this.entityName,
        undefined,
        { page, limit }
      );
    }
  }

  /**
   * Apply query options to mongoose query
   */
  protected applyQueryOptions(query: any, options?: FindOptions): any {
    if (!options) return query;

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((pop) => {
          query = query.populate(pop);
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

  /**
   * Handle and transform errors consistently
   */
  protected handleError(
    error: any, 
    operation: string, 
    entityId?: string,
    context?: RepositoryContext
  ): never {
    let repositoryError: RepositoryError;

    if (error instanceof RepositoryError) {
      repositoryError = error;
    } else {
      repositoryError = RepositoryErrorFactory.fromMongoError(
        error,
        operation,
        this.entityName,
        entityId
      );
    }

    // Log error with context
    RepositoryLogger.logError(repositoryError);

    throw repositoryError;
  }

  /**
   * Track performance metrics
   */
  protected trackPerformance(
    operation: string,
    startTime: number,
    resultCount?: number,
    context?: RepositoryContext
  ): void {
    const metrics: PerformanceMetrics = {
      operation,
      entityName: this.entityName,
      duration: Date.now() - startTime,
      queryCount: 1,
      resultCount,
      timestamp: new Date()
    };

    this.performanceMetrics.push(metrics);

    // Keep only last 100 metrics to prevent memory leaks
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics.shift();
    }

    // Log slow queries (> 1000ms)
    if (metrics.duration > 1000) {
      console.warn(`🐌 Slow query detected: ${this.entityName}.${operation} took ${metrics.duration}ms`);
    }
  }

  /**
   * 🔹 CRUD OPERATIONS
   */

  /**
   * Create a new entity
   */
  async create(
    data: DeepPartial<TEntity>, 
    context?: RepositoryContext
  ): Promise<CreateResult<TEntity>> {
    const startTime = Date.now();
    const operation = 'create';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, context?.metadata);

      // Validate input data
      if (!data || typeof data !== 'object') {
        throw RepositoryErrorFactory.validationError(
          'Invalid data provided for creation',
          operation,
          this.entityName,
          undefined,
          { data }
        );
      }

      // Create and save entity
      const entity = new this.model(data);
      const savedEntity = await entity.save();

      this.trackPerformance(operation, startTime, 1, context);
      RepositoryLogger.logSuccess(operation, this.entityName, savedEntity._id?.toString(), context?.metadata);

      return {
        success: true,
        data: savedEntity
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find entity by ID
   */
  async findById(
    id: string, 
    options?: FindOptions, 
    context?: RepositoryContext
  ): Promise<TEntity | null> {
    const startTime = Date.now();
    const operation = 'findById';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id, context?.metadata);

      let query = this.model.findById(id);
      query = this.applyQueryOptions(query, options);

      const result = await query.exec();

      this.trackPerformance(operation, startTime, result ? 1 : 0, context);
      RepositoryLogger.logSuccess(operation, this.entityName, id, { found: !!result, ...context?.metadata });

      return result;

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Find one entity by filter
   */
  async findOne(
    filter: FilterQuery<TEntity>, 
    options?: FindOptions, 
    context?: RepositoryContext
  ): Promise<TEntity | null> {
    const startTime = Date.now();
    const operation = 'findOne';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filter, ...context?.metadata });

      let query = this.model.findOne(filter);
      query = this.applyQueryOptions(query, options);

      const result = await query.exec();

      this.trackPerformance(operation, startTime, result ? 1 : 0, context);
      RepositoryLogger.logSuccess(operation, this.entityName, result?._id?.toString(), { found: !!result });

      return result;

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find multiple entities
   */
  async find(
    filter: FilterQuery<TEntity>, 
    options?: FindOptions, 
    context?: RepositoryContext
  ): Promise<TEntity[]> {
    const startTime = Date.now();
    const operation = 'find';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filter, ...context?.metadata });

      let query = this.model.find(filter);
      query = this.applyQueryOptions(query, options);

      const results = await query.exec();

      this.trackPerformance(operation, startTime, results.length, context);
      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { count: results.length });

      return results;

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Find with pagination
   */
  async findPaginated(
    filter: FilterQuery<TEntity>,
    pagination: PaginationParams,
    options?: FindOptions,
    context?: RepositoryContext
  ): Promise<PaginatedResponse<TEntity>> {
    const startTime = Date.now();
    const operation = 'findPaginated';

    try {
      this.validatePaginationParams(pagination);
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filter, pagination, ...context?.metadata });

      const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : undefined;

      // Execute count and find queries in parallel
      const [total, data] = await Promise.all([
        this.model.countDocuments(filter),
        this.find(filter, { ...options, skip, limit, sort }, context)
      ]);

      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<TEntity> = {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit
        }
      };

      this.trackPerformance(operation, startTime, data.length, context);
      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        count: data.length, 
        total, 
        page, 
        totalPages 
      });

      return response;

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Update entity by ID
   */
  async update(
    id: string,
    update: UpdateQuery<TEntity>,
    options: QueryOptions = { new: true, runValidators: true },
    context?: RepositoryContext
  ): Promise<UpdateResult<TEntity>> {
    const startTime = Date.now();
    const operation = 'update';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id, { update, ...context?.metadata });

      // Add updatedAt timestamp
      const updateWithTimestamp = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      };

      const result = await this.model.findByIdAndUpdate(
        id,
        updateWithTimestamp,
        options
      ).exec();

      const success = !!result;
      this.trackPerformance(operation, startTime, success ? 1 : 0, context);

      if (!result) {
        RepositoryLogger.logSuccess(operation, this.entityName, id, { modified: false });
        return {
          success: false,
          modified: false,
          error: `${this.entityName} not found`
        };
      }

      RepositoryLogger.logSuccess(operation, this.entityName, id, { modified: true });

      return {
        success: true,
        data: result,
        modified: true
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Update multiple entities
   */
  async updateMany(
    filter: FilterQuery<TEntity>,
    update: UpdateQuery<TEntity>,
    options?: QueryOptions,
    context?: RepositoryContext
  ): Promise<BulkUpdateResult> {
    const startTime = Date.now();
    const operation = 'updateMany';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filter, update, ...context?.metadata });

      // Add updatedAt timestamp
      const updateWithTimestamp = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      };

      const result = await this.model.updateMany(filter, updateWithTimestamp, options);

      this.trackPerformance(operation, startTime, result.modifiedCount, context);
      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { 
        matched: result.matchedCount,
        modified: result.modifiedCount 
      });

      return {
        acknowledged: result.acknowledged,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount || 0,
        upsertedId: result.upsertedId
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(
    id: string, 
    context?: RepositoryContext
  ): Promise<DeleteResult> {
    const startTime = Date.now();
    const operation = 'delete';

    try {
      this.validateObjectId(id, operation);
      RepositoryLogger.logStart(operation, this.entityName, id, context?.metadata);

      const result = await this.model.findByIdAndDelete(id).exec();
      const deleted = !!result;

      this.trackPerformance(operation, startTime, deleted ? 1 : 0, context);
      RepositoryLogger.logSuccess(operation, this.entityName, id, { deleted });

      return {
        success: true,
        deleted
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, id, context);
    }
  }

  /**
   * Delete multiple entities
   */
  async deleteMany(
    filter: FilterQuery<TEntity>, 
    context?: RepositoryContext
  ): Promise<BulkDeleteResult> {
    const startTime = Date.now();
    const operation = 'deleteMany';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { filter, ...context?.metadata });

      const result = await this.model.deleteMany(filter);

      this.trackPerformance(operation, startTime, result.deletedCount || 0, context);
      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { deleted: result.deletedCount });

      return {
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount || 0
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * 🔹 UTILITY OPERATIONS
   */

  /**
   * Check if entity exists
   */
  async exists(
    filter: FilterQuery<TEntity>, 
    context?: RepositoryContext
  ): Promise<boolean> {
    const startTime = Date.now();
    const operation = 'exists';

    try {
      const result = await this.model.exists(filter);
      this.trackPerformance(operation, startTime, result ? 1 : 0, context);
      return result !== null;
    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Count entities
   */
  async count(
    filter: FilterQuery<TEntity> = {}, 
    context?: RepositoryContext
  ): Promise<number> {
    const startTime = Date.now();
    const operation = 'count';

    try {
      const result = await this.model.countDocuments(filter);
      this.trackPerformance(operation, startTime, result, context);
      return result;
    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Aggregate data
   */
  async aggregate<TResult = unknown>(
    pipeline: any[], 
    context?: RepositoryContext
  ): Promise<AggregationResult<TResult>> {
    const startTime = Date.now();
    const operation = 'aggregate';

    try {
      RepositoryLogger.logStart(operation, this.entityName, undefined, { pipelineStages: pipeline.length, ...context?.metadata });

      const data = await this.model.aggregate<TResult>(pipeline);

      this.trackPerformance(operation, startTime, data.length, context);
      RepositoryLogger.logSuccess(operation, this.entityName, undefined, { resultCount: data.length });

      return { data };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Get distinct values
   */
  async distinct<TResult = unknown>(
    field: string, 
    filter?: FilterQuery<TEntity>, 
    context?: RepositoryContext
  ): Promise<TResult[]> {
    const startTime = Date.now();
    const operation = 'distinct';

    try {
      const result = await this.model.distinct(field, filter);
      this.trackPerformance(operation, startTime, result.length, context);
      return result;
    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Search entities (basic implementation)
   */
  async search(
    params: SearchParams,
    pagination: PaginationParams,
    context?: RepositoryContext
  ): Promise<SearchResult<TEntity>> {
    const startTime = Date.now();
    const operation = 'search';

    try {
      this.validatePaginationParams(pagination);

      const { query, fields = ['name', 'title', 'description'], options = {} } = params;
      const searchFields = fields;

      // Build search filter
      const searchFilter: FilterQuery<TEntity> = {
        $or: searchFields.map(field => ({
          [field]: {
            $regex: query,
            $options: options.caseSensitive ? '' : 'i'
          }
        }))
      };

      const response = await this.findPaginated(searchFilter, pagination, undefined, context);

      this.trackPerformance(operation, startTime, response.data.length, context);

      return {
        ...response,
        searchTerm: query,
        searchFields
      };

    } catch (error: any) {
      this.trackPerformance(operation, startTime, 0, context);
      this.handleError(error, operation, undefined, context);
    }
  }

  /**
   * Validate entity data (basic implementation)
   */
  async validate(
    data: DeepPartial<TEntity>, 
    context?: RepositoryContext
  ): Promise<ValidationResult> {
    try {
      const entity = new this.model(data);
      await entity.validate();
      return { valid: true, errors: [] };
    } catch (error: any) {
      const errors = Object.keys(error.errors || {}).map(field => ({
        field,
        message: error.errors[field].message,
        value: error.errors[field].value
      }));

      return { valid: false, errors };
    }
  }

  /**
   * Health check
   */
  async healthCheck(context?: RepositoryContext): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Test basic database connectivity
      await this.model.db.admin().ping();
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        database: {
          connected: true,
          responseTime,
          lastChecked: new Date()
        }
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      return {
        status: 'unhealthy',
        database: {
          connected: false,
          responseTime,
          lastChecked: new Date()
        },
        details: {
          error: error.message
        }
      };
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  /**
   * Clear performance metrics
   */
  clearPerformanceMetrics(): void {
    this.performanceMetrics.length = 0;
  }
}