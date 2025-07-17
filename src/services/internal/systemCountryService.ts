
import { SystemCountry } from "../../entities/SystemCountry";
import { systemCountryRepository } from "../../repositories/systemCountryRepository";
import { QueryCondition } from "../../types/queryCondition";
import { BasicMethod } from "../../utils/basicMethod";
import { NotFoundError } from "../../utils/customError";
import { ErrorCodes } from "../../utils/errorCodes";
import logger from "../../utils/logger";

export class SystemCountryService extends BasicMethod {
  static entity = "systemCountry";

  static buildCondition(query: any): QueryCondition {
    let { condition, querySQL } = super.buildCondition(query);

    const { id, searchName, isActive } = query;

    if (id) {
      querySQL += ` AND ${this.entity}.id = :id`;
      condition["id"] = id;
    }

    if (searchName) {
      querySQL += ` AND ${this.entity}.name ILIKE :name`;
      condition["name"] = `%${searchName}%`;
    }

    if (isActive !== undefined) {
      querySQL += ` AND ${this.entity}.isActive = :isActive`;
      condition["isActive"] = isActive;
    }

    return { condition, querySQL };
  }

  static override buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    const { querySQL, condition } = SystemCountryService.buildCondition(query);

    const transformedFilters: Record<string, string | number | object> = {
      [querySQL]: condition,
    };

    return transformedFilters;
  }

  static async validateSystemCountryExists(id: number): Promise<SystemCountry> {
    logger.info({ msg: "In SystemCountryService.validateSystemCountryExists" });

    if (!id) {
      logger.error({
        msg: "System country ID is required.",
      });

      throw new NotFoundError(ErrorCodes.SYSTEM_COUNTRY_NOT_FOUND.message);
    }

    const systemCountry = await systemCountryRepository.findOne({
      where: { id, isActive: true },
    });

    if (!systemCountry) {
      logger.error({
        msg: 'In SystemCountryService.validateSystemCountryExists',
        id,
      });

      throw new NotFoundError(ErrorCodes.SYSTEM_COUNTRY_NOT_FOUND.message);
    }

    return systemCountry;
  }

  static async getSystemCountryList(): Promise<SystemCountry[]> {
    const systemCountries = systemCountryRepository
      .createQueryBuilder('systemCountry')
      .select([
        'systemCountry.id',
        'systemCountry.name',
        'systemCountry.alpha2Code',
        'systemCountry.alpha3Code',
        'systemCountry.countryCode',
      ])
      .where('systemCountry.isActive = true')
      .getMany();

    return systemCountries;
  }
}