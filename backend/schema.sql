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
    type VARCHAR(50),
    mainImage TEXT,
    gallery JSON
);

CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    titleAr VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    summary TEXT,
    summaryAr TEXT,
    image TEXT,
    published BOOLEAN DEFAULT TRUE
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
    descriptionAr TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON
);
