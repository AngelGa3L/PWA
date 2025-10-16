import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();