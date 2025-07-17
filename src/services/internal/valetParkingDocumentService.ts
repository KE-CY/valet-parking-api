import { QueryRunner } from "typeorm";
import { ValetParkingDocument } from "../../entities/ValetParkingDocument";
import { ValetParkingDocumentRepository } from "../../repositories/valetParkingDocumentRepository";
import { QueryCondition } from "../../types/queryCondition";
import { BasicMethod } from "../../utils/basicMethod";
import logger from "../../utils/logger";
import { ValetParkingRecord } from "../../entities/ValetParkingRecord";

export class ValetParkingDocumentService extends BasicMethod {
  static entity = 'valetParkingDocument';

  static buildCondition(query: any): QueryCondition {
    let { condition, querySQL } = super.buildCondition(query);

    const { id, valetParkingRecordId, isActive } = query;

    if (id) {
      querySQL += ` AND ${this.entity}.id = :id`;
      condition['id'] = id;
    }

    if (valetParkingRecordId) {
      querySQL += ` AND ${this.entity}.valetParkingRecordId = :valetParkingRecordId`;
      condition['valetParkingRecordId'] = valetParkingRecordId;
    }

    if (isActive !== undefined) {
      querySQL += ` AND ${this.entity}.isActive = :isActive`;
      condition['isActive'] = isActive;
    }

    return { condition, querySQL };
  }

  static override buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    const { querySQL, condition } = ValetParkingDocumentService.buildCondition(query);

    const transformedFilters: Record<string, string | number | object> = {
      [querySQL]: condition,
    };

    return transformedFilters;
  }

  static async createValetParkingDocumentsWithTransaction({
    queryRunner,
    valetParkingRecord,
    valetParkingDocuments,
    reqUser
  }: {
    queryRunner: QueryRunner,
    valetParkingRecord: ValetParkingRecord,
    valetParkingDocuments: Partial<ValetParkingDocument>[],
    reqUser: any
  }): Promise<void> {
    logger.info({ msg: 'In ValetParkingDocumentService.createValetParkingDocumentsWithTransaction', valetParkingDocuments });

    const createData: Partial<ValetParkingDocument>[] = valetParkingDocuments.map(doc => ({
      ...doc,
      valetParkingRecord,
      createdBy: reqUser,
      updatedBy: reqUser,
    }));

    await ValetParkingDocumentRepository.createValetParkingDocumentsWithTransaction({
      queryRunner,
      createData,
    });

    logger.info({ msg: 'ValetParkingDocumentService.createValetParkingDocumentsWithTransaction completed successfully' });
  }
}