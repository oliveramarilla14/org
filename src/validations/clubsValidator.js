import { body, validationResult } from 'express-validator';

export const clubsValidator = [
  body('name', 'El club es requerido y debe ser un string').notEmpty().isString(),
  body('payment')
    .isString()
    .custom((value) => value === 'true' || value === 'false')
    .withMessage('El valor de payment debe ser "true" o "false"')
    .optional(),

  (req, res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (error) {
      res.status(403).json(error.array());
    }
  }
];
