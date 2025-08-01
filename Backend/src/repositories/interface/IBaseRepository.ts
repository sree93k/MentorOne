import { Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(entity: Partial<T>, options?: QueryOptions): Promise<T>;

  createMany(entities: Partial<T>[], options?: QueryOptions): Promise<T[]>;

  findById(id: string, options?: IQueryOptions): Promise<T | null>;

  findOne(filter: FilterQuery<T>, options?: IQueryOptions): Promise<T | null>;

  find(filter: FilterQuery<T>, options?: IQueryOptions): Promise<T[]>;

  findAll(options?: IQueryOptions): Promise<T[]>;

  findPaginated(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    options?: IQueryOptions
  ): Promise<IPaginatedResult<T>>;

  update(
    id: string,
    update: UpdateQuery<T>,
    options?: IUpdateOptions
  ): Promise<T | null>;

  updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: IUpdateOptions
  ): Promise<T | null>;
  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: IUpdateOptions
  ): Promise<T | null>;

  updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<IUpdateResult>;

  deleteById(id: string, options?: QueryOptions): Promise<T | null>;

  deleteOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null>;

  deleteMany(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<IDeleteResult>;

  count(filter: FilterQuery<T>): Promise<number>;

  exists(filter: FilterQuery<T>): Promise<boolean>;

  aggregate<R = any>(pipeline: any[], options?: QueryOptions): Promise<R[]>;

  distinct<R = any>(field: string, filter?: FilterQuery<T>): Promise<R[]>;
}

export interface IQueryOptions {
  select?: string | string[];
  populate?: string | string[] | IPopulateOptions | IPopulateOptions[];
  sort?: string | { [key: string]: 1 | -1 };
  lean?: boolean;
  limit?: number;
  skip?: number;
}

export interface IPopulateOptions {
  path: string;
  select?: string;
  populate?: IPopulateOptions | IPopulateOptions[];
  match?: FilterQuery<any>;
  options?: QueryOptions;
}

export interface IUpdateOptions extends IQueryOptions {
  new?: boolean;
  upsert?: boolean;
  runValidators?: boolean;
}

// export interface IPaginatedResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
// }
export interface IPaginatedResult<T> {
  data: T[];
  total: number; // ✅ Keep this
  totalCount?: number; // ✅ Add this for compatibility
  page: number;
  currentPage?: number; // ✅ Add this for compatibility
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IUpdateResult {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId?: any;
}

export interface IDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}
