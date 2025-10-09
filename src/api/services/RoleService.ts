import { PrismaClient, roles } from '../../generated/prisma';

const prisma = new PrismaClient();

export class RoleService {
  async getAllRoles(): Promise<roles[]> {
    return await prisma.roles.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getRoleById(id: number): Promise<roles | null> {
    return await prisma.roles.findUnique({
      where: { id },
    });
  }

  async getRoleByName(name: string): Promise<roles | null> {
    return await prisma.roles.findUnique({
      where: { name },
    });
  }

  async createRole(roleData: Omit<roles, 'id' | 'createdAt' | 'updatedAt'>): Promise<roles> {
    return await prisma.roles.create({
      data: roleData,
    });
  }

  async updateRole(id: number, roleData: Partial<Omit<roles, 'id' | 'createdAt' | 'updatedAt'>>): Promise<roles> {
    return await prisma.roles.update({
      where: { id },
      data: roleData,
    });
  }

  async deleteRole(id: number): Promise<roles> {
    return await prisma.roles.delete({
      where: { id },
    });
  }

  async searchRoles(searchTerm: string): Promise<roles[]> {
    return await prisma.roles.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            description: {
              contains: searchTerm,
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

export default new RoleService();