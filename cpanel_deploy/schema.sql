-- schema.sql
CREATE DATABASE IF NOT EXISTS national_institues_db;
USE national_institues_db;

CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nameAr VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    locationAr VARCHAR(255) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    governorateAr VARCHAR(100) NOT NULL,
    principal VARCHAR(255) NOT NULL,
    principalAr VARCHAR(255),
    logo TEXT,
    type VARCHAR(255),
    mainImage TEXT,
    gallery JSON,
    about TEXT,
    aboutAr TEXT,
    phone VARCHAR(100),
    email VARCHAR(255),
    website TEXT,
    rating VARCHAR(50),
    studentCount VARCHAR(50),
    foundedYear VARCHAR(50),
    address TEXT,
    addressAr TEXT,
    applicationLink TEXT
);

CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    titleAr VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    summary TEXT,
    summaryAr TEXT,
    content LONGTEXT,
    contentAr LONGTEXT,
    highlightTitle VARCHAR(255),
    highlightTitleAr VARCHAR(255),
    highlightContent LONGTEXT,
    highlightContentAr LONGTEXT,
    image TEXT,
    published TINYINT(1) DEFAULT 1,
    featured TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    titleAr VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    departmentAr VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    locationAr VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    typeAr VARCHAR(50) NOT NULL,
    description TEXT,
    descriptionAr TEXT,
    image TEXT
);

CREATE TABLE IF NOT EXISTS alumni (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nameAr VARCHAR(255) NOT NULL,
    image TEXT,
    school VARCHAR(255),
    schoolAr VARCHAR(255),
    graduationYear VARCHAR(20),
    degree VARCHAR(255),
    degreeAr VARCHAR(255),
    jobTitle VARCHAR(255),
    jobTitleAr VARCHAR(255),
    company VARCHAR(255),
    companyAr VARCHAR(255),
    testimonial TEXT,
    testimonialAr TEXT,
    linkedin TEXT,
    twitter TEXT,
    featured TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('super_admin', 'school_admin') DEFAULT 'super_admin',
  schoolId VARCHAR(50) NULL,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastLogin DATETIME,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- NEW TABLES FOR ADMISSIONS & MODIFICATIONS WORKFLOW (Week 1)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. admissions table (Critical Priority)
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
  status ENUM('pending','under_review','accepted','waitlist','rejected','modification_requested','modification_approved') DEFAULT 'pending',
  accepted_school_id VARCHAR(50),
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_national_id (student_national_id),
  INDEX idx_passport (passport_number),
  INDEX idx_application_number (application_number),
  INDEX idx_status (status),
  INDEX idx_email (parent_email),
  INDEX idx_created (created_at),
  FOREIGN KEY (accepted_school_id) REFERENCES schools(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. admission_preferences table (Critical Priority)
CREATE TABLE IF NOT EXISTS admission_preferences (
  id VARCHAR(50) PRIMARY KEY,
  admission_id VARCHAR(50) NOT NULL,
  school_id VARCHAR(50) NOT NULL,
  preference_order INT NOT NULL CHECK (preference_order BETWEEN 1 AND 10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admission_id) REFERENCES admissions(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  INDEX idx_admission (admission_id),
  INDEX idx_school (school_id),
  UNIQUE KEY unique_preference (admission_id, preference_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. modification_requests table (Critical Priority)
CREATE TABLE IF NOT EXISTS modification_requests (
  id VARCHAR(50) PRIMARY KEY,
  request_number VARCHAR(30) UNIQUE NOT NULL,
  admission_id VARCHAR(50) NOT NULL,
  original_status VARCHAR(50),
  national_id_suffix VARCHAR(4) NOT NULL,
  requested_preferences JSON NOT NULL,
  old_preferences JSON,
  request_reason TEXT NOT NULL,
  status ENUM('pending','approved','rejected','completed') DEFAULT 'pending',
  admin_response TEXT,
  reviewed_by VARCHAR(50),
  reviewed_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admission_id) REFERENCES admissions(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_request_number (request_number),
  INDEX idx_admission (admission_id),
  INDEX idx_status (status),
  INDEX idx_national_suffix (national_id_suffix)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. complaints table (High Priority)
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

-- 5. contact_messages table (High Priority)
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

-- 6. job_applications table (High Priority)
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
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  INDEX idx_email (email),
  INDEX idx_job (job_id),
  INDEX idx_status (status),
  INDEX idx_applied (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. job_departments table (Medium Priority)
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
