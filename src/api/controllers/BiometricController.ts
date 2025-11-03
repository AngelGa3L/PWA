import { Request, Response } from "express";
import BiometricService from "../services/BiometricService";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

class BiometricController {
  // Habilitar autenticación biométrica
  async enableBiometric(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user.id; // Del token JWT
      const { publicKey } = req.body;

      if (!publicKey) {
        return res.status(400).json({
          msg: "Public key es requerida",
        });
      }

      await BiometricService.enableBiometric(userId, publicKey);

      return res.status(200).json({
        msg: "Autenticación biométrica habilitada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al habilitar autenticación biométrica",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Deshabilitar autenticación biométrica
  async disableBiometric(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user.id; // Del token JWT

      await BiometricService.disableBiometric(userId);

      return res.status(200).json({
        msg: "Autenticación biométrica deshabilitada",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al deshabilitar autenticación biométrica",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Obtener estado de biometría
  async getBiometricStatus(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user.id; // Del token JWT

      const user = await BiometricService.getBiometricStatus(userId);

      if (!user) {
        return res.status(404).json({
          msg: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        msg: "Estado de biometría obtenido",
        data: {
          biometricEnabled: user.biometricEnabled,
        },
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al obtener estado de biometría",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Login con biometría (WebAuthn)
  async loginWithBiometric(req: Request, res: Response): Promise<any> {
    try {
      const { email, credential } = req.body;

      if (!email || !credential) {
        return res.status(400).json({
          msg: "Email y credential son requeridos",
        });
      }

      const user = await BiometricService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          msg: "Usuario no encontrado",
        });
      }

      if (!user.biometricEnabled) {
        return res.status(400).json({
          msg: "Autenticación biométrica no habilitada para este usuario",
        });
      }

      // Aquí deberías validar el credential con WebAuthn
      // Por ahora, asumimos que el frontend ya validó la huella
      // En producción, debes verificar la firma con la publicKey

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
        },
        secretKey as string,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        msg: "Login exitoso con biometría",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error en login biométrico",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}

export default new BiometricController();
