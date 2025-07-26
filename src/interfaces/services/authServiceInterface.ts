import { User } from "../../entities/User";
import { LoginDto } from "../dto/authDto";
import { LoginResponse, TokenResponse } from "../responses/authResponse";
import { UserResponse } from "../responses/userResponse";

export interface IAuthService {
  login(loginData: LoginDto, requestId: string): Promise<LoginResponse>;
  validateUser(username: string, password: string): Promise<User | null>;
  generateToken(user: UserResponse): TokenResponse;
  refreshToken(refreshToken: string, requestId: string): Promise<TokenResponse>;
  verifyToken(token: string): any;
}