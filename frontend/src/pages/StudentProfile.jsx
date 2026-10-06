import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2, XCircle } from 'lucide-react';
import { getStudent } from '../services/api';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getStudent(id);
      setStudent(res.data.data);
    })();
  }, [id]);

  if (!student) {
    return <p className="text-slate-400">Loading...</p>;
  }

  const rows = [
    { label: 'Student #',  value: student.student_number },
    { label: 'Name',       value: `${student.first_name} ${student.last_name}` },
    { label: 'Gender',     value: student.gender },
    { label: 'Class',      value: student.class_name },
    { label: 'Department', value: student.department },
    { label: 'Email',      value: student.email },
    { label: 'Phone',      value: student.phone },
    { label: 'RFID UID',   value: student.rfid_uid || '—', mono: true },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User size={24} /> Student Profile
      </h1>

      <div className="card divide-y">
        {rows.map((r) => (
          <div key={r.label} className="py-2 flex justify-between">
            <span className="text-slate-500 text-sm">{r.label}</span>
            <span className={r.mono ? 'font-mono text-sm' : 'font-medium'}>
              {r.value}
            </span>
          </div>
        ))}

        {/* Status row with icon badge */}
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500 text-sm">Status</span>
          <span
            className={`badge inline-flex items-center gap-1 ${
              student.status === 'active' ? 'badge-green' : 'badge-red'
            }`}
          >
            {student.status === 'active' ? (
              <CheckCircle2 size={12} />
            ) : (
              <XCircle size={12} />
            )}
            {student.status}
          </span>
        </div>
      </div>
    </div>
  );
}