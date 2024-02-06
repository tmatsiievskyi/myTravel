import { EMAIL_FROM, WEB_URL } from '../../configs/env';
import { logger } from '../../configs/logger';
import { AppDataSource } from '../../configs/rdbms';
import {
  MissingParamException,
  AllreadyExistsException,
  BadRequestException,
  WrongAuthTokenException,
  RecordNotFoundException,
  NotImplementedException,
  WrongCredentialsException,
} from '../../exceptions';
import { AuthTokenExpiredException } from '../../exceptions/AuthTokenExpired.exception';
import {
  ActivityType,
  IDao,
  IJwtPayload,
  NotificationType,
  ResourceType,
} from '../../interfaces';
import {
  AppError,
  TokenTypes,
  addHashCache,
  addSetCache,
  createAuthJwts,
  createEmailJwt,
  deleteHashCache,
  getPermission,
  hashPassword,
  isInSetCache,
  verifyJwt,
  verifyPassword,
} from '../../utils';
import { Email } from '../email';
import { User } from '../user';
import { Role } from '../user/role.entity';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';

export class AuthDao {
  private resource = ResourceType.AUTH;
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

      //TODO: event

      newUser.password = undefined;
      logger.info(`User with email ${user.email} just registered`);

      await this.notifyByEmail(user, NotificationType.REGISTER);

      logger.info(`User with email ${user.email} registered`);

      return user;
    } catch (error) {
      logger.error(`### ${error} ###`);
      throw new BadRequestException(error);
    }
  };

  public login = async (loginData: LoginUserDto, userAgent: object) => {
    if (!userAgent || !loginData) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started: number = Date.now();
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email: loginData.email },
      relations: ['roles'],
    });
    if (!user) throw new WrongCredentialsException();

    const isPasswordmatch = await verifyPassword(
      loginData.password,
      user.password || ''
    );
    if (!isPasswordmatch) throw new WrongCredentialsException();

    return await this.logUserIn(user, userAgent, started);
  };

  private logUserIn = async (
    user: User,
    userAgent: object,
    started: number
  ) => {
    const authJwtS = await createAuthJwts(
      { user_id: user.user_id, email: user.email, type: TokenTypes.LOGIN },
      userAgent
    );

    //TODO: event

    logger.info(`User with email ${user.email} just logged in`);

    delete user.password;

    return { user, authJwtS };
  };

  public logout = async (
    user: User,
    access_token: string,
    refresh_token: string
  ) => {
    if (!user || !access_token || !refresh_token) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started: number = Date.now();
    const isOwnerOrMember: boolean = false;
    const action = ActivityType.UPDATE;
    const permission = getPermission(
      user,
      isOwnerOrMember,
      action,
      this.resource
    );

    //TODO: permission check
    // await addSetCache('TOKEN_DENY_LIST', access_token);
    // const success = await deleteHashCache(
    //   'AUTH_REFRESH_KEY',
    //   user.user_id,
    //   refresh_token
    // );

    logger.info(`User with email ${user.email} logout`);

    return true;
    // return success;
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
        emailToken = await createEmailJwt(user.email, '1h');
        emailSubject = 'My Travel: email confirmation required';
        emailBody = `Click this link to confirm your email address with \
                      us: ${WEB_URL}/verifyEmail/${emailToken}`;
    }

    await addHashCache('AUTH_EMAIL_KEY', emailToken, {
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
  };

  public verifyToken = async (
    token: string,
    secret: string,
    userAgent: object
  ) => {
    if (!userAgent || !token) {
      const message = 'Required parameters missing';
      throw new MissingParamException(message);
    }

    const started = Date.now();
    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    if (await isInSetCache('TOKEN_DENY_LIST', token))
      throw new WrongAuthTokenException();

    try {
      const decodedJwt = await verifyJwt<IJwtPayload>(token, secret);
      if (!decodedJwt) throw new WrongAuthTokenException();

      const foundUser = await userRepo.findOne({
        where: { email: decodedJwt.email },
      });
      if (!foundUser) throw new RecordNotFoundException(decodedJwt.email);

      switch (decodedJwt.type) {
        case TokenTypes.REGISTER:
          const userRole = roleRepo.create({ role_id: 'user' });
          const user = await userRepo.save({
            ...foundUser,
            roles: [userRole],
          });
          break;
        default:
          throw new NotImplementedException(decodedJwt.type);
      }

      await addSetCache('TOKEN_DENY_LIST', token);
      await deleteHashCache('AUTH_EMAIL_KEY', token);

      return await this.logUserIn(foundUser, userAgent, started);
    } catch (error) {
      //TODO: check token etc
      // const err = new AppError(error);
      logger.error(error);
      throw new AuthTokenExpiredException();

      // if (err.message) {
      //   logger.error(`User try to verify expired token ${token}`);
      //   throw new AuthTokenExpiredException();
      // }
    }
  };
}
