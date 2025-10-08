const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class UserService {
  async getAllUsers() {
    return await prisma.users.findMany({
      include: {
        polls: true,
        responses: true,
      },
    });
  }

  async getUserById(id) {
    return await prisma.users.findUnique({
      where: { id },
      include: {
        polls: true,
        responses: true,
      },
    });
  }

  async createUser(userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  async updateUser(id, userData) {
    return await prisma.users.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id) {
    return await prisma.users.delete({
      where: { id },
    });
  }

  async getUserPolls(userId) {
    return await prisma.polls.findMany({
      where: { creatorId: userId },
      include: {
        questions: true,
        responses: true,
      },
    });
  }

  async getUserResponses(userId) {
    return await prisma.responses.findMany({
      where: { userId },
      include: {
        poll: true,
        question: true,
        option: true,
      },
    });
  }

  async getUserByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

module.exports = new UserService();
