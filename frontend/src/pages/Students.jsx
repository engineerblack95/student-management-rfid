import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { getStudents, deleteStudent } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await getStudents();
    setStudents(res.data.data);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}?`)) return;
    await deleteStudent(id);
    load();
  };

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.student_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Students ({students.length})</h1>
        <Link
          to="/students/add"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} /> Add Student
        </Link>
      </div>

      {/* Search box with magnifier icon */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          placeholder="Search by name or student number..."
          className="input pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Student #</th>
              <th>Name</th>
              <th>Class</th>
              <th>Department</th>
              <th>RFID UID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="py-2 font-mono text-xs">{s.student_number}</td>
                <td className="font-medium">{s.first_name} {s.last_name}</td>
                <td>{s.class_name}</td>
                <td>{s.department}</td>
                <td className="font-mono text-xs">
                  {s.rfid_uid || <span className="text-slate-400">—</span>}
                </td>
                <td>
                  <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <Link to={`/students/${s.id}`} className="text-blue-600 hover:underline text-xs">
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id, s.first_name)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}