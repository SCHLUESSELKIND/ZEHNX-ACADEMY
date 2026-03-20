-- ═══════════════════════════════════════════════════════════════
-- ZEHNX ACADEMY — Complete Database Schema
-- Supabase (PostgreSQL) · Self-hosted on Hetzner
-- ═══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══ ENUMS ═══════════════════════════════════════════════════

CREATE TYPE user_role AS ENUM ('learner', 'team_admin', 'org_admin', 'superadmin');
CREATE TYPE skill_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE sprint_status AS ENUM ('available', 'active', 'paused', 'completed', 'abandoned');
CREATE TYPE sprint_phase AS ENUM ('kickoff', 'learn', 'build', 'reflect', 'share');
CREATE TYPE sprint_type AS ENUM ('micro', 'standard', 'deep');
CREATE TYPE news_impact AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE news_category AS ENUM ('tools', 'regulation', 'security', 'research', 'business', 'tutorials', 'community');
CREATE TYPE assessment_type AS ENUM ('quick', 'deep', 'portfolio');
CREATE TYPE content_depth AS ENUM ('surface', 'deep1', 'deep2', 'deep3');

-- ═══ CORE TABLES ═════════════════════════════════════════════

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'learner',
  skill_level skill_level DEFAULT 'A1',
  language_preference TEXT DEFAULT 'de',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  streak_days INTEGER DEFAULT 0,
  streak_last_date DATE,
  total_xp INTEGER DEFAULT 0,
  total_sprints_completed INTEGER DEFAULT 0,
  active_sprint_id UUID,
  project_description TEXT,
  project_stack TEXT[],
  preferred_departments TEXT[],
  -- Enterprise fields
  organization_id UUID,
  department TEXT,
  job_title TEXT,
  -- ADHD preferences
  focus_mode BOOLEAN DEFAULT TRUE,
  session_reminder_minutes INTEGER DEFAULT 25,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations (Enterprise)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  -- Admin
  owner_id UUID REFERENCES profiles(id),
  -- Enterprise settings
  goals TEXT,
  ai_policy TEXT,
  sso_provider TEXT,
  sso_domain TEXT,
  -- Compliance
  av_vertrag_signed BOOLEAN DEFAULT FALSE,
  av_vertrag_date TIMESTAMPTZ,
  ai_act_compliant BOOLEAN DEFAULT FALSE,
  -- Limits
  max_seats INTEGER DEFAULT 10,
  plan TEXT DEFAULT 'starter',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link profiles to organizations
ALTER TABLE profiles
  ADD CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- ═══ DEPARTMENTS ═════════════════════════════════════════════

CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  tagline TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed departments
INSERT INTO departments (id, name, icon, tagline, color, sort_order) VALUES
  ('design', 'Design Studio', '✦', 'Visual AI & Branding', '#DB2777', 1),
  ('apps', 'App Lab', '◆', 'Full-Stack AI Apps', '#2563EB', 2),
  ('chat', 'Conversational AI', '◇', 'Chatbots & Voice', '#0891B2', 3),
  ('auto', 'Automation HQ', '⬡', 'Workflows & Pipelines', '#D97706', 4),
  ('content', 'Content Factory', '◈', 'Text, Video & Audio', '#DC2626', 5),
  ('data', 'Data Intelligence', '◉', 'Analytics & BI', '#7C3AED', 6),
  ('biz', 'Business School', '◎', 'Strategie & AI Act', '#059669', 7),
  ('shield', 'Selbstschutz', '⊕', 'Privacy & Safety', '#374151', 8);

-- ═══ ASSESSMENTS ═════════════════════════════════════════════

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_type assessment_type DEFAULT 'quick',
  -- Scores per dimension (0-5)
  understanding_score NUMERIC(3,1) DEFAULT 0,
  usage_score NUMERIC(3,1) DEFAULT 0,
  technical_score NUMERIC(3,1) DEFAULT 0,
  ethics_score NUMERIC(3,1) DEFAULT 0,
  projects_score NUMERIC(3,1) DEFAULT 0,
  -- Computed
  average_score NUMERIC(3,1) GENERATED ALWAYS AS (
    (understanding_score + usage_score + technical_score + ethics_score + projects_score) / 5
  ) STORED,
  determined_level skill_level,
  -- Raw answers for analysis
  answers JSONB DEFAULT '{}',
  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ SPRINTS ═════════════════════════════════════════════════

