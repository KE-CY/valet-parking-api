import { ValetParkingRecord } from '../../entities/ValetParkingRecord';
import { ParkingStatus, PaymentStatus } from '../../enums/valetParkingRecordEnum';

export interface IValetParkingRecordRepository {
  findAll(): Promise<ValetParkingRecord[]>;
  findById(id: number): Promise<ValetParkingRecord | null>;
  findByMemberId(memberId: string): Promise<ValetParkingRecord[]>;
  findByRfIdKey(rfIdKey: string): Promise<ValetParkingRecord | null>;
  findByParkingStatus(status: ParkingStatus): Promise<ValetParkingRecord[]>;
  findByPaymentStatus(status: PaymentStatus): Promise<ValetParkingRecord[]>;
  findActive(): Promise<ValetParkingRecord[]>;
  create(recordData: Partial<ValetParkingRecord>): Promise<ValetParkingRecord>;
  update(id: number, recordData: Partial<ValetParkingRecord>): Promise<ValetParkingRecord | null>;
  delete(id: number): Promise<boolean>;
}