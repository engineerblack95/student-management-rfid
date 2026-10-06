import { useEffect, useState } from 'react';
import { Users as UsersIcon, ShieldCheck, UserCog, Trash2, KeyRound } from 'lucide-react';
import { getUsers, updateUserRole, resetUserPassword, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const changeRole = async (u, newRole) => {
    if (!window.confirm(`Change ${u.full_name}'s role to ${newRole}?`)) return;
    try {
      await updateUserRole(u.id, newRole);
      setMsg({ type: 'success', text: `Role updated to ${newRole}` });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const resetPassword = async (u) => {
    const pwd = window.prompt(`New password for ${u.full_name} (min 6 chars):`);
    if (!pwd) return;
    try {
      await resetUserPassword(u.id, pwd);
      setMsg({ type: 'success', text: `Password reset for ${u.full_name}` });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Permanently delete ${u.full_name}? This cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      setMsg({ type: 'success', text: 'User deleted' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UsersIcon size={24} /> User Management
      </h1>

      <div className="card bg-blue-50 border-blue-200 flex items-start gap-3">
        <ShieldCheck size={20} className="text-blue-700 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Only <strong>admin</strong> users can access this page. Admins can change
          roles, reset passwords, and delete other users.
        </p>
      </div>

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

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const isMe = me?.id === u.id;
              return (
                <tr key={u.id} className="border-b hover:bg-slate-50">
                  <td className="py-2">{i + 1}</td>
                  <td className="font-medium">
                    {u.full_name} {isMe && <span className="text-xs text-slate-400">(you)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="text-xs border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                      disabled={isMe}
                    >
                      <option value="admin">admin</option>
                      <option value="staff">staff</option>
                    </select>
                  </td>
                  <td className="text-xs text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="space-x-3">
                    <button
                      onClick={() => resetPassword(u)}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                      title="Reset password"
                    >
                      <KeyRound size={12} /> Reset password
                    </button>
                    <button
                      onClick={() => remove(u)}
                      disabled={isMe}
                      className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isMe ? 'You cannot delete yourself' : 'Delete user'}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}