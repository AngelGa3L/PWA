import { Router } from 'express';
import OptionsController from '../controllers/OptionsController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// GET /api/options - Get all options (autenticado)
router.get('/', verifyToken, verifyAuthenticated, OptionsController.getAllOptions);

// GET /api/options/:id - Get option by ID (autenticado)
router.get('/:id', verifyToken, verifyAuthenticated, OptionsController.getOptionById);

// POST /api/options - Create new option (solo admin)
router.post('/', verifyToken, verifyAdmin, OptionsController.createOption);

// PUT /api/options/:id - Update option (solo admin)
router.put('/:id', verifyToken, verifyAdmin, OptionsController.updateOption);

// DELETE /api/options/:id - Delete option (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, OptionsController.deleteOption);

// GET /api/options/:id/responses - Get responses for an option (solo admin)
router.get('/:id/responses', verifyToken, verifyAdmin, OptionsController.getOptionResponses);

export default router;