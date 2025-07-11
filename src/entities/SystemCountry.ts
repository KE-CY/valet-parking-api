import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity('system_country')
export class SystemCountry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'alpha2_code' })
  alpha2Code!: string;

  @Column({ name: 'alpha3_code', default: '' })
  alpha3Code!: string;

  @Column({ name: 'country_code' })
  countryCode!: number;

  @Column()
  name!: string;

  @Column({ default: 999999, name: 'display_order' })
  displayOrder!: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive?: boolean;

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
