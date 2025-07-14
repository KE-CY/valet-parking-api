import { QueryRunner, Repository } from "typeorm";
import { ValetParkingDocument } from "../entities/ValetParkingDocument";
import { AppDataSource } from "../config/typeorm-config";
import logger from "../utils/logger";

export class ValetParkingDocumentRepository extends Repository<ValetParkingDocument> {
  constructor() {
    super(ValetParkingDocument, AppDataSource.manager);
  }

  static async createValetParkingDocumentsWithTransaction({
    queryRunner,
    createData,
  }: {
    queryRunner: QueryRunner,
    createData: Partial<ValetParkingDocument>[],
  }): Promise<ValetParkingDocument[]> {
    logger.info('In ValetParkingDocumentRepository.createValetParkingDocumentsWithTransaction', { createData });

    const valetParkingDocumentRepository = queryRunner.manager.getRepository(ValetParkingDocument);

    const valetParkingDocs = valetParkingDocumentRepository.create(createData);
    await valetParkingDocumentRepository.insert(valetParkingDocs);

    return valetParkingDocs;
  }
}

export const valetParkingDocumentRepository =
  AppDataSource.getRepository(ValetParkingDocument).extend(ValetParkingDocumentRepository);