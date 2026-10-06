export default function Devices() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Devices</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Device ID</th><th>Name</th><th>Location</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-mono">RFID-READER-001</td>
              <td>Main Entrance Reader</td>
              <td>Main Gate</td>
              <td><span className="badge badge-green">online</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          ℹ️ ESP32 device. It sends scans to <code className="font-mono">POST /api/attendance/scan</code> 
        </p>
      </div>
    </div>
  );
}