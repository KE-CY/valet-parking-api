import { SystemCountry } from '../entities/SystemCountry';
import { AppDataSource } from '../config/typeorm-config';

import { Repository } from 'typeorm';

export class SystemCountryRepository extends Repository<SystemCountry> {
  constructor() {
    super(SystemCountry, AppDataSource.manager);
  }
}

export const systemCountryRepository =
  AppDataSource.getRepository(SystemCountry).extend(SystemCountryRepository);
