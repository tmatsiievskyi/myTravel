import { Request } from 'express';

import { User } from '../services/user';

import { IURLParams } from './urlParams.interface';

export interface IRequestWithUser extends Request {
  user: User;
  startTime: number;
  userAgent: { [key: string]: any };
  searchParams?: IURLParams;
}
