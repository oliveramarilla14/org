import { Router } from 'express';
import {
  cancelPayCuota,
  createCuota,
  createMulta,
  deleteMulta,
  editMulta,
  getCuotas,
  getMultas,
  payCuota
} from '../controllers/paymentController.js';
import { CuotaValidator, multaValidator } from '../validations/paymentValidation.js';

export const router = Router();

router.get('/cuotas', getCuotas);
router.post('/cuotas', CuotaValidator, createCuota); //crear cuota
router.post('/cuotas/:id/pay', payCuota);
router.delete('/cuotas/:id/pay', cancelPayCuota);

router.get('/multas', getMultas);
router.post('/multas', multaValidator, createMulta);
router.put('/multas/:id', multaValidator, editMulta);
router.delete('/multas/:id', deleteMulta);
router.post('/multas/:id/pay');
router.delete('/multas/:id/pay');

export default router;
