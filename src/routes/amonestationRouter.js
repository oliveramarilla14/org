import { Router } from 'express';
import {
  cancelPayAmonestation,
  createAmonestation,
  deleteAmonestation,
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
router.delete('/:id', deleteAmonestation);
router.post('/pay/:id', payAmonestation);
router.delete('/pay/:id', cancelPayAmonestation);

export default router;
