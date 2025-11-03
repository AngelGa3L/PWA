import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

class BiometricService {
  // Habilitar biometría para un usuario
  async enableBiometric(userId: number, publicKey: string) {
    try {
      const user = await prisma.users.update({
        where: { id: userId },
        data: {
          biometricEnabled: true,
          biometricPublicKey: publicKey,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Error enabling biometric: ${error}`);
    }
  }

  // Deshabilitar biometría para un usuario
  async disableBiometric(userId: number) {
    try {
      const user = await prisma.users.update({
        where: { id: userId },
        data: {
          biometricEnabled: false,
          biometricPublicKey: null,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Error disabling biometric: ${error}`);
    }
  }

  // Verificar si el usuario tiene biometría habilitada
  async getBiometricStatus(userId: number) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          biometricEnabled: true,
          biometricPublicKey: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Error getting biometric status: ${error}`);
    }
  }

  // Obtener usuario por email para login biométrico
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          biometricEnabled: true,
          biometricPublicKey: true,
          roleId: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Error getting user: ${error}`);
    }
  }
}

export default new BiometricService();
