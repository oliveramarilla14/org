import { Router } from 'express';
import { clubPositions, createClub, deleteClub, getClub, getClubs, updateClub } from '../controllers/clubController.js';
import { clubsValidator } from '../validations/clubsValidator.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.get('/', getClubs);
router.get('/positions', clubPositions);
router.post('/', upload.single('badge'), clubsValidator, createClub);
router.get('/:id', getClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

export default router;
