import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_PUBLIC_KEY,
  APP_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_PUBLIC_KEY,
} from '../configs/env';
import { logger } from '../configs/logger';
import { IJwtPayload } from '../interfaces';

import { addHashCache } from './cache.util';
import { generateCookieOptions } from './cookie';

type JwtSignPayload = Record<string, any>;

export enum TokenTypes {
  LOGIN = 'login',
  REGISTER = 'register',
  PASSWORD = 'password',
}

const jwtOptionsInit = {
  issuer: 'my-travel-be',
  audience: ['my-travel-fe'],
};

export const hashPassword = async (plainTextPassword: string) => {
  return bcrypt.hash(plainTextPassword, 10);
};

export const verifyPassword = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

const createJwt = (
  payload: JwtPayload,
  secret: string,
  options: SignOptions = {}
) => jwt.sign(payload, secret, options);

export const verifyJwt = <T>(token: string, secret: string): T | null => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const createAuthJwts = async (data: IJwtPayload, userAgent: object) => {
  const access_token = createJwt(data, ACCESS_TOKEN_PUBLIC_KEY, {
    ...jwtOptionsInit,
    expiresIn: `${Number(ACCESS_TOKEN_EXPIRES) || 0}m`,
  });

  const refresh_token = createJwt(data, REFRESH_TOKEN_PUBLIC_KEY, {
    ...jwtOptionsInit,
    expiresIn: `${Number(REFRESH_TOKEN_EXPIRES) || 0}m`,
  });

  await addHashCache(
    'AUTH_REFRESH_KEY',
    refresh_token,
    {
      user_id: data.user_id,
      refresh_token,
      expiresIn: `${Number(REFRESH_TOKEN_EXPIRES) || 0}m`,
      userAgent,
    },
    data.user_id
  );

  return {
    access: {
      token: access_token,
      options: generateCookieOptions(Number(ACCESS_TOKEN_EXPIRES), {
        httpOnly: true,
        sameSite: 'lax',
      }),
    },
    refresh: {
      token: refresh_token,
      options: generateCookieOptions(Number(REFRESH_TOKEN_EXPIRES), {
        httpOnly: true,
        sameSite: 'lax',
      }),
    },
  };
};

export const createEmailJwt = async (
  email: string,
  expiresIn: string = '1h',
  type: TokenTypes = TokenTypes.REGISTER
) => {
  const dataStoredInToken = {
    email,
    type,
  };
  const jwt = createJwt(dataStoredInToken, APP_SECRET, {
    ...jwtOptionsInit,
    expiresIn: expiresIn,
  });

  return jwt;
};
