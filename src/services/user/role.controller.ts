import { Router, Request, Response, NextFunction } from 'express';

import { IController, IRequestWithUser } from '../../interfaces';
import { validationMiddleware } from '../../middlewares';
import { Formatter } from '../../utils';

import { AddRemovePermissionDto, CreatePermissionDto } from './permission.dto';
import { RoleDao } from './role.dao';
import { CreateRoleDto } from './role.dto';

export class RoleController implements IController {
  public path = '/role';
  public router: Router = Router();

  private roleDao: RoleDao = new RoleDao();
  private fmt = new Formatter();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(this.path, this.all);
    this.router.post(
      this.path,
      validationMiddleware(CreateRoleDto),
      this.createRole
    );
    this.router.post(
      `${this.path}/create-permission`,
      validationMiddleware(CreatePermissionDto),
      this.createPermission
    );
    this.router.post(
      `${this.path}/:role_id/add-permission`,
      validationMiddleware(AddRemovePermissionDto),
      this.addPermission
    );

    this.router.post(
      `${this.path}/:role_id/remove-permission`,
      validationMiddleware(AddRemovePermissionDto),
      this.removePermissionRelation
    );

    this.router.delete(
      `${this.path}/delete-permission/:permission_id`,
      this.deletePermission
    );
  };

  private all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, total } = await this.roleDao.getAll(
        req.user,
        req.searchParams
      );
      res.send(data);
    } catch (error) {
      next(error);
    }
  };

  private createRole = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newRecord: CreateRoleDto = req.body;
      const data = await this.roleDao.create(req.user, newRecord);
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  // --Permission--
  private createPermission = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const newRecord: CreatePermissionDto = req.body;
    try {
      const data = await this.roleDao.createPermission(req.user, newRecord);
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  private addPermission = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const { role_id } = req.params;
    const newRecord: AddRemovePermissionDto = req.body;

    try {
      const data = await this.roleDao.addPermission(
        req.user,
        role_id,
        newRecord
      );
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  private removePermissionRelation = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const { role_id } = req.params;
    const newRecord: AddRemovePermissionDto = req.body;

    try {
      const data = await this.roleDao.removePermission(
        req.user,
        role_id,
        newRecord
      );
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };

  private deletePermission = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const { permission_id } = req.params;
    try {
      const data = await this.roleDao.deletePermission(req.user, permission_id);
      res.send(this.fmt.formatResp(data, Date.now() - req.startTime, 'OK'));
    } catch (error) {
      next(error);
    }
  };
}
