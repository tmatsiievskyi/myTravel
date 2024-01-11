import { NextFunction, Request, Response } from 'express';

import { logger } from '../configs/logger';
import { HttpException } from '../exceptions';
import { Formatter } from '../utils';

const fmt: Formatter = new Formatter();

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message;

  logger.warn(message);
  res
    .status(status)
    .send(fmt.formatResp(new HttpException(status, message), 0, message));
};
