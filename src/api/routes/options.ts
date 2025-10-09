import { Router } from 'express';
import OptionsController from '../controllers/OptionsController';

const router = Router();

// GET /api/options - Get all options
router.get('/', OptionsController.getAllOptions);

// GET /api/options/:id - Get option by ID
router.get('/:id', OptionsController.getOptionById);

// POST /api/options - Create new option
router.post('/', OptionsController.createOption);

// PUT /api/options/:id - Update option
router.put('/:id', OptionsController.updateOption);

// DELETE /api/options/:id - Delete option
router.delete('/:id', OptionsController.deleteOption);

// GET /api/options/:id/responses - Get responses for an option
router.get('/:id/responses', OptionsController.getOptionResponses);

export default router;