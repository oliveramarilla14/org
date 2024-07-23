import { body, validationResult } from 'express-validator';

export const amonestationValidator = [
  body('clubId', 'el club es requerido y debe ser un int').notEmpty().isInt(),
  body('type', 'la amonestacion no corresponde con los tipos establecidos').notEmpty().isString(),
  body('playerId', 'El jugador debe ser un id').optional(),
  body('paymentId').isInt().optional(),
  body('matchesToPay').isInt().optional(),
  body('matchesPaid').isInt().optional(),
  body('observation').isString().optional(),
  body('pointsDeducted').isInt().optional(),
  (req, res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (error) {
      res.status(403).json({ errors: error.array() });
    }
  }
];
