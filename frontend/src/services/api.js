import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ---------- Request: attach JWT ----------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rfid_auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Response: auto-logout on 401 ----------
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rfid_auth_token');
      localStorage.removeItem('rfid_auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ---------- Auth ----------
export const authRegister = (data) => API.post('/auth/register', data);
export const authLogin = (data) => API.post('/auth/login', data);
export const authMe = () => API.get('/auth/me');

// ---------- Students ----------
export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const getStudentFull = (id) => API.get(`/students/${id}/full`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deactivateStudent = (id) => API.delete(`/students/${id}`);
export const hardDeleteStudent = (id) => API.delete(`/students/${id}/hard`);

// ---------- RFID Cards ----------
export const getRfidCards = () => API.get('/rfid-cards');
export const assignRfidCard = (data) => API.post('/rfid-cards', data);
export const updateCardStatus = (id, data) => API.put(`/rfid-cards/${id}`, data);
export const updateCardUid = (id, data) => API.put(`/rfid-cards/${id}/uid`, data);
export const deleteRfidCard = (id) => API.delete(`/rfid-cards/${id}`);

// ---------- Attendance ----------
export const getAttendance = () => API.get('/attendance');
export const getTodayReport = () => API.get('/attendance/report/today');
export const simulateScan = (data) => API.post('/attendance/scan', data);
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);

// ---------- Users (admin) ----------
export const getUsers = () => API.get('/users');
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });
export const resetUserPassword = (id, password) =>
  API.put(`/users/${id}/password`, { password });
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;