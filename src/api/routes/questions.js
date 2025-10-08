const express = require('express');
const router = express.Router();
const QuestionsController = require('../controllers/QuestionsController');

// GET /api/questions - Get all questions
router.get('/', QuestionsController.getAllQuestions);

// GET /api/questions/:id - Get question by ID
router.get('/:id', QuestionsController.getQuestionById);

// POST /api/questions - Create new question
router.post('/', QuestionsController.createQuestion);

// PUT /api/questions/:id - Update question
router.put('/:id', QuestionsController.updateQuestion);

// DELETE /api/questions/:id - Delete question
router.delete('/:id', QuestionsController.deleteQuestion);

// GET /api/questions/:id/options - Get options for a question
router.get('/:id/options', QuestionsController.getQuestionOptions);

// GET /api/questions/:id/responses - Get responses for a question
router.get('/:id/responses', QuestionsController.getQuestionResponses);

module.exports = router;