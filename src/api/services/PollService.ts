import { PrismaClient, polls, questions, responses } from '../../generated/prisma';

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
    return await prisma.polls.create({
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
      where: { creatorId: userId },
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