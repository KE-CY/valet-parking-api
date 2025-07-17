import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ParkingStatus, PaymentStatus } from "../enums/valetParkingRecordEnum";
import { SystemCountry } from "./SystemCountry";
import { User } from "./User";
import { MemberVehicles } from "./MemberVehicles";

@Entity('valet_parking_record')
export class ValetParkingRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'member_id', nullable: true })
  memberId!: string;

  @Column({ type: 'boolean', default: true, name: 'is_status' })
  isStatus?: boolean;

  @Column()
  name!: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber!: string;

  @ManyToOne(() => SystemCountry, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country?: SystemCountry;

  @Column({ name: 'rfid_key' })
  rfIdKey!: string;

  @Column({ name: 'parking_spot', nullable: true })
  parkingSpot!: string;

  @Column({
    name: 'parking_status',
    type: 'enum',
    enum: ParkingStatus,
    default: ParkingStatus.PARKING
  })
  parkingStatus!: ParkingStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID
  })
  paymentStatus!: PaymentStatus;

  @Column({
    name: 'parked_at',
    type: 'timestamp',
    nullable: true,
  })
  parkedAt!: Date;

  @Column({
    name: 'picked_at',
    type: 'timestamp',
    nullable: true,
  })
  pickedAt!: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;

  // Relationship with MemberVehicles
  @OneToOne(() => MemberVehicles, (memberVehicle) => memberVehicle.valetParkingRecord)
  memberVehicle?: MemberVehicles;
}
