import './configs';
import { logger } from './configs/logger';
import { AppDataSource } from './configs/rdbms';
import { ExpressServer } from './core/ExpressServer.core';
import { validateEnv } from './utils';

validateEnv();

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info('DB ready');
  } catch (error) {
    logger.info('DB Error', error);
  }

  const app = new ExpressServer();
  app.listen();
})();
