import { Router } from 'express';
import {
  clubPositions,
  createClub,
  deleteClub,
  getClub,
  getClubs,
  getClubsPlayers,
  updateClub
} from '../controllers/clubController.js';
import { clubsValidator } from '../validations/clubsValidator.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.get('/', getClubs);
router.get('/players', getClubsPlayers);
router.get('/positions', clubPositions);
router.post('/', upload.single('badge'), clubsValidator, createClub);
router.get('/:id', getClub);
router.put('/:id', upload.single('badge'), updateClub);
router.delete('/:id', deleteClub);

export default router;
