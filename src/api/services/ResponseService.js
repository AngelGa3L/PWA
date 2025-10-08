const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class ResponseService {
  async getAllResponses() {
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

  async getResponseById(id) {
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

  async createResponse(responseData) {
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

  async updateResponse(id, responseData) {
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

  async deleteResponse(id) {
    return await prisma.responses.delete({
      where: { id },
    });
  }

  async getResponsesByPoll(pollId) {
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

  async getResponsesByUser(userId) {
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

  async getResponsesByQuestion(questionId) {
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

  async getResponsesByOption(optionId) {
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

module.exports = new ResponseService();