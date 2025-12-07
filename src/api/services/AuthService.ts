import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserService from "./UserService";
import EmailService from "./EmailService";
import { PrismaClient } from "../../generated/prisma";

const secretKey = process.env.JWT_SECRET_KEY as string;
const prisma = new PrismaClient();

export class AuthService {
  // Generar código de 6 dígitos
  private generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // PASO 1: Validar email y contraseña, enviar código
  async initiateLogin(email: string, password: string): Promise<{ success: boolean; message: string; userId: number }> {
    try {
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        throw new Error("Email o contraseña incorrectos");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Email o contraseña incorrectos");
      }

      // Generar código de 6 dígitos
      const code = this.generateTwoFactorCode();
      
      // Encriptar el código antes de guardarlo
      const hashedCode = await bcrypt.hash(code, 10);
      
      // Calcular expiración (5 minutos)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Guardar código encriptado en la base de datos
      await prisma.users.update({
        where: { id: user.id },
        data: {
          twoFactorCode: hashedCode,
          twoFactorExpires: expiresAt,
        },
      });

      // Enviar código por email
      await EmailService.sendTwoFactorCode(
        user.email,
        code,
        `${user.firstName} ${user.lastName}`
      );

      console.log(`📧 Código 2FA enviado a: ${user.email}`);

      return {
        success: true,
        message: "Código de verificación enviado a tu correo",
        userId: user.id,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // PASO 2: Verificar código y generar token
  async verifyTwoFactorCode(userId: number, code: string): Promise<{ token: string; user: any }> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (!user.twoFactorCode || !user.twoFactorExpires) {
        throw new Error("No hay código de verificación pendiente");
      }

      // Verificar si el código expiró
      if (new Date() > user.twoFactorExpires) {
        throw new Error("El código de verificación ha expirado");
      }

      // Verificar el código encriptado
      const isCodeValid = await bcrypt.compare(code, user.twoFactorCode);

      if (!isCodeValid) {
        throw new Error("Código de verificación incorrecto");
      }

      // Limpiar el código usado
      await prisma.users.update({
        where: { id: userId },
        data: {
          twoFactorCode: null,
          twoFactorExpires: null,
        },
      });

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      console.log(`✅ Login 2FA exitoso para: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          method_login: user.method_login,
          createdAt: user.createdAt,
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Método antiguo (mantener por compatibilidad si se necesita login sin 2FA)
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: any }> {
    try {
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        throw new Error("Email o contraseña incorrectos");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Email o contraseña incorrectos");
      }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          method_login: user.method_login,
          createdAt: user.createdAt,
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
export default new AuthService();
