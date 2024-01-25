import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

import cache from '../configs/cache';
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  APP_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_PUBLIC_KEY,
} from '../configs/env';
import { logger } from '../configs/logger';
import { IJwtPayload, IRequestWithUser } from '../interfaces';

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

export const createAuthJwts = async (data: IJwtPayload, userAgent: object) => {
  const access_token = createJwt(data, ACCESS_TOKEN_PUBLIC_KEY, {
    ...jwtOptionsInit,
    expiresIn: `${Number(ACCESS_TOKEN_EXPIRES) || 0}m`,
  });

  const refresh_token = createJwt(data, REFRESH_TOKEN_PUBLIC_KEY, {
    ...jwtOptionsInit,
    expiresIn: `${Number(REFRESH_TOKEN_EXPIRES) || 0}m`,
  });

  await storeTokenInCache(refresh_token, { ...data, ...userAgent });

  return { access_token, refresh_token };
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
    expiresIn: '1h',
  });
  await storeTokenInCache(jwt, {
    vendor: undefined,
    model: undefined,
    type: undefined,
  });

  return jwt;
};

export const storeTokenInCache = async (token: string, data: object) => {
  const success = false;
  try {
    cache.set(token, JSON.stringify(data));
  } catch (error) {
    logger.error(error);
  }
};
