import './configs';
import { ExpressServer } from './core/ExpressServer.core';
import { validateEnv } from './utils';

validateEnv();

(async () => {
  const app = new ExpressServer();
  app.listen();
})();
