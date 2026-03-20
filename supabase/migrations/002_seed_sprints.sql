-- ═══════════════════════════════════════════════════════════════
-- ZEHNX ACADEMY — Sprint Template Seed Data
-- ═══════════════════════════════════════════════════════════════

-- ─── AUTOMATION HQ ───────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('auto', 'Prompt Mastery', '5 Power-Prompts für deinen Arbeitsalltag entwickeln und testen', 'A1', 'micro', 2,
 '5 getestete, wiederverwendbare Prompts für deine häufigsten Tasks',
 ARRAY['prompt_engineering'], ARRAY['Claude', 'ChatGPT'],
 '[{"phase":"kickoff","title":"5 wiederkehrende Tasks identifizieren","duration":10},{"phase":"learn","title":"Role/Context/Task Framework verstehen","duration":20},{"phase":"build","title":"Prompts schreiben, testen, iterieren","duration":60},{"phase":"reflect","title":"Welcher Prompt spart am meisten Zeit?","duration":10},{"phase":"share","title":"Prompt-Bibliothek dokumentieren","duration":10}]'::jsonb),

('auto', 'AI Email Triage', 'AI kategorisiert, priorisiert und schlägt Antworten vor', 'A2', 'micro', 2,
 'Funktionierender Email-Kategorisierungs-Workflow',
 ARRAY['prompt_engineering', 'automation'], ARRAY['n8n', 'Claude API', 'Gmail'],
 '[{"phase":"kickoff","title":"Email-Muster analysieren","duration":10},{"phase":"learn","title":"n8n Email-Trigger + AI-Node","duration":25},{"phase":"build","title":"Pipeline bauen und testen","duration":60},{"phase":"reflect","title":"Genauigkeit bewerten","duration":10},{"phase":"share","title":"Workflow dokumentieren","duration":10}]'::jsonb),

('auto', 'Sales Autopilot', 'Lead → AI qualifiziert → personalisierte Email automatisch', 'B1', 'standard', 4,
 'Funktionierende Lead-Qualifizierungs-Pipeline mit Auto-Emails',
 ARRAY['prompt_engineering', 'automation'], ARRAY['n8n', 'Claude API', 'CRM'],
 '[{"phase":"kickoff","title":"Lead-Kriterien definieren","duration":15},{"phase":"learn","title":"AI Scoring + Email-Personalisierung","duration":40},{"phase":"build","title":"Pipeline: Webhook → Score → Email","duration":120},{"phase":"reflect","title":"Qualitätscheck der generierten Emails","duration":15},{"phase":"share","title":"Best Practices dokumentieren","duration":15}]'::jsonb),

('auto', 'Rechnungs-Pipeline', 'Rechnungen automatisch erfassen, kategorisieren, exportieren', 'A2', 'standard', 4,
 'OCR-Pipeline: Rechnung → Kategorisierung → DATEV-Export',
 ARRAY['automation', 'python'], ARRAY['n8n', 'Claude API', 'Google Drive'],
 '[{"phase":"kickoff","title":"Rechnungsformate analysieren","duration":10},{"phase":"learn","title":"AI-OCR + Datenextraktion","duration":30},{"phase":"build","title":"Pipeline: Upload → OCR → Kategorisierung → Export","duration":130},{"phase":"reflect","title":"Fehlerrate messen","duration":10},{"phase":"share","title":"Edge Cases dokumentieren","duration":10}]'::jsonb);

-- ─── DESIGN STUDIO ───────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('design', 'Brand Kit in 90 Min', 'Logo-Konzept, Farbpalette, 3 Mockups — AI-assisted', 'A2', 'micro', 3,
 'Komplettes Brand Kit: Logo + Farben + 3 Mockups',
 ARRAY['ai_design', 'prompt_engineering'], ARRAY['Midjourney', 'Canva', 'Claude'],
 '[{"phase":"kickoff","title":"Brand-Briefing erstellen","duration":10},{"phase":"learn","title":"Visuelles Prompt Engineering","duration":20},{"phase":"build","title":"Logo-Varianten + Palette + Mockups generieren","duration":100},{"phase":"reflect","title":"Konsistenz prüfen","duration":10},{"phase":"share","title":"Brand Board zusammenstellen","duration":20}]'::jsonb),

