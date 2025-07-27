import { GetEnumListResponse, StaticOptionsResponse } from "../responses/systemResponse";

export interface ISystemService {
  getEnumList(): GetEnumListResponse;
  getStaticOptions(requestId: string): Promise<StaticOptionsResponse>;
}