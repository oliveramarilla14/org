import { Router } from 'express';
import { createMatch, deleteMatch, editMatch, getMatch, getMatches } from '../controllers/matchController.js';
import { matchValidator } from '../validations/matchValidator.js';

const router = Router();

router
  .get('fixture')
  .get('/', getMatches)
  .get('/:id', getMatch)
  .post('/', matchValidator, createMatch)
  .put('/:id', matchValidator, editMatch)
  .delete('/:id', deleteMatch);

export default router;
