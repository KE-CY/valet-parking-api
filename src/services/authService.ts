import bcrypt from 'bcrypt';
import { IUserRepository } from "../interfaces/repositories/userRepositoryInterface";
import { LoginResponse, TokenResponse } from "../interfaces/responses/authResponse";
import { UserResponse } from "../interfaces/responses/userResponse";
import { IAuthService } from "../interfaces/services/authServiceInterface";
import { UserRepository } from "../repositories/userRepository";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import logger from "../utils/logger";
import { BusinessError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/customErrors";
import { LoginDto } from "../interfaces/dto/authDto";
import { User } from "../entities/User";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository = UserRepository.getInstance()) { }

  generateToken(user: UserResponse): TokenResponse {
    const payload = {
      id: user.id,
      username: user.username
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpiry
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string, requestId: string): Promise<TokenResponse> {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as jwt.JwtPayload;
    if (!payload) {
      logger.warn({ msg: 'Refresh Token Error', requestId });
      throw new UnauthorizedError(
        'Invalid refresh token',
        'Invalid refresh token'
      );
    }
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      logger.warn({ msg: 'User not found', requestId });
      throw new NotFoundError(
        'Invalid refresh token',
        'User not found'
      );
    }
    const response = this.generateToken(user.toResponse());
    return response;
  }

  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      logger.debug({
        msg: 'AuthService: JWT token verified',
        userId: (decoded as any).id
      });

      return decoded;
    } catch (error) {
      logger.warn({
        msg: 'AuthService: Invalid JWT token',
        error: error instanceof Error ? error.message : error
      });

      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  async login(loginData: LoginDto, requestId: string): Promise<LoginResponse> {
    logger.debug({ msg: 'AuthService login start', requestId });
    const { username, password } = loginData;
    try {
      const user = await this.validateUser(username, password);

      if (!user) {
        throw new UnauthorizedError(
          'Invalid username or password',
          'The provided credentials are incorrect'
        );
      }

      const userResponse = user.toResponse();
      const token = this.generateToken(userResponse);
      const response: LoginResponse = {
        user: userResponse,
        token,
      };

      return response;
    } catch (error) {
      logger.error({
        msg: 'AuthService: Login failed',
        username,
        error: error instanceof Error ? error.message : error,
        requestId
      });

      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new InternalServerError(
        'Login failed',
        error instanceof Error ? error.message : 'Unknown error during login'
      );
    }

  }

  async validateUser(username: string, password: string): Promise<User | null> {
    logger.debug({ msg: 'AuthService: Validating user credentials', username });

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      logger.debug({ msg: 'AuthService: User not found', username });
      return null;
    }

    // 檢查用戶是否被停用
    if (!user.isActive) {
      logger.warn({
        msg: 'AuthService: User account is deactivated',
        userId: user.id,
        username
      });
      throw new BusinessError(
        'Account has been deactivated',
        'ACCOUNT_DEACTIVATED',
        'This user account has been deactivated and cannot be used for login'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      logger.debug({
        msg: 'AuthService: Invalid password',
        userId: user.id,
        username
      });
      return null;
    }

    logger.debug({
      msg: 'AuthService: User credentials validated successfully',
      userId: user.id,
      username
    });
    return user;
  }
}