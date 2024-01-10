import EventEmitter from 'events';

import express, { Application } from 'express';

import { PORT } from '../configs/env';
import { logger } from '../configs/logger';
import { IController } from '../interfaces';

export class ExpressServer extends EventEmitter {
  public app: Application;

  constructor() {
    // controllers: IController[]
    super();

    this.app = express();
  }

  public listen() {
    this.app.listen(PORT, () => {
      logger.info(`App listening on the port ${PORT}`);
    });
  }
}
