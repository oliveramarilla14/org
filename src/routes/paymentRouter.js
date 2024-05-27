import { Router } from 'express';
import { cancelPayCuota, getCuotas, payCuota } from '../controllers/paymentController.js';

export const router = Router();

router.get('/cuotas', getCuotas);
router.post('/cuotas/:id/pay', payCuota);
router.delete('/cuotas/:id/pay', cancelPayCuota);

export default router;
