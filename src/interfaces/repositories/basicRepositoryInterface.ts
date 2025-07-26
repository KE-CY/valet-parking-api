export interface IBasicRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  createOne(data: Partial<T>, requestId: string): Promise<T>;
}
