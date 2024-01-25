import Redis from 'ioredis';

import { REDIS_HOST, REDIS_PORT } from './env';
import { logger } from './logger';

const client = new Redis({ port: +REDIS_PORT, host: REDIS_HOST });

const CACHE_MAX_RETRY_ATTEMPTS = 20;
let cacheConnectionAttempts = 0;

client.on('connect', () => {
  logger.info('Redis ready');
  cacheConnectionAttempts = 0;
});

client.on('error', (cacheError) => {
  if (cacheConnectionAttempts >= CACHE_MAX_RETRY_ATTEMPTS) {
    logger.error(
      `Could not connect to redis after ${cacheConnectionAttempts} attempts. Killing process`
    );
    process.exit(1);
  }

  logger.error('Error connecting to redis');
  logger.error(cacheError.message);
  cacheConnectionAttempts++;
});

export default client;