('design', 'Social Media Kit', '5 zusammengehörende Posts für eine Brand generieren', 'A1', 'micro', 2,
 '5 on-brand Social Media Posts, ready to publish',
 ARRAY['ai_design', 'content_ai'], ARRAY['Midjourney', 'Canva'],
 '[{"phase":"kickoff","title":"Brand-Stil definieren","duration":10},{"phase":"learn","title":"Konsistente Style-Prompts","duration":15},{"phase":"build","title":"5 Posts generieren und verfeinern","duration":60},{"phase":"reflect","title":"Brand-Konsistenz checken","duration":10},{"phase":"share","title":"Template-Prompts speichern","duration":10}]'::jsonb),

('design', 'AI Video Explainer', '2-Min Erklärvideo mit AI-Avatar, Script und B-Roll', 'A2', 'standard', 3,
 'Fertiges 2-Minuten Erklärvideo',
 ARRAY['ai_design', 'content_ai'], ARRAY['HeyGen', 'Runway', 'Claude'],
 '[{"phase":"kickoff","title":"Video-Konzept und Script-Outline","duration":10},{"phase":"learn","title":"AI-Video-Tools und Best Practices","duration":20},{"phase":"build","title":"Script → Avatar → B-Roll → Edit","duration":100},{"phase":"reflect","title":"Qualitätscheck und Feedback","duration":15},{"phase":"share","title":"Workflow dokumentieren","duration":10}]'::jsonb);

-- ─── APP LAB ─────────────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('apps', 'AI Chat Widget', 'Funktionierenden Chatbot bauen und deployen', 'B1', 'standard', 4,
 'Deployed AI-Chatbot auf eigener Domain',
 ARRAY['react', 'prompt_engineering', 'supabase'], ARRAY['React', 'Claude API', 'Vercel'],
 '[{"phase":"kickoff","title":"Use Case und Scope definieren","duration":15},{"phase":"learn","title":"Claude API Streaming + React Integration","duration":30},{"phase":"build","title":"Chat UI + API Route + System Prompt","duration":130},{"phase":"reflect","title":"Edge Cases testen","duration":15},{"phase":"share","title":"Deploy + Dokumentation","duration":20}]'::jsonb),

('apps', 'AI Onboarding Flow', 'Mehrstufigen Onboarding-Flow mit AI-Personalisierung', 'B1', 'standard', 4,
 'Funktionierender Onboarding-Flow mit AI-Personalisierung',
 ARRAY['react', 'supabase', 'prompt_engineering'], ARRAY['React', 'Supabase', 'Claude API'],
 '[{"phase":"kickoff","title":"Onboarding-Steps und Ziel definieren","duration":15},{"phase":"learn","title":"Multi-Step Forms + AI Content Generation","duration":30},{"phase":"build","title":"Flow bauen, AI-Personalisierung einbauen","duration":130},{"phase":"reflect","title":"User-Test durchführen","duration":15},{"phase":"share","title":"Patterns dokumentieren","duration":15}]'::jsonb),

('apps', 'RAG Knowledge Bot', 'Chatbot der auf eigenen Dokumenten antwortet', 'B2', 'deep', 8,
 'Production RAG-System mit Upload und Chat',
 ARRAY['react', 'supabase', 'python', 'prompt_engineering'], ARRAY['React', 'Supabase', 'OpenAI Embeddings', 'Claude API'],
 '[{"phase":"kickoff","title":"Knowledge Base und Scope definieren","duration":20},{"phase":"learn","title":"Embeddings, Vector Search, RAG Architecture","duration":60},{"phase":"build","title":"Upload → Embed → Store → Retrieve → Chat","duration":300},{"phase":"reflect","title":"Retrieval-Qualität testen","duration":30},{"phase":"share","title":"Architecture Decision Record schreiben","duration":30}]'::jsonb);

