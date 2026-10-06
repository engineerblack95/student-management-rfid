import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent, assignRfidCard } from '../services/api';

export default function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_number: '', first_name: '', last_name: '', gender: 'Male',
    class_name: '', department: '', email: '', phone: '',
  });
  const [rfidUid, setRfidUid] = useState('');
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createStudent(form);
      const studentId = res.data.data.id;

      if (rfidUid.trim()) {
        await assignRfidCard({ student_id: studentId, rfid_uid: rfidUid.trim() });
      }
      setMsg({ type: 'success', text: 'Student added successfully!' });
      setTimeout(() => navigate('/students'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">Add New Student</h1>

      {msg && (
        <div className={`p-3 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm">Student Number *</label>
            <input name="student_number" required className="input" value={form.student_number} onChange={handleChange} /></div>
          <div><label className="text-sm">Gender</label>
            <select name="gender" className="input" value={form.gender} onChange={handleChange}>
              <option>Male</option><option>Female</option>
            </select></div>
          <div><label className="text-sm">First Name *</label>
            <input name="first_name" required className="input" value={form.first_name} onChange={handleChange} /></div>
          <div><label className="text-sm">Last Name *</label>
            <input name="last_name" required className="input" value={form.last_name} onChange={handleChange} /></div>
          <div><label className="text-sm">Class</label>
            <input name="class_name" className="input" value={form.class_name} onChange={handleChange} /></div>
          <div><label className="text-sm">Department</label>
            <input name="department" className="input" value={form.department} onChange={handleChange} /></div>
          <div><label className="text-sm">Email</label>
            <input name="email" type="email" className="input" value={form.email} onChange={handleChange} /></div>
          <div><label className="text-sm">Phone</label>
            <input name="phone" className="input" value={form.phone} onChange={handleChange} /></div>
          <div className="col-span-2"><label className="text-sm">RFID UID (optional — assign card now)</label>
            <input className="input font-mono" placeholder="e.g. A342B519"
              value={rfidUid} onChange={(e) => setRfidUid(e.target.value)} /></div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">Save Student</button>
          <button type="button" onClick={() => navigate('/students')} className="btn bg-slate-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}