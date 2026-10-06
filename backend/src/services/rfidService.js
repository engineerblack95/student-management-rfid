const pool = require('../config/db');

// ---------- Helpers ----------
const normalizeUid = (uid) => String(uid || '').trim().toUpperCase();

const isValidUid = (uid) => /^[A-F0-9]{4,32}$/.test(uid);

// ---------- Read ----------
const getAllCards = async () => {
  const result = await pool.query(
    `SELECT rc.*, s.first_name, s.last_name, s.student_number
     FROM rfid_cards rc
     JOIN students s ON s.id = rc.student_id
     ORDER BY rc.id DESC`
  );
  return result.rows;
};

const getCardByUid = async (rfid_uid) => {
  const uid = normalizeUid(rfid_uid);
  const result = await pool.query(
    `SELECT rc.*, s.first_name, s.last_name, s.student_number
     FROM rfid_cards rc
     JOIN students s ON s.id = rc.student_id
     WHERE rc.rfid_uid = $1`,
    [uid]
  );
  return result.rows[0];
};

// ---------- Assign ----------
const assignCard = async ({ student_id, rfid_uid }) => {
  // 1. Validate input
  if (!student_id) {
    throw new Error('student_id is required');
  }

  const uid = normalizeUid(rfid_uid);

  if (!uid) {
    throw new Error('RFID UID is required');
  }

  if (!isValidUid(uid)) {
    throw new Error('Invalid RFID UID format. Use 4–32 hex characters (0-9, A-F).');
  }

  // 2. Verify the student exists
  const student = await pool.query(
    `SELECT id FROM students WHERE id = $1`,
    [student_id]
  );
  if (student.rows.length === 0) {
    throw new Error('Student not found');
  }

  // 3. Check UID not already assigned (case-insensitive, trimmed)
  const uidTaken = await pool.query(
    `SELECT id, student_id FROM rfid_cards WHERE UPPER(TRIM(rfid_uid)) = $1`,
    [uid]
  );
  if (uidTaken.rows.length > 0) {
    throw new Error('This RFID UID is already assigned to another student');
  }

  // 4. Ensure the student does not already have an active card
  const existingActive = await pool.query(
    `SELECT id, rfid_uid FROM rfid_cards
     WHERE student_id = $1 AND card_status = 'active'`,
    [student_id]
  );
  if (existingActive.rows.length > 0) {
    throw new Error(
      `This student already has an active card (${existingActive.rows[0].rfid_uid}). ` +
      `Disable it first before assigning a new one.`
    );
  }

  // 5. Insert
  const result = await pool.query(
    `INSERT INTO rfid_cards (student_id, rfid_uid, card_status)
     VALUES ($1, $2, 'active')
     RETURNING *`,
    [student_id, uid]
  );

  return result.rows[0];
};

// ---------- Update status ----------
const updateCardStatus = async (id, card_status) => {
  const allowed = ['active', 'disabled', 'lost'];
  if (!allowed.includes(card_status)) {
    throw new Error(`card_status must be one of: ${allowed.join(', ')}`);
  }

  const result = await pool.query(
    `UPDATE rfid_cards
     SET card_status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [card_status, id]
  );

  if (result.rows.length === 0) {
    throw new Error('RFID card not found');
  }

  return result.rows[0];
};

module.exports = {
  getAllCards,
  getCardByUid,
  assignCard,
  updateCardStatus,
};