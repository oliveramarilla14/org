import { Router } from 'express';
import { cancelPayCuota, createCuota, getCuotas, payCuota } from '../controllers/paymentController.js';

export const router = Router();

router.get('/cuotas', getCuotas);
router.post('/cuotas', createCuota); //crear cuota
router.post('/cuotas/:id/pay', payCuota);
router.delete('/cuotas/:id/pay', cancelPayCuota);

router.get('/multas');
router.post('/multas');
router.put('/multas/:id');
router.delete('/multas/:id');
router.post('/multas/:id/pay');
router.delete('/multas/:id/pay');

export default router;
