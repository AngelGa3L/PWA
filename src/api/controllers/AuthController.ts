import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({
        message: 'Login exitoso',
        data: result.user,
        token: result.token,
      });
    } catch (error: any) {
      res.status(401).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

export default new AuthController();