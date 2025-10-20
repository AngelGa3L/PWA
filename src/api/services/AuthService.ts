import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserService from "./UserService";

const secretKey = process.env.JWT_SECRET_KEY as string;

export class AuthService {
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
          userId: user.id,
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
