import { PrismaClient, users, polls, responses } from '../../generated/prisma';

const prisma = new PrismaClient();

export class UserService {
  async getAllUsers(): Promise<users[]> {
    return await prisma.users.findMany({
      include: {
        polls: true,
        responses: true,
      },
    });
  }

  async getUserById(id: number): Promise<users | null> {
    return await prisma.users.findUnique({
      where: { id },
      include: {
        polls: true,
        responses: true,
      },
    });
  }

  async createUser(userData: Omit<users, 'id' | 'createdAt' | 'updatedAt'>): Promise<users> {
    return await prisma.users.create({
      data: userData,
    });
  }

  async updateUser(id: number, userData: Partial<Omit<users, 'id' | 'createdAt' | 'updatedAt'>>): Promise<users> {
    return await prisma.users.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<users> {
    return await prisma.users.delete({
      where: { id },
    });
  }

  async getUserPolls(userId: number): Promise<polls[]> {
    return await prisma.polls.findMany({
      where: { creatorId: userId },
      include: {
        questions: true,
        responses: true,
      },
    });
  }

  async getUserResponses(userId: number): Promise<responses[]> {
    return await prisma.responses.findMany({
      where: { userId },
      include: {
        poll: true,
        question: true,
        option: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<users | null> {
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

export default new UserService();