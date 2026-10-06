import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  CalendarCheck,
  BarChart3,
  Radio,
  Settings,
  Wifi,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menu = [
  { name: 'Dashboard',   path: '/',             Icon: LayoutDashboard },
  { name: 'Students',    path: '/students',     Icon: Users },
  { name: 'Add Student', path: '/students/add', Icon: UserPlus },
  { name: 'RFID Cards',  path: '/rfid-cards',   Icon: CreditCard },
  { name: 'Attendance',  path: '/attendance',   Icon: CalendarCheck },
  { name: 'Reports',     path: '/reports',      Icon: BarChart3 },
  { name: 'Devices',     path: '/devices',      Icon: Radio },
  { name: 'Users',       path: '/users',        Icon: ShieldCheck, adminOnly: true },
  { name: 'Settings',    path: '/settings',     Icon: Settings },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    if (window.confirm('Sign out?')) {
      logout();
      navigate('/login');
    }
  };

  const visibleMenu = menu.filter((m) => !m.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-xl font-bold">SAN TECH HUB</h1>
          <p className="text-xs text-slate-400">RFID Attendance System</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {visibleMenu.map(({ name, path, Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          © 2026 SAN TECH HUB
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">
            Student Management & RFID Attendance
          </h2>

          <div className="flex items-center gap-3">
            <span className="badge badge-green inline-flex items-center gap-1.5">
              <Wifi size={12} strokeWidth={2.5} /> System Online
            </span>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium text-slate-700">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || 'staff'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-1 p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}