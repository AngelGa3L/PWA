import { Router } from 'express';
import QuestionsController from '../controllers/QuestionsController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// GET /api/questions - Get all questions (autenticado)
router.get('/', verifyToken, verifyAuthenticated, QuestionsController.getAllQuestions);

// GET /api/questions/:id - Get question by ID (autenticado)
router.get('/:id', verifyToken, verifyAuthenticated, QuestionsController.getQuestionById);

// POST /api/questions - Create new question (solo admin)
router.post('/', verifyToken, verifyAdmin, QuestionsController.createQuestion);

// PUT /api/questions/:id - Update question (solo admin)
router.put('/:id', verifyToken, verifyAdmin, QuestionsController.updateQuestion);

// DELETE /api/questions/:id - Delete question (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, QuestionsController.deleteQuestion);

// GET /api/questions/:id/options - Get options for a question (autenticado)
router.get('/:id/options', verifyToken, verifyAuthenticated, QuestionsController.getQuestionOptions);

// GET /api/questions/:id/responses - Get responses for a question (solo admin)
router.get('/:id/responses', verifyToken, verifyAdmin, QuestionsController.getQuestionResponses);

export default router;