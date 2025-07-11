import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DocumentType } from "../enums/valetParkingDocumentEnum";
import { ValetParkingRecord } from "./ValetParkingRecord";
import { User } from "./User";

@Entity('valet_parking_document')
export class ValetParkingDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ValetParkingRecord)
  @JoinColumn({ name: 'valet_parking_record_id' })
  valetParkingRecord?: ValetParkingRecord;

  @Column({
    name: 'type',
    type: 'enum',
    enum: DocumentType,
  })
  type!: DocumentType;

  @Column()
  url!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;
}