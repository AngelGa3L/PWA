import { Request, Response } from 'express';
import OptionService from '../services/OptionService';

export class OptionsController {
  async getAllOptions(req: Request, res: Response): Promise<void> {
    try {
      const options = await OptionService.getAllOptions();
      res.json(options);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOptionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const option = await OptionService.getOptionById(parseInt(id));
      if (!option) {
        res.status(404).json({ error: 'Option not found' });
        return;
      }
      res.json(option);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createOption(req: Request, res: Response): Promise<void> {
    try {
      const optionData = req.body;
      const newOption = await OptionService.createOption(optionData);
      res.status(201).json(newOption);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateOption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const optionData = req.body;
      const updatedOption = await OptionService.updateOption(parseInt(id), optionData);
      res.json(updatedOption);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteOption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await OptionService.deleteOption(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOptionResponses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responses = await OptionService.getOptionResponses(parseInt(id));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OptionsController();