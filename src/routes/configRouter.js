import { Router } from 'express';
import { createConfig, editConfig, getConfig } from '../controllers/configController.js';

const router = Router();

router.get('/', getConfig);
router.post('/', createConfig);
router.put('/', editConfig);

export default router;
