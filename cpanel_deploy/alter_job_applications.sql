-- Add resume_data column to job_applications table for CV preview
ALTER TABLE job_applications ADD COLUMN resume_data LONGTEXT AFTER resume_path;
