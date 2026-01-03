-- MySchools Database Schema V2 - Clean Installation
-- This script will drop existing tables and recreate them in proper order

-- Drop all tables in reverse dependency order (to handle foreign key constraints)
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS student_subjects CASCADE;
DROP TABLE IF EXISTS teacher_subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS majors CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;  -- Drop old profiles table if exists
DROP TABLE IF EXISTS users CASCADE;     -- Drop old users table if exists

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Authentication)
-- Every role (admin, school, teacher, student) has a user account
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number text,
  role text NOT NULL CHECK (role IN ('admin', 'school', 'teacher', 'student')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. SCHOOLS TABLE
-- School is a user who can manage their institution
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_name text NOT NULL,
  address text,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. MAJORS TABLE (Departments/Specializations)
-- Created and managed by school
CREATE TABLE majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(school_id, name)
);

-- 4. CLASSES TABLE (Groups/Sections)
-- Created and managed by school
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  major_id uuid REFERENCES majors(id) ON DELETE SET NULL,
  name text NOT NULL,
  year text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(school_id, name)
);

-- 5. SUBJECTS (Matières)
-- Each subject belongs to a major and is taught by a teacher
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  major_id uuid NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(school_id, major_id, name)
);

-- 6. TEACHERS TABLE
-- Teacher is a user who teaches subjects
CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  hire_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. TEACHER_SUBJECTS (Many-to-Many)
-- A teacher can teach multiple subjects in different classes
CREATE TABLE teacher_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id)
);

-- 8. STUDENTS TABLE
-- Student is a user who studies at a school
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  major_id uuid REFERENCES majors(id) ON DELETE SET NULL,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  roll_number text,
  parent_phone_number text NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, roll_number)
);

-- 9. STUDENT_SUBJECTS (Many-to-Many)
-- Tracks which subjects each student studies
CREATE TABLE student_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

-- 10. TIMETABLES (Emploi du temps)
-- Schedule for each class
CREATE TABLE timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, day_of_week, start_time)
);

-- 11. ATTENDANCE
-- Track student attendance by subject and date
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text,
  recorded_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject_id, date)
);

-- 12. GRADES
-- Student grades by subject, semester, and teacher
CREATE TABLE grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  semester text NOT NULL CHECK (semester IN ('1', '2', '3', '4')),
  grade numeric(5,2) NOT NULL CHECK (grade >= 0 AND grade <= 20),
  comments text,
  recorded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject_id, semester)
);

-- ========================================
-- INDEXES for better performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_schools_user_id ON schools(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);

-- ========================================
-- VIEWS for easier querying
-- ========================================

-- Student full info with user details
CREATE OR REPLACE VIEW student_details AS
SELECT 
  s.id as student_id,
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone_number,
  s.parent_phone_number,
  s.roll_number,
  s.school_id,
  sch.school_name,
  s.major_id,
  m.name as major_name,
  s.class_id,
  c.name as class_name,
  s.enrollment_date,
  s.created_at
FROM students s
JOIN users u ON s.user_id = u.id
JOIN schools sch ON s.school_id = sch.id
LEFT JOIN majors m ON s.major_id = m.id
LEFT JOIN classes c ON s.class_id = c.id;

-- Teacher full info with user details
CREATE OR REPLACE VIEW teacher_details AS
SELECT 
  t.id as teacher_id,
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone_number,
  t.school_id,
  sch.school_name,
  t.hire_date,
  t.created_at
FROM teachers t
JOIN users u ON t.user_id = u.id
JOIN schools sch ON t.school_id = sch.id;

-- School full info with user details
CREATE OR REPLACE VIEW school_details AS
SELECT 
  s.id as school_id,
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  s.school_name,
  s.address,
  s.phone_number,
  s.created_at
FROM schools s
JOIN users u ON s.user_id = u.id;

-- ========================================
-- Create the admin user
-- ========================================
-- Use this to create your initial admin user:
-- INSERT INTO users (email, password_hash, first_name, last_name, role) 
-- VALUES ('admin@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8rKz9rG1vQ6e7YqKq7B9pZ2P9qz7lK', 'Admin', 'User', 'admin');
-- 
-- Then get the user ID and create the corresponding school profile:
-- INSERT INTO schools (user_id, school_name, address) 
-- VALUES ('[USER_ID_FROM_ABOVE]', 'System Admin', 'System Administrator');