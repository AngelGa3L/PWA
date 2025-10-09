import { PrismaClient, questions, options, responses } from '../../generated/prisma';

const prisma = new PrismaClient();

export class QuestionService {
  async getAllQuestions(): Promise<questions[]> {
    return await prisma.questions.findMany({
      include: {
        poll: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        options: true,
        responses: true,
      },
    });
  }

  async getQuestionById(id: number): Promise<questions | null> {
    return await prisma.questions.findUnique({
      where: { id },
      include: {
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
        options: true,
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
            option: true,
          },
        },
      },
    });
  }

  async createQuestion(questionData: Omit<questions, 'id' | 'createdAt' | 'updatedAt'>): Promise<questions> {
    return await prisma.questions.create({
      data: questionData,
      include: {
        poll: true,
        options: true,
      },
    });
  }

  async updateQuestion(id: number, questionData: Partial<Omit<questions, 'id' | 'createdAt' | 'updatedAt'>>): Promise<questions> {
    return await prisma.questions.update({
      where: { id },
      data: questionData,
      include: {
        poll: true,
        options: true,
      },
    });
  }

  async deleteQuestion(id: number): Promise<questions> {
    return await prisma.questions.delete({
      where: { id },
    });
  }

  async getQuestionOptions(questionId: number): Promise<options[]> {
    return await prisma.options.findMany({
      where: { questionId },
      include: {
        responses: true,
      },
    });
  }

  async getQuestionResponses(questionId: number): Promise<responses[]> {
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
        option: true,
      },
    });
  }

  async getQuestionsByPoll(pollId: number): Promise<questions[]> {
    return await prisma.questions.findMany({
      where: { pollId },
      include: {
        options: true,
        responses: true,
      },
    });
  }

  async getQuestionsByType(type: string): Promise<questions[]> {
    return await prisma.questions.findMany({
      where: { type },
      include: {
        poll: true,
        options: true,
      },
    });
  }
}

export default new QuestionService();