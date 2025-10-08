const OptionService = require('../services/OptionService');

class OptionsController {
  async getAllOptions(req, res) {
    try {
      const options = await OptionService.getAllOptions();
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOptionById(req, res) {
    try {
      const { id } = req.params;
      const option = await OptionService.getOptionById(parseInt(id));
      if (!option) {
        return res.status(404).json({ error: 'Option not found' });
      }
      res.json(option);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createOption(req, res) {
    try {
      const optionData = req.body;
      const newOption = await OptionService.createOption(optionData);
      res.status(201).json(newOption);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateOption(req, res) {
    try {
      const { id } = req.params;
      const optionData = req.body;
      const updatedOption = await OptionService.updateOption(parseInt(id), optionData);
      res.json(updatedOption);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteOption(req, res) {
    try {
      const { id } = req.params;
      await OptionService.deleteOption(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOptionResponses(req, res) {
    try {
      const { id } = req.params;
      const responses = await OptionService.getOptionResponses(parseInt(id));
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OptionsController();