/**
 * 🔹 INDUSTRY STANDARD: Repository Type Definitions
 * Type-safe repository operations and data structures
 */

import { Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

/**
 * 🔹 PAGINATION TYPES
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * 🔹 QUERY TYPES
 */
export interface QueryFilters {
  [key: string]: unknown;
}

export interface SortOptions {
  [key: string]: 1 | -1 | 'asc' | 'desc';
}

export interface PopulateOptions {
  path: string;
  select?: string;
  populate?: PopulateOptions | PopulateOptions[];
  match?: FilterQuery<any>;
  options?: QueryOptions;
}

export interface FindOptions {
  select?: string | string[];
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  sort?: string | SortOptions;
  lean?: boolean;
  limit?: number;
  skip?: number;
}

/**
 * 🔹 OPERATION RESULT TYPES
 */
export interface CreateResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpdateResult<T> {
  success: boolean;
  data?: T;
  modified: boolean;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  deleted: boolean;
  error?: string;
}

export interface BulkUpdateResult {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId?: unknown;
}

export interface BulkDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}

/**
 * 🔹 SEARCH TYPES
 */
export interface SearchParams {
  query: string;
  fields?: string[];
  options?: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
    fuzzy?: boolean;
  };
}

export interface SearchResult<T> extends PaginatedResponse<T> {
  searchTerm: string;
  searchFields: string[];
}

/**
 * 🔹 AGGREGATION TYPES
 */
export interface AggregationPipeline {
  [key: string]: unknown;
}

export interface AggregationResult<T = unknown> {
  data: T[];
  totalCount?: number;
}

/**
 * 🔹 TRANSACTION TYPES
 */
export interface TransactionOptions {
  session?: any;
  retries?: number;
  timeout?: number;
}

export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  retryCount?: number;
}

/**
 * 🔹 VALIDATION TYPES
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * 🔹 ENTITY METADATA
 */
export interface EntityMetadata {
  createdAt: Date;
  updatedAt: Date;
  version?: number;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * 🔹 AUDIT TYPES
 */
export interface AuditTrail {
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  entityType: string;
  changes?: Record<string, { old?: unknown; new?: unknown }>;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 🔹 CACHE TYPES
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  tags?: string[];
  invalidateOnUpdate?: boolean;
}

export interface CacheResult<T> {
  data: T;
  fromCache: boolean;
  cacheKey: string;
  timestamp: Date;
}

/**
 * 🔹 FILTER BUILDER TYPES
 */
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex' | 'exists';
  value: unknown;
  options?: {
    caseSensitive?: boolean;
    flags?: string;
  };
}

export interface FilterGroup {
  conditions: (FilterCondition | FilterGroup)[];
  operator: 'and' | 'or';
}

/**
 * 🔹 REPOSITORY OPERATION CONTEXT
 */
export interface RepositoryContext {
  userId?: string;
  userRole?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 🔹 PERFORMANCE MONITORING
 */
export interface PerformanceMetrics {
  operation: string;
  entityName: string;
  duration: number;
  queryCount: number;
  cacheHit?: boolean;
  resultCount?: number;
  timestamp: Date;
}

/**
 * 🔹 DATA TRANSFORMATION TYPES
 */
export interface TransformOptions {
  exclude?: string[];
  include?: string[];
  transform?: Record<string, (value: unknown) => unknown>;
  flatten?: boolean;
}

export interface SerializationOptions extends TransformOptions {
  format?: 'json' | 'xml' | 'csv';
  prettify?: boolean;
}

/**
 * 🔹 BACKUP & RESTORE TYPES
 */
export interface BackupOptions {
  includeIndexes?: boolean;
  compression?: boolean;
  encryption?: boolean;
  batchSize?: number;
}

export interface RestoreOptions {
  dropExisting?: boolean;
  validateData?: boolean;
  batchSize?: number;
  continueOnError?: boolean;
}

/**
 * 🔹 HEALTH CHECK TYPES
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: {
    connected: boolean;
    responseTime: number;
    lastChecked: Date;
  };
  cache?: {
    connected: boolean;
    responseTime: number;
    lastChecked: Date;
  };
  details?: Record<string, unknown>;
}

/**
 * 🔹 UTILITY TYPES
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

export type OptionalId<T extends { _id?: unknown }> = Omit<T, '_id'> & { _id?: T['_id'] };

/**
 * 🔹 REPOSITORY BASE INTERFACE
 */
export interface IRepositoryBase<TEntity extends Document> {
  // Basic CRUD
  create(data: DeepPartial<TEntity>, context?: RepositoryContext): Promise<CreateResult<TEntity>>;
  findById(id: string, options?: FindOptions, context?: RepositoryContext): Promise<TEntity | null>;
  findOne(filter: FilterQuery<TEntity>, options?: FindOptions, context?: RepositoryContext): Promise<TEntity | null>;
  find(filter: FilterQuery<TEntity>, options?: FindOptions, context?: RepositoryContext): Promise<TEntity[]>;
  findPaginated(filter: FilterQuery<TEntity>, pagination: PaginationParams, options?: FindOptions, context?: RepositoryContext): Promise<PaginatedResponse<TEntity>>;
  update(id: string, update: UpdateQuery<TEntity>, options?: QueryOptions, context?: RepositoryContext): Promise<UpdateResult<TEntity>>;
  updateMany(filter: FilterQuery<TEntity>, update: UpdateQuery<TEntity>, options?: QueryOptions, context?: RepositoryContext): Promise<BulkUpdateResult>;
  delete(id: string, context?: RepositoryContext): Promise<DeleteResult>;
  deleteMany(filter: FilterQuery<TEntity>, context?: RepositoryContext): Promise<BulkDeleteResult>;
  
  // Advanced queries
  exists(filter: FilterQuery<TEntity>, context?: RepositoryContext): Promise<boolean>;
  count(filter: FilterQuery<TEntity>, context?: RepositoryContext): Promise<number>;
  aggregate<TResult = unknown>(pipeline: AggregationPipeline[], context?: RepositoryContext): Promise<AggregationResult<TResult>>;
  distinct<TResult = unknown>(field: string, filter?: FilterQuery<TEntity>, context?: RepositoryContext): Promise<TResult[]>;
  
  // Search
  search(params: SearchParams, pagination: PaginationParams, context?: RepositoryContext): Promise<SearchResult<TEntity>>;
  
  // Validation
  validate(data: DeepPartial<TEntity>, context?: RepositoryContext): Promise<ValidationResult>;
  
  // Health & Monitoring
  healthCheck(context?: RepositoryContext): Promise<HealthStatus>;
}