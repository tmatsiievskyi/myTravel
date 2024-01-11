import { Router, Request, Response, NextFunction } from 'express';

import { IController } from '../../interfaces';

export class RoleController implements IController {
  public path = '/role';
  public router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(this.path, this.all);
  };

  private all = async (req: Request, res: Response, next: NextFunction) => {
    res.send('All Routes');
  };
}
