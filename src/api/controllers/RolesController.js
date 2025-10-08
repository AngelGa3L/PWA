const RoleService = require('../services/RoleService');

class RolesController {
  async getAllRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(parseInt(id));
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRole(req, res) {
    try {
      const roleData = req.body;
      const newRole = await RoleService.createRole(roleData);
      res.status(201).json(newRole);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedRole = await RoleService.updateRole(parseInt(id), roleData);
      res.json(updatedRole);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RolesController();