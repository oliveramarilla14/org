import { Router } from 'express';
import { playerStats } from '../controllers/playerController.js';
const router = Router();

router.get('/stats', playerStats);

export default router;
