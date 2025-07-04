export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(query: any): Promise<T | null>;
  findAll(query: any): Promise<T[]>;
  findMany(query: any, page: number, limit: number): Promise<any[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  countDocuments(query: any): Promise<number>;
  findOneAndUpdate(query: any, data: Partial<T>): Promise<T | null>;
  aggregate(pipeline: any[]): Promise<any[]>;
}