-- ─── CONVERSATIONAL AI ───────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('chat', 'Support Bot in 30 Min', 'FAQ-Bot für deine Website deployen', 'A1', 'micro', 1,
 'Funktionierender FAQ-Bot auf deiner Website',
 ARRAY['chatbot_dev', 'prompt_engineering'], ARRAY['Chatbase', 'Claude'],
 '[{"phase":"kickoff","title":"FAQ-Liste zusammenstellen","duration":5},{"phase":"learn","title":"Bot-Builder Setup","duration":10},{"phase":"build","title":"Bot konfigurieren, testen, einbetten","duration":30},{"phase":"reflect","title":"Antwortqualität prüfen","duration":5},{"phase":"share","title":"Setup dokumentieren","duration":5}]'::jsonb),

('chat', 'Voice Agent MVP', 'Sprach-Assistent der Termine bucht', 'B1', 'standard', 4,
 'Funktionierender Voice Agent mit Terminbuchung',
 ARRAY['chatbot_dev', 'automation', 'prompt_engineering'], ARRAY['Vapi', 'Claude API', 'Cal.com'],
 '[{"phase":"kickoff","title":"Gesprächsfluss designen","duration":15},{"phase":"learn","title":"Voice AI Setup + Kalender-Integration","duration":30},{"phase":"build","title":"Agent bauen, Stimme wählen, Flow testen","duration":130},{"phase":"reflect","title":"Testanrufe durchführen","duration":15},{"phase":"share","title":"Conversation Design Patterns teilen","duration":15}]'::jsonb);

-- ─── CONTENT FACTORY ─────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('content', '10× Content Sprint', '10 Posts, 1 Blog, 3 Emails in einer Session', 'A1', 'micro', 2,
 '14 Content-Pieces, publikationsfertig',
 ARRAY['content_ai', 'prompt_engineering'], ARRAY['Claude', 'Canva'],
 '[{"phase":"kickoff","title":"Thema und Zielgruppe festlegen","duration":10},{"phase":"learn","title":"Content-Prompting Frameworks","duration":15},{"phase":"build","title":"Blog → Posts → Emails produzieren","duration":70},{"phase":"reflect","title":"Qualitätscheck: Stimme authentisch?","duration":10},{"phase":"share","title":"Prompt-Templates speichern","duration":10}]'::jsonb),

('content', 'AI Podcast Episode', 'Von Recherche bis Publish in einem Sprint', 'A2', 'standard', 3,
 'Fertige Podcast-Episode, bereit zum Veröffentlichen',
 ARRAY['content_ai', 'prompt_engineering'], ARRAY['Claude', 'NotebookLM', 'ElevenLabs'],
 '[{"phase":"kickoff","title":"Thema und Format festlegen","duration":10},{"phase":"learn","title":"AI Audio Tools und Workflow","duration":20},{"phase":"build","title":"Research → Script → Audio → Edit","duration":100},{"phase":"reflect","title":"Qualitätscheck und Feedback","duration":15},{"phase":"share","title":"Workflow dokumentieren","duration":10}]'::jsonb);

-- ─── DATA INTELLIGENCE ───────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('data', 'Dashboard aus Rohdaten', 'CSV → AI-Analyse → interaktives Dashboard', 'B1', 'standard', 3,
 'Funktionierendes interaktives Dashboard',
 ARRAY['data_analysis', 'prompt_engineering'], ARRAY['Claude', 'React', 'Recharts'],
 '[{"phase":"kickoff","title":"Datenquelle und Fragestellung definieren","duration":10},{"phase":"learn","title":"Datenanalyse mit AI + Visualisierung","duration":25},{"phase":"build","title":"Daten laden → AI analysiert → Dashboard bauen","duration":100},{"phase":"reflect","title":"Insights validieren","duration":15},{"phase":"share","title":"Analysis Patterns dokumentieren","duration":10}]'::jsonb),

