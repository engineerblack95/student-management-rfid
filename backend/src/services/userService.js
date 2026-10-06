const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, full_name, email, role, created_at
     FROM users ORDER BY id ASC`
  );
  return result.rows;
};

const updateUserRole = async (id, role) => {
  const allowed = ['admin', 'staff'];
  if (!allowed.includes(role)) {
    throw new Error(`Role must be one of: ${allowed.join(', ')}`);
  }
  const result = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2
     RETURNING id, full_name, email, role`,
    [role, id]
  );
  if (result.rows.length === 0) throw new Error('User not found');
  return result.rows[0];
};

const resetPassword = async (id, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  const hash = await bcrypt.hash(newPassword, 10);
  const result = await pool.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2
     RETURNING id, full_name, email`,
    [hash, id]
  );
  if (result.rows.length === 0) throw new Error('User not found');
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1
     RETURNING id, full_name, email`,
    [id]
  );
  if (result.rows.length === 0) throw new Error('User not found');
  return result.rows[0];
};

module.exports = { getAllUsers, updateUserRole, resetPassword, deleteUser };