import { MemberVehicles } from '../../entities/MemberVehicles';

export interface IMemberVehiclesRepository {
  findAll(): Promise<MemberVehicles[]>;
  findById(id: number): Promise<MemberVehicles | null>;
  findByCarPlate(carPlate: string): Promise<MemberVehicles[]>;
  findActive(): Promise<MemberVehicles[]>;
  create(vehicleData: Partial<MemberVehicles>): Promise<MemberVehicles>;
  update(id: number, vehicleData: Partial<MemberVehicles>): Promise<MemberVehicles | null>;
  delete(id: number): Promise<boolean>;
}