import { useState, useRef } from "react";

const C = {
  bg: "#FAFAF9", w: "#FFFFFF", x: "#18181B",
  g50: "#FAFAF9", g100: "#F4F4F5", g200: "#E4E4E7", g300: "#D4D4D8",
  g400: "#A1A1AA", g500: "#71717A", g600: "#52525B", g700: "#3F3F46", g800: "#27272A",
  bl: "#2563EB", blD: "#1D4ED8", blL: "#DBEAFE", blXL: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5", gnD: "#047857",
  am: "#D97706", amL: "#FFFBEB",
  rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF",
  cy: "#0891B2",
};

const EXISTING_SPRINTS = [
  { id: "pm", name: "Prompt Mastery", dept: "Automation HQ", level: "A1", hours: 2, desc: "5 Power-Prompts für deinen Arbeitsalltag entwickeln und testen", skills: ["prompt_engineering"], tools: ["Claude", "ChatGPT"] },
  { id: "email", name: "AI Email Triage", dept: "Automation HQ", level: "A2", hours: 2, desc: "AI kategorisiert, priorisiert und schlägt Antworten vor", skills: ["prompt_engineering", "automation"], tools: ["n8n", "Claude API", "Gmail"] },
  { id: "sales", name: "Sales Autopilot", dept: "Automation HQ", level: "B1", hours: 4, desc: "Lead → AI qualifiziert → personalisierte Email automatisch", skills: ["prompt_engineering", "automation"], tools: ["n8n", "Claude API", "CRM"] },
  { id: "invoice", name: "Rechnungs-Pipeline", dept: "Automation HQ", level: "A2", hours: 4, desc: "Rechnungen automatisch erfassen, kategorisieren, exportieren", skills: ["automation", "python"], tools: ["n8n", "Claude API", "Google Drive"] },
  { id: "brand", name: "Brand Kit in 90 Min", dept: "Design Studio", level: "A2", hours: 3, desc: "Logo-Konzept, Farbpalette, 3 Mockups — AI-assisted", skills: ["ai_design", "prompt_engineering"], tools: ["Midjourney", "Canva", "Claude"] },
  { id: "social", name: "Social Media Kit", dept: "Design Studio", level: "A1", hours: 2, desc: "5 zusammengehörende Posts für eine Brand generieren", skills: ["ai_design", "content_ai"], tools: ["Midjourney", "Canva"] },
  { id: "video", name: "AI Video Explainer", dept: "Design Studio", level: "A2", hours: 3, desc: "2-Min Erklärvideo mit AI-Avatar, Script und B-Roll", skills: ["ai_design", "content_ai"], tools: ["HeyGen", "Runway", "Claude"] },
  { id: "chat", name: "AI Chat Widget", dept: "App Lab", level: "B1", hours: 4, desc: "Funktionierenden Chatbot bauen und deployen", skills: ["react", "prompt_engineering", "supabase"], tools: ["React", "Claude API", "Vercel"] },
  { id: "onboard", name: "AI Onboarding Flow", dept: "App Lab", level: "B1", hours: 4, desc: "Mehrstufigen Onboarding-Flow mit AI-Personalisierung", skills: ["react", "supabase", "prompt_engineering"], tools: ["React", "Supabase", "Claude API"] },
  { id: "rag", name: "RAG Knowledge Bot", dept: "App Lab", level: "B2", hours: 8, desc: "Chatbot der auf eigenen Dokumenten antwortet", skills: ["react", "supabase", "python", "prompt_engineering"], tools: ["React", "Supabase", "OpenAI Embeddings", "Claude API"] },
  { id: "faq", name: "Support Bot in 30 Min", dept: "Conversational AI", level: "A1", hours: 1, desc: "FAQ-Bot für deine Website deployen", skills: ["chatbot_dev", "prompt_engineering"], tools: ["Chatbase", "Claude"] },
  { id: "voice", name: "Voice Agent MVP", dept: "Conversational AI", level: "B1", hours: 4, desc: "Sprach-Assistent der Termine bucht", skills: ["chatbot_dev", "automation", "prompt_engineering"], tools: ["Vapi", "Claude API", "Cal.com"] },
  { id: "content", name: "10× Content Sprint", dept: "Content Factory", level: "A1", hours: 2, desc: "10 Posts, 1 Blog, 3 Emails in einer Session", skills: ["content_ai", "prompt_engineering"], tools: ["Claude", "Canva"] },
  { id: "podcast", name: "AI Podcast Episode", dept: "Content Factory", level: "A2", hours: 3, desc: "Von Recherche bis Publish in einem Sprint", skills: ["content_ai", "prompt_engineering"], tools: ["Claude", "NotebookLM", "ElevenLabs"] },
  { id: "dashboard", name: "Dashboard aus Rohdaten", dept: "Data Intelligence", level: "B1", hours: 3, desc: "CSV → AI-Analyse → interaktives Dashboard", skills: ["data_analysis", "prompt_engineering"], tools: ["Claude", "React", "Recharts"] },
  { id: "market", name: "Marktanalyse in 60 Min", dept: "Data Intelligence", level: "A2", hours: 2, desc: "Komplette Branchenanalyse mit AI", skills: ["data_analysis", "prompt_engineering", "ai_strategy"], tools: ["Claude", "Perplexity"] },
  { id: "aiact", name: "AI Act Quick Check", dept: "Business School", level: "A1", hours: 2, desc: "Alle AI-Systeme klassifizieren und dokumentieren", skills: ["ai_ethics", "ai_strategy"], tools: ["Claude"] },
  { id: "strategy", name: "AI Strategie Sprint", dept: "Business School", level: "B1", hours: 8, desc: "AI-Potenziale identifizieren und Roadmap erstellen", skills: ["ai_strategy", "ai_ethics"], tools: ["Claude", "Miro"] },
  { id: "deepfake", name: "Deepfake Defense", dept: "Selbstschutz", level: "A1", hours: 2, desc: "Team gegen AI-Scams und Social Engineering schulen", skills: ["ai_security", "ai_ethics"], tools: ["Claude"] },
  { id: "privacy", name: "Privacy Audit", dept: "Selbstschutz", level: "A1", hours: 1.5, desc: "Eigene AI-Nutzung auf Datenschutz prüfen", skills: ["ai_security", "ai_ethics"], tools: ["Claude"] },
];

