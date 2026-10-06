import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { getStudents, deactivateStudent, hardDeleteStudent } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Students() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await getStudents();
    setStudents(res.data.data);
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}? They can no longer scan RFID.`)) return;
    await deactivateStudent(id);
    load();
  };

  const handleHardDelete = async (id, name) => {
    if (
      !window.confirm(
        `⚠️ Permanently DELETE ${name}?\n\nThis will also remove their RFID card and ALL attendance records.\nThis cannot be undone.`
      )
    )
      return;
    await hardDeleteStudent(id);
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
        <Link to="/students/add" className="btn btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Add Student
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/students/${s.id}`}
                      title="View"
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`/students/${s.id}/edit`}
                      title="Edit"
                      className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                    >
                      <Pencil size={15} />
                    </Link>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleDeactivate(s.id, s.first_name)}
                          title="Deactivate"
                          className="text-xs text-slate-500 hover:underline"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleHardDelete(s.id, s.first_name)}
                          title="Delete permanently (admin only)"
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
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