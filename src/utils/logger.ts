import path from 'path';
import fs from 'fs';
import pino from 'pino';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
const isProd = process.env.ENVIRONMENT === 'production';

const logger = pino({
  level: isProd ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: logFile,
          mkdir: true,
        },
        level: isProd ? 'info' : 'debug',
      },
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
        level: isProd ? 'info' : 'debug',
      },
    ],
  },
});

export default logger;
