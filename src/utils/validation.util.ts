import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { cleanEnv, port, str } from 'envalid';

import { HttpException } from '../exceptions';

export const validateDto = async (
  type: any,
  data: any,
  skipMissingProperties = false
): Promise<boolean | HttpException> => {
  const errors: ValidationError[] = await validate(plainToClass(type, data), {
    skipMissingProperties,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const message = errors
      .map((error: ValidationError) => {
        return error.constraints
          ? Object.values(error.constraints).join(', ')
          : null;
      })
      .join('. ');

    throw new HttpException(400, message);
  } else {
    return true;
  }
};

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    POSTGRES_DB: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    NODE_ENV: str(),
    ACCESS_TOKEN_PUBLIC_KEY: str(),
    REFRESH_TOKEN_PUBLIC_KEY: str(),
    ACCESS_TOKEN_EXPIRES: str(),
    REFRESH_TOKEN_EXPIRES: str(),
  });
};
