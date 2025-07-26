import { User } from "../../entities/User";
import { IBasicRepository } from "./basicRepositoryInterface";

export interface IUserRepository extends IBasicRepository<User> {
  existsByUsername(username: string): Promise<boolean>;
}