import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export class AuthController {
  // PASO 1: Iniciar login (validar credenciales y enviar código)
  async initiateLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.initiateLogin(email, password);
      res.json({
        success: true,
        message: result.message,
        userId: result.userId, // El frontend necesita esto para el paso 2
      });
    } catch (error: any) {
      res.status(401).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // PASO 2: Verificar código y obtener token
  async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code } = req.body;
      const result = await AuthService.verifyTwoFactorCode(parseInt(userId), code);
      res.json({
        success: true,
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

  // Login sin 2FA (mantener por compatibilidad si es necesario)
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