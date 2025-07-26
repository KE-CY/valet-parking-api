import { User } from "../../entities/User";
import { IBasicRepository } from "./basicRepositoryInterface";

export interface IUserRepository extends IBasicRepository<User> {
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
}