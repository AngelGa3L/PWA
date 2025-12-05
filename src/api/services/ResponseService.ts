import { PrismaClient, responses } from '../../generated/prisma';

const prisma = new PrismaClient();

export class ResponseService {
  async getAllResponses(): Promise<responses[]> {
    return await prisma.responses.findMany({
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
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async getResponseById(id: number): Promise<responses | null> {
    return await prisma.responses.findUnique({
      where: { id },
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
            status: true,
            creator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        question: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async createResponse(responseData: Omit<responses, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const response = await prisma.responses.create({
      data: responseData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        poll: true,
        question: true,
        option: true,
      },
    });

    // Verificar si el usuario completó todas las preguntas de la encuesta
    const poll = await prisma.polls.findUnique({
      where: { id: responseData.pollId },
      include: {
        questions: true,
        responses: {
          where: {
            userId: responseData.userId
          }
        }
      }
    });

    if (poll) {
      const totalQuestions = poll.questions.length;
      const answeredQuestions = new Set(poll.responses.map(r => r.questionId)).size;
      
      const completed = totalQuestions > 0 && answeredQuestions === totalQuestions;
      
      return {
        ...response,
        pollCompleted: completed,
        progress: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
      };
    }

    return response;
  }

  async updateResponse(id: number, responseData: Partial<Omit<responses, 'id' | 'createdAt' | 'updatedAt'>>): Promise<responses> {
    return await prisma.responses.update({
      where: { id },
      data: responseData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        poll: true,
        question: true,
        option: true,
      },
    });
  }

  async deleteResponse(id: number): Promise<responses> {
    return await prisma.responses.delete({
      where: { id },
    });
  }

  async getResponsesByPoll(pollId: number): Promise<responses[]> {
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
        question: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async getResponsesByUser(userId: number): Promise<responses[]> {
    return await prisma.responses.findMany({
      where: { userId },
      include: {
        poll: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async getResponsesByQuestion(questionId: number): Promise<responses[]> {
    return await prisma.responses.findMany({
      where: { questionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async getResponsesByOption(optionId: number): Promise<responses[]> {
    return await prisma.responses.findMany({
      where: { optionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
  async getResponsesByPollAndUser(pollId: number, userId: number) {
  return await prisma.responses.findMany({
    where: {
      pollId,
      userId
    },
    include: {
      question: {
        select: {
          id: true,
          title: true,
          type: true
        }
      },
      option: {
        select: {
          id: true,
          text: true
        }
      }
    }
  });
}

  async getAnsweredPollDetails(pollId: number, userId: number) {
    // Trae la encuesta con sus preguntas y opciones, y las respuestas del usuario
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                text: true,
              },
            },
          },
        },
      },
    });

    if (!poll) return null;

    const userResponses = await prisma.responses.findMany({
      where: { pollId, userId },
      select: {
        questionId: true,
        optionId: true,
        response: true,
      },
    });

    // Agrupar respuestas por pregunta (para soportar selección múltiple)
    const responseMap: Record<number, number[]> = {};
    const textResponseMap: Record<number, string> = {};

    userResponses.forEach((r) => {
      if (!responseMap[r.questionId]) {
        responseMap[r.questionId] = [];
      }
      if (r.optionId) {
        responseMap[r.questionId].push(r.optionId);
      }
      if (r.response) {
        textResponseMap[r.questionId] = r.response;
      }
    });

    const questions = poll.questions.map((q) => {
      const selectedOptionIds = responseMap[q.id] || [];
      const textResponse = textResponseMap[q.id] || null;

      const options = q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        selected: selectedOptionIds.includes(opt.id),
      }));

      return {
        id: q.id,
        title: q.title,
        type: q.type,
        options,
        userResponse: {
            optionIds: selectedOptionIds,
            response: textResponse
        }
      };
    });

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      questions,
    };
  }

}

export default new ResponseService();