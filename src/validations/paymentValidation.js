import { body, validationResult } from 'express-validator';

export const CuotaValidator = [
  body('ClubId', 'El club es requerido y debe ser un id').notEmpty().isInt(),
  body('playerId', 'El jugador es requerido para la cuota').notEmpty().isInt(),
  body('month', 'elija un mes a generar').notEmpty().isString(),
  (req, res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (error) {
      res.status(403).json({ errors: error.array() });
    }
  }
];

export const multaValidator = [
  body('clubId', 'El club es requerido y debe ser un id').notEmpty().isInt(),
  body('playerId', 'El jugador debe ser un id'),
  body('type').notEmpty().isString(),
  body('price').notEmpty().isInt(),
  body('deadline').notEmpty().isString(),
  (req, res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (error) {
      res.status(403).json({ errors: error.array() });
    }
  }
];
