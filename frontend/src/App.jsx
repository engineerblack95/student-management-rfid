import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentProfile from './pages/StudentProfile';
import RfidCards from './pages/RfidCards';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Devices from './pages/Devices';
import Users from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/students/add" element={<AddStudent />} />
                    <Route path="/students/:id" element={<StudentProfile />} />
                    <Route path="/students/:id/edit" element={<EditStudent />} />
                    <Route path="/rfid-cards" element={<RfidCards />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}