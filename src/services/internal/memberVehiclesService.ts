import { QueryRunner } from "typeorm";
import { MemberVehicles } from "../../entities/MemberVehicles";
import { User } from "../../entities/User";
import { MemberVehiclesRepository } from "../../repositories/memberVehiclesRepository";
import { BasicMethod } from "../../utils/basicMethod";
import logger from "../../utils/logger";
import { QueryCondition } from "../../types/queryCondition";

export class MemberVehiclesService extends BasicMethod {
  static entity = 'memberVehicles';

  static buildCondition(query: any): QueryCondition {
    let { condition, querySQL } = super.buildCondition(query);

    const { id, memberId, carPlate } = query;

    if (id) {
      querySQL += ` AND ${this.entity}.id = :id`;
      condition['id'] = id;
    }

    if (memberId) {
      querySQL += ` AND ${this.entity}.memberId = :memberId`;
      condition['memberId'] = memberId;
    }

    if (carPlate) {
      querySQL += ` AND ${this.entity}.carPlate ILIKE :carPlate`;
      condition['carPlate'] = `%${carPlate}%`;
    }

    return { condition, querySQL };
  }

  static override buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    const { querySQL, condition } = MemberVehiclesService.buildCondition(query);

    const transformedFilters: Record<string, string | number | object> = {
      [querySQL]: condition,
    };

    return transformedFilters;
  }

  static async createMemberVehicleWithTransaction({
    queryRunner,
    memberVehicle,
    reqUser
  }: {
    queryRunner: QueryRunner,
    memberVehicle: Partial<MemberVehicles>,
    reqUser: User
  }): Promise<void> {
    logger.info({ msg: 'In MemberVehiclesService.createMemberVehicleWithTransaction', memberVehicle });

    const newMemberVehicle = queryRunner.manager.create(MemberVehicles, {
      ...memberVehicle,
      createdBy: reqUser,
      updatedBy: reqUser,
    });

    await MemberVehiclesRepository.createMemberVehicleWithTransaction({
      queryRunner,
      createData: newMemberVehicle,
    });
  }
}