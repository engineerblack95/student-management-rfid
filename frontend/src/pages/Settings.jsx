export default function Settings() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="card space-y-2">
        <p><strong>API URL:</strong> <code className="font-mono">{import.meta.env.VITE_API_URL}</code></p>
        <p><strong>Duplicate Protection Window:</strong> 60 seconds</p>
        <p><strong>Device ID:</strong> RFID-READER-001</p>
        <p><strong>System:</strong> SAN TECH HUB — RFID Student Management v1.0</p>
      </div>
    </div>
  );
}