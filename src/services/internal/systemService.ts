import _ from "lodash";
import { SystemSettingParamKey } from "../../constants/systemSettingKey";
import { DocumentType, } from "../../enums/valetParkingDocumentEnum";
import { ParkingStatus, PaymentStatus } from '../../enums/valetParkingRecordEnum';
import { NotificationStatus } from '../../enums/notificationEnum'
import { SystemCountryService } from "./systemCountryService";
import { SystemSettingService } from "./systemSettingService";
import logger from "../../utils/logger";

export class SystemService {
  static getEnumList() {
    return {
      parkingStatusEnum: ParkingStatus,
      paymentStatusEnum: PaymentStatus,
      documentTypeEnum: DocumentType,
      notificationStatusEnum: NotificationStatus
    }
  }

  static async getStaticOptions() {
    logger.debug('In SystemService.getStaticOptions');
    const systemCountryList = await SystemCountryService.getSystemCountryList();
    const enumList = SystemService.getEnumList();

    const systemSettings = await SystemSettingService.getMultiple([
      SystemSettingParamKey.MAX_PARKING_SPOTS,
      SystemSettingParamKey.VALET_MAX_PARKING_MINUTES
    ]);


    return _.assign(enumList, {
      systemCountryList,
      maxParkingSpots: systemSettings[SystemSettingParamKey.MAX_PARKING_SPOTS],
      valetMaxParkingMinutes: systemSettings[SystemSettingParamKey.VALET_MAX_PARKING_MINUTES]
    });
  }
}