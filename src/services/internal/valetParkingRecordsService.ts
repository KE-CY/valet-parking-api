import _ from "lodash";
import { QueryRunner } from "typeorm";
import { User } from "../../entities/User";
import { ValetParkingRecord } from "../../entities/ValetParkingRecord";
import { valetParkingRecordRepository, ValetParkingRecordRepository } from "../../repositories/valetParkingRecordsRepository";
import { QueryCondition } from "../../types/queryCondition";
import { BasicMethod } from "../../utils/basicMethod";
import { NotFoundError, ValidationError } from "../../utils/customError";
import { ErrorCodes } from "../../utils/errorCodes";
import logger from "../../utils/logger";
import { getPaginatedIds, paginateAndSortByIds, PaginatedResponseInterface, PaginationQueryInterface } from "../../utils/pagination";
import { ThirdPartyApiService } from "../thirdPartyApiService";
import { SystemSettingService } from "./systemSettingService";
import { SystemSettingApiConfigKey } from "../../constants/systemSettingKey";
import { ParkingStatus } from "../../enums/valetParkingRecordEnum";

export class ValetParkingRecordService extends BasicMethod {
  static entity = 'valetParkingRecord';

  static buildCondition(query: any): QueryCondition {
    let { condition, querySQL } = super.buildCondition(query);

    const { id, searchName, isActive, parkingStatus, memberId } = query;

    if (id) {
      querySQL += ` AND ${this.entity}.id = :id`;
      condition['id'] = id;
    }

    if (memberId) {
      querySQL += ` AND ${this.entity}.memberId ILIKE :memberId`;
      condition['memberId'] = `%${memberId}%`;
    }

    if (searchName) {
      querySQL += ` AND ${this.entity}.name ILIKE :name`;
      condition['name'] = `%${searchName}%`;
    }

    if (isActive !== undefined) {
      querySQL += ` AND ${this.entity}.isActive = :isActive`;
      condition['isActive'] = isActive;
    }

    if (_.isEmpty(parkingStatus)) {
      querySQL += ` AND ${this.entity}.parkingStatus IN ('PARKING', 'RESERVED', 'RETURNED')`;
      condition['parkingStatus'] = ['PARKING', 'RESERVED', 'RETURNED'];
    }
    else if (parkingStatus) {
      querySQL += ` AND ${this.entity}.parkingStatus = :parkingStatus`;
      condition['parkingStatus'] = parkingStatus;
    }

    return { condition, querySQL };
  }

  static override buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    const { querySQL, condition } = ValetParkingRecordService.buildCondition(query);

    const transformedFilters: Record<string, string | number | object> = {
      [querySQL]: condition,
    };

