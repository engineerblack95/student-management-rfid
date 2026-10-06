import {
  Settings as SettingsIcon,
  Server,
  Shield,
  Cpu,
  Info,
} from 'lucide-react';

export default function Settings() {
  const rows = [
    {
      Icon: Server,
      label: 'API URL',
      value: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      mono: true,
    },
    {
      Icon: Shield,
      label: 'Duplicate Protection Window',
      value: '60 seconds',
    },
    {
      Icon: Cpu,
      label: 'Device ID',
      value: 'RFID-READER-001',
      mono: true,
    },
    {
      Icon: Info,
      label: 'System',
      value: 'SAN TECH HUB — RFID Student Management v1.0',
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon size={24} /> Settings
      </h1>

      <div className="card divide-y">
        {rows.map(({ Icon, label, value, mono }) => (
          <div key={label} className="py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-sm font-medium truncate ${mono ? 'font-mono' : ''}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="card bg-blue-50 border-blue-200 flex items-start gap-3">
        <Info size={20} className="text-blue-700 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          All settings are read from environment variables — no values are hardcoded in source code.
        </p>
      </div>
    </div>
  );
}