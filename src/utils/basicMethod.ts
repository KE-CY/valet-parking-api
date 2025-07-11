import { QueryCondition } from '../types/queryCondition';

export abstract class BasicMethod {
  static entity: string;

  static buildCondition(query: any): QueryCondition {
    const { startDate, endDate } = query;
    const condition: Record<string, any> = {};

    // 初始條件
    let querySQL = `1=1`;

    if (startDate && endDate) {
      querySQL += ` AND ${this.entity}.createdAt BETWEEN :startDate AND :endDate`;
      condition['startDate'] = new Date(startDate);
      condition['endDate'] = new Date(endDate);
    } else if (startDate) {
      querySQL += ` AND ${this.entity}.createdAt >= :startDate`;
      condition['startDate'] = new Date(startDate);
    } else if (endDate) {
      querySQL += ` AND ${this.entity}.createdAt <= :endDate`;
      condition['endDate'] = new Date(endDate);
    }

    return { querySQL, condition };
  }

  // Typescript can't use abstract static method so we use override instead
  static buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    throw new Error('Method not implemented.');
  }
}