-- Sprint templates (the catalog)
CREATE TABLE sprint_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id TEXT REFERENCES departments(id),
  name TEXT NOT NULL,
  description TEXT,
  -- Classification
  min_level skill_level DEFAULT 'A1',
  sprint_type sprint_type DEFAULT 'standard',
  estimated_hours NUMERIC(4,1),
  -- Content
  phases JSONB DEFAULT '[]',
  learning_objectives TEXT[],
  deliverable TEXT,
  skills_taught TEXT[],
  tools_used TEXT[],
  -- Enterprise
  enterprise_division TEXT,
  universal BOOLEAN DEFAULT TRUE,
  -- Meta
  popularity INTEGER DEFAULT 0,
  avg_completion_hours NUMERIC(4,1),
  completion_rate NUMERIC(3,2) DEFAULT 0,
  -- Versioning (AI UPDATE)
  version INTEGER DEFAULT 1,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  needs_update BOOLEAN DEFAULT FALSE,
  -- Timestamps
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sprint instances
CREATE TABLE user_sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES sprint_templates(id),
  organization_id UUID REFERENCES organizations(id),
  -- Status
  status sprint_status DEFAULT 'active',
  current_phase sprint_phase DEFAULT 'kickoff',
  progress_pct INTEGER DEFAULT 0,
  -- Tracking
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_time_minutes INTEGER DEFAULT 0,
  -- Personalization
  project_context TEXT,
  personalized_plan JSONB DEFAULT '{}',
  -- Reflection (SHARE phase)
  reflection_learned TEXT[],
  reflection_difficult TEXT,
  reflection_aha TEXT,
  -- Deliverable
  deliverable_url TEXT,
  deliverable_description TEXT,
  -- Quality
  self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 5),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ SKILLS & PROGRESS ═══════════════════════════════════════

-- Skill definitions
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  color TEXT,
  max_level INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core skills
INSERT INTO skills (id, name, category, color) VALUES
  ('prompt_engineering', 'Prompt Engineering', 'core', '#2563EB'),
  ('react', 'React & Frontend', 'technical', '#0891B2'),
  ('python', 'Python', 'technical', '#7C3AED'),
  ('supabase', 'Supabase & Backend', 'technical', '#059669'),
  ('ai_ethics', 'AI Ethics & DSGVO', 'governance', '#DC2626'),
  ('automation', 'Automation & n8n', 'applied', '#D97706'),
  ('data_analysis', 'Datenanalyse', 'applied', '#7C3AED'),
  ('ai_design', 'AI Design', 'creative', '#DB2777'),
  ('chatbot_dev', 'Chatbot Development', 'technical', '#0891B2'),
  ('content_ai', 'AI Content', 'creative', '#DC2626'),
  ('ai_strategy', 'AI Strategie', 'governance', '#059669'),
  ('ai_security', 'AI Sicherheit', 'governance', '#374151');

-- User skill progress (accumulated through sprints)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  sprints_contributing INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ═══ NEWSROOM ════════════════════════════════════════════════

-- News articles
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Content
  title TEXT NOT NULL,
  summary_a1 TEXT,
  summary_b1 TEXT,
  summary_c1 TEXT,
  full_content TEXT,
  -- Classification
  category news_category NOT NULL,
  impact news_impact DEFAULT 'medium',
  -- Source
  source_url TEXT,
  source_name TEXT,
  source_tier INTEGER DEFAULT 3,
  -- Enrichment
  resources JSONB DEFAULT '[]',
  affected_departments TEXT[],
  related_sprint_ids UUID[],
  -- Deep Dive
  deep_dive_available BOOLEAN DEFAULT FALSE,
  deep_dive_content JSONB DEFAULT '{}',
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  is_reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES profiles(id),
  -- Crawler metadata
  crawled_at TIMESTAMPTZ,
  relevance_score NUMERIC(3,1),
  duplicate_of UUID REFERENCES news_items(id),
  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live ticker items
CREATE TABLE ticker_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ DEEP DIVE ══════════════════════════════════════════════

CREATE TABLE deep_dive_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Link to sprint or news
  sprint_template_id UUID REFERENCES sprint_templates(id),
  news_item_id UUID REFERENCES news_items(id),
  topic TEXT NOT NULL,
  -- Depth layers
  depth content_depth NOT NULL,
  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 15,
  -- Interactive elements
  sandbox_config JSONB DEFAULT '{}',
  exercises JSONB DEFAULT '[]',
  -- Resources
  resources JSONB DEFAULT '[]',
  -- Level adaptations
  level_adaptations JSONB DEFAULT '{}',
  -- Meta
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track which deep dives users have explored
CREATE TABLE user_deep_dives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deep_dive_id UUID NOT NULL REFERENCES deep_dive_content(id),
  depth_reached content_depth DEFAULT 'surface',
  time_spent_minutes INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ COLLECTIVE BRAIN ════════════════════════════════════════

