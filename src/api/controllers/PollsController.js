const PollService = require('../services/PollService');

class PollsController {
  async getAllPolls(req, res) {
    try {
      const polls = await PollService.getAllPolls();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollById(req, res) {
    try {
      const { id } = req.params;
      const poll = await PollService.getPollById(parseInt(id));
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPoll(req, res) {
    try {
      const pollData = req.body;
      const newPoll = await PollService.createPoll(pollData);
      res.status(201).json(newPoll);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePoll(req, res) {
    try {
      const { id } = req.params;
      const pollData = req.body;
      const updatedPoll = await PollService.updatePoll(parseInt(id), pollData);
      res.json(updatedPoll);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePoll(req, res) {
    try {
      const { id } = req.params;
      await PollService.deletePoll(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPollQuestions(req, res) {
    try {
      const { id } = req.params;
      const questions = await PollService.getPollQuestions(parseInt(id));
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollResponses(req, res) {
    try {
      const { id } = req.params;
      const responses = await PollService.getPollResponses(parseInt(id));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPollsByUser(req, res) {
    try {
      const { userId } = req.params;
      const polls = await PollService.getPollsByUser(parseInt(userId));
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PollsController();