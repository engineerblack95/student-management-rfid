import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';

const menu = [
  { name: 'Dashboard',   path: '/',             Icon: LayoutDashboard },
  { name: 'Students',    path: '/students',     Icon: Users },
  { name: 'Add Student', path: '/students/add', Icon: UserPlus },
  { name: 'RFID Cards',  path: '/rfid-cards',   Icon: CreditCard },
  { name: 'Attendance',  path: '/attendance',   Icon: CalendarCheck },
  { name: 'Reports',     path: '/reports',      Icon: BarChart3 },
  { name: 'Devices',     path: '/devices',      Icon: Radio },
  { name: 'Settings',    path: '/settings',     Icon: Settings },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-xl font-bold">SAN TECH HUB</h1>
          <p className="text-xs text-slate-400">RFID Attendance System</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menu.map(({ name, path, Icon }) => {
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">
            Student Management & RFID Attendance
          </h2>
          <div className="flex items-center gap-3">
            <span className="badge badge-green inline-flex items-center gap-1.5">
              <Wifi size={12} strokeWidth={2.5} /> System Online
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}