-- Generalized learnings extracted from user sprints (privacy-preserving)
CREATE TABLE collective_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Classification
  pattern_type TEXT NOT NULL, -- 'best_practice', 'pitfall', 'timing', 'difficulty'
  department_id TEXT REFERENCES departments(id),
  sprint_template_id UUID REFERENCES sprint_templates(id),
  skill_ids TEXT[],
  -- Content (NEVER contains identifying info)
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  -- Stats
  reported_by_count INTEGER DEFAULT 1,
  helpfulness_score NUMERIC(3,2) DEFAULT 0,
  -- Validation
  is_validated BOOLEAN DEFAULT FALSE,
  validated_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ENTERPRISE ══════════════════════════════════════════════

-- Organization goals (top-level direction)
CREATE TABLE org_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_metric TEXT,
  target_value TEXT,
  deadline DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department goals (derive from org goals)
CREATE TABLE org_department_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_goal_id UUID REFERENCES org_goals(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_name TEXT NOT NULL,
  goal_description TEXT,
  priority_workflows TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance tracking (EU AI Act Art. 4)
CREATE TABLE compliance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  module_type TEXT NOT NULL, -- 'ai_literacy', 'ai_act', 'dsgvo', 'bias_check'
  module_name TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score NUMERIC(3,1),
  certificate_hash TEXT,
  -- Audit export fields
  is_exportable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ STREAK & GAMIFICATION ═══════════════════════════════════

CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sprints_worked_on INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  deep_dives_explored INTEGER DEFAULT 0,
  news_read INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- ═══ INDEXES ═════════════════════════════════════════════════

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_level ON profiles(skill_level);
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_user_sprints_user ON user_sprints(user_id);
CREATE INDEX idx_user_sprints_status ON user_sprints(status);
CREATE INDEX idx_user_sprints_org ON user_sprints(organization_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_news_items_published ON news_items(is_published, published_at DESC);
CREATE INDEX idx_news_items_category ON news_items(category);
CREATE INDEX idx_ticker_active ON ticker_items(expires_at) WHERE expires_at > NOW();
CREATE INDEX idx_compliance_user ON compliance_logs(user_id);
CREATE INDEX idx_compliance_org ON compliance_logs(organization_id);
CREATE INDEX idx_daily_activity_user ON daily_activity(user_id, activity_date);
CREATE INDEX idx_sprint_templates_dept ON sprint_templates(department_id);
CREATE INDEX idx_sprint_templates_level ON sprint_templates(min_level);
CREATE INDEX idx_deep_dive_sprint ON deep_dive_content(sprint_template_id);
CREATE INDEX idx_deep_dive_news ON deep_dive_content(news_item_id);

-- ═══ ROW LEVEL SECURITY ══════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deep_dives ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_department_goals ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own, org admins see org members
CREATE POLICY profiles_own ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY profiles_org_admin ON profiles FOR SELECT USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  )
);

-- Assessments: own only
CREATE POLICY assessments_own ON assessments FOR ALL USING (user_id = auth.uid());

-- Sprints: own only
CREATE POLICY sprints_own ON user_sprints FOR ALL USING (user_id = auth.uid());

-- Skills: own only
CREATE POLICY skills_own ON user_skills FOR ALL USING (user_id = auth.uid());

-- Deep dives: own only
CREATE POLICY deep_dives_own ON user_deep_dives FOR ALL USING (user_id = auth.uid());

-- Daily activity: own only
CREATE POLICY activity_own ON daily_activity FOR ALL USING (user_id = auth.uid());

-- Compliance: own + org admin aggregated view
CREATE POLICY compliance_own ON compliance_logs FOR ALL USING (user_id = auth.uid());
CREATE POLICY compliance_org ON compliance_logs FOR SELECT USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  )
);

-- Organizations: owner can manage, members can view
CREATE POLICY org_owner ON organizations FOR ALL USING (owner_id = auth.uid());
CREATE POLICY org_member ON organizations FOR SELECT USING (
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Org goals: org admin only
CREATE POLICY goals_admin ON org_goals FOR ALL USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  )
);
CREATE POLICY dept_goals_admin ON org_department_goals FOR ALL USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  )
);

-- Public read for catalog tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY departments_public ON departments FOR SELECT USING (true);

