import { Router } from 'express';
import { createAmonestation, getAmonestations, payAmonestation } from '../controllers/amonestationController.js';
import { amonestationValidator } from '../validations/amonestationValidator.js';
const router = Router();

router.get('/', getAmonestations);
router.post('/', amonestationValidator, createAmonestation);
router.post('/pay/:id', amonestationValidator, payAmonestation);

export default router;
