import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Students
export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// RFID Cards
export const getRfidCards = () => API.get('/rfid-cards');
export const assignRfidCard = (data) => API.post('/rfid-cards', data);
export const updateCardStatus = (id, data) => API.put(`/rfid-cards/${id}`, data);

// Attendance
export const getAttendance = () => API.get('/attendance');
export const getTodayReport = () => API.get('/attendance/report/today');
export const simulateScan = (data) => API.post('/attendance/scan', data);

export default API;