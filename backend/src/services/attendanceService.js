const pool = require('../config/db');

// ---------- Helpers ----------
const normalizeUid = (uid) => String(uid || '').trim().toUpperCase();

// ---------- Process scan ----------
const processScan = async ({ deviceId, rfidUid }) => {
  if (!deviceId || !rfidUid) {
    return { success: false, message: 'deviceId and rfidUid are required' };
  }

  const uid = normalizeUid(rfidUid);
  if (!uid) {
    return { success: false, message: 'Invalid RFID UID' };
  }

  const cardResult = await pool.query(
    `SELECT rc.*, s.id AS student_id, s.student_number, s.first_name, s.last_name,
            s.class_name, s.status AS student_status
     FROM rfid_cards rc
     JOIN students s ON s.id = rc.student_id
     WHERE UPPER(TRIM(rc.rfid_uid)) = $1`,
    [uid]
  );

  if (cardResult.rows.length === 0) {
    return { success: false, message: 'RFID card not registered' };
  }

  const card = cardResult.rows[0];

  if (card.card_status !== 'active') {
    return { success: false, message: `Card is ${card.card_status}` };
  }

  if (card.student_status !== 'active') {
    return { success: false, message: 'Student is inactive' };
  }

  const dupCheck = await pool.query(
    `SELECT id FROM attendance
     WHERE student_id = $1 AND scan_time > NOW() - INTERVAL '60 seconds'`,
    [card.student_id]
  );

  if (dupCheck.rows.length > 0) {
    return {
      success: false,
      message: 'Duplicate scan — attendance already recorded',
      student: {
        studentId: card.student_number,
        name: `${card.first_name} ${card.last_name}`,
        className: card.class_name,
      },
    };
  }

  const insertResult = await pool.query(
    `INSERT INTO attendance (student_id, rfid_uid, device_id, status)
     VALUES ($1, $2, $3, 'present') RETURNING *`,
    [card.student_id, uid, deviceId]
  );

  return {
    success: true,
    message: 'Attendance recorded',
    student: {
      studentId: card.student_number,
      name: `${card.first_name} ${card.last_name}`,
      className: card.class_name,
    },
    attendance: insertResult.rows[0],
  };
};

// ---------- Attendance history ----------
const getAttendance = async () => {
  const result = await pool.query(
    `SELECT a.*, s.first_name, s.last_name, s.student_number, s.class_name
     FROM attendance a
     JOIN students s ON s.id = a.student_id
     ORDER BY a.scan_time DESC
     LIMIT 200`
  );
  return result.rows;
};

// ---------- Today's summary ----------
const getTodayReport = async () => {
  const totalStudents = await pool.query(
    `SELECT COUNT(*) FROM students WHERE status = 'active'`
  );
  const presentToday = await pool.query(
    `SELECT COUNT(DISTINCT student_id) FROM attendance
     WHERE attendance_date = CURRENT_DATE`
  );
  const scansToday = await pool.query(
    `SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE`
  );
  const activeCards = await pool.query(
    `SELECT COUNT(*) FROM rfid_cards WHERE card_status = 'active'`
  );
  const devicesOnline = await pool.query(
    `SELECT COUNT(*) FROM devices WHERE status = 'online'`
  );

  const total = parseInt(totalStudents.rows[0].count);
  const present = parseInt(presentToday.rows[0].count);

  return {
    totalStudents: total,
    presentToday: present,
    absentToday: total - present,
    activeRfidCards: parseInt(activeCards.rows[0].count),
    scansToday: parseInt(scansToday.rows[0].count),
    devicesOnline: parseInt(devicesOnline.rows[0].count),
  };
};

// ---------- Delete an attendance record (admin only) ----------
const deleteAttendance = async (id) => {
  const result = await pool.query(
    `DELETE FROM attendance WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rows.length === 0) throw new Error('Attendance record not found');
  return result.rows[0];
};

module.exports = { processScan, getAttendance, getTodayReport, deleteAttendance };