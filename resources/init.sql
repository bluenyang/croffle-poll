-- Install extensions
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE poll_type AS ENUM ('VOTE', 'APPLICATION', 'OPINION');
CREATE TYPE poll_status AS ENUM ('ACTIVE', 'CLOSED');

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  role user_role NOT NULL DEFAULT 'MEMBER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);

-- Polls Table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type poll_type NOT NULL,
  status poll_status NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
  is_multiple_choice BOOLEAN DEFAULT FALSE,
  allow_custom_options BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Poll Options Table
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Poll Submissions Table
CREATE TABLE IF NOT EXISTS poll_submissions (
  id UUID PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

  UNIQUE (poll_id, user_id)
);

-- Poll Submission Options Table (VOTE type)
CREATE TABLE poll_submission_options (
  submission_id UUID NOT NULL REFERENCES poll_submissions(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  PRIMARY KEY (submission_id, option_id)
);

-- Indexes
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_type ON polls(type);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_submissions_user_id ON poll_submissions(user_id);
