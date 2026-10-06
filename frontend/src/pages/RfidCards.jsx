import { useEffect, useState } from 'react';
import { getRfidCards, getStudents, assignRfidCard, updateCardStatus } from '../services/api';

export default function RfidCards() {
  const [cards, setCards] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_id: '', rfid_uid: '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [c, s] = await Promise.all([getRfidCards(), getStudents()]);
    setCards(c.data.data);
    setStudents(s.data.data);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await assignRfidCard({ student_id: parseInt(form.student_id), rfid_uid: form.rfid_uid });
      setMsg({ type: 'success', text: 'Card assigned!' });
      setForm({ student_id: '', rfid_uid: '' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const toggleStatus = async (card) => {
    const next = card.card_status === 'active' ? 'disabled' : 'active';
    await updateCardStatus(card.id, { card_status: next });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">RFID Card Management</h1>

      {msg && (
        <div className={`p-3 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleAssign} className="card grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="input" value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
          <option value="">— Select Student —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.student_number} — {s.first_name} {s.last_name}</option>
          ))}
        </select>
        <input className="input font-mono" placeholder="RFID UID e.g. A342B519" required
          value={form.rfid_uid} onChange={(e) => setForm({ ...form, rfid_uid: e.target.value })} />
        <button className="btn btn-primary">Assign Card</button>
      </form>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-3">All RFID Cards ({cards.length})</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th><th>RFID UID</th><th>Student</th>
              <th>Student #</th><th>Status</th><th>Assigned</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c, i) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="py-2">{i + 1}</td>
                <td className="font-mono text-xs">{c.rfid_uid}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td className="font-mono text-xs">{c.student_number}</td>
                <td>
                  <span className={`badge ${c.card_status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {c.card_status}
                  </span>
                </td>
                <td>{new Date(c.assigned_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => toggleStatus(c)} className="text-xs text-blue-600 hover:underline">
                    {c.card_status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}