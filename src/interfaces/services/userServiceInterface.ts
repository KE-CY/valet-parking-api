import { RegisterDto } from "../dto/userDto";
import { UserResponse } from "../responses/userResponse";

export interface IUserService {
  register(registerData: RegisterDto, requestId: string): Promise<UserResponse>;
}