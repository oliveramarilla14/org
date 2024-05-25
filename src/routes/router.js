import { Router } from 'express';
import clubRouter from './clubRouter.js';

const router = Router();

export function routerApiV1(app) {
  app.use('/api/v1', router);

  router.use('/clubs', clubRouter);
}
