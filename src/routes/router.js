import { Router } from 'express';
import { app } from '../server.js';
import clubRouter from './clubRouter.js';

const router = Router();

router.use('/', () => {
  app.use('/clubs', clubRouter);
});

export default router;

Arr;
