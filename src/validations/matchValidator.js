import { body, validationResult } from 'express-validator';

export const matchValidator = [
  body('firstTeamId', 'Por favor escoga ambos clubes').notEmpty().isInt(),
  body('secondTeamId', 'Por favor escoga ambos clubes').notEmpty().isInt(),
  body('fecha', 'El partido debe pertenecer a una fecha').notEmpty().isInt(),
  body('secondTeamId').custom((value, { req }) => {
    if (value == req.body.firstTeamId) {
      throw new Error('Los equipos no pueden ser iguales');
    }
    return true;
  }),
  (req, res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (error) {
      res.status(403).json({ errors: error.array() });
    }
  }
];
