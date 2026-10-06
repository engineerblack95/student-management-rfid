const userService = require('../services/userService');

const list = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changeRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await userService.resetPassword(req.params.id, req.body.password);
    res.json({ success: true, data: user, message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }
    const user = await userService.deleteUser(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { list, changeRole, resetPassword, remove };