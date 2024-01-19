import { NextFunction, Response } from 'express';
import { UAParser } from 'ua-parser-js';

import { logger } from '../configs/logger';
import { IRequestWithUser } from '../interfaces';

export const addUserAgent = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    req.userAgent = new UAParser(req.headers['user-agent']).getResult();
    next();
  } catch (error) {
    logger.warn('Could not determine user agent');
    next();
  }
};
