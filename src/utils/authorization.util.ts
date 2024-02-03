import { logger } from '../configs/logger';
import { AppDataSource } from '../configs/rdbms';
import { User } from '../services/user';
import { Role } from '../services/user/role.entity';

const createGrantListFromDatabse = () => {
  logger.info('Create a new grant list from db');
  const grantList: Array<Record<string, any>> = [];
  const roleRepo = AppDataSource.getRepository<Role>;
};

const getPermission = async (
  user: User,
  isOwnerOrMember: boolean,
  action: string,
  resource: string
) => {};
