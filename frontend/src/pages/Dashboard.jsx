import { useEffect, useState } from 'react';
import { getTodayReport, getAttendance } from '../services/api';

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const r = await getTodayReport();
      setReport(r.data.data);
      const a = await getAttendance();
      setLatest(a.data.data.slice(0, 8));
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    { label: 'Total Students',  value: report?.totalStudents ?? '—', color: 'bg-blue-500',   icon: '👥' },
    { label: 'Present Today',   value: report?.presentToday ?? '—',  color: 'bg-green-500',  icon: '✅' },
    { label: 'Absent Today',    value: report?.absentToday ?? '—',   color: 'bg-red-500',    icon: '❌' },
    { label: 'Active RFID Cards', value: report?.activeRfidCards ?? '—', color: 'bg-purple-500', icon: '💳' },
    { label: 'Scans Today',     value: report?.scansToday ?? '—',    color: 'bg-yellow-500', icon: '📡' },
    { label: 'Devices Online',  value: report?.devicesOnline ?? '—', color: 'bg-teal-500',   icon: '🖥️' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4">
            <div className={`${c.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl`}>
              {c.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Scans */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 mb-3">📋 Latest RFID Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">#</th>
                <th>Student</th>
                <th>Class</th>
                <th>RFID UID</th>
                <th>Device</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latest.length === 0 ? (
                <tr><td colSpan="7" className="py-6 text-center text-slate-400">
                  No scans yet. Simulate one from the Attendance page.
                </td></tr>
              ) : latest.map((r, i) => (
                <tr key={r.id} className="border-b hover:bg-slate-50">
                  <td className="py-2">{i + 1}</td>
                  <td className="font-medium">{r.first_name} {r.last_name}</td>
                  <td>{r.class_name}</td>
                  <td className="font-mono text-xs">{r.rfid_uid}</td>
                  <td>{r.device_id}</td>
                  <td>{new Date(r.scan_time).toLocaleString()}</td>
                  <td><span className="badge badge-green">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}