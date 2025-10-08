const ResponseService = require('../services/ResponseService');

class ResponsesController {
  async getAllResponses(req, res) {
    try {
      const responses = await ResponseService.getAllResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResponseById(req, res) {
    try {
      const { id } = req.params;
      const response = await ResponseService.getResponseById(parseInt(id));
      if (!response) {
        return res.status(404).json({ error: 'Response not found' });
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createResponse(req, res) {
    try {
      const responseData = req.body;
      const newResponse = await ResponseService.createResponse(responseData);
      res.status(201).json(newResponse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateResponse(req, res) {
    try {
      const { id } = req.params;
      const responseData = req.body;
      const updatedResponse = await ResponseService.updateResponse(parseInt(id), responseData);
      res.json(updatedResponse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteResponse(req, res) {
    try {
      const { id } = req.params;
      await ResponseService.deleteResponse(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getResponsesByPoll(req, res) {
    try {
      const { pollId } = req.params;
      const responses = await ResponseService.getResponsesByPoll(parseInt(pollId));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResponsesByUser(req, res) {
    try {
      const { userId } = req.params;
      const responses = await ResponseService.getResponsesByUser(parseInt(userId));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResponsesController();