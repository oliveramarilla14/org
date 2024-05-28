import { body } from 'express-validator';

export const amonestationValidator = [
  body('clubId').notEmpty().isInt().withMessage('el club es requerido'),
  body('type').notEmpty().isString().withMessage('seleccione el tipo de amonestacion'),
  body('playerId').isInt().optional(),
  body('paymentId').isInt().optional(),
  body('matchesToPay').isInt().optional(),
  body('matchesPaid').isInt().optional(),
  body('observation').isString().optional(),
  body('pointsDeducted').isString().optional()
];
