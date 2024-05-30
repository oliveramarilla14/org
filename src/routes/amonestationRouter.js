import { Router } from 'express';
import {
  createAmonestation,
  editAmonestation,
  getAmonestation,
  getAmonestations,
  payAmonestation
} from '../controllers/amonestationController.js';
import { amonestationValidator } from '../validations/amonestationValidator.js';
const router = Router();

router.get('/', getAmonestations);
router.post('/', amonestationValidator, createAmonestation);
router.get('/:id', getAmonestation);
router.put('/:id', amonestationValidator, editAmonestation);
router.post('/pay/:id', payAmonestation);

export default router;
