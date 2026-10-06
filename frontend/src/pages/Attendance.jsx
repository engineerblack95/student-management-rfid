import { useEffect, useState } from 'react';
import { getAttendance, simulateScan } from '../services/api';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [uid, setUid] = useState('A342B519');
  const [deviceId, setDeviceId] = useState('RFID-READER-001');
  const [result, setResult] = useState(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const res = await getAttendance();
    setRecords(res.data.data);
  };

  const handleSimulate = async () => {
    try {
      const res = await simulateScan({ deviceId, rfidUid: uid });
      setResult(res.data);
      load();
    } catch (err) {
      setResult({ success: false, message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance & RFID Simulator</h1>

      {/* Simulator Card */}
      <div className="card border-l-4 border-blue-500">
        <h3 className="font-semibold mb-3">🧪 RFID Scan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="input font-mono" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="RFID UID" />
          <input className="input font-mono" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="Device ID" />
          <button onClick={handleSimulate} className="btn btn-primary">📡  Scan Now</button>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-bold">{result.success ? '✅ ACCEPTED' : '❌ REJECTED'}</p>
            <p>{result.message}</p>
            {result.student && (
              <p className="text-sm mt-1">
                👤 {result.student.name} ({result.student.studentId}) — {result.student.className}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-3">📅 Attendance History ({records.length})</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th><th>Student</th><th>Class</th>
              <th>RFID UID</th><th>Device</th><th>Date</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-2">{i + 1}</td>
                <td>{r.first_name} {r.last_name}</td>
                <td>{r.class_name}</td>
                <td className="font-mono text-xs">{r.rfid_uid}</td>
                <td>{r.device_id}</td>
                <td>{r.attendance_date?.slice(0, 10)}</td>
                <td>{new Date(r.scan_time).toLocaleTimeString()}</td>
                <td><span className="badge badge-green">{r.status}</span></td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="8" className="py-6 text-center text-slate-400">No attendance yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}