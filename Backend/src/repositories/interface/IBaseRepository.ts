export interface IBaseRepository<T> {
  create(item: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  updateField(id: string, field: keyof T, value: string): Promise<T | null>;
  findByField<K extends keyof T>(field: K, value: string): Promise<T[] | null>;
}
