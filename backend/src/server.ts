import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import prisma from './config/database.js';

// Connect and verify database connection
prisma.$connect()
  .then(() => {
    logger.info('🔌 MySQL Database connected successfully via Prisma Client!');
    console.log('🔌 MySQL Database connected successfully via Prisma Client!');
  })
  .catch((error) => {
    logger.error(error, '❌ Failed to connect to the MySQL database:');
    console.error('❌ Failed to connect to the MySQL database:', error);
  });

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
