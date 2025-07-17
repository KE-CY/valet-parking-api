import { QueryRunner, Repository } from "typeorm";
import { AppDataSource } from "../config/typeorm-config";
import { ValetParkingRecord } from "../entities/ValetParkingRecord";
import logger from "../utils/logger";

export class ValetParkingRecordRepository extends Repository<ValetParkingRecord> {
  constructor() {
    super(ValetParkingRecord, AppDataSource.manager);
  }

  static async createValetParkingRecordWithTransaction({
    queryRunner,
    createData
  }: {
    queryRunner: QueryRunner,
    createData: Partial<ValetParkingRecord>
  }): Promise<ValetParkingRecord> {
    logger.info({ msg: 'In ValetParkingRecordRepository.createValetParkingRecordWithTransaction', createData });

    const valetParkingRecordsRepository = queryRunner.manager.getRepository(ValetParkingRecord);

    const valetParkingRecord = valetParkingRecordsRepository.create(createData);
    await valetParkingRecordsRepository.insert(valetParkingRecord);

    return valetParkingRecord;
  }

  static async updateValetParkingRecordWithTransaction({
    queryRunner,
    id,
    set,
  }: {
    queryRunner: QueryRunner,
    id: number,
    set: Partial<ValetParkingRecord>
  }): Promise<void> {
    logger.info({ msg: 'In ValetParkingRecordRepository.updateValetParkingRecordWithTransaction', id, set });

    const valetParkingRecordRepository = queryRunner.manager.getRepository(ValetParkingRecord);

    await valetParkingRecordRepository.update(id, set);
  }

}

export const valetParkingRecordRepository =
  AppDataSource.getRepository(ValetParkingRecord).extend(ValetParkingRecordRepository);