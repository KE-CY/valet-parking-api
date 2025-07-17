import { User } from "../../entities/User";
import jwt from 'jsonwebtoken';
import logger from "../../utils/logger";

export class AuthService {
  static generateToken(user: User) {
    const payload = { id: user.id, username: user.username };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h',
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '8h',
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  };

  static verifyRefreshToken(token: string) {
    logger.debug({ msg: 'In AuthService.verifyRefreshToken' });
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
      return payload;
    } catch (err) {
      return null;
    }
  }

  static refreshTokens(refreshToken: string) {
    logger.debug({ msg: 'In AuthService.refreshTokens' });
    const payload = AuthService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const user = { id: payload.id, username: payload.username };
    return AuthService.generateToken(user as User);
  }
}
