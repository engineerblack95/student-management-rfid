/**
 * RFID Simulator
 * --------------
 * Mimics exactly what the ESP32 + MFRC522 will do tomorrow.
 * Sends HTTP POST to the same /api/attendance/scan endpoint.
 *
 * Usage:
 *   node rfidSimulator.js A342B519
 *   node rfidSimulator.js UNKNOWN999
 */

const API_URL = process.env.API_URL || 'http://localhost:5000/api/attendance/scan';
const DEVICE_ID = process.env.DEVICE_ID || 'RFID-READER-001';

const uid = process.argv[2];

if (!uid) {
  console.log('');
  console.log('❌ Missing RFID UID.');
  console.log('');
  console.log('Usage:');
  console.log('  node rfidSimulator.js <RFID_UID>');
  console.log('');
  console.log('Examples:');
  console.log('  node rfidSimulator.js A342B519   → known card');
  console.log('  node rfidSimulator.js UNKNOWN999 → unknown card');
  console.log('');
  process.exit(1);
}

const simulateHardwareIndicators = (result) => {
  console.log('');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│  HARDWARE INDICATOR (what ESP32 will do)│');
  console.log('└─────────────────────────────────────────┘');

  if (result.success) {
    console.log('  🟢 GREEN LED  : ON');
    console.log('  🟡 YELLOW LED : OFF');
    console.log('  🔴 RED LED    : OFF');
    console.log('  🔊 BUZZER     : 1 short beep');
  } else if (result.message && result.message.toLowerCase().includes('not registered')) {
    console.log('  🟢 GREEN LED  : OFF');
    console.log('  🟡 YELLOW LED : OFF');
    console.log('  🔴 RED LED    : ON');
    console.log('  🔊 BUZZER     : 2 short beeps');
  } else if (result.message && result.message.toLowerCase().includes('duplicate')) {
    console.log('  🟢 GREEN LED  : ON (still present)');
    console.log('  🟡 YELLOW LED : OFF');
    console.log('  🔴 RED LED    : OFF');
    console.log('  🔊 BUZZER     : (silent — already recorded)');
  } else {
    console.log('  🟢 GREEN LED  : OFF');
    console.log('  🟡 YELLOW LED : OFF');
    console.log('  🔴 RED LED    : ON');
    console.log('  🔊 BUZZER     : 1 long beep');
  }
  console.log('');
};

const run = async () => {
  console.log('');
  console.log('📡 RFID Simulator — SAN TECH HUB');
  console.log('─────────────────────────────────');
  console.log(`   Device ID : ${DEVICE_ID}`);
  console.log(`   RFID UID  : ${uid}`);
  console.log(`   API URL   : ${API_URL}`);
  console.log('');
  console.log('🟡 YELLOW LED: ON  (processing...)');

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: DEVICE_ID, rfidUid: uid }),
    });

    const data = await res.json();
    console.log('🟡 YELLOW LED: OFF');
    console.log('');
    console.log('📥 Server response:');
    console.log(JSON.stringify(data, null, 2));

    simulateHardwareIndicators(data);

    if (data.success) {
      console.log(`✅ Attendance recorded for ${data.student.name} (${data.student.studentId})`);
    } else {
      console.log(`❌ ${data.message}`);
    }
    console.log('');
  } catch (err) {
    console.log('🟡 YELLOW LED: OFF');
    console.log('');
    console.log('❌ Network / Server error:', err.message);
    simulateHardwareIndicators({ success: false, message: 'server error' });
  }
};

run();