export interface IReadableRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface IWritableRepository<T> {
  createOne(data: Partial<T>, requestId: string): Promise<T>;
}

export interface IBasicRepository<T> extends IReadableRepository<T>, IWritableRepository<T> {}