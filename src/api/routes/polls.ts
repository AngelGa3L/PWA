import { Router } from 'express';
import PollsController from '../controllers/PollsController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// GET /api/polls - Get all polls (público o autenticado, dependiendo de tu lógica)
router.get('/', verifyToken, verifyAuthenticated, PollsController.getAllPolls);

// GET /api/polls/stats - Get counts: total, open (active) and closed
router.get('/stats', verifyToken, verifyAuthenticated, PollsController.getPollStats);

// GET /api/polls/:id - Get poll by ID (autenticado)
router.get('/:id', verifyToken, verifyAuthenticated, PollsController.getPollById);

// POST /api/polls - Create new poll (solo admin)
router.post('/', verifyToken, PollsController.createPoll);

// PUT /api/polls/:id - Update poll (solo admin)
router.put('/:id', verifyToken, verifyAdmin, PollsController.updatePoll);

// DELETE /api/polls/:id - Delete poll (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, PollsController.deletePoll);

// GET /api/polls/:id/questions - Get questions for a poll (autenticado)
router.get('/:id/questions', verifyToken, verifyAuthenticated, PollsController.getPollQuestions);

// GET /api/polls/:id/responses - Get responses for a poll (solo admin)
router.get('/:id/responses', verifyToken, verifyAdmin, PollsController.getPollResponses);

// GET /api/polls/user/:userId - Get polls by user (solo admin)
router.get('/user/:userId', verifyToken, PollsController.getPollsByUser);

export default router;