import { PrismaClient, options, responses } from '../../generated/prisma';

const prisma = new PrismaClient();

export class OptionService {
  async getAllOptions(): Promise<options[]> {
    return await prisma.options.findMany({
      include: {
        question: {
          select: {
            id: true,
            title: true,
            type: true,
            poll: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        responses: true,
      },
    });
  }

  async getOptionById(id: number): Promise<options | null> {
    return await prisma.options.findUnique({
      where: { id },
      include: {
        question: {
          include: {
            poll: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
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
          },
        },
      },
    });
  }

  async createOption(optionData: Omit<options, 'id' | 'createdAt' | 'updatedAt'>): Promise<options> {
    return await prisma.options.create({
      data: optionData,
      include: {
        question: true,
      },
    });
  }

  async updateOption(id: number, optionData: Partial<Omit<options, 'id' | 'createdAt' | 'updatedAt'>>): Promise<options> {
    return await prisma.options.update({
      where: { id },
      data: optionData,
      include: {
        question: true,
      },
    });
  }

  async deleteOption(id: number): Promise<options> {
    return await prisma.options.delete({
      where: { id },
    });
  }

  async getOptionResponses(optionId: number): Promise<responses[]> {
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
        question: true,
        poll: true,
      },
    });
  }

  async getOptionsByQuestion(questionId: number): Promise<options[]> {
    return await prisma.options.findMany({
      where: { questionId },
      include: {
        responses: true,
      },
    });
  }

  async getOptionResponseCount(optionId: number): Promise<number> {
    return await prisma.responses.count({
      where: { optionId },
    });
  }
}

export default new OptionService();