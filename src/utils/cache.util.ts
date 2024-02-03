import cache from '../configs/cache';
import { logger } from '../configs/logger';

const cacheTypes = {
  SET: 'set',
  HASH: 'hash',
} as const;

// cache keys
const hashCacheKeys = {
  AUTH_DENY_KEY: 'auth:token:deny',
  AUTH_EMAIL_KEY: 'auth:token:email',
  AUTH_REFRESH_KEY: (userId: string) => `auth:${userId}:refresh`,
} as const;
type TCacheKeys = keyof typeof hashCacheKeys;
type TypeOfCacheKeys = (typeof hashCacheKeys)[TCacheKeys];

const setCacheKeys = {
  USER_TOKENS_LIST: (userId: string) => `user:${userId}:tokens`,
  TOKEN_DENY_LIST: 'auth:token:deny',
} as const;
type TSetCacheKeys = keyof typeof setCacheKeys;
type TypeOfSetCacheKeys = (typeof setCacheKeys)[TSetCacheKeys];

export const addHashCache = async (
  key: TCacheKeys,
  id: string,
  data: object,
  keyData?: string
) => {
  let success = false;
  try {
    const val = hashCacheKeys[key];
    typeof val === 'string'
      ? await cache.hset(val, { [id]: data })
      : await cache.hset(val(keyData || ''), { [id]: data });
    logger.info(`Added to ${val} -> ${id} - ${data}`);

    success = true;
  } catch (error) {
    logger.error(error);
  }
  return success;
};

export const deleteHashCache = async (
  key: TCacheKeys,
  id: string,
  keyData?: string
) => {
  let success = false;
  try {
    const val = hashCacheKeys[key];
    typeof val === 'string'
      ? await cache.hdel(val, id)
      : await cache.hdel(val(keyData || ''), id);
    success = true;
  } catch (error) {
    logger.error(error);
    success = false;
  }
  return success;
};

export const addSetCache = async (
  key: TSetCacheKeys,
  item: string,
  keyData?: string
) => {
  let success = false;
  try {
    const val = setCacheKeys[key];

    typeof val === 'string'
      ? await cache.sadd(val, item)
      : await cache.sadd(val(keyData || ''), item);
    success = true;
  } catch (error) {
    logger.error(error);
  }
  return success;
};

export const isInSetCache = async (
  key: TSetCacheKeys,
  id: string,
  keyData?: string
) => {
  let success = false;
  try {
    const val = setCacheKeys[key];
    if (typeof val === 'string') {
      success = (await cache.sismember(val, id)) > 0;
      return success;
    } else {
      success = (await cache.sismember(val(keyData || ''), id)) > 0;
      return success;
    }
  } catch (error) {
    logger.error(error);
    success = false;
  }
  return success;
};