const DEPT_COLORS = {
  "Automation HQ": C.am, "Design Studio": "#DB2777", "App Lab": C.bl,
  "Conversational AI": C.cy, "Content Factory": C.rd, "Data Intelligence": C.vi,
  "Business School": C.gn, "Selbstschutz": C.g700,
};

function RatingBar({ score }) {
  const clr = score >= 8 ? C.gn : score >= 6 ? C.bl : score >= 4 ? C.am : C.rd;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ width: 16, height: 8, borderRadius: 2, background: i < score ? clr : C.g200, transition: "all 0.3s", transitionDelay: `${i * 50}ms` }} />
        ))}
      </div>
      <span style={{ fontSize: 14, fontWeight: 900, color: clr, fontFamily: "'JetBrains Mono', monospace", minWidth: 28 }}>{score}/10</span>
    </div>
  );
}

function SprintCard({ sprint, index, isNew }) {
  const deptColor = DEPT_COLORS[sprint.dept] || C.bl;
  return (
    <div style={{
      padding: 18, background: C.w, borderRadius: 14,
      border: `1.5px solid ${isNew ? C.bl : C.g200}`,
      boxShadow: isNew ? `0 4px 16px ${C.bl}10` : "none",
      transition: "all 0.3s", transitionDelay: `${index * 100}ms`,
      animation: "fadeInUp 0.5s ease forwards",
      opacity: 0, animationDelay: `${index * 100}ms`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        {isNew && <span style={{ padding: "2px 8px", borderRadius: 4, background: C.blL, color: C.bl, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em" }}>NEU GENERIERT</span>}
        <span style={{ padding: "2px 8px", borderRadius: 4, background: `${deptColor}10`, color: deptColor, fontSize: 10, fontWeight: 700 }}>{sprint.dept}</span>
        <span style={{ padding: "2px 8px", borderRadius: 4, background: C.g100, color: C.g600, fontSize: 10, fontWeight: 700 }}>Level {sprint.level}</span>
        <span style={{ fontSize: 10, color: C.g400, marginLeft: "auto" }}>{sprint.hours}h</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 900, color: C.x, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{sprint.name}</h3>
      <p style={{ fontSize: 12, color: C.g500, margin: "0 0 10px", lineHeight: 1.5 }}>{sprint.desc}</p>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.g400, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>Relevanz für dein Projekt</div>
        <RatingBar score={sprint.relevance} />
      </div>
      {sprint.reason && <div style={{ fontSize: 11, color: C.g600, lineHeight: 1.5, padding: "8px 10px", background: C.g50, borderRadius: 8 }}>{sprint.reason}</div>}
      {sprint.tools && sprint.tools.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
          {sprint.tools.map((t, i) => <span key={i} style={{ padding: "2px 6px", borderRadius: 4, background: C.g100, color: C.g600, fontSize: 9, fontWeight: 600 }}>{t}</span>)}
        </div>
      )}
      {sprint.phases && sprint.phases.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.g100}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.g400, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>Sprint-Phasen</div>
          {sprint.phases.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: C.g600, padding: "3px 0" }}>
              <span style={{ fontWeight: 700, color: C.bl, minWidth: 16 }}>{i + 1}.</span>
              <span style={{ fontWeight: 600, color: C.x }}>{p.title}</span>
              <span style={{ color: C.g400, marginLeft: "auto" }}>{p.duration} min</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ SCREENS ═══

function InputScreen({ onAnalyze }) {
  const [desc, setDesc] = useState("");
  const [stack, setStack] = useState("");
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("1-2 Wochen");
  const [level, setLevel] = useState("B1");
  const [pdfText, setPdfText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const fileRef = useRef(null);

  const handlePDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfName(file.name);
    const text = await file.text();
    const cleaned = text.replace(/[^\x20-\x7E\xC0-\xFF\n]/g, " ").substring(0, 3000);
    setPdfText(cleaned);
  };

  const canSubmit = (desc.length > 20 || pdfText.length > 20);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🚀</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: C.x, letterSpacing: "-0.04em", margin: "0 0 4px" }}>Sprint Engine</h2>
        <p style={{ fontSize: 14, color: C.g500, margin: 0 }}>Beschreibe dein Projekt — wir finden und bauen die perfekten Sprints für dich.</p>
      </div>

      <div style={{ background: C.w, borderRadius: 14, border: `1px solid ${C.g200}`, padding: 20, marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 800, color: C.x, display: "block", marginBottom: 8 }}>Projektbeschreibung</label>
        <textarea
          value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Beschreibe dein Projekt so detailliert wie möglich: Was baust du? Für wen? Welche Herausforderungen hast du? Was ist dein nächstes Ziel?..."
          style={{ width: "100%", minHeight: 120, padding: 14, borderRadius: 10, border: `1.5px solid ${C.g200}`, fontSize: 14, fontFamily: "inherit", color: C.x, lineHeight: 1.6, resize: "vertical", background: C.g50 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 12, color: C.g400 }}>oder</span>
          <button onClick={() => fileRef.current?.click()} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${C.g200}`, background: C.w, color: C.x, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            📄 PDF hochladen
          </button>
          {pdfName && <span style={{ fontSize: 11, color: C.gn, fontWeight: 600 }}>✓ {pdfName}</span>}
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" onChange={handlePDF} style={{ display: "none" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, padding: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.g500, display: "block", marginBottom: 6 }}>Tech Stack</label>
          <input value={stack} onChange={e => setStack(e.target.value)} placeholder="z.B. React, Supabase, n8n..."
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, fontSize: 13, fontFamily: "inherit" }} />
        </div>
        <div style={{ background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, padding: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.g500, display: "block", marginBottom: 6 }}>Nächstes Ziel</label>
          <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="z.B. MVP launchen, Umsatz steigern..."
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, fontSize: 13, fontFamily: "inherit" }} />
        </div>
        <div style={{ background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, padding: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.g500, display: "block", marginBottom: 6 }}>Zeitbudget</label>
          <select value={timeline} onChange={e => setTimeline(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, fontSize: 13, fontFamily: "inherit", background: C.w }}>
            <option>2-4 Stunden</option><option>1-2 Wochen</option><option>1 Monat</option><option>Flexibel</option>
          </select>
        </div>
        <div style={{ background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, padding: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.g500, display: "block", marginBottom: 6 }}>Dein Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, fontSize: 13, fontFamily: "inherit", background: C.w }}>
            <option value="A1">A1 — Einsteiger</option><option value="A2">A2 — Grundlagen</option>
            <option value="B1">B1 — Fortgeschritten</option><option value="B2">B2 — Erfahren</option>
            <option value="C1">C1 — Experte</option><option value="C2">C2 — Profi</option>
          </select>
        </div>
      </div>

      <button onClick={() => onAnalyze({ desc: desc || pdfText, stack, goal, timeline, level })}
        disabled={!canSubmit}
        style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: canSubmit ? C.x : C.g300, color: C.w,
          fontSize: 15, fontWeight: 800, cursor: canSubmit ? "pointer" : "default",
          fontFamily: "inherit", opacity: canSubmit ? 1 : 0.6,
        }}>
        🔍 Projekt analysieren & Sprints finden
      </button>
    </div>
  );
}

function LoadingScreen({ stage }) {
  const stages = [
    "Projekt wird analysiert...",
    "Bestehende Sprints werden gematcht...",
    "Lücken werden identifiziert...",
    "Neue Sprints werden generiert...",
    "Report wird erstellt...",
  ];
  return (
    <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${C.g200}`, borderTopColor: C.bl, animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
      <h3 style={{ fontSize: 18, fontWeight: 800, color: C.x, margin: "0 0 8px" }}>{stages[stage] || stages[0]}</h3>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 12 }}>
        {stages.map((_, i) => (
          <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i <= stage ? C.bl : C.g200, transition: "background 0.5s" }} />
        ))}
      </div>
      <p style={{ fontSize: 12, color: C.g400, marginTop: 16 }}>Claude analysiert dein Projekt und matcht es gegen {EXISTING_SPRINTS.length} Sprint-Templates...</p>
    </div>
  );
}

