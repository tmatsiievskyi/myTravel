import { cleanEnv, port } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
  });
};
