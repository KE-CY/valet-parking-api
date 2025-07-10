import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { ValetParkingRecord } from "./ValetParkingRecord";

@Entity('member_vehicles')
export class MemberVehicles {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => ValetParkingRecord)
  @JoinColumn({ name: 'valet_parking_record_id' })
  valetParkingRecord?: ValetParkingRecord;

  @Column({ default: true })
  status?: boolean;

  @Column({ name: 'car_plate' })
  carPlate!: string;

  @Column({ name: 'car_color' })
  carColor!: string;

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
}