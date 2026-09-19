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

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE ese_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_pyq_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mistake_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mock_tests ENABLE ROW LEVEL SECURITY;

-- Explicit RLS Policies for Anon API access
DROP POLICY IF EXISTS "Public profiles access" ON ese_profiles;
CREATE POLICY "Public profiles access" ON ese_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public settings access" ON ese_settings;
CREATE POLICY "Public settings access" ON ese_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public sessions access" ON ese_study_sessions;
CREATE POLICY "Public sessions access" ON ese_study_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public pyqs access" ON ese_pyq_records;
CREATE POLICY "Public pyqs access" ON ese_pyq_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public mistakes access" ON ese_mistake_logs;
CREATE POLICY "Public mistakes access" ON ese_mistake_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public mocks access" ON ese_mock_tests;
CREATE POLICY "Public mocks access" ON ese_mock_tests FOR ALL USING (true) WITH CHECK (true);
