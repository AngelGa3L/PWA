import { Router } from 'express';
import ResponsesController from '../controllers/ResponsesController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// GET /api/responses - Get all responses (solo admin)
router.get('/', verifyToken, verifyAdmin, ResponsesController.getAllResponses);

// GET /api/responses/:id - Get response by ID (autenticado)
router.get('/:id', verifyToken, verifyAuthenticated, ResponsesController.getResponseById);

// POST /api/responses - Create new response (cualquier usuario autenticado)
router.post('/', verifyToken, verifyAuthenticated, ResponsesController.createResponse);

// PUT /api/responses/:id - Update response (autenticado)
router.put('/:id', verifyToken, verifyAuthenticated, ResponsesController.updateResponse);

// DELETE /api/responses/:id - Delete response (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, ResponsesController.deleteResponse);

// GET /api/responses/poll/:pollId - Get responses by poll (solo admin)
router.get('/poll/:pollId', verifyToken, verifyAdmin, ResponsesController.getResponsesByPoll);

// GET /api/responses/user/:userId - Get responses by user (autenticado)
router.get('/user/:userId', verifyToken, verifyAuthenticated, ResponsesController.getResponsesByUser);

export default router;