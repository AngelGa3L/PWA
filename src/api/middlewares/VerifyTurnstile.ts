import { Request, Response, NextFunction } from 'express';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export const verifyTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { turnstileToken } = req.body;

    if (!turnstileToken) {
      return res.status(400).json({
        success: false,
        error: 'Token de verificación (Turnstile) es requerido',
      });
    }

    // Verificar el token con Cloudflare
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY || '');
    formData.append('response', turnstileToken);
    
    // Opcional: IP del usuario (mejora la validación)
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (userIp) {
      formData.append('remoteip', userIp as string);
    }

    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json() as TurnstileResponse;

    if (!data.success) {
      console.error('❌ Turnstile verification failed:', data['error-codes']);
      return res.status(400).json({
        success: false,
        error: 'Verificación de seguridad fallida. Por favor, intenta de nuevo.',
        details: data['error-codes'],
      });
    }

    console.log('✅ Turnstile verification successful');
    
    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error('❌ Error verificando Turnstile:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al verificar la seguridad. Intenta de nuevo.',
    });
  }
};

export default verifyTurnstile;
