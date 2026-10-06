const pool = require('../config/db');

const getAllStudents = async () => {
  const result = await pool.query(
    `SELECT s.*, rc.rfid_uid 
     FROM students s 
     LEFT JOIN rfid_cards rc ON rc.student_id = s.id 
     ORDER BY s.id DESC`
  );
  return result.rows;
};

const getStudentById = async (id) => {
  const result = await pool.query(
    `SELECT s.*, rc.rfid_uid 
     FROM students s 
     LEFT JOIN rfid_cards rc ON rc.student_id = s.id 
     WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
};

const createStudent = async (data) => {
  const { student_number, first_name, last_name, gender, class_name, department, email, phone } = data;
  const result = await pool.query(
    `INSERT INTO students 
     (student_number, first_name, last_name, gender, class_name, department, email, phone) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
     RETURNING *`,
    [student_number, first_name, last_name, gender, class_name, department, email, phone]
  );
  return result.rows[0];
};

const updateStudent = async (id, data) => {
  const { first_name, last_name, gender, class_name, department, email, phone, status } = data;
  const result = await pool.query(
    `UPDATE students 
     SET first_name=$1, last_name=$2, gender=$3, class_name=$4, 
         department=$5, email=$6, phone=$7, status=$8, updated_at=CURRENT_TIMESTAMP 
     WHERE id=$9 RETURNING *`,
    [first_name, last_name, gender, class_name, department, email, phone, status, id]
  );
  return result.rows[0];
};

const deactivateStudent = async (id) => {
  const result = await pool.query(
    `UPDATE students SET status='inactive', updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deactivateStudent,
};