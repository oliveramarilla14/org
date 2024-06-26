import { Router } from 'express';
import { createMatch, deleteMatch, editMatch, getMatch, getMatches } from '../controllers/matchController.js';
import { matchValidator } from '../validations/matchValidator.js';
import { generateFixture, getFecha } from '../controllers/fixtureController.js';

const router = Router();

router
  .post('/fixture/generate', generateFixture)
  .get('/fixture/:fecha', getFecha)
  .get('/', getMatches)
  .get('/:id', getMatch)
  .post('/', matchValidator, createMatch)
  .put('/:id', matchValidator, editMatch)
  .delete('/:id', deleteMatch);

export default router;
