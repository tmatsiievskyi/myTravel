import { logger } from '../../configs/logger';
import { AppDataSource } from '../../configs/rdbms';
import {
  MissingParamException,
  AllreadyExistsException,
  BadRequestException,
} from '../../exceptions';
import { IDao } from '../../interfaces';
import { hashPassword } from '../../utils';
import { User } from '../user';
import { Role } from '../user/role.entity';
import { CreateUserDto } from '../user/user.dto';

export class AuthDao {
  private resource = 'auth';

  constructor() {}

  public register = async (userData: CreateUserDto, userAgent: object) => {
    if (!userAgent || !userData) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started: number = Date.now();
    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    const userExists = await userRepo.findOne({
      where: { email: userData.email, archived: false },
    });
    if (userExists) {
      throw new AllreadyExistsException('user', userData.email);
    }

    logger.info(userData);

    try {
      const hashedPassword = await hashPassword(userData.password);
      const guestRole = roleRepo.create({ role_id: 'guest' });
      const user = userRepo.create({
        ...userData,
        password: hashedPassword,
        roles: [guestRole],
      });

      const newUser = await userRepo.save(user);

      newUser.password = undefined;
      logger.info(`User with email ${user.email} just registered`);

      return user;
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw new BadRequestException(error);
    }
  };
}
