-- Migration: Create missing tables for NIS system
-- Run this in phpMyAdmin on your cPanel server
-- Database: ganiedu_nis_db (or your actual database name)

-- 1. governorates table
CREATE TABLE IF NOT EXISTS governorates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id VARCHAR(50) PRIMARY KEY,
  application_number VARCHAR(25) UNIQUE,
  student_name VARCHAR(255) NOT NULL,
  student_name_ar VARCHAR(255),
  student_dob DATE,
  student_national_id VARCHAR(20) UNIQUE,
  student_birth_certificate VARCHAR(100),
  grade_stage VARCHAR(50),
  grade_class VARCHAR(50),
  parent_name VARCHAR(255),
  parent_name_ar VARCHAR(255),
  parent_phone VARCHAR(50),
  parent_email VARCHAR(255),
  parent_national_id VARCHAR(20),
  parent_job VARCHAR(255),
  address TEXT,
  has_sibling BOOLEAN DEFAULT FALSE,
  sibling_school VARCHAR(255),
  passport_number VARCHAR(50) UNIQUE,
  id_type ENUM('national_id', 'passport', 'both') DEFAULT 'national_id',
  documents JSON,
  status ENUM('pending','under_review','accepted','waitlist','rejected','modification_requested') DEFAULT 'pending',
  accepted_school_id VARCHAR(50),
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_national_id (student_national_id),
  INDEX idx_passport (passport_number),
  INDEX idx_application_number (application_number),
  INDEX idx_status (status),
  INDEX idx_email (parent_email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. admission_preferences table
CREATE TABLE IF NOT EXISTS admission_preferences (
  id VARCHAR(50) PRIMARY KEY,
  admission_id VARCHAR(50) NOT NULL,
  school_id VARCHAR(50) NOT NULL,
  preference_order INT NOT NULL CHECK (preference_order BETWEEN 1 AND 10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admission (admission_id),
  INDEX idx_school (school_id),
  UNIQUE KEY unique_preference (admission_id, preference_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. modification_requests table
CREATE TABLE IF NOT EXISTS modification_requests (
  id VARCHAR(50) PRIMARY KEY,
  request_number VARCHAR(30) UNIQUE NOT NULL,
  admission_id VARCHAR(50) NOT NULL,
  national_id_suffix VARCHAR(4) NOT NULL,
  requested_preferences JSON NOT NULL,
  request_reason TEXT NOT NULL,
  status ENUM('pending','approved','rejected','completed') DEFAULT 'pending',
  admin_response TEXT,
  reviewed_by VARCHAR(50),
  reviewed_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_request_number (request_number),
  INDEX idx_admission (admission_id),
  INDEX idx_status (status),
  INDEX idx_national_suffix (national_id_suffix)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(50) PRIMARY KEY,
  complaint_number VARCHAR(20) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message_type VARCHAR(50),
  school VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('pending','under_review','resolved','rejected') DEFAULT 'pending',
  admin_response TEXT,
  priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
  assigned_to VARCHAR(50),
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_type (message_type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(50) PRIMARY KEY,
  message_number VARCHAR(20) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('pending','read','replied','archived') DEFAULT 'pending',
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id VARCHAR(50) PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE,
  job_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume_path TEXT,
  cover_letter TEXT,
  experience_years INT,
  current_employer VARCHAR(255),
  education_level VARCHAR(100),
  status ENUM('pending','under_review','shortlisted','rejected','hired') DEFAULT 'pending',
  admin_notes TEXT,
  interview_date DATETIME,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_job (job_id),
  INDEX idx_status (status),
  INDEX idx_applied (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. job_departments table
CREATE TABLE IF NOT EXISTS job_departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort (sort_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default governorates (optional)
INSERT IGNORE INTO governorates (id, name, nameAr) VALUES 
('1', 'Cairo', 'القاهرة'), 
('2', 'Alexandria', 'الإسكندرية'), 
('3', 'Giza', 'الجيزة'),
('4', 'Qalyubia', 'القليوبية'),
('5', 'Port Said', 'بورسعيد'),
('6', 'Suez', 'السويس'),
('7', 'Luxor', 'الأقصر'),
('8', 'Aswan', 'أسوان'),
('9', 'Dakahlia', 'الدقهلية'),
('10', 'Gharbia', 'الغربية'),
('11', 'Kafr El Sheikh', 'كفر الشيخ'),
('12', 'Monufia', 'المنوفية'),
('13', 'Sharqia', 'الشرقية'),
('14', 'Damietta', 'دمياط'),
('15', 'Ismailia', 'الإسماعيلية'),
('16', 'Faiyum', 'الفيوم'),
('17', 'Beni Suef', 'بني سويف'),
('18', 'Minya', 'المنيا'),
('19', 'Asyut', 'أسيوط'),
('20', 'Sohag', 'سوهاج'),
('21', 'Qena', 'قنا'),
('22', 'Red Sea', 'البحر الأحمر'),
('23', 'Beheira', 'البحيرة'),
('24', 'New Valley', 'الوادي الجديد'),
('25', 'Matruh', 'مرسى مطروح'),
('26', 'North Sinai', 'شمال سيناء'),
('27', 'South Sinai', 'جنوب سيناء');
