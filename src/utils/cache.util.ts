import cache from '../configs/cache';
import { logger } from '../configs/logger';

// cache keys
const AUTH_DENYLIST_KEY = 'auth:token:denylist';
const USER_TOKENS_LIST = (userId: string) => `user:${userId}:tokens`;

const setGetAll = async (type: string, prop: string) => {
  return await cache.smembers(`${type}:${prop}`);
};

const setAdd = (type: string, prop: string, items: string[]) => {
  let success = false;
  try {
    items.forEach((el) => {
      return cache.sadd(`${type}:${prop}`, items);
    });
    success = true;
  } catch (error) {
    logger.error(error);
  }
  return success;
};
