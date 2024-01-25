import { EMAIL_FROM, WEB_URL } from '../../configs/env';
import { logger } from '../../configs/logger';
import { AppDataSource } from '../../configs/rdbms';
import {
  MissingParamException,
  AllreadyExistsException,
  BadRequestException,
} from '../../exceptions';
import { IDao } from '../../interfaces';
import {
  TokenTypes,
  createAuthJwts,
  createEmailJwt,
  hashPassword,
  storeTokenInCache,
} from '../../utils';
import { Email } from '../email';
import { User } from '../user';
import { Role } from '../user/role.entity';
import { CreateUserDto } from '../user/user.dto';

enum NotificationType {
  PASSWORD = 'password',
  REGISTER = 'register',
  REISSUE = 'reissue',
}

export class AuthDao {
  private resource = 'auth';
  private email: Email;

  constructor() {
    this.email = new Email();
  }

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
    if (userExists) throw new AllreadyExistsException('user', userData.email);

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

      await this.notifyByEmail(user, NotificationType.REGISTER);

      // const logInData = await this.logUserIn(user, userAgent, started);

      return user;
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw new BadRequestException(error);
    }
  };

  private logUserIn = async (
    user: User,
    userAgent: object,
    started: number
  ) => {
    const jwtS = await createAuthJwts({ id: user.user_id }, userAgent);

    //TODO: event

    logger.info(`User with email ${user.email} just logged in`);

    return { user, jwtS };
  };

  private notifyByEmail = async (
    user: User,
    type: NotificationType,
    tokenType: TokenTypes = TokenTypes.REGISTER
  ) => {
    let emailBody: string;
    let emailSubject: string;
    let emailToken: string;

    switch (type) {
      case NotificationType.REGISTER:
      default:
        emailToken = await createEmailJwt(user.email, '6h');
        emailSubject = 'My Travel: email confirmation required';
        emailBody = `Click this link to confirm your email address with \
                      us: ${WEB_URL}/verify/${emailToken}`;
    }

    await storeTokenInCache(emailToken, {
      vendor: undefined,
      model: undefined,
      type: undefined,
    });

    await this.email.send({
      from: EMAIL_FROM,
      subject: emailSubject,
      text: emailBody,
      to: user.email,
    });

    logger.info(emailToken);

    // await storeTokenInCache()
  };

  private verifyToken = async (token: string, userAgent: object) => {
    if (!userAgent || !token) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started = Date.now();
    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);
  };
}
