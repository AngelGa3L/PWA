import { Router } from 'express';
import ResponsesController from '../controllers/ResponsesController';

const router = Router();

// GET /api/responses - Get all responses
router.get('/', ResponsesController.getAllResponses);

// GET /api/responses/:id - Get response by ID
router.get('/:id', ResponsesController.getResponseById);

// POST /api/responses - Create new response
router.post('/', ResponsesController.createResponse);

// PUT /api/responses/:id - Update response
router.put('/:id', ResponsesController.updateResponse);

// DELETE /api/responses/:id - Delete response
router.delete('/:id', ResponsesController.deleteResponse);

// GET /api/responses/poll/:pollId - Get responses by poll
router.get('/poll/:pollId', ResponsesController.getResponsesByPoll);

// GET /api/responses/user/:userId - Get responses by user
router.get('/user/:userId', ResponsesController.getResponsesByUser);

export default router;