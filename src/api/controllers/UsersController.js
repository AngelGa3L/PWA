const UserService = require('../services/UserService');

class UsersController {
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await UserService.updateUser(parseInt(id), userData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserPolls(req, res) {
    try {
      const { id } = req.params;
      const polls = await UserService.getUserPolls(parseInt(id));
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserResponses(req, res) {
    try {
      const { id } = req.params;
      const responses = await UserService.getUserResponses(parseInt(id));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsersController();
