-- ============================================
-- STUDENT MANAGEMENT & RFID ATTENDANCE SYSTEM
-- PostgreSQL Schema
-- ============================================

-- Drop tables if they exist (for clean re-run)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS rfid_cards CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE (Admin login)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. STUDENTS TABLE
-- ============================================
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    class_name VARCHAR(50),
    department VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. RFID CARDS TABLE
-- ============================================
CREATE TABLE rfid_cards (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    rfid_uid VARCHAR(50) UNIQUE NOT NULL,
    card_status VARCHAR(20) DEFAULT 'active',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    rfid_uid VARCHAR(50),
    attendance_date DATE DEFAULT CURRENT_DATE,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'present',
    device_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. DEVICES TABLE (ESP32 readers)
-- ============================================
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'online',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_rfid_uid ON rfid_cards(rfid_uid);
CREATE INDEX idx_students_status ON students(status);

-- ============================================
-- SEED DATA — Admin user + sample device
-- ============================================
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('Administrator', 'admin@santechhub.com', 'admin123', 'admin');

INSERT INTO devices (device_id, device_name, location, status)
VALUES ('RFID-READER-001', 'Main Entrance Reader', 'Main Gate', 'online');

-- ============================================
-- DONE
-- ============================================