import { Notification } from '../../entities/Notification';
import { NotificationStatus } from '../../enums/notificationEnum';

export interface INotificationRepository {
  findAll(): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  findByStatus(status: NotificationStatus): Promise<Notification[]>;
  findByValetParkingRecordId(recordId: number): Promise<Notification[]>;
  create(notificationData: Partial<Notification>): Promise<Notification>;
  update(id: number, notificationData: Partial<Notification>): Promise<Notification | null>;
  delete(id: number): Promise<boolean>;
}