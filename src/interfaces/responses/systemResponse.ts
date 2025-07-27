export interface StaticOptionsResponse extends GetEnumListResponse {
  maxParkingSpots: number,
  valetMaxParkingMinutes: number,
  systemCountryList: SystemCountryResponse[];
}

export interface GetEnumListResponse {
  parkingStatusEnum: string[];
  paymentStatusEnum: string[];
  documentTypeEnum: string[];
  notificationStatusEnum: string[];
}

export interface SystemCountryResponse {
  id: number;
  alpha2Code: string;
  alpha3Code: string;
  countryCode: number;
  name: string;
}