import { Request, Response } from "express";
import UserService from "../services/UserService";

export class UsersController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, lastName, firstName, password, roleId } = req.body;
      const newUser = await UserService.createUser({ email, lastName, firstName, password, roleId });
      res
        .status(201)
        .json({
          data: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            roleId: newUser.roleId,
            createdAt: newUser.createdAt,
          },
          msg: "Usuario creado exitosamente"
        });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await UserService.updateUser(parseInt(id), userData);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.deleteUser(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserPolls(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const polls = await UserService.getUserPolls(parseInt(id));
      res.json(polls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserResponses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responses = await UserService.getUserResponses(parseInt(id));
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UsersController();
