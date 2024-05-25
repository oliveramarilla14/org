import { Router } from 'express';
import { createClub, deleteClub, getClub, getClubs, updateClub } from '../controllers/clubController.js';

const router = Router();

router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/', createClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

export default router;
