import { IURLParams } from '../../interfaces';
import { User } from '../../services/user';

declare global {
  namespace Express {
    export interface Request {
      user: User;
      startTime: number;
      userAgent: { [key: string]: any };
      searchParams?: IURLParams;
    }
  }
}
