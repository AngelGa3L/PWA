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

  async createResponse(responseData: Omit<responses, 'id' | 'createdAt' | 'updatedAt'>): Promise<responses> {
    return await prisma.responses.create({
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
}

export default new ResponseService();