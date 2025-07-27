import { NotificationStatus } from "../enums/notificationEnum";
import { ParkingStatus, PaymentStatus } from "../enums/valetParkingRecordEnum";
import { DocumentType } from "../enums/valetParkingDocumentEnum";
import { GetEnumListResponse, StaticOptionsResponse } from "../interfaces/responses/systemResponse";
import { ISystemService } from "../interfaces/services/systemServiceInterface";
import { InternalServerError } from "../utils/customErrors";
import logger from "../utils/logger";
import { ISystemSettingRepository } from "../interfaces/repositories/systemSettingRepositoryInterface";
import { SystemSettingRepository } from "../repositories/systemSettingRepository";
import { SystemSettingParamKey } from "../constants/systemSettingKey";
import { SystemCountryRepository } from "../repositories/systemCountryRepository";
import { ISystemCountryRepository } from "../interfaces/repositories/systemCountryRepositoryInterface";

export class SystemService implements ISystemService {
  constructor(
    private systemSettingRepository: ISystemSettingRepository = SystemSettingRepository.getInstance(),
    private systemCountryRepository: ISystemCountryRepository = SystemCountryRepository.getInstance()
  ) { }

  getEnumList(): GetEnumListResponse {
    return {
      parkingStatusEnum: Object.values(ParkingStatus),
      paymentStatusEnum: Object.values(PaymentStatus),
      documentTypeEnum: Object.values(DocumentType),
      notificationStatusEnum: Object.values(NotificationStatus),
    }
  }

  async getStaticOptions(requestId: string): Promise<StaticOptionsResponse> {
    try {
      logger.debug({ msg: 'SystemService: Start get static options', requestId });
      const enumList = this.getEnumList();

      const systemSettings = await this.systemSettingRepository.getMultiple([
        SystemSettingParamKey.MAX_PARKING_SPOTS,
        SystemSettingParamKey.VALET_MAX_PARKING_MINUTES
      ]);

      const systemCountries = await this.systemCountryRepository.findAll();

      const response: StaticOptionsResponse = {
        ...enumList,
        maxParkingSpots: systemSettings[SystemSettingParamKey.MAX_PARKING_SPOTS],
        valetMaxParkingMinutes: systemSettings[SystemSettingParamKey.VALET_MAX_PARKING_MINUTES],
        systemCountryList: systemCountries.map(country => country.toResponse())
      }

      return response;

    } catch (error) {
      logger.error({
        msg: 'SystemService: Get Static Options Failed.',
        requestId,
        error: error instanceof Error ? error.message : error,
      })

      throw new InternalServerError(
        'Get Static Options Failed.',
        error instanceof Error ? error.message : 'Unknown error during get static options failed'
      )
    }
  }
}