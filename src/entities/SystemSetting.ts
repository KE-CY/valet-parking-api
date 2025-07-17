import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SettingType } from "../enums/systemSettingEnum";

@Entity('system_setting')
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: SettingType })
  type!: SettingType;

  @Column({ name: 'key', unique: true })
  key!: string;

  @Column({ name: 'value', type: 'jsonb' })
  value!: any;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt?: Date;
}