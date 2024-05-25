import { Router } from 'express';
import { clubPositions, createClub, deleteClub, getClub, getClubs, updateClub } from '../controllers/clubController.js';

const router = Router();

router.get('/', getClubs);
router.get('/positions', clubPositions);
router.post('/', createClub);
router.get('/:id', getClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

export default router;
