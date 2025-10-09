import { Request, Response } from 'express';
import QuestionService from '../services/QuestionService';

export class QuestionsController {
  async getAllQuestions(req: Request, res: Response): Promise<void> {
    try {
      const questions = await QuestionService.getAllQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuestionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const question = await QuestionService.getQuestionById(parseInt(id));
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }
      res.json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const questionData = req.body;
      const newQuestion = await QuestionService.createQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const questionData = req.body;
      const updatedQuestion = await QuestionService.updateQuestion(parseInt(id), questionData);
      res.json(updatedQuestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await QuestionService.deleteQuestion(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuestionOptions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const options = await QuestionService.getQuestionOptions(parseInt(id));
      res.json(options);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuestionResponses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responses = await QuestionService.getQuestionResponses(parseInt(id));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new QuestionsController();