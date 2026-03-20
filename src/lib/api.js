import { supabase } from './supabase';

// ═══ ASSESSMENTS ═════════════════════════════════════════════

export async function saveAssessment(userId, scores, answers) {
  const level = scores.average < 1 ? 'A1' : scores.average < 2 ? 'A2' : scores.average < 3 ? 'B1' : scores.average < 4 ? 'B2' : 'C1';

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      understanding_score: scores.understanding,
      usage_score: scores.usage,
      technical_score: scores.technical,
      ethics_score: scores.ethics,
      projects_score: scores.projects,
      determined_level: level,
      answers,
    })
    .select()
    .single();

  if (!error) {
    await supabase
      .from('profiles')
      .update({ skill_level: level, onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }

  return { data, error };
}

export async function getLatestAssessment(userId) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

// ═══ SPRINTS ═════════════════════════════════════════════════

export async function getSprintTemplates(filters = {}) {
  let query = supabase.from('sprint_templates').select('*, departments(*)').eq('is_active', true);
  if (filters.department) query = query.eq('department_id', filters.department);
  if (filters.level) query = query.lte('min_level', filters.level);
  query = query.order('popularity', { ascending: false });
  const { data, error } = await query;
  return { data, error };
}

export async function startSprint(userId, templateId, projectContext = '') {
  const { data, error } = await supabase
    .from('user_sprints')
    .insert({
      user_id: userId,
      template_id: templateId,
      project_context: projectContext,
      status: 'active',
      current_phase: 'kickoff',
    })
    .select('*, sprint_templates(*)')
    .single();

  if (!error && data) {
    await supabase
      .from('profiles')
      .update({ active_sprint_id: data.id, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }

  return { data, error };
}

export async function updateSprintProgress(sprintId, updates) {
  const { data, error } = await supabase
    .from('user_sprints')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sprintId)
    .select()
    .single();
  return { data, error };
}

export async function completeSprint(sprintId, reflection) {
  const { data, error } = await supabase.rpc('complete_sprint', {
    p_sprint_id: sprintId,
    p_reflection_learned: reflection.learned,
    p_reflection_difficult: reflection.difficult,
    p_reflection_aha: reflection.aha,
    p_self_rating: reflection.rating,
  });
  return { data, error };
}

export async function getUserSprints(userId, status = null) {
  let query = supabase
    .from('user_sprints')
    .select('*, sprint_templates(*, departments(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  return { data, error };
}

export async function getActiveSprint(userId) {
  const { data, error } = await supabase
    .from('user_sprints')
    .select('*, sprint_templates(*, departments(*))')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

// ═══ SKILLS ══════════════════════════════════════════════════

export async function getUserSkills(userId) {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*, skills(*)')
    .eq('user_id', userId)
    .order('xp', { ascending: false });
  return { data, error };
}

export async function getAllSkills() {
  const { data, error } = await supabase.from('skills').select('*').order('name');
  return { data, error };
}

// ═══ NEWS ════════════════════════════════════════════════════

export async function getNews(limit = 10, category = null) {
  let query = supabase
    .from('news_items')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  return { data, error };
}

export async function getTicker() {
  const { data, error } = await supabase
    .from('ticker_items')
    .select('*')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(10);
  return { data, error };
}

export async function getNewsItem(id) {
  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

// ═══ DEEP DIVE ══════════════════════════════════════════════

export async function getDeepDives(sprintTemplateId = null, newsItemId = null) {
  let query = supabase.from('deep_dive_content').select('*').eq('is_active', true);
  if (sprintTemplateId) query = query.eq('sprint_template_id', sprintTemplateId);
  if (newsItemId) query = query.eq('news_item_id', newsItemId);
  query = query.order('depth');
  const { data, error } = await query;
  return { data, error };
}

export async function trackDeepDive(userId, deepDiveId, depth, minutes) {
  const { data, error } = await supabase
    .from('user_deep_dives')
    .upsert({
      user_id: userId,
      deep_dive_id: deepDiveId,
      depth_reached: depth,
      time_spent_minutes: minutes,
    }, { onConflict: 'user_id,deep_dive_id' })
    .select()
    .single();
  return { data, error };
}

// ═══ DAILY ACTIVITY ══════════════════════════════════════════

export async function logActivity(userId, activity) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_activity')
    .upsert({
      user_id: userId,
      activity_date: today,
      ...activity,
    }, { onConflict: 'user_id,activity_date' })
    .select()
    .single();

  if (!error) await supabase.rpc('update_streak', { p_user_id: userId });
  return { data, error };
}

// ═══ DEPARTMENTS ═════════════════════════════════════════════

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return { data, error };
}

// ═══ COLLECTIVE PATTERNS ════════════════════════════════════

export async function getPatterns(departmentId = null, templateId = null) {
  let query = supabase
    .from('collective_patterns')
    .select('*')
    .eq('is_validated', true)
    .order('helpfulness_score', { ascending: false });
  if (departmentId) query = query.eq('department_id', departmentId);
  if (templateId) query = query.eq('sprint_template_id', templateId);
  const { data, error } = await query;
  return { data, error };
}

// ═══ ENTERPRISE ══════════════════════════════════════════════

export async function getOrganization(orgId) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();
  return { data, error };
}

export async function getOrgDepartmentStats(orgId) {
  const { data, error } = await supabase.rpc('get_org_department_stats', { p_org_id: orgId });
  return { data, error };
}

export async function getOrgGoals(orgId) {
  const { data, error } = await supabase
    .from('org_goals')
    .select('*, org_department_goals(*)')
    .eq('organization_id', orgId)
    .eq('is_active', true);
  return { data, error };
}

// ═══ COMPLIANCE ══════════════════════════════════════════════

export async function logCompliance(userId, orgId, moduleType, moduleName, score) {
  const { data, error } = await supabase
    .from('compliance_logs')
    .insert({
      user_id: userId,
      organization_id: orgId,
      module_type: moduleType,
      module_name: moduleName,
      score,
      certificate_hash: crypto.randomUUID(),
    })
    .select()
    .single();
  return { data, error };
}

export async function getComplianceStatus(userId) {
  const { data, error } = await supabase
    .from('compliance_logs')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  return { data, error };
}