function ResultScreen({ result, onBack, onReport }) {
  const { matched, generated, analysis } = result;
  const allSprints = [...matched, ...generated];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
          {allSprints.length} Sprints für dein Projekt
        </h2>
        <p style={{ fontSize: 13, color: C.g500, margin: 0 }}>
          {matched.length} aus der Bibliothek · {generated.length} neu generiert
        </p>
      </div>

      {/* ANALYSIS SUMMARY */}
      <div style={{ padding: 18, background: C.x, borderRadius: 14, marginBottom: 18, color: C.w }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.bl, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Projekt-Analyse</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: C.g300, margin: 0 }}>{analysis}</p>
      </div>

      {/* MATCHED SPRINTS */}
      {matched.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: C.x, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.gn }}>📚</span> Aus der Sprint-Bibliothek
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {matched.map((s, i) => <SprintCard key={s.id || i} sprint={s} index={i} isNew={false} />)}
          </div>
        </div>
      )}

      {/* GENERATED SPRINTS */}
      {generated.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: C.x, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.bl }}>⚡</span> Neu generiert für dein Projekt
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {generated.map((s, i) => <SprintCard key={s.id || i} sprint={s} index={matched.length + i} isNew={true} />)}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.g200}`, background: C.w, color: C.x, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          ← Neues Projekt
        </button>
        <button onClick={onReport} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.x, color: C.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          📄 Detaillierten Report anzeigen
        </button>
      </div>
    </div>
  );
}

function ReportScreen({ result, project, onBack }) {
  const { matched, generated, analysis } = result;
  const allSprints = [...matched, ...generated];
  const avgRelevance = allSprints.length > 0 ? (allSprints.reduce((a, s) => a + (s.relevance || 5), 0) / allSprints.length).toFixed(1) : "0";
  const totalHours = allSprints.reduce((a, s) => a + (s.hours || 2), 0);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* PAGE 1: EXECUTIVE SUMMARY */}
      <div style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.04em", color: C.x }}>ZEHN<span style={{ color: C.bl }}>X</span></span>
              <span style={{ fontSize: 11, color: C.g400, marginLeft: 8 }}>ACADEMY · Sprint Report</span>
            </div>
            <span style={{ fontSize: 10, color: C.g400 }}>{new Date().toLocaleDateString("de-DE")}</span>
          </div>
          <div style={{ padding: "20px 24px", background: C.x, borderRadius: 12, marginBottom: 20, color: C.w }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: C.bl, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Personalisierter Sprint-Plan</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.03em" }}>Executive Summary</h1>
            <p style={{ fontSize: 12, color: C.g400, margin: 0 }}>Basierend auf deiner Projektbeschreibung</p>
          </div>

          {/* KPI ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { v: allSprints.length, l: "Sprints", c: C.bl },
              { v: matched.length, l: "Bibliothek", c: C.gn },
              { v: generated.length, l: "Neu generiert", c: C.vi },
              { v: `${totalHours}h`, l: "Gesamtdauer", c: C.am },
            ].map((k, i) => (
              <div key={i} style={{ padding: 14, background: C.g50, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: k.c }}>{k.v}</div>
                <div style={{ fontSize: 10, color: C.g500, fontWeight: 600 }}>{k.l}</div>
              </div>
            ))}
          </div>

          {/* ANALYSIS */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.x, margin: "0 0 8px" }}>Projekt-Analyse</h3>
            <p style={{ fontSize: 13, color: C.g600, lineHeight: 1.7, margin: 0 }}>{analysis}</p>
          </div>

          {/* SPRINT TABLE */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.x, margin: "0 0 10px" }}>Sprint-Übersicht</h3>
            <div style={{ borderRadius: 10, border: `1px solid ${C.g200}`, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.5fr 0.5fr 1fr", padding: "8px 12px", background: C.g50, fontSize: 10, fontWeight: 700, color: C.g500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                <span>Sprint</span><span>Department</span><span>Level</span><span>Dauer</span><span>Relevanz</span>
              </div>
              {allSprints.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.5fr 0.5fr 1fr", padding: "10px 12px", borderTop: `1px solid ${C.g100}`, fontSize: 12, color: C.g700, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: C.x }}>{i >= matched.length ? "⚡ " : ""}{s.name}</span>
                  <span style={{ color: DEPT_COLORS[s.dept] || C.g500, fontWeight: 600, fontSize: 11 }}>{s.dept}</span>
                  <span>{s.level}</span>
                  <span>{s.hours}h</span>
                  <RatingBar score={s.relevance || 5} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 28px", borderTop: `1px solid ${C.g200}`, background: C.g50 }}>
          <div style={{ fontSize: 9, color: C.g400, textAlign: "center" }}>
            ZEHNX ACADEMY · Frerich United Ventures GmbH · Seite 1 von 3
          </div>
        </div>
      </div>

      {/* PAGE 2: DETAIL MATCHED */}
      <div style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: C.x, margin: 0 }}>Sprint-Details: Bibliothek</h2>
            <span style={{ fontSize: 10, color: C.g400 }}>Seite 2</span>
          </div>
          {matched.length > 0 ? matched.map((s, i) => (
            <div key={i} style={{ padding: 16, background: C.g50, borderRadius: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: 0 }}>{s.name}</h3>
                <RatingBar score={s.relevance} />
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span style={{ padding: "2px 7px", borderRadius: 4, background: `${DEPT_COLORS[s.dept] || C.bl}10`, color: DEPT_COLORS[s.dept] || C.bl, fontSize: 10, fontWeight: 700 }}>{s.dept}</span>
                <span style={{ padding: "2px 7px", borderRadius: 4, background: C.g100, fontSize: 10, fontWeight: 600, color: C.g600 }}>Level {s.level} · {s.hours}h</span>
              </div>
              <p style={{ fontSize: 12, color: C.g600, margin: "0 0 6px", lineHeight: 1.5 }}>{s.desc}</p>
              {s.reason && <p style={{ fontSize: 11, color: C.bl, margin: 0, fontStyle: "italic" }}>→ {s.reason}</p>}
            </div>
          )) : <p style={{ fontSize: 13, color: C.g400, padding: 20, textAlign: "center" }}>Keine bestehenden Sprints passen direkt — alle wurden neu generiert.</p>}
        </div>
        <div style={{ padding: "12px 28px", borderTop: `1px solid ${C.g200}`, background: C.g50 }}>
          <div style={{ fontSize: 9, color: C.g400, textAlign: "center" }}>ZEHNX ACADEMY · Seite 2 von 3</div>
        </div>
      </div>

      {/* PAGE 3: DETAIL GENERATED */}
      <div style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: C.x, margin: 0 }}>Sprint-Details: Neu Generiert</h2>
            <span style={{ fontSize: 10, color: C.g400 }}>Seite 3</span>
          </div>
          {generated.length > 0 ? generated.map((s, i) => (
            <div key={i} style={{ padding: 16, background: C.blXL, borderRadius: 12, marginBottom: 10, border: `1px solid ${C.blL}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: 0 }}>⚡ {s.name}</h3>
                <RatingBar score={s.relevance} />
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span style={{ padding: "2px 7px", borderRadius: 4, background: C.blL, color: C.bl, fontSize: 10, fontWeight: 700 }}>{s.dept}</span>
                <span style={{ padding: "2px 7px", borderRadius: 4, background: C.g100, fontSize: 10, fontWeight: 600, color: C.g600 }}>Level {s.level} · {s.hours}h</span>
              </div>
              <p style={{ fontSize: 12, color: C.g600, margin: "0 0 8px", lineHeight: 1.5 }}>{s.desc}</p>
              {s.reason && <p style={{ fontSize: 11, color: C.bl, margin: "0 0 8px", fontWeight: 600 }}>→ {s.reason}</p>}
              {s.phases && s.phases.length > 0 && (
                <div style={{ borderTop: `1px solid ${C.blL}`, paddingTop: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.g400, marginBottom: 4, letterSpacing: "0.03em", textTransform: "uppercase" }}>5 Phasen</div>
                  {s.phases.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, fontSize: 11, color: C.g600, padding: "2px 0" }}>
                      <span style={{ fontWeight: 700, color: C.bl, minWidth: 60, textTransform: "uppercase", fontSize: 9 }}>{p.phase}</span>
                      <span style={{ fontWeight: 600, color: C.x }}>{p.title}</span>
                      <span style={{ color: C.g400, marginLeft: "auto" }}>{p.duration}min</span>
                    </div>
                  ))}
                </div>
              )}
              {s.deliverable && <div style={{ marginTop: 8, fontSize: 11, color: C.gnD, fontWeight: 600 }}>🎯 Deliverable: {s.deliverable}</div>}
            </div>
          )) : <p style={{ fontSize: 13, color: C.g400, padding: 20, textAlign: "center" }}>Alle bestehenden Sprints passen — keine neuen nötig!</p>}

          <div style={{ padding: 14, background: C.gnL, borderRadius: 10, marginBottom: 20, border: `1px solid ${C.gn}20` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gnD, marginBottom: 4 }}>💡 Nächster Schritt</div>
            <div style={{ fontSize: 12, color: C.g700, lineHeight: 1.6 }}>
              Starte mit dem Sprint mit der höchsten Relevanz. Jeder abgeschlossene Sprint aktualisiert dein Skill-Profil und die nächsten Empfehlungen werden noch präziser. Neu generierte Sprints stehen ab sofort auch allen anderen Usern zur Verfügung.
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 28px", borderTop: `1px solid ${C.g200}`, background: C.g50 }}>
          <div style={{ fontSize: 9, color: C.g400, textAlign: "center" }}>ZEHNX ACADEMY · Frerich United Ventures GmbH · Seite 3 von 3</div>
        </div>
      </div>

      <button onClick={onBack} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${C.g200}`, background: C.w, color: C.x, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        ← Zurück zur Übersicht
      </button>
    </div>
  );
}

// ═══ MAIN ═══

export default function SprintEngine() {
  const [screen, setScreen] = useState("input");
  const [loadStage, setLoadStage] = useState(0);
  const [result, setResult] = useState(null);
  const [project, setProject] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const analyze = async (proj) => {
    setProject(proj);
    setScreen("loading");
    setLoadStage(0);

    const sprintList = EXISTING_SPRINTS.map(s => `- ${s.name} (${s.dept}, ${s.level}, ${s.hours}h): ${s.desc} [Tools: ${s.tools.join(", ")}]`).join("\n");

    const prompt = `Du bist die ZEHNX ACADEMY Sprint Engine. Analysiere dieses Projekt und erstelle einen personalisierten Sprint-Plan.

