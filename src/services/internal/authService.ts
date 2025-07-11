import { User } from "../../entities/User";
import jwt from 'jsonwebtoken';

export class AuthService {
  static generateToken(user: User) {
    const payload = { id: user.id, username: user.username };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h',
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '8h',
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  };
}
