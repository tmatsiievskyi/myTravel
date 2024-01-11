import './configs';
import { logger } from './configs/logger';
import { AppDataSource } from './configs/rdbms';
import { ExpressServer } from './core/ExpressServer.core';
import { ControllersArr } from './services';
import { validateEnv } from './utils';

validateEnv();

process.on('uncaughtException', (e) => {
  logger.error(e);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  logger.error(e);
  process.exit(1);
});

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info('DB ready');
  } catch (error) {
    logger.info('DB Error', error);
  }

  const app = new ExpressServer(
    ControllersArr.map((Controller) => new Controller())
  );
  app.listen();
})();
