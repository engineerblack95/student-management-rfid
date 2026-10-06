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

const getStudentFull = async (id) => {
  const studentRes = await pool.query(
    `SELECT s.*, rc.rfid_uid, rc.card_status
     FROM students s
     LEFT JOIN rfid_cards rc ON rc.student_id = s.id
     WHERE s.id = $1`,
    [id]
  );
  if (studentRes.rows.length === 0) return null;

  const attendanceRes = await pool.query(
    `SELECT id, attendance_date, scan_time, status, device_id
     FROM attendance
     WHERE student_id = $1
     ORDER BY scan_time DESC
     LIMIT 50`,
    [id]
  );

  return {
    student: studentRes.rows[0],
    attendance: attendanceRes.rows,
  };
};

const createStudent = async (data) => {
  const {
    student_number, first_name, last_name, gender,
    class_name, department, email, phone,
  } = data;

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
  const {
    first_name, last_name, gender, class_name,
    department, email, phone, status,
  } = data;

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

const hardDeleteStudent = async (id) => {
  const result = await pool.query(
    `DELETE FROM students WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rows.length === 0) throw new Error('Student not found');
  return result.rows[0];
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentFull,
  createStudent,
  updateStudent,
  deactivateStudent,
  hardDeleteStudent,
};