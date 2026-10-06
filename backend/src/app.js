const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const rfidRoutes = require('./routes/rfidRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'RFID Attendance API is running 🚀' });
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/rfid-cards', rfidRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;