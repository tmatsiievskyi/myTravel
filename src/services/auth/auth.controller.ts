import { Router, Response, NextFunction, Request } from 'express';

import { IController, IRequestWithUser } from '../../interfaces';
import { addUserAgent, validationMiddleware } from '../../middlewares';
import { Formatter } from '../../utils';
import { CreateUserDto } from '../user/user.dto';

import { AuthDao } from './auth.dao';

export class AuthController implements IController {
  public path: string = '/auth';
  public router: Router = Router();

  private fmt = new Formatter();
  private authDao: AuthDao = new AuthDao();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(`${this.path}/health`, this.healthCheck);
    this.router.post(
      `${this.path}/sign-up`,
      validationMiddleware(CreateUserDto),
      addUserAgent,
      this.signUp
    );
  };

  private healthCheck = (req: Request, res: Response, next: NextFunction) => {
    res.send('Ok');
  };

  private signUp = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = req.body;

    try {
      const data = await this.authDao.register(userData, req.userAgent);
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
