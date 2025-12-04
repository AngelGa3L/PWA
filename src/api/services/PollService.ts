import { PrismaClient, polls, questions, responses } from '../../generated/prisma';
import NotificationService from './NotificationService';
import PushNotificationService from './PushNotificationService';

const prisma = new PrismaClient();

export class PollService {
  async getAllPolls(): Promise<polls[]> {
    return await prisma.polls.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
        },
        responses: true,
      },
    });
  }

  // Obtener encuestas con estado de respuesta del usuario
  async getPollsForUser(userId: number): Promise<any[]> {
    const polls = await prisma.polls.findMany({
      where: {
        status: 'active' // Solo encuestas activas
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
        },
        responses: {
          where: {
            userId: userId
          }
        },
      },
    });

    // Agregar campo "completed" a cada encuesta
    return polls.map(poll => {
      const totalQuestions = poll.questions.length;
      const answeredQuestions = new Set(poll.responses.map(r => r.questionId)).size;

      return {
        ...poll,
        completed: totalQuestions > 0 && answeredQuestions === totalQuestions,
        progress: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
      };
    });
  }

  async getPollById(id: number): Promise<polls | null> {
    return await prisma.polls.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            question: true,
            option: true,
          },
        },
      },
    });
  }

  async createPoll(pollData: Omit<polls, 'id' | 'createdAt' | 'updatedAt'>): Promise<polls> {
    // 1. Crear la encuesta normalmente
    const newPoll = await prisma.polls.create({
      data: pollData,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // 2. 🔔 ENVIAR NOTIFICACIÓN (Esto es lo nuevo)
    try {
      console.log('📢 Iniciando proceso de notificación masiva...');

      // A) Guardar en la base de datos (para historial)
      await NotificationService.createNotification({
        pollId: newPoll.id,
        title: '¡Nueva encuesta disponible!',
        body: `Participa en: ${newPoll.title}`,
        userId: undefined, // null = para todos
      });

      // B) Enviar Push Notification a los celulares
      // NOTA: Angular Service Worker espera que el objeto tenga una propiedad "notification"
      await PushNotificationService.sendPushToAll({
        notification: {
          title: '¡Nueva encuesta disponible!',
          body: `${newPoll.title}`,
          icon: '/assets/icon/favicon.png',
          vibrate: [100, 50, 100],
          data: {
            url: `/tabs/encuestas`,
            pollId: newPoll.id
          }
        }
      });

      console.log(`✅ Notificaciones enviadas para: ${newPoll.title}`);
    } catch (error) {
      console.error('⚠️ Error enviando notificaciones (la encuesta sí se creó):', error);
    }

    return newPoll;
  }

  async updatePoll(id: number, pollData: Partial<Omit<polls, 'id' | 'createdAt' | 'updatedAt'>>): Promise<polls> {
    return await prisma.polls.update({
      where: { id },
      data: pollData,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: true,
      },
    });
  }

  async deletePoll(id: number): Promise<polls> {
    return await prisma.polls.delete({
      where: { id },
    });
  }

  async getPollQuestions(pollId: number): Promise<questions[]> {
    return await prisma.questions.findMany({
      where: { pollId },
      include: {
        options: true,
        responses: true,
      },
    });
  }

  async getPollResponses(pollId: number): Promise<responses[]> {
    return await prisma.responses.findMany({
      where: { pollId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        question: true,
        option: true,
      },
    });
  }

  async getPollsByUser(userId: number): Promise<polls[]> {
    return await prisma.polls.findMany({
      where: {
        responses: {
          some: {
            userId: userId,  // solo encuestas donde el usuario respondió
          },
        },
      },
      include: {
        questions: true,
        responses: true,
      },
    });
  }


  async getPollsByStatus(status: string): Promise<polls[]> {
    return await prisma.polls.findMany({
      where: { status },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: true,
      },
    });
  }
}

export default new PollService();