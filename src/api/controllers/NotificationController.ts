import { Request, Response } from "express";
import NotificationService from "../services/NotificationService";

class NotificationController {
  // Crear notificación
  async createNotification(req: Request, res: Response): Promise<any> {
    try {
      const { pollId, title, body, userId } = req.body;

      if (!pollId || !title || !body) {
        return res.status(400).json({
          msg: "pollId, title y body son requeridos",
        });
      }

      const notification = await NotificationService.createNotification({
        pollId,
        title,
        body,
        userId,
      });

      return res.status(201).json({
        msg: "Notificación creada exitosamente",
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al crear notificación",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Obtener todas las notificaciones (admin)
  async getAllNotifications(req: Request, res: Response): Promise<any> {
    try {
      const notifications = await NotificationService.getAllNotifications();

      return res.status(200).json({
        msg: "Notificaciones obtenidas exitosamente",
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al obtener notificaciones",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Obtener notificaciones de un usuario
  async getNotificationsByUser(req: Request, res: Response): Promise<any> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          msg: "ID de usuario inválido",
        });
      }

      const notifications = await NotificationService.getNotificationsByUser(
        userId
      );

      return res.status(200).json({
        msg: "Notificaciones obtenidas exitosamente",
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al obtener notificaciones del usuario",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Marcar notificación como enviada
  async markAsSent(req: Request, res: Response): Promise<any> {
    try {
      const notificationId = parseInt(req.params.id);

      if (isNaN(notificationId)) {
        return res.status(400).json({
          msg: "ID de notificación inválido",
        });
      }

      const notification = await NotificationService.markAsSent(notificationId);

      return res.status(200).json({
        msg: "Notificación marcada como enviada",
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al marcar notificación",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Eliminar notificación
  async deleteNotification(req: Request, res: Response): Promise<any> {
    try {
      const notificationId = parseInt(req.params.id);

      if (isNaN(notificationId)) {
        return res.status(400).json({
          msg: "ID de notificación inválido",
        });
      }

      const notification = await NotificationService.deleteNotification(
        notificationId
      );

      return res.status(200).json({
        msg: "Notificación eliminada exitosamente",
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al eliminar notificación",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Obtener notificaciones pendientes
  async getPendingNotifications(req: Request, res: Response): Promise<any> {
    try {
      const notifications = await NotificationService.getPendingNotifications();

      return res.status(200).json({
        msg: "Notificaciones pendientes obtenidas",
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error al obtener notificaciones pendientes",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}

export default new NotificationController();
