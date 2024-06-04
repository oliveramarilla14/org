import { Router } from 'express';
import clubRouter from './clubRouter.js';
import playerRouter from './playerRouter.js';
import paymentRouter from './paymentRouter.js';
import amonestationRouter from './amonestationRouter.js';
import configRouter from './configRouter.js';
import matchRouter from './matchRouter.js';

const router = Router();

export function routerApiV1(app) {
  app.use('/api/v1', router);

  router.use('/clubs', clubRouter);
  router.use('/players', playerRouter);
  router.use('/payments', paymentRouter);
  router.use('/amonestations', amonestationRouter);
  router.use('/config', configRouter);
  router.use('/matches', matchRouter);
}