ALTER TABLE sprint_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY templates_public ON sprint_templates FOR SELECT USING (is_active = true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY skills_public ON skills FOR SELECT USING (true);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY news_public ON news_items FOR SELECT USING (is_published = true);

ALTER TABLE ticker_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY ticker_public ON ticker_items FOR SELECT USING (
  expires_at IS NULL OR expires_at > NOW()
);

ALTER TABLE deep_dive_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY deep_dive_public ON deep_dive_content FOR SELECT USING (is_active = true);

ALTER TABLE collective_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY patterns_public ON collective_patterns FOR SELECT USING (is_validated = true);

-- ═══ FUNCTIONS ═══════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  SELECT streak_last_date, streak_days INTO last_date, current_streak
  FROM profiles WHERE id = p_user_id;

  IF last_date = CURRENT_DATE THEN
    RETURN; -- Already counted today
  ELSIF last_date = CURRENT_DATE - 1 THEN
    UPDATE profiles SET
      streak_days = current_streak + 1,
      streak_last_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE id = p_user_id;
  ELSE
    UPDATE profiles SET
      streak_days = 1,
      streak_last_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add XP and update skill
CREATE OR REPLACE FUNCTION add_skill_xp(
  p_user_id UUID,
  p_skill_id TEXT,
  p_xp INTEGER DEFAULT 1
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_skills (user_id, skill_id, xp, level, sprints_contributing, last_practiced_at)
  VALUES (p_user_id, p_skill_id, p_xp, 1, 1, NOW())
  ON CONFLICT (user_id, skill_id) DO UPDATE SET
    xp = user_skills.xp + p_xp,
    level = LEAST(7, (user_skills.xp + p_xp) / 3 + 1),
    sprints_contributing = user_skills.sprints_contributing + 1,
    last_practiced_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete a sprint
CREATE OR REPLACE FUNCTION complete_sprint(
  p_sprint_id UUID,
  p_reflection_learned TEXT[],
  p_reflection_difficult TEXT,
  p_reflection_aha TEXT,
  p_self_rating INTEGER
)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_template_id UUID;
  v_skills TEXT[];
BEGIN
  -- Get sprint info
  SELECT user_id, template_id INTO v_user_id, v_template_id
  FROM user_sprints WHERE id = p_sprint_id;

  -- Update sprint
  UPDATE user_sprints SET
    status = 'completed',
    current_phase = 'share',
    progress_pct = 100,
    completed_at = NOW(),
    reflection_learned = p_reflection_learned,
    reflection_difficult = p_reflection_difficult,
    reflection_aha = p_reflection_aha,
    self_rating = p_self_rating,
    updated_at = NOW()
  WHERE id = p_sprint_id;

  -- Get skills from template
  SELECT skills_taught INTO v_skills
  FROM sprint_templates WHERE id = v_template_id;

  -- Add XP for each skill
  IF v_skills IS NOT NULL THEN
    FOR i IN 1..array_length(v_skills, 1) LOOP
      PERFORM add_skill_xp(v_user_id, v_skills[i], 1);
    END LOOP;
  END IF;

  -- Update profile
  UPDATE profiles SET
    total_sprints_completed = total_sprints_completed + 1,
    total_xp = total_xp + 25,
    active_sprint_id = NULL,
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Update streak
  PERFORM update_streak(v_user_id);

  -- Update template popularity
  UPDATE sprint_templates SET
    popularity = popularity + 1,
    updated_at = NOW()
  WHERE id = v_template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Determine skill level from assessment score
CREATE OR REPLACE FUNCTION determine_level(avg_score NUMERIC)
RETURNS skill_level AS $$
BEGIN
  IF avg_score < 1 THEN RETURN 'A1';
  ELSIF avg_score < 2 THEN RETURN 'A2';
  ELSIF avg_score < 3 THEN RETURN 'B1';
  ELSIF avg_score < 4 THEN RETURN 'B2';
  ELSIF avg_score < 4.5 THEN RETURN 'C1';
  ELSE RETURN 'C2';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enterprise: aggregated department progress (no individual data)
CREATE OR REPLACE FUNCTION get_org_department_stats(p_org_id UUID)
RETURNS TABLE(
  department TEXT,
  member_count BIGINT,
  avg_level TEXT,
  sprints_completed BIGINT,
  compliance_pct NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.department,
    COUNT(DISTINCT p.id) as member_count,
    MODE() WITHIN GROUP (ORDER BY p.skill_level::TEXT) as avg_level,
    COALESCE(SUM(p.total_sprints_completed), 0) as sprints_completed,
    ROUND(
      COUNT(DISTINCT cl.user_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.id), 0) * 100, 1
    ) as compliance_pct
  FROM profiles p
  LEFT JOIN compliance_logs cl ON cl.user_id = p.id AND cl.module_type = 'ai_literacy'
  WHERE p.organization_id = p_org_id
  GROUP BY p.department;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
