import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserRepository } from '../repositories/userRepository';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';

/**
 * 配置 Passport Local Strategy
 */
export const configurePassport = (): void => {
  const userRepository = UserRepository.getInstance();
  const authService = new AuthService(); // 創建 AuthService 實例

  // 配置 Local Strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // 允許在回調中訪問 request 對象
    },
    async (req: any, username: string, password: string, done) => {
      try {
        const requestId = req?.res?.locals?.requestId || 'unknown';

        logger.info({
          msg: 'Passport: Local authentication attempt',
          username,
          requestId
        });

        // 使用 AuthService 驗證用戶憑證
        const user = await authService.validateUser(username, password);

        if (!user) {
          logger.warn({
            msg: 'Passport: Authentication failed',
            username,
            requestId
          });
          return done(null, false, { message: 'Invalid username or password' });
        }

        // 認證成功
        logger.info({
          msg: 'Passport: Authentication successful',
          userId: user.id,
          requestId
        });

        // 轉換為回應格式（不包含密碼）
        const userResponse = user.toResponse();
        return done(null, userResponse);

      } catch (error) {
        logger.error({
          msg: 'Passport: Authentication error',
          username,
          error: error instanceof Error ? error.message : error,
          requestId: req?.res?.locals?.requestId
        });

        // 檢查是否是業務邏輯錯誤（如帳戶被停用）
        if (error instanceof Error) {
          // 如果是 BusinessError（帳戶停用），返回特定訊息
          if (error.message.includes('deactivated')) {
            return done(null, false, { message: 'Account has been deactivated' });
          }
          // 其他業務錯誤
          if (error.name === 'BusinessError') {
            return done(null, false, { message: error.message });
          }
        }

        // 系統錯誤
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    logger.debug({ msg: 'Passport: Serializing user', userId: user.id });
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      logger.debug({ msg: 'Passport: Deserializing user', userId: id });

      const user = await userRepository.findById(id);

      if (!user) {
        logger.warn({ msg: 'Passport: User not found during deserialization', userId: id });
        return done(null, false);
      }

      if (!user.isActive) {
        logger.warn({ msg: 'Passport: User is deactivated during deserialization', userId: id });
        return done(null, false);
      }

      // 轉換為回應格式
      const userResponse = user.toResponse();

      logger.debug({ msg: 'Passport: User deserialized successfully', userId: user.id });
      done(null, userResponse);

    } catch (error) {
      logger.error({
        msg: 'Passport: Deserialization error',
        userId: id,
        error: error instanceof Error ? error.message : error
      });
      done(error);
    }
  });

  logger.info({ msg: 'Passport configuration completed with AuthService integration' });
};