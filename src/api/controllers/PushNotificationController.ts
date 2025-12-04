import { Request, Response } from "express";
import PushNotificationService from "../services/PushNotificationService";

class PushNotificationController {
  // Obtener clave pública VAPID
  async getPublicKey(req: Request, res: Response): Promise<any> {
    try {
      const publicKey = PushNotificationService.getPublicKey();

      return res.status(200).json({
        msg: "Clave pública obtenida",
        data: { publicKey },
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al obtener clave pública",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Guardar suscripción de usuario
  async subscribe(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user.id; // Del token JWT
      const { subscription } = req.body;

      console.log('📥 Recibiendo suscripción para usuario ID (desde Token):', userId);

      if (!subscription) {
        return res.status(400).json({
          msg: "Subscription es requerida",
        });
      }

      const user = await PushNotificationService.saveSubscription(
        userId,
        JSON.stringify(subscription)
      );

      console.log(`✅ Suscripción guardada correctamente para el usuario ${userId}`);

      return res.status(200).json({
        msg: "Suscripción guardada exitosamente",
        data: { userId: user.id },
      });
    } catch (error) {
      console.error('❌ Error guardando suscripción en DB:', error);
      return res.status(500).json({
        msg: "Error al guardar suscripción",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Eliminar suscripción de usuario
  async unsubscribe(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user.id; // Del token JWT

      await PushNotificationService.removeSubscription(userId);

      return res.status(200).json({
        msg: "Suscripción eliminada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al eliminar suscripción",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Enviar notificación push a un usuario
  async sendToUser(req: Request, res: Response): Promise<any> {
    try {
      const { userId, title, body, data } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({
          msg: "userId, title y body son requeridos",
        });
      }

      const payload = {
        title,
        body,
        data: data || {},
      };

      await PushNotificationService.sendPushToUser(userId, payload);

      return res.status(200).json({
        msg: "Notificación enviada exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al enviar notificación",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Enviar notificación push a todos los usuarios
  async sendToAll(req: Request, res: Response): Promise<any> {
    try {
      const { title, body, data } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          msg: "title y body son requeridos",
        });
      }

      const payload = {
        title,
        body,
        data: data || {},
      };

      const result = await PushNotificationService.sendPushToAll(payload);

      return res.status(200).json({
        msg: "Notificaciones enviadas",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al enviar notificaciones",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}

export default new PushNotificationController();
