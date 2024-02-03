import { Response, NextFunction } from 'express';

import { ACCESS_TOKEN_PUBLIC_KEY } from '../configs/env';
import { logger } from '../configs/logger';
import { AppDataSource } from '../configs/rdbms';
import { WrongAuthTokenException } from '../exceptions';
import { IRequestWithUser } from '../interfaces';
import { User } from '../services/user';
import { isInSetCache, verifyJwt } from '../utils';

export const authenticationMiddleware = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    const userRepo = AppDataSource.getRepository(User);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else {
      access_token = req.cookies.access_token;
    }
    if (!access_token) {
      return next(new WrongAuthTokenException());
    }

    if (await isInSetCache('TOKEN_DENY_LIST', access_token)) {
      return next(new WrongAuthTokenException());
    }

    const userToken = verifyJwt<User>(access_token, ACCESS_TOKEN_PUBLIC_KEY);
    if (!userToken) {
      return next(new WrongAuthTokenException());
    }

    const user = await userRepo.findOne({
      where: { user_id: userToken.user_id },
    });
    if (!user) {
      return next(new WrongAuthTokenException());
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