('data', 'Marktanalyse in 60 Min', 'Komplette Branchenanalyse mit AI', 'A2', 'micro', 2,
 'Strukturierter Marktanalyse-Report',
 ARRAY['data_analysis', 'prompt_engineering', 'ai_strategy'], ARRAY['Claude', 'Perplexity'],
 '[{"phase":"kickoff","title":"Branche und Fragestellung definieren","duration":5},{"phase":"learn","title":"Research-Prompting Strategien","duration":15},{"phase":"build","title":"Wettbewerb, Trends, Sizing recherchieren","duration":60},{"phase":"reflect","title":"Quellen validieren","duration":10},{"phase":"share","title":"Report finalisieren","duration":15}]'::jsonb);

-- ─── BUSINESS SCHOOL ─────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('biz', 'AI Act Quick Check', 'Alle AI-Systeme klassifizieren und dokumentieren', 'A1', 'micro', 2,
 'Dokumentierte Klassifizierung aller AI-Systeme',
 ARRAY['ai_ethics', 'ai_strategy'], ARRAY['Claude'],
 '[{"phase":"kickoff","title":"AI-Systeme im Einsatz auflisten","duration":10},{"phase":"learn","title":"AI Act Risikoklassen verstehen","duration":20},{"phase":"build","title":"Jedes System klassifizieren + dokumentieren","duration":50},{"phase":"reflect","title":"Lücken identifizieren","duration":10},{"phase":"share","title":"Compliance-Report erstellen","duration":15}]'::jsonb),

('biz', 'AI Strategie Sprint', 'AI-Potenziale identifizieren und Roadmap erstellen', 'B1', 'deep', 8,
 '5-seitiges AI-Strategie-Dokument mit Roadmap',
 ARRAY['ai_strategy', 'ai_ethics'], ARRAY['Claude', 'Miro'],
 '[{"phase":"kickoff","title":"Ist-Zustand und Ziele erfassen","duration":30},{"phase":"learn","title":"AI Strategy Frameworks","duration":60},{"phase":"build","title":"Analyse → Priorisierung → Roadmap","duration":300},{"phase":"reflect","title":"Feasibility Check","duration":30},{"phase":"share","title":"Executive Summary schreiben","duration":30}]'::jsonb);

-- ─── SELBSTSCHUTZ ────────────────────────────────────────────

INSERT INTO sprint_templates (department_id, name, description, min_level, sprint_type, estimated_hours, deliverable, skills_taught, tools_used, phases) VALUES
('shield', 'Deepfake Defense', 'Team gegen AI-Scams und Social Engineering schulen', 'A1', 'micro', 2,
 'Schutzprotokoll + Erkennungs-Checkliste',
 ARRAY['ai_security', 'ai_ethics'], ARRAY['Claude'],
 '[{"phase":"kickoff","title":"Aktuelle Deepfake-Bedrohungen kennenlernen","duration":10},{"phase":"learn","title":"Erkennungsmethoden und Red Flags","duration":20},{"phase":"build","title":"Schutzprotokoll für Team/Familie erstellen","duration":50},{"phase":"reflect","title":"Schwachstellen identifizieren","duration":10},{"phase":"share","title":"Checkliste teilen","duration":10}]'::jsonb),

('shield', 'Privacy Audit', 'Eigene AI-Nutzung auf Datenschutz prüfen', 'A1', 'micro', 1.5,
 'Persönlicher AI-Datenschutz-Report',
 ARRAY['ai_security', 'ai_ethics'], ARRAY['Claude'],
 '[{"phase":"kickoff","title":"Alle genutzten AI-Tools auflisten","duration":5},{"phase":"learn","title":"DSGVO-Grundlagen bei AI-Nutzung","duration":15},{"phase":"build","title":"Jedes Tool bewerten: Was fließt wohin?","duration":40},{"phase":"reflect","title":"Risiken priorisieren","duration":10},{"phase":"share","title":"Action Plan erstellen","duration":10}]'::jsonb);
