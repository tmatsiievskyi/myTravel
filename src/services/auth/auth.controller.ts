import { Router, Response, NextFunction, Request } from 'express';

import { APP_SECRET } from '../../configs/env';
import { logger } from '../../configs/logger';
import { IController, IRequestWithUser } from '../../interfaces';
import {
  addUserAgent,
  authenticationMiddleware,
  validationMiddleware,
} from '../../middlewares';
import { Formatter } from '../../utils';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';

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
    this.router.post(
      `${this.path}/sign-in`,
      validationMiddleware(LoginUserDto),
      addUserAgent,
      this.signIn
    );
    this.router.post(
      `${this.path}/sign-out`,
      authenticationMiddleware,
      this.signOut
    );
    this.router.post(
      `${this.path}/verifyEmail/:token`,
      addUserAgent,
      this.verifyEmail
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

  private signIn = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const userData: LoginUserDto = req.body;

    try {
      const { user, authJwtS } = await this.authDao.login(
        userData,
        req.userAgent
      );
      res.cookie(
        'access_token',
        authJwtS.access.token,
        authJwtS.access.options
      );
      res.cookie(
        'refresh_token',
        authJwtS.refresh.token,
        authJwtS.refresh.options
      );
      res.cookie('logged_in', true, authJwtS.access.options);
      res.send(this.fmt.formatResp(user, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  private signOut = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.authDao.logout(
        req.user,
        req.cookies.access_token,
        req.cookies.refresh_token
      );
      res.cookie('logged_in', false);
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  private verifyEmail = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.params.token;
    logger.info(token);

    try {
      const data = await this.authDao.verifyToken(
        token,
        APP_SECRET,
        req.userAgent
      );
      const { user, authJwtS } = data;
      res.cookie(
        'access_token',
        authJwtS.access.token,
        authJwtS.access.options
      );
      res.cookie(
        'refresh_token',
        authJwtS.refresh.token,
        authJwtS.refresh.options
      );
      res.cookie('logged_in', true, authJwtS.access.options);
      res.send(
        this.fmt.formatResp(data.user, Date.now() - req.startTime, 'OK')
      );
    } catch (error) {
      next(error);
    }
  };
}
