import { useEffect, useState } from 'react';
import { getTodayReport, getAttendance } from '../services/api';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await getTodayReport();
      setReport(r.data.data);
      const a = await getAttendance();
      setRecords(a.data.data);
    })();
  }, []);

  const byClass = records.reduce((acc, r) => {
    acc[r.class_name] = (acc[r.class_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports — Today</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {report && Object.entries(report).map(([k, v]) => (
          <div key={k} className="card">
            <p className="text-xs text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">📊 Scans by Class</h3>
        {Object.keys(byClass).length === 0 ? (
          <p className="text-slate-400">No data.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(byClass).map(([cls, count]) => (
              <li key={cls} className="flex justify-between border-b pb-1">
                <span>{cls || 'Unknown'}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}