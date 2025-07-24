import { SystemCountry } from '../../entities/SystemCountry';

export interface ISystemCountryRepository {
  findAll(): Promise<SystemCountry[]>;
  findById(id: number): Promise<SystemCountry | null>;
  findByAlpha2Code(alpha2Code: string): Promise<SystemCountry | null>;
  findByAlpha3Code(alpha3Code: string): Promise<SystemCountry | null>;
  findActive(): Promise<SystemCountry[]>;
  create(countryData: Partial<SystemCountry>): Promise<SystemCountry>;
  update(id: number, countryData: Partial<SystemCountry>): Promise<SystemCountry | null>;
  delete(id: number): Promise<boolean>;
}