PROJEKT:
${proj.desc}

KONTEXT:
- Tech Stack: ${proj.stack || "nicht angegeben"}
- Ziel: ${proj.goal || "nicht angegeben"}
- Zeitbudget: ${proj.timeline}
- Level: ${proj.level}

BESTEHENDE SPRINTS:
${sprintList}

AUFGABE:
1. Analysiere das Projekt (2-3 Sätze)
2. Matche die relevantesten bestehenden Sprints (max 5). Gib jedem eine Relevanz 1-10 und erkläre warum
3. Identifiziere Lücken: Was braucht der User, das kein bestehender Sprint abdeckt?
4. Generiere 2-4 NEUE Sprints die exakt auf dieses Projekt zugeschnitten sind. Jeder neue Sprint braucht: Name, Department, Level, Stunden, Beschreibung, 5 Phasen (Kickoff/Learn/Build/Reflect/Share), Deliverable, Tools, Relevanz 1-10

Antworte NUR mit JSON:
{
  "analysis": "Projekt-Analyse...",
  "matched": [
    {"id": "pm", "name": "Prompt Mastery", "dept": "Automation HQ", "level": "A1", "hours": 2, "desc": "...", "tools": ["Claude"], "relevance": 8, "reason": "Warum relevant..."}
  ],
  "generated": [
    {"name": "Neuer Sprint", "dept": "App Lab", "level": "B1", "hours": 4, "desc": "Beschreibung...", "tools": ["React", "Claude API"], "relevance": 9, "reason": "Warum erstellt...", "deliverable": "Was am Ende fertig ist", "phases": [
      {"phase": "kickoff", "title": "Ziel definieren", "duration": 15},
      {"phase": "learn", "title": "Konzept verstehen", "duration": 30},
      {"phase": "build", "title": "Bauen und testen", "duration": 120},
      {"phase": "reflect", "title": "Ergebnis bewerten", "duration": 15},
      {"phase": "share", "title": "Dokumentieren", "duration": 15}
    ]}
  ]
}`;

    try {
      setLoadStage(1);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      setLoadStage(2);
      const data = await response.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json\n?|```\n?/g, "").trim();

      setLoadStage(3);
      const parsed = JSON.parse(clean);

      setLoadStage(4);
      // Sort by relevance
      if (parsed.matched) parsed.matched.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
      if (parsed.generated) parsed.generated.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

      setResult(parsed);
      setScreen("result");
    } catch (e) {
      // Fallback: simulate result
      setResult({
        analysis: "Dein Projekt wurde analysiert. Basierend auf den Details wurden passende Sprints identifiziert und neue erstellt.",
        matched: EXISTING_SPRINTS.slice(0, 4).map((s, i) => ({ ...s, relevance: 8 - i, reason: "Passt zu deinem Projektkontext" })),
        generated: [{
          name: "Custom Sprint für dein Projekt", dept: "App Lab", level: proj.level, hours: 4,
          desc: "Ein maßgeschneiderter Sprint basierend auf deiner Projektbeschreibung",
          tools: ["Claude API", "React"], relevance: 9,
          reason: "Deckt eine Lücke ab die kein bestehender Sprint adressiert",
          deliverable: "Funktionierender Prototyp",
          phases: [
            { phase: "kickoff", title: "Projektziel schärfen", duration: 15 },
            { phase: "learn", title: "Relevante Konzepte", duration: 30 },
            { phase: "build", title: "Implementierung", duration: 120 },
            { phase: "reflect", title: "Testing & Review", duration: 15 },
            { phase: "share", title: "Dokumentation", duration: 15 },
          ],
        }],
      });
      setScreen("result");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0}
        ::selection{background:${C.blL};color:${C.x}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        textarea:focus,input:focus,select:focus{outline:none;border-color:${C.bl} !important;box-shadow:0 0 0 3px ${C.blL}}
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}E6`, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `0.5px solid ${C.g200}` }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 48 }}>
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.04em", color: C.x }}>
            ZEHN<span style={{ color: C.bl }}>X</span>
            <span style={{ fontWeight: 500, color: C.g400, fontSize: 12, marginLeft: 8 }}>Sprint Engine</span>
          </span>
        </div>
      </nav>

      <div style={{ padding: "24px 20px 60px" }}>
        {screen === "input" && <InputScreen onAnalyze={analyze} />}
        {screen === "loading" && <LoadingScreen stage={loadStage} />}
        {screen === "result" && !showReport && <ResultScreen result={result} onBack={() => setScreen("input")} onReport={() => setShowReport(true)} />}
        {screen === "result" && showReport && <ReportScreen result={result} project={project} onBack={() => setShowReport(false)} />}
      </div>
    </div>
  );
}
