import { App } from './app';
import { logger } from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error({ msg: 'Uncaught Exception', error: err.message, stack: err.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error({ msg: 'Unhandled Rejection', reason, promise });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info({ msg: 'SIGTERM received, shutting down gracefully' });
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info({ msg: 'SIGINT received, shutting down gracefully' });
  process.exit(0);
});

// Start the application
try {
  const app = new App();
  app.start();
} catch (error) {
  logger.error({
    msg: 'Failed to start application',
    error: error instanceof Error ? error.message : error
  });
  process.exit(1);
}