const studentService = require('../services/studentService');

const getAll = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFull = async (req, res) => {
  try {
    const data = await studentService.getStudentFull(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const student = await studentService.deactivateStudent(req.params.id);
    res.json({ success: true, message: 'Student deactivated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const hardDelete = async (req, res) => {
  try {
    const student = await studentService.hardDeleteStudent(req.params.id);
    res.json({ success: true, message: 'Student permanently deleted', data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  getFull,
  create,
  update,
  remove,
  hardDelete,
};