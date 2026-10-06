const rfidService = require('../services/rfidService');

const getAll = async (req, res) => {
  try {
    const cards = await rfidService.getAllCards();
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const assign = async (req, res) => {
  try {
    const card = await rfidService.assignCard(req.body);
    res.status(201).json({ success: true, data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const card = await rfidService.updateCardStatus(req.params.id, req.body.card_status);
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, assign, updateStatus };