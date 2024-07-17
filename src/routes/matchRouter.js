import { Router } from 'express';
import {
  createMatch,
  deleteMatch,
  editMatch,
  finishMatch,
  getMatch,
  getMatches
} from '../controllers/matchController.js';
import { matchValidator } from '../validations/matchValidator.js';
import { deleteFixture, generateFixture, getFecha } from '../controllers/fixtureController.js';

const router = Router();

router
  .post('/fixture/generate', generateFixture)
  .get('/fixture/:fecha', getFecha)
  .delete('/fixture', deleteFixture)
  .get('/', getMatches)
  .get('/:id', getMatch)
  .post('/', matchValidator, createMatch)
  .post('/finish', finishMatch)
  .put('/:id', matchValidator, editMatch)
  .delete('/:id', deleteMatch);

export default router;
