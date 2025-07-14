import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

export interface PaginationQueryInterface {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: Record<string, string | number | object>;
}

export interface PaginatedResponseInterface<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export async function getPaginatedIds<T extends ObjectLiteral>(
  repository: Repository<T>,
  alias: string,
  paginationQuery: PaginationQueryInterface,
  joinList: string[] = []
): Promise<number[]> {
  const { sortOrder, page, limit, filters = {} } = paginationQuery;

  const [whereString, whereParams] = Object.entries(filters)[0];

  let qb = repository.createQueryBuilder(alias).select([`${alias}.id`]);

  // 動態加 join
  for (const relation of joinList) {
    if (relation.includes('.')) {
      qb = qb.leftJoinAndSelect(relation, relation.split('.').pop()!);
    } else {
      qb = qb.leftJoin(`${alias}.${relation}`, relation);
    }
  }

  const result = await qb
    .where(whereString, whereParams as any)
    .orderBy(`${alias}.id`, sortOrder)
    .skip((page! - 1) * limit!)
    .take(limit!)
    .getMany();

  return result.map((item: any) => item.id);
}

export async function paginateAndSortByIds<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  alias: string,
  ids: number[],
  paginationQuery: PaginationQueryInterface
): Promise<PaginatedResponseInterface<T>> {
  const page = paginationQuery.page || 1;
  const limit = paginationQuery.limit || 10;
  const sortOrder = paginationQuery.sortOrder || 'ASC';
  const filters = paginationQuery.filters || {};
  const sortBy = paginationQuery.sortBy || 'id';

  const [key, value] = Object.entries(filters)[0];

  if (ids.length === 0) {
    return {
      data: [],
      page,
      limit,
      total: 0,
    };
  }
  const [result, total] = await Promise.all([
    query
      .clone()
      .orderBy(sortBy, sortOrder)
      .where(`${alias}.id IN (:...ids)`, { ids })
      .getMany(),
    query
      .clone()
      .where(key, value as any)
      .getCount(),
  ]);

  return {
    data: result,
    page,
    limit,
    total: total,
  };
}
