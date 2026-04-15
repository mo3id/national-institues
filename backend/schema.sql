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
