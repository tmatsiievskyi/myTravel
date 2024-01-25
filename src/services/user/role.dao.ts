import { NextFunction, Response } from 'express';

import { logger } from '../../configs/logger';
import { AppDataSource } from '../../configs/rdbms';
import {
  AllreadyExistsException,
  BadRequestException,
  MissingParamException,
  RecordNotFoundException,
} from '../../exceptions';
import { IDao, ISerchResult } from '../../interfaces';

import { AddRemovePermissionDto, CreatePermissionDto } from './permission.dto';
import { Permission } from './permission.entity';
import { CreateRoleDto } from './role.dto';
import { Role } from './role.entity';
import { User } from './user.entity';

export class RoleDao implements IDao {
  private resource: string = 'role';
  private rolePermissionResource: string = 'rolepermission';

  constructor() {}

  public getAll = async (
    user: User,
    params?: { [key: string]: any } | undefined
  ): Promise<ISerchResult> => {
    // if (!user) {
    //   const message = 'Required parameters missing';
    //   throw new MissingParamException(message);
    // }

    const started = Date.now();
    const roleRepo = AppDataSource.getRepository(Role);

    const roles = await roleRepo.find();

    return {
      data: roles,
      length: roles.length,
      total: roles.length,
    };
  };

  public create = async (user: User, data: CreateRoleDto) => {
    if (!data) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const roleRepo = AppDataSource.getRepository(Role);

    if (
      await roleRepo.findOne({
        where: { role_id: data.role_id, archived: false },
      })
    ) {
      throw new AllreadyExistsException('Role', data.role_id);
    }

    try {
      const newData = roleRepo.create(data);
      const saveData = await roleRepo.save(newData);

      logger.info(
        `Saved ${this.resource} with ID ${saveData.role_id} in the database`
      );
      return saveData;
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw error;
    }
  };

  public createPermission = async (user: User, data: CreatePermissionDto) => {
    if (!data) {
      const message: string = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const permissionRepo = AppDataSource.getRepository(Permission);

    if (await permissionRepo.findOne({ where: { ...data } })) {
      throw new AllreadyExistsException(
        'Permission',
        data.resource + ' ' + data.action
      );
    }

    try {
      const newData = permissionRepo.create(data);
      const savedData = await permissionRepo.save(newData);
      return savedData;
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw error;
    }
  };

  public addPermission = async (
    user: User,
    role_id: string,
    data: AddRemovePermissionDto
  ) => {
    if (!data || !role_id) {
      const message: string = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started = Date.now();
    const roleRepo = AppDataSource.getRepository(Role);

    try {
      const roleToUpd = await roleRepo.findOne({
        where: { role_id },
        relations: ['permissions'],
      });
      if (!roleToUpd) throw new RecordNotFoundException(role_id);
      await roleRepo
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(roleToUpd)
        .addAndRemove(data.permissions, roleToUpd.permissions);
      return { message: 'ok' };
    } catch (error) {
      throw error;
    }
  };

  public removePermission = async (
    user: User,
    role_id: string,
    data: AddRemovePermissionDto
  ) => {
    if (!data || !role_id) {
      const message: string = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started = Date.now();
    const roleRepo = AppDataSource.getRepository(Role);

    try {
      const roleToUpd = await roleRepo.findOne({
        where: { role_id },
        relations: ['permissions'],
      });
      if (!roleToUpd) throw new RecordNotFoundException(role_id);
      await roleRepo
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of({ role_id })
        .remove(data.permissions);
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw error;
    }

    return { message: 'ok' };
  };

  public deletePermission = async (user: User, permission_id: string) => {
    if (!permission_id) {
      const message: string = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const permissionRepo = AppDataSource.getRepository(Permission);

    try {
      const permissionToDelete = await permissionRepo.findOne({
        where: { permission_id },
      });
      if (!permissionToDelete) throw new RecordNotFoundException(permission_id);

      const resp = await permissionRepo
        .createQueryBuilder()
        .delete()
        .from(Permission)
        .where('permission_id = :permission_id', { permission_id })
        .execute();
      if (resp.affected && resp.affected > 0) {
        return { message: 'ok' };
      } else {
        throw new BadRequestException(resp);
      }
    } catch (error) {
      throw error;
    }
  };
}
