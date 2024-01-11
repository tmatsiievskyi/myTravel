import { NextFunction, Router, Request, Response } from 'express';

import { IController } from '../../interfaces';

export class UserController implements IController {
  public path = '/user';
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(this.path, this.all);
  };

  private all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('All Users');
    } catch (error) {
      next(error);
    }
  };
}
