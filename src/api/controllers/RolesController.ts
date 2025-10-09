import { Request, Response } from 'express';
import RoleService from '../services/RoleService';

export class RolesController {
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(parseInt(id));
      if (!role) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }
      res.json(role);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const roleData = req.body;
      const newRole = await RoleService.createRole(roleData);
      res.status(201).json(newRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedRole = await RoleService.updateRole(parseInt(id), roleData);
      res.json(updatedRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new RolesController();