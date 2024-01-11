import EventEmitter from 'events';

import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application, Response, NextFunction, Request } from 'express';
import helmet from 'helmet';
import nocache from 'nocache';

import { PORT } from '../configs/env';
import { logger } from '../configs/logger';
import { IController, IRequestWithUser } from '../interfaces';
import { errorMiddleware } from '../middlewares';

export class ExpressServer extends EventEmitter {
  public app: Application;

  constructor(controllers: IController[]) {
    super();

    this.app = express();

    this.initSecurity();
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  private initControllers = (controllers: IController[]) => {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  };

  private initSecurity = () => {
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
    this.app.use(nocache());
  };

  private initMiddlewares = () => {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(compression());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.startTime = Date.now();
      next();
    });
  };

  private initErrorHandling = () => {
    this.app.use(errorMiddleware);
  };

  public listen() {
    this.app.listen(PORT, () => {
      logger.info(`App listening on the port ${PORT}`);
    });
  }
}
