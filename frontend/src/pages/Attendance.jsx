import { useEffect, useState } from 'react';
import {
  FlaskConical,
  Radio,
  CheckCircle2,
  XCircle,
  History,
  User,
  Trash2,
} from 'lucide-react';
import { getAttendance, simulateScan, deleteAttendance } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [records, setRecords] = useState([]);
  const [uid, setUid] = useState('A342B519');
  const [deviceId, setDeviceId] = useState('RFID-READER-001');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await getAttendance();
    setRecords(res.data.data);
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateScan({ deviceId, rfidUid: uid });
      setResult(res.data);
      load();
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (r) => {
    if (!window.confirm(`Delete attendance record #${r.id}? This cannot be undone.`)) return;
    try {
      await deleteAttendance(r.id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance & RFID Simulator</h1>

      <div className="card border-l-4 border-blue-500">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FlaskConical size={18} /> RFID Scan Simulator
          <span className="text-xs text-slate-400 font-normal">
            (as ESP32 will do tomorrow)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input font-mono"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="RFID UID"
          />
          <input
            className="input font-mono"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Device ID"
          />
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="btn btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Radio size={16} /> {loading ? 'Sending...' : 'Simulate Scan'}
          </button>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {result.success ? (
              <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={22} className="mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {result.success ? 'ACCEPTED' : 'REJECTED'}
              </p>
              <p>{result.message}</p>
              {result.student && (
                <p className="text-sm mt-1 inline-flex items-center gap-1.5">
                  <User size={14} /> {result.student.name} ({result.student.studentId}) — {result.student.className}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <History size={18} /> Attendance History ({records.length})
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th>
              <th>Student</th>
              <th>Class</th>
              <th>RFID UID</th>
              <th>Device</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
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
                <td>
                  <span className="badge badge-green">{r.status}</span>
                </td>
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => handleDelete(r)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      title="Delete record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="py-6 text-center text-slate-400">
                  No attendance yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}