import webpush from "web-push";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Configurar las claves VAPID (genera tus propias claves con: npx web-push generate-vapid-keys)
// Guárdalas en tu archivo .env
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

webpush.setVapidDetails(
  "mailto:angelgaelguevara@gmail.com", // Cambia esto por tu email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class PushNotificationService {
  // Guardar suscripción de usuario
  async saveSubscription(userId: number, subscription: string) {
    try {
      // Verificar si el usuario existe (Evita errores confusos si el usuario fue borrado)
      const userExists = await prisma.users.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        throw new Error(`El usuario ${userId} no existe en la base de datos.`);
      }

      const user = await prisma.users.update({
        where: { id: userId },
        data: { pushSubscription: subscription },
      });

      return user;
    } catch (error) {
      throw new Error(`Error saving subscription: ${error}`);
    }
  }

  // Eliminar suscripción de usuario
  async removeSubscription(userId: number) {
    try {
      const user = await prisma.users.update({
        where: { id: userId },
        data: { pushSubscription: null },
      });

      return user;
    } catch (error) {
      throw new Error(`Error removing subscription: ${error}`);
    }
  }

  // Enviar notificación push a un usuario específico
  async sendPushToUser(userId: number, payload: any) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { pushSubscription: true },
      });

      if (!user || !user.pushSubscription) {
        throw new Error("Usuario no tiene suscripción activa");
      }

      const subscription = JSON.parse(user.pushSubscription);
      const result = await webpush.sendNotification(
        subscription,
        JSON.stringify(payload)
      );

      return result;
    } catch (error) {
      // Si la suscripción está inválida, eliminarla
      if (error instanceof Error && error.message.includes("410")) {
        await this.removeSubscription(userId);
      }
      throw new Error(`Error sending push notification: ${error}`);
    }
  }

  // Enviar notificación push a todos los usuarios suscritos
  async sendPushToAll(payload: any) {
    try {
      const users = await prisma.users.findMany({
        where: {
          pushSubscription: {
            not: null,
          },
        },
        select: {
          id: true,
          pushSubscription: true,
        },
      });

      const results = await Promise.allSettled(
        users.map(async (user) => {
          if (user.pushSubscription) {
            const subscription = JSON.parse(user.pushSubscription);
            return webpush.sendNotification(
              subscription,
              JSON.stringify(payload)
            );
          }
          return Promise.resolve(null);
        })
      );

      // Remover suscripciones inválidas
      const failedUsers = results
        .map((result, index) => {
          if (result.status === "rejected") {
            return users[index].id;
          }
          return null;
        })
        .filter((id) => id !== null);

      if (failedUsers.length > 0) {
        await prisma.users.updateMany({
          where: {
            id: {
              in: failedUsers as number[],
            },
          },
          data: {
            pushSubscription: null,
          },
        });
      }

      return {
        success: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
        total: users.length,
      };
    } catch (error) {
      throw new Error(`Error sending push to all: ${error}`);
    }
  }

  // Obtener claves públicas VAPID para el cliente
  getPublicKey() {
    return vapidKeys.publicKey;
  }
}

export default new PushNotificationService();
