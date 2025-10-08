const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class PollService {
  async getAllPolls() {
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

  async getPollById(id) {
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

  async createPoll(pollData) {
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

  async updatePoll(id, pollData) {
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

  async deletePoll(id) {
    return await prisma.polls.delete({
      where: { id },
    });
  }

  async getPollQuestions(pollId) {
    return await prisma.questions.findMany({
      where: { pollId },
      include: {
        options: true,
        responses: true,
      },
    });
  }

  async getPollResponses(pollId) {
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

  async getPollsByUser(userId) {
    return await prisma.polls.findMany({
      where: { creatorId: userId },
      include: {
        questions: true,
        responses: true,
      },
    });
  }

  async getPollsByStatus(status) {
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

module.exports = new PollService();