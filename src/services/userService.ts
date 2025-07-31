import bcrypt from 'bcrypt';
import { CreateUserDto, RegisterDto } from "../interfaces/dto/userDto";
import { IUserRepository } from "../interfaces/repositories/userRepositoryInterface";
import { UserResponse } from "../interfaces/responses/userResponse";
import { IUserService } from "../interfaces/services/userServiceInterface";
import { UserRepository } from "../repositories/userRepository";
import { BusinessError, InternalServerError } from "../utils/customErrors";
import logger from "../utils/logger";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository = UserRepository.getInstance()) { }

  async register(registerData: RegisterDto, requestId: string): Promise<UserResponse> {
    logger.debug({ msg: 'UserService: Starting user registration', requestId, user: { username: registerData.username } });

    // 檢查 username 是否存在
    const usernameExists = await this.userRepository.existsByUsername(registerData.username);
    if (usernameExists) {
      throw new BusinessError(
        'Username already registered',
        'USERNAME_ALREADY_EXISTS',
        `A user with username ${registerData.username} already exists`
      )
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerData.password, salt);

    const createUserData: CreateUserDto = {
      name: registerData.name,
      username: registerData.username,
      password: hashedPassword,
      employeeNo: registerData.employeeNo,
      salt,
      avatarUrl: registerData.avatarUrl
    };

    const newUser = await this.userRepository.createOne(createUserData, requestId);

    const userResponse = newUser.toResponse();
    return userResponse;

  }
}