    return transformedFilters;
  }

  static async getOneById(id: number): Promise<ValetParkingRecord | null> {
    logger.info({ msg: 'In ValetParkingRecordService.getOneById', id });

    const valetParkingRecordsQueryBuilderRepository = valetParkingRecordRepository.createQueryBuilder('valetParkingRecord');
    const valetParkingRecord = await valetParkingRecordsQueryBuilderRepository
      .leftJoinAndSelect('valetParkingRecord.createdBy', 'createdBy')
      .leftJoinAndSelect('valetParkingRecord.updatedBy', 'updatedBy')
      .leftJoinAndSelect('valetParkingRecord.memberVehicle', 'memberVehicle')
      .where('valetParkingRecord.id = :id', { id })
      .select([
        'valetParkingRecord.id',
        'valetParkingRecord.memberId',
        'valetParkingRecord.name',
        'valetParkingRecord.phoneNumber',
        'valetParkingRecord.rfIdKey',
        'valetParkingRecord.parkingSpot',
        'valetParkingRecord.parkingStatus',
        'valetParkingRecord.paymentStatus',
        'valetParkingRecord.parkedAt',
        'valetParkingRecord.pickedAt',
        'valetParkingRecord.createdAt',
        'valetParkingRecord.updatedAt',
        'createdBy.id',
        'createdBy.name',
        'updatedBy.id',
        'updatedBy.name',
        'memberVehicle'
      ])
      .getOne();

    return valetParkingRecord;
  }

  static async validateParkingSpotPreconditions(id: number) {
    logger.info({ msg: 'In ValetParkingRecordService.validateParkingSpotPreconditions', id });

    const valetParkingRecord = await valetParkingRecordRepository.findOne({
      where: { id },
    });

    if (_.isEmpty(valetParkingRecord)) {
      logger.error({ msg: 'Valet parking record not found', id });
      throw new NotFoundError(ErrorCodes.VALET_PARKING_RECORD_NOT_FOUND.message);
    }

    if (valetParkingRecord.parkingStatus !== 'PARKING') {
      logger.error({ msg: 'Parking spot is not currently occupied', id });
      throw new ValidationError('Parking spot is not currently occupied');
    }
  }

  static async createValetParkingRecordWithTransaction({
    queryRunner,
    valetParkingRecord,
    reqUser
  }: {
    queryRunner: QueryRunner,
    valetParkingRecord: Partial<ValetParkingRecord>,
    reqUser: User
  }): Promise<ValetParkingRecord> {
    logger.info({ msg: 'In ValetParkingRecordService.createValetParkingRecordWithTransaction', valetParkingRecord });

    const createData: Partial<ValetParkingRecord> = {
      ...valetParkingRecord,
      createdBy: reqUser,
      updatedBy: reqUser
    };

    const newValetParkingRecord = await ValetParkingRecordRepository.createValetParkingRecordWithTransaction({
      queryRunner,
      createData
    });

    return newValetParkingRecord;
  }

  static async updateValetParkingRecordWithTransaction({
    queryRunner,
    id,
    updateData,
    reqUser
  }: {
    queryRunner: QueryRunner,
    id: number,
    updateData: Partial<ValetParkingRecord>,
    reqUser: User
  }): Promise<void> {
    logger.info({ msg: 'In ValetParkingRecordService.updateValetParkingRecordWithTransaction', id, updateData });

    const set = {
      ..._.omitBy(updateData, _.isUndefined),
      updatedBy: reqUser
    };

    await ValetParkingRecordRepository.updateValetParkingRecordWithTransaction({
      queryRunner,
      id,
      set,
    });
  }

  static async getList(paginationQuery: PaginationQueryInterface): Promise<PaginatedResponseInterface<ValetParkingRecord>> {
    logger.info({ msg: 'In ValetParkingRecordService.getList' });

    const ids = await getPaginatedIds<ValetParkingRecord>(
      valetParkingRecordRepository,
      'valetParkingRecord',
      paginationQuery,
    );

    const valetParkingRecordsQueryBuilderRepository = valetParkingRecordRepository.createQueryBuilder('valetParkingRecord');

    const query = await valetParkingRecordsQueryBuilderRepository
      .leftJoinAndSelect('valetParkingRecord.createdBy', 'createdBy')
      .leftJoinAndSelect('valetParkingRecord.updatedBy', 'updatedBy')
      .leftJoinAndSelect('valetParkingRecord.memberVehicle', 'memberVehicle')
      .select([
        'valetParkingRecord.id',
        'valetParkingRecord.memberId',
        'valetParkingRecord.name',
        'valetParkingRecord.phoneNumber',
        'valetParkingRecord.rfIdKey',
        'valetParkingRecord.parkingSpot',
        'valetParkingRecord.parkingStatus',
        'valetParkingRecord.paymentStatus',
        'valetParkingRecord.parkedAt',
        'valetParkingRecord.pickedAt',
        'valetParkingRecord.createdAt',
        'valetParkingRecord.updatedAt',
        'createdBy.id',
        'createdBy.name',
        'updatedBy.id',
        'updatedBy.name',
        'memberVehicle',
      ]);

    const paginatedResult = await paginateAndSortByIds<ValetParkingRecord>(
      query,
      'valetParkingRecord',
      ids,
      paginationQuery
    );

    return paginatedResult;
  }

  static async validateValetParkingRecordExists(id: number): Promise<void> {
    logger.info({ msg: 'In ValetParkingRecordService.validateValetParkingRecordExists', id });

    const valetParkingRecord = await valetParkingRecordRepository.findOne({
      where: { id },
    });

    if (_.isEmpty(valetParkingRecord)) {
      logger.error({ msg: 'Valet parking record not found', id });
      throw new NotFoundError(ErrorCodes.VALET_PARKING_RECORD_NOT_FOUND.message);
    }
  }

  static async validateHandoverKeyPreconditions(id: number): Promise<void> {
    logger.info({ msg: 'In ValetParkingRecordService.validateHandoverKeyPreconditions', id });

    const valetParkingRecord = await valetParkingRecordRepository.findOne({
      where: { id },
    });

    if (_.isEmpty(valetParkingRecord)) {
      logger.error({ msg: 'Valet parking record not found', id });
      throw new NotFoundError(ErrorCodes.VALET_PARKING_RECORD_NOT_FOUND.message);
    }

    if (valetParkingRecord.paymentStatus !== 'PAID') {
      logger.error({ msg: 'Cannot hand over key, payment status is not PAID', id });
      throw new ValidationError('Cannot hand over key, payment status is not PAID');
    }

    if (valetParkingRecord.parkingStatus !== 'RETURNED') {
      logger.error({ msg: 'Cannot hand over key, parking status is not RETURNED', id });
      throw new ValidationError('Cannot hand over key, parking status is not RETURNED');
    }
  }

  static async validatePaidStatus(id: number): Promise<void> {
    logger.info({ msg: 'In ValetParkingRecordService.validatePaidStatus', id });

    const valetParkingRecord = await valetParkingRecordRepository.findOne({
      where: { id },
    });

    if (_.isEmpty(valetParkingRecord)) {
      logger.error({ msg: 'Valet parking record not found', id, valetParkingRecord });
      throw new NotFoundError(ErrorCodes.VALET_PARKING_RECORD_NOT_FOUND.message);
    }

    const currentParkingStatus = valetParkingRecord.parkingStatus
    const allowedStatus = [ParkingStatus.RESERVED, ParkingStatus.RETURNED];
    if (!_.includes(allowedStatus, currentParkingStatus)) {
      logger.error({ msg: 'Valet parking record status error', valetParkingRecord });
      throw new ValidationError('Invalid valet parking status.');
    }
  }

  static async getValetParkingMembership(memberId: string) {
    logger.info({ msg: 'In ValetParkingRecordService.getValetParkingMembership', memberId });

    const config = await SystemSettingService.getApiConfig(SystemSettingApiConfigKey.GET_MEMBER_INFO);

    const { token } = await ThirdPartyApiService.loginToVendor();

    try {
      return await ThirdPartyApiService.call(config, { memberNo: memberId, token });
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        logger.warn({ msg: 'Member not found in third-party system', memberId });
        return null; // 如果找不到會員，返回 null
      }
      throw err;
    }
  }
}