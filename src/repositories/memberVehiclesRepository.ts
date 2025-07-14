import { QueryRunner, Repository } from "typeorm";
import { MemberVehicles } from "../entities/MemberVehicles";
import { AppDataSource } from "../config/typeorm-config";
import logger from "../utils/logger";

export class MemberVehiclesRepository extends Repository<MemberVehicles> {
  constructor() {
    super(MemberVehicles, AppDataSource.manager);
  }

  static async createMemberVehicleWithTransaction({
    queryRunner,
    createData,
  }: {
    queryRunner: QueryRunner;
    createData: Partial<MemberVehicles>;
  }): Promise<MemberVehicles> {
    logger.info('In MemberVehiclesRepository.createMemberVehiclesWithTransaction', { createData });

    const memberVehiclesRepository = queryRunner.manager.getRepository(MemberVehicles);

    const memberVehicles = memberVehiclesRepository.create(createData);
    await memberVehiclesRepository.insert(memberVehicles);

    return memberVehicles;
  }
}

export const memberVehiclesRepository =
  AppDataSource.getRepository(MemberVehicles).extend(MemberVehiclesRepository);