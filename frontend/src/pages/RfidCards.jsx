import { useEffect, useState } from 'react';
import { CreditCard, Plus, CheckCircle2, XCircle, Pencil, Trash2, Save, X } from 'lucide-react';
import {
  getRfidCards,
  getStudents,
  assignRfidCard,
  updateCardStatus,
  updateCardUid,
  deleteRfidCard,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RfidCards() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [cards, setCards] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_id: '', rfid_uid: '' });
  const [msg, setMsg] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editUid, setEditUid] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [c, s] = await Promise.all([getRfidCards(), getStudents()]);
    setCards(c.data.data);
    setStudents(s.data.data);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await assignRfidCard({
        student_id: parseInt(form.student_id),
        rfid_uid: form.rfid_uid,
      });
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

  const startEdit = (card) => {
    setEditingId(card.id);
    setEditUid(card.rfid_uid);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUid('');
  };

  const saveEdit = async (id) => {
    try {
      await updateCardUid(id, { rfid_uid: editUid });
      setMsg({ type: 'success', text: 'RFID UID updated' });
      cancelEdit();
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const handleDelete = async (card) => {
    if (!window.confirm(`Delete card ${card.rfid_uid}? This cannot be undone.`)) return;
    try {
      await deleteRfidCard(card.id);
      setMsg({ type: 'success', text: 'Card deleted' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard size={24} /> RFID Card Management
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

      <form onSubmit={handleAssign} className="card grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="input"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          required
        >
          <option value="">— Select Student —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.student_number} — {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <input
          className="input font-mono"
          placeholder="RFID UID e.g. A342B519"
          required
          value={form.rfid_uid}
          onChange={(e) => setForm({ ...form, rfid_uid: e.target.value })}
        />

        <button className="btn btn-primary inline-flex items-center justify-center gap-2">
          <Plus size={16} /> Assign Card
        </button>
      </form>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-3">All RFID Cards ({cards.length})</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th>
              <th>RFID UID</th>
              <th>Student</th>
              <th>Student #</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c, i) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="py-2">{i + 1}</td>
                <td className="font-mono text-xs">
                  {editingId === c.id ? (
                    <input
                      className="input py-1 px-2 text-xs font-mono"
                      value={editUid}
                      onChange={(e) => setEditUid(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    c.rfid_uid
                  )}
                </td>
                <td>{c.first_name} {c.last_name}</td>
                <td className="font-mono text-xs">{c.student_number}</td>
                <td>
                  <span
                    className={`badge inline-flex items-center gap-1 ${
                      c.card_status === 'active' ? 'badge-green' : 'badge-red'
                    }`}
                  >
                    {c.card_status === 'active' ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {c.card_status}
                  </span>
                </td>
                <td>{new Date(c.assigned_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {editingId === c.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(c.id)}
                          className="p-1.5 rounded hover:bg-green-50 text-green-600"
                          title="Save"
                        >
                          <Save size={15} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                          title="Cancel"
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleStatus(c)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {c.card_status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => startEdit(c)}
                              className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                              title="Edit UID"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(c)}
                              className="p-1.5 rounded hover:bg-red-50 text-red-600"
                              title="Delete card"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400">
                  No RFID cards assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}