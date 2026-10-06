import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Pencil } from 'lucide-react';
import { getStudent, updateStudent } from '../services/api';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getStudent(id);
      const s = res.data.data;
      setForm({
        student_number: s.student_number || '',
        first_name: s.first_name || '',
        last_name: s.last_name || '',
        gender: s.gender || 'Male',
        class_name: s.class_name || '',
        department: s.department || '',
        email: s.email || '',
        phone: s.phone || '',
        status: s.status || 'active',
      });
    })();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudent(id, form);
      setMsg({ type: 'success', text: 'Student updated successfully!' });
      setTimeout(() => navigate(`/students/${id}`), 1000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Pencil size={24} /> Edit Student
      </h1>

      {msg && (
        <div
          className={`p-3 rounded-lg ${
            msg.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Student Number *</label>
            <input
              name="student_number"
              required
              className="input"
              value={form.student_number}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Status</label>
            <select
              name="status"
              className="input"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div>
            <label className="text-sm">First Name *</label>
            <input
              name="first_name"
              required
              className="input"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name *</label>
            <input
              name="last_name"
              required
              className="input"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Gender</label>
            <select
              name="gender"
              className="input"
              value={form.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Class</label>
            <input
              name="class_name"
              className="input"
              value={form.class_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Department</label>
            <input
              name="department"
              className="input"
              value={form.department}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Phone</label>
            <input
              name="phone"
              className="input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/students/${id}`)}
            className="btn bg-slate-200 inline-flex items-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}