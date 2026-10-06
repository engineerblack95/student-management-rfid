import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (!student) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <button onClick={() => navigate(-1)} className="text-blue-600 text-sm">← Back</button>
      <h1 className="text-2xl font-bold">Student Profile</h1>

      <div className="card space-y-2">
        <p><strong>Student #:</strong> {student.student_number}</p>
        <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Class:</strong> {student.class_name}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>RFID UID:</strong> <span className="font-mono">{student.rfid_uid || '—'}</span></p>
        <p><strong>Status:</strong> <span className={`badge ${student.status === 'active' ? 'badge-green' : 'badge-red'}`}>{student.status}</span></p>
      </div>
    </div>
  );
}