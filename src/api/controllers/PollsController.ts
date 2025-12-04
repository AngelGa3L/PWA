import { Request, Response } from 'express';
import PollService from '../services/PollService';

export class PollsController {
  async getAllPolls(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.user?.id;
      
      // Si hay usuario autenticado, devolver con estado de respuestas
      if (userId) {
        const polls = await PollService.getPollsForUser(userId);
        res.json(polls);
      } else {
        const polls = await PollService.getAllPolls();
        res.json(polls);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const poll = await PollService.getPollById(parseInt(id));
      if (!poll) {
        res.status(404).json({ error: 'Poll not found' });
        return;
      }
      res.json(poll);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPoll(req: Request, res: Response): Promise<void> {
    try {
      const pollData = req.body;
      const newPoll = await PollService.createPoll(pollData);
      res.status(201).json(newPoll);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePoll(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pollData = req.body;
      const updatedPoll = await PollService.updatePoll(parseInt(id), pollData);
      res.json(updatedPoll);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePoll(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await PollService.deletePoll(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPollQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const questions = await PollService.getPollQuestions(parseInt(id));
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollResponses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responses = await PollService.getPollResponses(parseInt(id));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const polls = await PollService.getPollsByUser(parseInt(userId));
      res.json(polls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PollsController();