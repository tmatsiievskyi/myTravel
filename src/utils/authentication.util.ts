import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_PUBLIC_KEY,
} from '../configs/env';
import { IJwtPayload, IRequestWithUser } from '../interfaces';

type JwtSignPayload = Record<string, any>;

export const hashPassword = async (plainTextPassword: string) => {
  return bcrypt.hash(plainTextPassword, 10);
};

export const verifyPassword = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

const signJwt = (
  payload: JwtSignPayload,
  secret: string,
  options: SignOptions = {}
) => {
  return jwt.sign(payload, secret, options);
};

export const verifyJwt = (token: string, secret: string) => {
  try {
    const resp = jwt.verify(token, secret);
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateAuthTokens = (data: IJwtPayload) => {
  const access_token = signJwt(data, ACCESS_TOKEN_PUBLIC_KEY, {
    issuer: 'my-travel-be',
    audience: ['my-travel-fe'],
    expiresIn: `${Number(ACCESS_TOKEN_EXPIRES) || 0}m`,
  });

  const refresh_token = signJwt(data, REFRESH_TOKEN_PUBLIC_KEY, {
    issuer: 'my-travel-be',
    audience: ['my-tavel-fe'],
    expiresIn: `${Number(REFRESH_TOKEN_EXPIRES) || 0}m`,
  });

  return { access_token, refresh_token };
};

export const parseToken = (req: IRequestWithUser) => {
  let foundToken = null;

  if (req && req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      const scheme: string = parts[0];
      const credentials: string = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        foundToken = credentials;
      }
    }
  }

  return foundToken;
};
