import { Router } from 'express';
import { createPlayer, playerStats, deletePlayer } from '../controllers/playerController.js';
const router = Router();

router.get('/stats', playerStats);
router.post('/create', createPlayer);
router.delete('/:id', deletePlayer);

export default router;
