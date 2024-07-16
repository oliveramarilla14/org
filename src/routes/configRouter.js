import { Router } from 'express';
import { editConfig, getConfig, modifyConfig } from '../controllers/configController.js';

const router = Router();

router.get('/', getConfig);
router.post('/', modifyConfig);
router.put('/', editConfig);

export default router;
