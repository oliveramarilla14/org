import { Router } from 'express';
import { clubPositions, createClub, deleteClub, getClub, getClubs, updateClub } from '../controllers/clubController.js';
import { clubsValidator } from '../validations/clubsValidator.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/${file.fieldname}/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});
const router = Router();

const upload = multer({ storage });

router.get('/', getClubs);
router.get('/positions', clubPositions);
router.post('/', upload.single('badge'), clubsValidator, createClub);
router.get('/:id', getClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

export default router;
