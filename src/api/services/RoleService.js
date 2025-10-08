const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

class RoleService {
  async getAllRoles() {
    return await prisma.roles.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getRoleById(id) {
    return await prisma.roles.findUnique({
      where: { id },
    });
  }

  async getRoleByName(name) {
    return await prisma.roles.findUnique({
      where: { name },
    });
  }

  async createRole(roleData) {
    return await prisma.roles.create({
      data: roleData,
    });
  }

  async updateRole(id, roleData) {
    return await prisma.roles.update({
      where: { id },
      data: roleData,
    });
  }

  async deleteRole(id) {
    return await prisma.roles.delete({
      where: { id },
    });
  }

  async searchRoles(searchTerm) {
    return await prisma.roles.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}

module.exports = new RoleService();