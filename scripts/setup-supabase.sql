-- ============================================================
--  Job Application Automation Suite — Supabase Database Setup
--  Developer: Litheesh V R | buffalo.edu
--  Run this entire script in: Supabase Dashboard → SQL Editor
--  It creates all 8 tables in one go.
-- ============================================================


-- ── TABLE 1: jobs ────────────────────────────────────────────
-- Stores every job you save or apply to.

CREATE TABLE IF NOT EXISTS jobs (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  company       TEXT        NOT NULL,
  url           TEXT,
  location      TEXT,
  salary        TEXT,
  status        TEXT        DEFAULT 'saved'
                            CHECK (status IN ('saved','applied','interview','offer','rejected')),
  date_applied  DATE,
  deadline      DATE,
  job_description TEXT,
  notes         TEXT,
  ats_score     INTEGER,
  source        TEXT        DEFAULT 'manual'
                            CHECK (source IN ('remoteok','arbeitnow','adzuna','themuse',
                                              'remotive','handshake','jobright','linkedin','manual')),
  source_id     TEXT,
  auto_imported BOOLEAN     DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 2: resumes ─────────────────────────────────────────
-- Stores your master resume files and LaTeX source code.

CREATE TABLE IF NOT EXISTS resumes (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT        NOT NULL,
  content        TEXT,
  latex_source   TEXT,
  compiled_pdf_url TEXT,
  is_base        BOOLEAN     DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 3: resume_versions ─────────────────────────────────
-- Every time you edit your resume for a specific job, saved here.

CREATE TABLE IF NOT EXISTS resume_versions (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id        UUID        REFERENCES resumes(id) ON DELETE CASCADE,
  job_id           UUID        REFERENCES jobs(id)    ON DELETE CASCADE,
  version_number   INTEGER,
  latex_source     TEXT,
  compiled_pdf_url TEXT,
  ats_score_before INTEGER,
  ats_score_after  INTEGER,
  pros             JSONB,
  cons             JSONB,
  ai_suggestions   TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 4: cover_letters ───────────────────────────────────
-- AI-generated cover letters, one per job.

CREATE TABLE IF NOT EXISTS cover_letters (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id     UUID        REFERENCES jobs(id) ON DELETE CASCADE,
  content    TEXT,
  tone       TEXT        CHECK (tone IN ('formal','conversational','enthusiastic')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 5: ats_results ─────────────────────────────────────
-- Stores ATS analysis scores and keyword reports per job.

CREATE TABLE IF NOT EXISTS ats_results (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id            UUID        REFERENCES jobs(id)     ON DELETE CASCADE,
  resume_id         UUID        REFERENCES resumes(id)  ON DELETE CASCADE,
  score             INTEGER,
  matched_keywords  JSONB,
  missing_keywords  JSONB,
  suggestions       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 6: notifications ───────────────────────────────────
-- Log of every Gmail notification the system sends.

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id     UUID        REFERENCES jobs(id) ON DELETE CASCADE,
  type       TEXT        CHECK (type IN ('status_change','ats_alert','deadline','daily_summary')),
  subject    TEXT,
  sent_at    TIMESTAMPTZ,
  status     TEXT        CHECK (status IN ('sent','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 7: contacts ────────────────────────────────────────
-- Hiring managers and recruiters found for each job.

CREATE TABLE IF NOT EXISTS contacts (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id           UUID        REFERENCES jobs(id) ON DELETE CASCADE,
  name             TEXT,
  title            TEXT,
  email            TEXT,
  linkedin_url     TEXT,
  company          TEXT,
  source           TEXT        CHECK (source IN ('hunter','apollo','pattern','manual')),
  verified         BOOLEAN     DEFAULT FALSE,
  outreach_status  TEXT        DEFAULT 'none'
                               CHECK (outreach_status IN ('none','draft_saved','sent','replied','no_response')),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);


-- ── TABLE 8: outreach_emails ─────────────────────────────────
-- Every outreach email draft, linked to a job and contact.

CREATE TABLE IF NOT EXISTS outreach_emails (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id      UUID        REFERENCES jobs(id)     ON DELETE CASCADE,
  contact_id  UUID        REFERENCES contacts(id) ON DELETE CASCADE,
  subject     TEXT,
  body        TEXT,
  tone        TEXT        CHECK (tone IN ('formal','conversational','confident')),
  status      TEXT        DEFAULT 'draft'
                          CHECK (status IN ('draft','saved','sent')),
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ── ROW LEVEL SECURITY ───────────────────────────────────────
-- Enable RLS on all tables (required by Supabase).
-- We allow full access via the service role key used by n8n.

ALTER TABLE jobs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_results      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_emails  ENABLE ROW LEVEL SECURITY;

-- Allow all operations (n8n uses the service role key which bypasses RLS,
-- but we add policies too so the anon key works for read if needed later)
CREATE POLICY "full_access_jobs"             ON jobs             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_resumes"          ON resumes          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_resume_versions"  ON resume_versions  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cover_letters"    ON cover_letters    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_ats_results"      ON ats_results      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_notifications"    ON notifications    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_contacts"         ON contacts         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_outreach_emails"  ON outreach_emails  FOR ALL USING (true) WITH CHECK (true);


-- ── VERIFICATION ─────────────────────────────────────────────
-- Run this at the end to confirm all 8 tables were created.

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'jobs','resumes','resume_versions','cover_letters',
    'ats_results','notifications','contacts','outreach_emails'
  )
ORDER BY table_name;

-- Expected output: 8 rows, one for each table name above.
