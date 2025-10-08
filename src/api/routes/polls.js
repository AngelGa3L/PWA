const express = require('express');
const router = express.Router();
const PollsController = require('../controllers/PollsController');

// GET /api/polls - Get all polls
router.get('/', PollsController.getAllPolls);

// GET /api/polls/:id - Get poll by ID
router.get('/:id', PollsController.getPollById);

// POST /api/polls - Create new poll
router.post('/', PollsController.createPoll);

// PUT /api/polls/:id - Update poll
router.put('/:id', PollsController.updatePoll);

// DELETE /api/polls/:id - Delete poll
router.delete('/:id', PollsController.deletePoll);

// GET /api/polls/:id/questions - Get questions for a poll
router.get('/:id/questions', PollsController.getPollQuestions);

// GET /api/polls/:id/responses - Get responses for a poll
router.get('/:id/responses', PollsController.getPollResponses);

// GET /api/polls/user/:userId - Get polls by user
router.get('/user/:userId', PollsController.getPollsByUser);

module.exports = router;