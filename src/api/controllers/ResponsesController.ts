import { Request, Response } from 'express';
import ResponseService from '../services/ResponseService';

export class ResponsesController {
  async getAllResponses(req: Request, res: Response): Promise<void> {
    try {
      const responses = await ResponseService.getAllResponses();
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResponseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await ResponseService.getResponseById(parseInt(id));
      if (!response) {
        res.status(404).json({ error: 'Response not found' });
        return;
      }
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createResponse(req: Request, res: Response): Promise<void> {
    try {
      const responseData = req.body;
      const newResponse = await ResponseService.createResponse(responseData);
      res.status(201).json(newResponse);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateResponse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responseData = req.body;
      const updatedResponse = await ResponseService.updateResponse(parseInt(id), responseData);
      res.json(updatedResponse);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteResponse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ResponseService.deleteResponse(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getResponsesByPoll(req: Request, res: Response): Promise<void> {
    try {
      const { pollId } = req.params;
      const responses = await ResponseService.getResponsesByPoll(parseInt(pollId));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResponsesByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const responses = await ResponseService.getResponsesByUser(parseInt(userId));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getResponsesByPollAndUser(req: Request, res: Response): Promise<void> {
  try {
    const { pollId, userId } = req.params;
    const responses = await ResponseService.getResponsesByPollAndUser(
      parseInt(pollId),
      parseInt(userId)
    );
    res.json(responses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

  async getAnsweredPollDetails(req: Request, res: Response): Promise<void> {
    try {
      const { pollId, userId } = req.params;
      const details = await ResponseService.getAnsweredPollDetails(
        parseInt(pollId),
        parseInt(userId)
      );
      if (!details) {
        res.status(404).json({ error: 'Poll not found' });
        return;
      }
      res.json(details);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ResponsesController();