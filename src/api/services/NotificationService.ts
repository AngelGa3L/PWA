import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

class NotificationService {
  // Crear notificación para todos los usuarios o uno específico
  async createNotification(data: {
    pollId: number;
    title: string;
    body: string;
    userId?: number;
  }) {
    try {
      const notification = await prisma.notifications.create({
        data: {
          pollId: data.pollId,
          title: data.title,
          body: data.body,
          userId: data.userId || null,
          sent: false,
        },
      });

      return notification;
    } catch (error) {
      throw new Error(`Error creating notification: ${error}`);
    }
  }

  // Obtener todas las notificaciones
  async getAllNotifications() {
    try {
      const notifications = await prisma.notifications.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          poll: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return notifications;
    } catch (error) {
      throw new Error(`Error fetching notifications: ${error}`);
    }
  }

  // Obtener notificaciones de un usuario
  async getNotificationsByUser(userId: number) {
    try {
      const notifications = await prisma.notifications.findMany({
        where: {
          OR: [{ userId: userId }, { userId: null }], // Notificaciones específicas o globales
        },
        include: {
          poll: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return notifications;
    } catch (error) {
      throw new Error(`Error fetching user notifications: ${error}`);
    }
  }

  // Marcar notificación como enviada
  async markAsSent(notificationId: number) {
    try {
      const notification = await prisma.notifications.update({
        where: { id: notificationId },
        data: { sent: true },
      });

      return notification;
    } catch (error) {
      throw new Error(`Error marking notification as sent: ${error}`);
    }
  }

  // Eliminar notificación
  async deleteNotification(notificationId: number) {
    try {
      const notification = await prisma.notifications.delete({
        where: { id: notificationId },
      });

      return notification;
    } catch (error) {
      throw new Error(`Error deleting notification: ${error}`);
    }
  }

  // Obtener notificaciones pendientes de enviar
  async getPendingNotifications() {
    try {
      const notifications = await prisma.notifications.findMany({
        where: { sent: false },
        include: {
          user: {
            select: {
              id: true,
              pushSubscription: true,
            },
          },
          poll: true,
        },
      });

      return notifications;
    } catch (error) {
      throw new Error(`Error fetching pending notifications: ${error}`);
    }
  }
}

export default new NotificationService();
