import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 DoorLoop ERP Backend Server running on http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

process.on('unhandledRejection', (reason: Error) => {
  logger.error(reason, 'Unhandled Rejection caught:');
});

process.on('uncaughtException', (error: Error) => {
  logger.error(error, 'Uncaught Exception caught:');
  process.exit(1);
});
