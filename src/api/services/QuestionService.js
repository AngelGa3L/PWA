const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class QuestionService {
  async getAllQuestions() {
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

  async getQuestionById(id) {
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

  async createQuestion(questionData) {
    return await prisma.questions.create({
      data: questionData,
      include: {
        poll: true,
        options: true,
      },
    });
  }

  async updateQuestion(id, questionData) {
    return await prisma.questions.update({
      where: { id },
      data: questionData,
      include: {
        poll: true,
        options: true,
      },
    });
  }

  async deleteQuestion(id) {
    return await prisma.questions.delete({
      where: { id },
    });
  }

  async getQuestionOptions(questionId) {
    return await prisma.options.findMany({
      where: { questionId },
      include: {
        responses: true,
      },
    });
  }

  async getQuestionResponses(questionId) {
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

  async getQuestionsByPoll(pollId) {
    return await prisma.questions.findMany({
      where: { pollId },
      include: {
        options: true,
        responses: true,
      },
    });
  }

  async getQuestionsByType(type) {
    return await prisma.questions.findMany({
      where: { type },
      include: {
        poll: true,
        options: true,
      },
    });
  }
}

module.exports = new QuestionService();