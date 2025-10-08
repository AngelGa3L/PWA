const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class OptionService {
  async getAllOptions() {
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

  async getOptionById(id) {
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

  async createOption(optionData) {
    return await prisma.options.create({
      data: optionData,
      include: {
        question: true,
      },
    });
  }

  async updateOption(id, optionData) {
    return await prisma.options.update({
      where: { id },
      data: optionData,
      include: {
        question: true,
      },
    });
  }

  async deleteOption(id) {
    return await prisma.options.delete({
      where: { id },
    });
  }

  async getOptionResponses(optionId) {
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

  async getOptionsByQuestion(questionId) {
    return await prisma.options.findMany({
      where: { questionId },
      include: {
        responses: true,
      },
    });
  }

  async getOptionResponseCount(optionId) {
    return await prisma.responses.count({
      where: { optionId },
    });
  }
}

module.exports = new OptionService();