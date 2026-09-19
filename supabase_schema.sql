-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Aspirant Profiles Table
CREATE TABLE IF NOT EXISTS ese_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. App Settings Table
CREATE TABLE IF NOT EXISTS ese_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  settings JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Study Sessions Table
CREATE TABLE IF NOT EXISTS ese_study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  duration NUMERIC NOT NULL,
  activity TEXT NOT NULL,
  questions_solved INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. PYQ Records Table
CREATE TABLE IF NOT EXISTS ese_pyq_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  year TEXT,
  difficulty TEXT,
  status TEXT NOT NULL,
  questions_solved INTEGER DEFAULT 0,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Mistake Logs Table
CREATE TABLE IF NOT EXISTS ese_mistake_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  why_made TEXT,
  correct_concept TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Mock Tests Table
CREATE TABLE IF NOT EXISTS ese_mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  name TEXT NOT NULL,
  paper TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_marks NUMERIC NOT NULL,
  correct INTEGER DEFAULT 0,
  incorrect INTEGER DEFAULT 0,
  unattempted INTEGER DEFAULT 0,
  time_taken_minutes INTEGER DEFAULT 0,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable RLS for simple name-based public table access
ALTER TABLE ese_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE ese_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE ese_study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ese_pyq_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mistake_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mock_tests DISABLE ROW LEVEL SECURITY;
