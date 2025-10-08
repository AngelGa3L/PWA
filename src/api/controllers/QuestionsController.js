const QuestionService = require('../services/QuestionService');

class QuestionsController {
  async getAllQuestions(req, res) {
    try {
      const questions = await QuestionService.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuestionById(req, res) {
    try {
      const { id } = req.params;
      const question = await QuestionService.getQuestionById(parseInt(id));
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createQuestion(req, res) {
    try {
      const questionData = req.body;
      const newQuestion = await QuestionService.createQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const questionData = req.body;
      const updatedQuestion = await QuestionService.updateQuestion(parseInt(id), questionData);
      res.json(updatedQuestion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      await QuestionService.deleteQuestion(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuestionOptions(req, res) {
    try {
      const { id } = req.params;
      const options = await QuestionService.getQuestionOptions(parseInt(id));
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuestionResponses(req, res) {
    try {
      const { id } = req.params;
      const responses = await QuestionService.getQuestionResponses(parseInt(id));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QuestionsController();