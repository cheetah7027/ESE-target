-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. App Settings Table
CREATE TABLE IF NOT EXISTS ese_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Study Sessions Table
CREATE TABLE IF NOT EXISTS ese_study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  duration NUMERIC NOT NULL,
  activity TEXT NOT NULL,
  questions_solved INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. PYQ Records Table
CREATE TABLE IF NOT EXISTS ese_pyq_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  year TEXT,
  difficulty TEXT,
  status TEXT NOT NULL,
  questions_solved INTEGER DEFAULT 0,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Mistake Logs Table
CREATE TABLE IF NOT EXISTS ese_mistake_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  chapter_id TEXT,
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  why_made TEXT,
  correct_concept TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Mock Tests Table
CREATE TABLE IF NOT EXISTS ese_mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Row Level Security (RLS) Enable
ALTER TABLE ese_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_pyq_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mistake_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ese_mock_tests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to perform all operations on their own data
CREATE POLICY "Users can manage their own settings" ON ese_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage study sessions" ON ese_study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage pyq records" ON ese_pyq_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage mistake logs" ON ese_mistake_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage mock tests" ON ese_mock_tests FOR ALL USING (auth.uid() = user_id);
