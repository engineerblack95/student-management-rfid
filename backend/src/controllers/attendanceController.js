const attendanceService = require('../services/attendanceService');

const scan = async (req, res) => {
  try {
    const { deviceId, rfidUid } = req.body;
    const result = await attendanceService.processScan({ deviceId, rfidUid });

    if (!result.success) {
      return res.status(200).json(result); // 200 so ESP32 can read response body
    }
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const history = async (req, res) => {
  try {
    const records = await attendanceService.getAttendance();
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const todayReport = async (req, res) => {
  try {
    const report = await attendanceService.getTodayReport();
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { scan, history, todayReport };