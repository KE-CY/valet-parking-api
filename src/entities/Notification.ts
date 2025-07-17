import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationStatus } from "../enums/notificationEnum";
import { User } from "./User";
import { ValetParkingRecord } from "./ValetParkingRecord";

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ name: 'status', type: 'enum', enum: NotificationStatus })
  status!: NotificationStatus;

  @ManyToOne(() => ValetParkingRecord)
  @JoinColumn({ name: 'valet_parking_record_id' })
  valetParkingRecord?: ValetParkingRecord;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;
}