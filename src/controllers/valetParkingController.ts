import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { QueryRunner } from "typeorm";
import { AppDataSource } from "../config/typeorm-config";
import { ParkingStatus, PaymentStatus } from "../enums/valetParkingRecordEnum";
import { MemberVehiclesService } from "../services/internal/memberVehiclesService";
import { SystemCountryService } from "../services/internal/systemCountryService";
import { UserService } from "../services/internal/userService";
import { ValetParkingDocumentService } from "../services/internal/valetParkingDocumentService";
import { ValetParkingRecordService } from "../services/internal/valetParkingRecordsService";
import logger from "../utils/logger";
import { ApiResponse } from "../utils/responseModel";

export const valetParkingScan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 需要另外做專案
    const fakeScanResult = {
      carPlate: "ABC123",
      carColor: "Red",
    }

    return res.status(200).json(new ApiResponse('success', 'OK', fakeScanResult));

  } catch (error) {
    logger.error({ msg: "Error in valetParkingScan:", error });
    next(error);
  }
}

export const getValetParkingMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId } = req.query;
    const result = await ValetParkingRecordService.getValetParkingMembership(String(memberId));

    return res.status(200).json(new ApiResponse('success', 'OK', result));

  } catch (error) {
    logger.error({ msg: "Error in getValetParkingMembership:", error });
    next(error);
  }
}

export const valetParkingRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));

  try {
    const validBody = req.body;

    const { country } = validBody;

    await SystemCountryService.validateSystemCountryExists(_.get(country, 'id'));

    const valetParkingRecord = await ValetParkingRecordService.createValetParkingRecordWithTransaction({
      queryRunner,
      valetParkingRecord: validBody,
      reqUser
    });

    const { document, carPlate, carColor } = validBody;

    await MemberVehiclesService.createMemberVehicleWithTransaction({
      queryRunner,
      memberVehicle: {
        valetParkingRecord,
        carPlate,
        carColor
      },
      reqUser
    });

    if (!_.isEmpty(document)) {
      await ValetParkingDocumentService.createValetParkingDocumentsWithTransaction({
        queryRunner,
        valetParkingRecord,
        valetParkingDocuments: document,
        reqUser
      });
    }

    await queryRunner.commitTransaction();

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in valetParkingRegister:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export const setParkingSpot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));
  const { id } = req.params;
  const validBody = req.body;
  try {
    const { parkingSpot } = validBody;

    await ValetParkingRecordService.validateParkingSpotPreconditions(Number(id));

    await ValetParkingRecordService.updateValetParkingRecordWithTransaction({
      queryRunner,
      id: Number(id),
      updateData: {
        parkingSpot,
        parkedAt: new Date(),
      },
      reqUser
    });
    await queryRunner.commitTransaction();

    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));

  } catch (error) {
    logger.error({ msg: "Error in setParkingSpot:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export const getList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = ValetParkingRecordService.buildTransformedFilters(req.query);

    const paginationQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sortBy: req.query.sortBy?.toString() || 'valetParkingRecord.id',
      sortOrder: (req.query.sortOrder?.toString() as 'ASC' | 'DESC') || 'ASC',
      filters,
    };

    const valetParkingRecords = await ValetParkingRecordService.getList(paginationQuery);

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecords));
  } catch (error) {
    logger.error({ msg: "Error in getList:", error });
    next(error);
  }
}

export const setReserved = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));
  const { id } = req.params;
  const validBody = req.body;

  try {
    const { pickedAt } = validBody;

    await ValetParkingRecordService.validateValetParkingRecordExists(Number(id));

    await ValetParkingRecordService.updateValetParkingRecordWithTransaction({
      queryRunner,
      id: Number(id),
      updateData: {
        pickedAt,
        parkingStatus: ParkingStatus.RESERVED,
      },
      reqUser
    });

    await queryRunner.commitTransaction();

    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in setReserved:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export const handOverKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));
  const { id } = req.params;

  try {
    await ValetParkingRecordService.validateHandoverKeyPreconditions(Number(id));

    await ValetParkingRecordService.updateValetParkingRecordWithTransaction({
      queryRunner,
      id: Number(id),
      updateData: {
        parkingStatus: ParkingStatus.COMPLETE,
      },
      reqUser
    });

    await queryRunner.commitTransaction();

    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in handOverKey:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export const getOneById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in getOneById:", error });
    next(error);
  }
}

export const setReturned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));
  const { id } = req.params;

  try {
    await ValetParkingRecordService.validateValetParkingRecordExists(Number(id));

    await ValetParkingRecordService.updateValetParkingRecordWithTransaction({
      queryRunner,
      id: Number(id),
      updateData: {
        parkingStatus: ParkingStatus.RETURNED,
      },
      reqUser
    });

    await queryRunner.commitTransaction();

    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in setReturned:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export const setPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const reqUser = await UserService.getReqUser(Number(_.get(req, 'user.id')));
  const { id } = req.params;

  try {
    await ValetParkingRecordService.validatePaidStatus(Number(id));

    await ValetParkingRecordService.updateValetParkingRecordWithTransaction({
      queryRunner,
      id: Number(id),
      updateData: {
        paymentStatus: PaymentStatus.PAID,
      },
      reqUser
    });

    await queryRunner.commitTransaction();

    const valetParkingRecord = await ValetParkingRecordService.getOneById(Number(id));

    res.status(200).json(new ApiResponse('success', 'OK', valetParkingRecord));
  } catch (error) {
    logger.error({ msg: "Error in setPaid:", error });
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}