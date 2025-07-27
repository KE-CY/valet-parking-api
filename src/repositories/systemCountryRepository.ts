import { Repository } from "typeorm";
import { SystemCountry } from "../entities/SystemCountry";
import { AppDataSource } from "../config/typeorm-config";
import { ISystemCountryRepository } from "../interfaces/repositories/systemCountryRepositoryInterface";
import logger from "../utils/logger";
import { DatabaseError } from "../utils/customErrors";

export class SystemCountryRepository extends Repository<SystemCountry> implements ISystemCountryRepository {
  constructor() {
    super(SystemCountry, AppDataSource.manager);
  }

  static getInstance(): SystemCountryRepository {
    return new SystemCountryRepository();
  }

  async findAll(): Promise<SystemCountry[]> {
    try {
      logger.debug({ msg: 'SystemCountryRepository: find all system countries' });

      const countries = await this.createQueryBuilder('systemCountry').getMany();

      return countries;

    } catch (error) {
      logger.error({ msg: 'SystemCountryRepository: Error find all system countries' });
      throw new DatabaseError(
        'Failed to find all countries',
        error instanceof Error ? error.message : 'Unknown database error'
      );
    }
  }

  async findById(id: number): Promise<SystemCountry | null> {
    try {
      logger.debug({ msg: 'SystemCountryRepository: Finding system country by ID', id });

      const systemCountry = await this.createQueryBuilder('systemCountry')
        .where('systemCountry.id = :id', { id })
        .getOne();

      logger.debug({ msg: 'SystemCountryRepository: System country found by ID', id, found: !!systemCountry });

      return systemCountry;
    } catch (error) {
      logger.error({ msg: 'SystemCountryRepository: Error finding system country by ID', id, error });
      throw new DatabaseError(
        'Failed to find system country by ID',
        error instanceof Error ? error.message : 'Unknown database error'
      );
    }
  }
}

