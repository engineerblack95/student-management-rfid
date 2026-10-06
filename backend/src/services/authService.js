const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'santechhub_secret_key_2026';
const JWT_EXPIRES = '7d';

// ---------- Register ----------
const register = async ({ full_name, email, password, role = 'staff' }) => {
  if (!full_name || !email || !password) {
    throw new Error('full_name, email and password are required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Prevent duplicate email
  const exists = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  if (exists.rows.length > 0) {
    throw new Error('Email already registered');
  }

  // First user becomes admin, others become 'staff' by default
  const countRes = await pool.query(`SELECT COUNT(*) FROM users`);
  const isFirstUser = parseInt(countRes.rows[0].count) === 0;
  const finalRole = isFirstUser ? 'admin' : role;

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, created_at`,
    [full_name, email.toLowerCase(), hash, finalRole]
  );

  const user = result.rows[0];
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return { user, token };
};

// ---------- Login ----------
const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('email and password are required');
  }

  const result = await pool.query(
    `SELECT id, full_name, email, password_hash, role
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

// ---------- Verify token ----------
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { register, login, verifyToken };