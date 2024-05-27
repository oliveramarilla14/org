import { Router } from 'express';
import clubRouter from './clubRouter.js';
import playerRouter from './playerRouter.js';
import paymentRouter from './paymentRouter.js';

const router = Router();

export function routerApiV1(app) {
  app.use('/api/v1', router);

  router.use('/clubs', clubRouter);
  router.use('/players', playerRouter);
  router.use('/payments', paymentRouter);
}
