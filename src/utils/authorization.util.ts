import { logger } from '../configs/logger';
import { AppDataSource } from '../configs/rdbms';
import { User } from '../services/user';
import { Role } from '../services/user/role.entity';

import {
  addSetCache,
  addStringCache,
  getAllSetCache,
  getStringCache,
} from './cache.util';

export const getPermission = async (
  user: User,
  isOwnerOrMember: boolean,
  action: string,
  resource: string
) => {
  const started = Date.now();
  const rolesWithPermissions = await getRolesWithPermission();
  const userRoles = await getUserRoles(user.user_id);
};

const getRolesWithPermission = async () => {
  let rolesWithPermissions = null;
  const rolesFromCache = await getRolesFromCache();

  const started = Date.now();

  if (!rolesFromCache) {
    const rolesFromDB = await getRolesFromDB();
    rolesWithPermissions = rolesFromDB;
    // logger.info({ rolesFromDB, take: Date.now() - started });
    // refreshRolesInCache(rolesFromDB);
  } else {
    const parsedRoles = JSON.parse(rolesFromCache);
    // logger.info({ rolesFromCache: parsedRoles, take: Date.now() - started });
    rolesWithPermissions = parsedRoles;
  }

  return rolesWithPermissions;
};

const getRolesFromDB = async () => {
  try {
    const roleRepo = AppDataSource.getRepository(Role);
    const rolesFromDB = await roleRepo.find({
      relations: ['permissions'],
    });
    return rolesFromDB;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const getRolesFromCache = async () => {
  return await getStringCache('ROLES_WITH_PERMISSIONS');
};

export const refreshRolesInCache = async (newRoles?: Role[] | null) => {
  if (newRoles) {
    return await addStringCache(
      'ROLES_WITH_PERMISSIONS',
      JSON.stringify(newRoles)
    );
  }

  const rolesFromDB = await getRolesFromDB();

  return await addStringCache(
    'ROLES_WITH_PERMISSIONS',
    JSON.stringify(rolesFromDB)
  );
};

const getUserRoles = async (userId: string) => {
  let userRoles = null;
  const userRolesFromCache = await getUserRolesFromCache(userId);

  if (!userRolesFromCache) {
    const userRolesFromDB = await getUserRolesFromDB(userId);
    userRoles = userRolesFromDB;
    // refreshUserRolesInCache(userId);
    logger.info({ userRolesFromDB });
  } else {
    const parsedUserRoles = JSON.parse(userRolesFromCache) as Role[];
    logger.info({ userRolesFromCache: parsedUserRoles });
  }

  return userRoles;
};

const getUserRolesFromDB = async (userId: string) => {
  try {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOne({
      where: { user_id: userId },
      relations: ['roles'],
    });
    return foundUser?.roles ? foundUser.roles : null;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const getUserRolesFromCache = async (userId: string) => {
  return await getStringCache('USER_ROLES_LIST', userId);
};

export const refreshUserRolesInCache = async (
  userId: string,
  newRoles?: Role[] | null
) => {
  try {
    if (newRoles) {
      return await addStringCache(
        'USER_ROLES_LIST',
        JSON.stringify(newRoles),
        userId
      );
    }

    const userRolesFromDB = await getUserRolesFromDB(userId);

    return await addStringCache(
      'USER_ROLES_LIST',
      JSON.stringify(userRolesFromDB),
      userId
    );
  } catch (error) {
    logger.error(error);
    return false;
  }
};
