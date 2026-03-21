import SprintEngine from "./SprintEngine";
import LiveTab from "./LiveTab";
import NetworkTab from "./NetworkTab";
import SprintRunner from "./SprintRunner";
import SprintCatalog from "./SprintCatalog";
import ResponsiveShell from "./ResponsiveShell";
import Pricing from "./Pricing";
import SkillProfile from "./SkillProfile";
import LearningPath from "./LearningPath";
import AITutor from "./StudyBot";
import AcademyBot from "./AcademyBot";
import EnterpriseBot from "./EnterpriseBot";
import BusinessInquiry from "./BusinessInquiry";
import Legal from "./Legal";
import NewsroomFull from "./Newsroom";
import AIReadiness from "./AIReadiness";
import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX ACADEMY — Production Build
// Verzehnfache dein Wissen.
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF", pk: "#DB2777", pkL: "#FDF2F8",
  cy: "#0891B2", cyL: "#ECFEFF", tl: "#0D9488",
};

// ─── DATA ────────────────────────────────────────────────────

const DEPTS = [
  { id: "design", n: "Design Studio", i: "✦", t: "Visual AI & Branding", s: 12, c: Z.pk },
  { id: "apps", n: "App Lab", i: "◆", t: "Full-Stack AI Apps", s: 14, c: Z.bl },
  { id: "chat", n: "Conversational AI", i: "◇", t: "Chatbots & Voice", s: 10, c: Z.cy },
  { id: "auto", n: "Automation HQ", i: "⬡", t: "Workflows & Pipelines", s: 11, c: Z.am },
  { id: "content", n: "Content Factory", i: "◈", t: "Text, Video & Audio", s: 9, c: Z.rd },
  { id: "data", n: "Data Intelligence", i: "◉", t: "Analytics & BI", s: 10, c: Z.vi },
  { id: "biz", n: "Business School", i: "◎", t: "Strategie & AI Act", s: 8, c: Z.gn },
  { id: "shield", n: "Selbstschutz", i: "⊕", t: "Privacy & Safety", s: 7, c: Z.g700 },
];

const DIMS = [
  { id: "understanding", l: "AI-Verständnis", i: "🧠", c: Z.bl },
  { id: "usage", l: "Praxis", i: "⚡", c: Z.am },
  { id: "technical", l: "Technik", i: "⌨️", c: Z.gn },
  { id: "ethics", l: "Ethik", i: "⚖️", c: Z.rd },
  { id: "projects", l: "Projekte", i: "🚀", c: Z.vi },
];

const QS = [
  { dim: "understanding", q: "Ein Kollege fragt: 'Ist ChatGPT künstliche Intelligenz?'", opts: [
    { t: "Ja, echte Intelligenz wie beim Menschen", s: 0 },
    { t: "Ja, ein AI-System — genauer ein Large Language Model", s: 3 },
    { t: "Ein auf Transformer-Architektur basierendes LLM, das Textmuster statistisch vorhersagt", s: 5 },
    { t: "Bin mir nicht sicher was AI genau bedeutet", s: 0 },
  ]},
  { dim: "understanding", q: "Was unterscheidet Machine Learning von Deep Learning?", opts: [
    { t: "Kein Unterschied, sind Synonyme", s: 0 },
    { t: "Deep Learning nutzt mehrschichtige neuronale Netze — ist Teil von ML", s: 5 },
    { t: "ML lernt aus Daten, DL ist die nächste Stufe", s: 2 },
    { t: "Keine Ahnung", s: 0 },
  ]},
  { dim: "usage", q: "Du willst einen komplexen Report mit AI zusammenfassen. Wie?", opts: [
    { t: "Text reinkopieren, 'Fasse zusammen' schreiben", s: 1 },
    { t: "Kontext, Zielgruppe und Format angeben", s: 3 },
    { t: "System-Prompt + strukturierte Anweisungen + iteratives Refinement", s: 5 },
    { t: "Hab ich noch nie gemacht", s: 0 },
  ]},
  { dim: "usage", q: "AI gibt dir eine plausible aber möglicherweise falsche Antwort. Was tust du?", opts: [
    { t: "Vertraue der Antwort", s: 0 },
    { t: "Frage nochmal ob sie sich sicher ist", s: 1 },
    { t: "Prüfe Kernaussagen mit zweiter Quelle", s: 3 },
    { t: "Kenne typische Halluzinationsmuster, weiß wann Check nötig", s: 5 },
  ]},
  { dim: "technical", q: "Du sollst Daten aus einer API abrufen und mit AI verarbeiten.", opts: [
    { t: "Weiß nicht was eine API ist", s: 0 },
    { t: "Würde jemanden fragen der programmiert", s: 1 },
    { t: "Python-Script mit requests, JSON verarbeiten", s: 4 },
    { t: "Pipeline mit Error-Handling, Rate-Limiting, strukturiertem Output", s: 5 },
  ]},
  { dim: "technical", q: "Wie würdest du einen AI-Chatbot für dein Unternehmen bauen?", opts: [
    { t: "Keine Ahnung wo ich anfangen soll", s: 0 },
    { t: "No-Code Tool wie Chatbase nutzen", s: 2 },
    { t: "React + Claude API + Supabase Backend", s: 4 },
    { t: "RAG-System mit Vektordatenbank, Streaming, Auth, Monitoring", s: 5 },
  ]},
  { dim: "ethics", q: "Chef will AI für automatisches Bewerber-Screening. Deine Reaktion?", opts: [
    { t: "Super Idee, spart Zeit!", s: 0 },
    { t: "Könnte problematisch sein wegen Bias", s: 2 },
    { t: "High-Risk System nach EU AI Act mit strengen Compliance-Pflichten", s: 5 },
    { t: "Unsicher ob es Regeln gibt", s: 1 },
  ]},
  { dim: "ethics", q: "Was bedeutet 'AI Literacy' nach dem EU AI Act?", opts: [
    { t: "Noch nie gehört", s: 0 },
    { t: "Mitarbeiter sollten wissen wie AI funktioniert", s: 2 },
    { t: "Art. 4 verpflichtet Unternehmen, ausreichende AI-Kompetenz sicherzustellen", s: 5 },
    { t: "Geht um Datenschutz bei AI, oder?", s: 1 },
  ]},
  { dim: "projects", q: "Wie viele AI-Projekte hast du eigenständig umgesetzt?", opts: [
    { t: "Noch keins", s: 0 },
    { t: "Tutorials nachgebaut", s: 1 },
    { t: "1-2 eigene Projekte die laufen", s: 3 },
    { t: "Mehrere produktive AI-Features in echten Apps", s: 5 },
  ]},
  { dim: "projects", q: "Du hast eine Idee für ein AI-Feature. Nächster Schritt?", opts: [
    { t: "Warte bis jemand das baut", s: 0 },
    { t: "Erstmal wochenlang recherchieren", s: 1 },
    { t: "Innerhalb von Stunden einen Prototyp bauen", s: 4 },
    { t: "Architektur → MVP → User-Test → Iterate", s: 5 },
  ]},
];

const SPRINTS_DATA = [
  { n: "AI Email Triage", dept: "auto", t: "2h", lv: "A2", d: "AI kategorisiert, priorisiert und schlägt Antworten vor" },
  { n: "Brand Kit in 90 Min", dept: "design", t: "3h", lv: "A2", d: "Logo, Palette, 3 Mockups — AI-assisted" },
  { n: "AI Chat Widget", dept: "apps", t: "4h", lv: "B1", d: "Funktionierenden Chatbot bauen und deployen" },
  { n: "10× Content Sprint", dept: "content", t: "2h", lv: "A1", d: "10 Posts, 1 Blog, 3 Emails in einer Session" },
  { n: "Dashboard aus Rohdaten", dept: "data", t: "3h", lv: "B1", d: "CSV → AI-Analyse → interaktives Dashboard" },
  { n: "AI Act Quick Check", dept: "biz", t: "2h", lv: "A1", d: "Alle AI-Systeme klassifizieren und dokumentieren" },
  { n: "Prompt Mastery", dept: "auto", t: "2h", lv: "A1", d: "5 Power-Prompts für deinen Arbeitsalltag entwickeln" },
  { n: "AI Onboarding Flow", dept: "apps", t: "4h", lv: "B1", d: "Mehrstufigen Onboarding-Flow mit AI-Personalisierung bauen" },
  { n: "Deepfake Defense", dept: "shield", t: "2h", lv: "A1", d: "Team gegen AI-Scams und Social Engineering schulen" },
  { n: "Voice Agent MVP", dept: "chat", t: "4h", lv: "B1", d: "Sprach-Assistent der Termine bucht" },
  { n: "AI Video Explainer", dept: "content", t: "3h", lv: "A2", d: "2-Min Erklärvideo mit AI-Avatar und B-Roll" },
  { n: "Sales Autopilot", dept: "auto", t: "4h", lv: "B1", d: "Lead → AI qualifiziert → personalisierte Email automatisch" },
];

const NEWS = [
  { id: 1, cat: "TOOLS", c: Z.bl, time: "2h", title: "Claude 4.6 Opus — Was ändert sich für deinen Stack?", sum: "Größeres Context Window, bessere Tool-Use-Performance. Konkrete Auswirkungen auf React/Supabase-Projekte.", impact: "HOCH", ic: Z.rd, res: ["📄 Anthropic Blog", "🎥 Fireship — 100 Seconds", "🎙️ Latent Space Podcast", "📚 Constitutional AI Paper"], sprint: "API Migration Sprint" },
  { id: 2, cat: "REGULATION", c: Z.rd, time: "4h", title: "Erstes EU-Bußgeld wegen fehlender AI-Literacy", sum: "Finnische Behörde sanktioniert nach Art. 4 AI Act. Was das für deutsche Firmen bedeutet.", impact: "KRITISCH", ic: Z.rd, res: ["📄 EU AI Office Guidelines", "🎙️ KI-Update kompakt", "📚 Art. 4 Leitfaden", "🎥 RA Solmecke"], sprint: "AI Act Sprint" },
  { id: 3, cat: "DEV TOOLS", c: Z.gn, time: "1d", title: "n8n 2.0: Native AI Agent Nodes", sum: "Dedizierte Nodes für AI-Agents: Tool-Use, Memory, Retrieval im Visual Editor.", impact: "MITTEL", ic: Z.am, res: ["📄 n8n Release Notes", "🎥 Agent Nodes Tutorial", "📚 Agent Node Docs"], sprint: "n8n Agent Sprint" },
  { id: 4, cat: "SECURITY", c: Z.pk, time: "2d", title: "Deepfake-Scam: €2.3M bei deutschem Mittelständler", sum: "CFO-Deepfake in Videocall autorisierte Überweisung. Analyse und Schutzmaßnahmen.", impact: "HOCH", ic: Z.rd, res: ["📄 BSI Warnung", "🎥 Deepfakes erkennen", "🎙️ Darknet Diaries"], sprint: "Deepfake Defense Sprint" },
];

const TICKER = [
  { t: "14:32", tx: "Claude 4.6 Opus: 200K Context Window für alle bestätigt", h: true },
  { t: "13:15", tx: "EU veröffentlicht High-Risk AI Klassifizierungs-Leitlinien", h: true },
  { t: "12:48", tx: "OpenAI Codex verlässt Beta — autonomer Software-Agent verfügbar" },
  { t: "11:30", tx: "Stripe launcht native AI-Features für Zahlungsanalyse" },
  { t: "10:22", tx: "GitHub Copilot Agent Mode erstellt Pull Requests autonom" },
  { t: "09:05", tx: "Bitkom: 112.000 unbesetzte IT-Stellen — Höchststand" },
];

const GOALS = [
  { t: "AI produktiv im Job einsetzen", path: "auto" },
  { t: "Business-Prozesse automatisieren", path: "auto" },
  { t: "Eine AI-App oder SaaS bauen", path: "apps" },
  { t: "Content-Produktion beschleunigen", path: "content" },
  { t: "AI-Strategie für mein Team", path: "biz" },
];

// ─── SHARED ──────────────────────────────────────────────────

function Pill({ c, children }) { return <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${c}10`, color: c }}>{children}</span>; }
function Logo({ s = 15 }) { return <span style={{ fontWeight: 900, fontSize: s, color: Z.x, letterSpacing: "-0.04em" }}>ZEHN<span style={{ color: Z.bl }}>X</span><span style={{ fontWeight: 500, color: Z.g400, fontSize: s * 0.7, marginLeft: 4, letterSpacing: "0.04em" }}>ACADEMY</span></span>; }
function Btn({ children, onClick, primary, disabled, full }) {
  return <button onClick={onClick} disabled={disabled} style={{
    padding: "11px 24px", borderRadius: 10, border: primary ? "none" : `1.5px solid ${Z.g300}`,
    background: disabled ? Z.g200 : primary ? Z.x : Z.w, color: disabled ? Z.g400 : primary ? Z.w : Z.x,
    fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    boxShadow: primary && !disabled ? `0 2px 8px ${Z.x}20` : "none", width: full ? "100%" : "auto",
  }}>{children}</button>;
}
function Bar({ v, max, c, h = 5 }) {
  return <div style={{ background: Z.g100, borderRadius: h / 2, height: h, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${Math.min((v / max) * 100, 100)}%`, height: "100%", background: c || Z.bl, borderRadius: h / 2, transition: "width 0.5s ease" }} />
  </div>;
}
function Radar({ scores, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.36, n = DIMS.length;
  const pt = (i, val) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return { x: cx + Math.cos(a) * (val / 5) * r, y: cy + Math.sin(a) * (val / 5) * r }; };
  const poly = DIMS.map((_, i) => { const p = pt(i, scores[DIMS[i].id] || 0); return `${p.x},${p.y}`; }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[1, 2, 3, 4, 5].map(lv => <polygon key={lv} points={DIMS.map((_, i) => { const p = pt(i, lv); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke={Z.g200} strokeWidth={1} />)}
      {DIMS.map((d, i) => { const p = pt(i, 5); const lb = pt(i, 6.5); return <g key={i}><line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={Z.g200} strokeWidth={1} /><text x={lb.x} y={lb.y} fill={Z.g400} fontSize={11} textAnchor="middle" dominantBaseline="middle">{d.i}</text></g>; })}
      <polygon points={poly} fill={`${Z.bl}18`} stroke={Z.bl} strokeWidth={2} />
      {DIMS.map((d, i) => { const p = pt(i, scores[d.id] || 0); return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={d.c} stroke={Z.w} strokeWidth={2} />; })}
    </svg>
  );
}

// ─── NAV ─────────────────────────────────────────────────────

function Nav({ screen, setScreen, section, setSection }) {
  const isPwa = !["home", "assess", "goal", "results", "import"].includes(screen);
  const tabs = [{ id: "dash", l: "Dashboard" }, { id: "sprints", l: "Sprints" }, { id: "news", l: "Newsroom" }, { id: "deep", l: "Deep Dive" }, { id: "live", l: "Live" }, { id: "network", l: "Netzwerk" }, { id: "progress", l: "Fortschritt" }];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, background: `${Z.bg}D8`, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `0.5px solid ${Z.g200}` }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 52 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setScreen("home")}><Logo /></div>
        {!isPwa ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {screen === "home" && ["Departments", "Sprints", "Business", "Enterprise"].map(i => (
              <span key={i} style={{ fontSize: 13, color: Z.g500, fontWeight: 600, cursor: "pointer" }} onMouseEnter={e => e.target.style.color = Z.x} onClick={() => { if(i==="Business") setScreen("business"); }} onMouseLeave={e => e.target.style.color = Z.g500}>{i}</span>
            ))}
            <button onClick={() => setScreen("newsroom")} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFF",color:"#18181B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Newsroom</button><button onClick={() => setScreen("legal")} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFF",color:"#18181B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Impressum</button><button onClick={() => setScreen("readiness")} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFF",color:"#18181B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>X-SCORE</button><button onClick={() => setScreen("engine")} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFF",color:"#18181B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sprint Engine</button><button onClick={() => setScreen("engine")} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFF",color:"#18181B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sprint Engine</button>{screen === "home" && <button onClick={() => setScreen("assess")} style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: Z.x, color: Z.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Starten →</button>}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setScreen("pwa"); setSection(t.id); }} style={{
                padding: "6px 13px", borderRadius: 8, border: "none",
                background: section === t.id ? Z.w : "transparent", color: section === t.id ? Z.x : Z.g400,
                fontSize: 12, fontWeight: section === t.id ? 600 : 500, cursor: "pointer", fontFamily: "inherit",
                boxShadow: section === t.id ? `0 1px 3px ${Z.x}08` : "none",
              }}>{t.l}</button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ═══ HOMEPAGE ══════════════════════════════════════════════════

function Home({ go }) {
  return (<div>
    <section style={{ padding: "72px 20px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${Z.blL}50 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", padding: "5px 14px", borderRadius: 20, background: Z.w, border: `1px solid ${Z.g200}`, fontSize: 12, color: Z.g600, fontWeight: 600, marginBottom: 22, gap: 6, alignItems: "center", boxShadow: `0 1px 4px ${Z.x}06` }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: Z.gn }} />Die freie AI Sprint-Akademie
        </div>
        <h1 style={{ fontSize: 50, fontWeight: 900, color: Z.x, lineHeight: 1.08, margin: "0 0 18px", letterSpacing: "-0.035em" }}>Verzehnfache<br />dein Wissen.</h1>
        <p style={{ fontSize: 18, color: Z.g500, lineHeight: 1.6, margin: "0 0 30px" }}>Keine Kurse. Sprints an deinem echten Projekt —<br />mit sofort sichtbaren Ergebnissen.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn primary onClick={() => go("assess")}>Kostenlos starten</Btn>
          <Btn>Enterprise Demo</Btn>
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 720, margin: "-10px auto 0", padding: "0 20px", position: "relative", zIndex: 10 }}>
      <div style={{ display: "flex", background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, overflow: "hidden", boxShadow: `0 2px 10px ${Z.x}06` }}>
        {[{ v: "130+", l: "Module" }, { v: "8", l: "Departments" }, { v: "A1→C2", l: "Sprachlevel" }, { v: "0 €", l: "Für immer frei" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "18px 12px", textAlign: "center", borderRight: i < 3 ? `1px solid ${Z.g100}` : "none" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: Z.x }}>{s.v}</div>
            <div style={{ fontSize: 11, color: Z.g400, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "64px 20px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: Z.bl, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>SO FUNKTIONIERT'S</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: Z.x, margin: 0, letterSpacing: "-0.02em" }}>Dein Projekt. Dein Sprint. Dein Ergebnis.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[{ s: "01", t: "Projekt beschreiben", d: "Was baust du? Die Plattform analysiert deinen Stand.", i: "📋" }, { s: "02", t: "Sprint starten", d: "3-5 Tage, 1-2h/Tag. Am Ende steht was Fertiges.", i: "⚡" }, { s: "03", t: "Ergebnis & Wachstum", d: "Feature funktioniert. Wissensbaum wächst.", i: "🌱" }].map((s, i) => (
          <div key={i} style={{ padding: 22, background: Z.w, borderRadius: 16, border: `1px solid ${Z.g200}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: Z.g200 }}>{s.s}</span><span style={{ fontSize: 20 }}>{s.i}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 4px" }}>{s.t}</h3>
            <p style={{ fontSize: 13, color: Z.g500, margin: 0, lineHeight: 1.5 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={{ background: Z.w, padding: "48px 20px", borderTop: `1px solid ${Z.g100}`, borderBottom: `1px solid ${Z.g100}` }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: Z.am, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>8 DEPARTMENTS</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: Z.x, margin: 0 }}>Wähle dein Fachgebiet</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {DEPTS.map((d, i) => (
            <div key={i} style={{ padding: "16px 14px", borderRadius: 12, border: `1px solid ${Z.g200}`, background: Z.bg, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.c; e.currentTarget.style.background = Z.w; }} onMouseLeave={e => { e.currentTarget.style.borderColor = Z.g200; e.currentTarget.style.background = Z.bg; }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${d.c}08`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: d.c, marginBottom: 8, border: `1px solid ${d.c}15` }}>{d.i}</div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: Z.x, margin: "0 0 2px" }}>{d.n}</h3>
              <p style={{ fontSize: 11, color: Z.g400, margin: "0 0 6px" }}>{d.t}</p>
              <span style={{ fontSize: 11, color: d.c, fontWeight: 700 }}>{d.s} Sprints →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ padding: "40px 32px", borderRadius: 20, background: Z.x, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", background: `${Z.bl}12` }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: Z.am, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>ENTERPRISE</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: Z.w, margin: "0 0 4px" }}>AI-Sprints für ganze Teams</h3>
          <p style={{ fontSize: 13, color: Z.g400, margin: 0, maxWidth: 360 }}>Personengenau am echten Tagesgeschäft. EU AI Act konform. Made in Germany.</p>
        </div>
        <Btn>Demo anfragen</Btn>
      </div>
    </section>
    <footer style={{ borderTop: `1px solid ${Z.g200}`, padding: "20px", background: Z.w }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: 11, color: Z.g400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Logo s={12} /><span>· Frerich United Ventures GmbH · Köln</span></div>
        <div style={{ display: "flex", gap: 14 }}><span style={{ cursor: "pointer" }}>Impressum</span><span style={{ cursor: "pointer" }}>Datenschutz</span><span style={{ cursor: "pointer" }}>AI Act</span></div>
      </div>
    </footer>
  </div>);
}

// ═══ ASSESSMENT ═══════════════════════════════════════════════

function Assessment({ onDone }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ans, setAns] = useState({});
  const q = QS[cur]; const dim = DIMS.find(d => d.id === q.dim);
  const next = () => {
    if (sel === null) return;
    const na = { ...ans, [cur]: { dim: q.dim, s: q.opts[sel].s } }; setAns(na); setSel(null);
    if (cur < QS.length - 1) setCur(cur + 1);
    else { const sc = {}, ct = {}; Object.values(na).forEach(a => { sc[a.dim] = (sc[a.dim] || 0) + a.s; ct[a.dim] = (ct[a.dim] || 0) + 1; }); const avg = {}; Object.keys(sc).forEach(k => avg[k] = sc[k] / ct[k]); onDone(avg); }
  };
  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Pill c={dim.c}>{dim.i} {dim.l}</Pill>
        <span style={{ fontSize: 12, color: Z.g400, fontFamily: "monospace" }}>{cur + 1}/{QS.length}</span>
      </div>
      <Bar v={cur + 1} max={QS.length} c={Z.bl} h={3} />
      <h2 style={{ fontSize: 18, fontWeight: 700, color: Z.x, margin: "24px 0 20px", lineHeight: 1.4 }}>{q.q}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {q.opts.map((o, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            padding: "12px 16px", borderRadius: 10, fontSize: 14, textAlign: "left",
            border: `1.5px solid ${sel === i ? Z.bl : Z.g200}`, background: sel === i ? Z.blL : Z.w,
            color: sel === i ? Z.x : Z.g600, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4,
          }}>
            <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center", marginRight: 8, background: sel === i ? Z.bl : Z.g200, color: sel === i ? Z.w : Z.g500, fontSize: 11, fontWeight: 800 }}>{String.fromCharCode(65 + i)}</span>
            {o.t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn primary disabled={sel === null} onClick={next}>{cur < QS.length - 1 ? "Weiter →" : "Auswerten →"}</Btn></div>
    </div>
  );
}

// ═══ RESULTS ═════════════════════════════════════════════════

function Results({ scores, onContinue }) {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const lvl = avg < 1 ? "A1" : avg < 2 ? "A2" : avg < 3 ? "B1" : avg < 4 ? "B2" : "C1";
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "36px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: Z.bl, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>DEIN ERGEBNIS</div>
      <h1 style={{ fontSize: 44, fontWeight: 900, color: Z.x, margin: "0 0 4px" }}>{avg.toFixed(1)}<span style={{ fontSize: 20, color: Z.g400 }}>/5.0</span></h1>
      <Pill c={Z.bl}>Level {lvl}</Pill>
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}><Radar scores={scores} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24, textAlign: "left" }}>
        {DIMS.map(d => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: Z.w, borderRadius: 8, border: `1px solid ${Z.g200}` }}>
            <span style={{ fontSize: 14 }}>{d.i}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: Z.x, fontWeight: 600 }}>{d.l}</span>
                <span style={{ fontSize: 12, color: d.c, fontWeight: 700 }}>{(scores[d.id] || 0).toFixed(1)}</span>
              </div>
              <Bar v={scores[d.id] || 0} max={5} c={d.c} h={4} />
            </div>
          </div>
        ))}
      </div>
      <Btn primary full onClick={onContinue}>Weiter — Projekt beschreiben →</Btn>
    </div>
  );
}

// ═══ PROJECT IMPORT / GOAL ═══════════════════════════════════

function GoalScreen({ onDone }) {
  const [text, setText] = useState("");
  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "36px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: Z.x, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Was willst du erreichen?</h2>
      <p style={{ fontSize: 14, color: Z.g400, margin: "0 0 20px" }}>Dein Ziel bestimmt deine Sprints. Wähle oder beschreibe dein Projekt.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {GOALS.map((g, i) => (
          <button key={i} onClick={() => onDone(g.path)} style={{ padding: "13px 16px", borderRadius: 10, textAlign: "left", border: `1px solid ${Z.g200}`, background: Z.w, color: Z.x, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = Z.bl} onMouseLeave={e => e.currentTarget.style.borderColor = Z.g200}>
            {g.t}
          </button>
        ))}
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Oder beschreibe dein Projekt frei... z.B. 'React PWA für Tagesmütter mit Supabase Backend, Stripe Payments, Push Notifications'" rows={3}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${Z.g200}`, background: Z.w, color: Z.x, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = Z.bl} onBlur={e => e.target.style.borderColor = Z.g200} />
      </div>
      {text.length > 10 && <Btn primary full onClick={() => onDone("apps")}>Mit diesem Projekt starten →</Btn>}
    </div>
  );
}

// ═══ PWA: DASHBOARD ══════════════════════════════════════════

function Dash({ scores, goSection }) {
  const avg = scores ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length : 2.5;
  const lvl = avg < 1 ? "A1" : avg < 2 ? "A2" : avg < 3 ? "B1" : avg < 4 ? "B2" : "C1";
  const [streak] = useState(1);
  const [done] = useState(0);
  const active = { n: "Prompt Mastery", dept: "Automation HQ", pct: 15, phase: "KICKOFF" };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 2px" }}>Willkommen bei ZEHNX</h1>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>Dein erster Sprint wartet. Level: {lvl}. Los geht's.</p>
      </div>

      <div style={{ padding: 18, background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, marginBottom: 12, boxShadow: `0 1px 4px ${Z.x}04` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: Z.bl, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Aktiver Sprint · {active.dept}</div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: Z.x, margin: 0 }}>{active.n}</h2>
          </div>
          <Pill c={Z.am}>{active.phase}</Pill>
        </div>
        <Bar v={active.pct} max={100} c={Z.bl} h={5} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
          <span style={{ color: Z.g400 }}>{active.pct}%</span>
          <span style={{ color: Z.bl, fontWeight: 600, cursor: "pointer" }}>Weitermachen →</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[{ v: `${streak}`, l: "Tag Streak", i: "🔥" }, { v: `${done}`, l: "Sprints fertig", i: "✓" }, { v: lvl, l: "Level", i: "◆" }].map((s, i) => (
          <div key={i} style={{ padding: 12, background: Z.w, borderRadius: 10, border: `1px solid ${Z.g200}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, marginBottom: 1 }}>{s.i}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: Z.x }}>{s.v}</div>
            <div style={{ fontSize: 10, color: Z.g400, marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, background: Z.w, borderRadius: 12, border: `1px solid ${Z.g200}`, marginBottom: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: Z.x, margin: "0 0 10px" }}>Wissensbaum</h3>
        {[{ s: "Prompt Engineering", xp: 1, c: Z.bl }, { s: "React", xp: 0, c: Z.cy }, { s: "AI Ethics", xp: 0, c: Z.rd }, { s: "Automation", xp: 0, c: Z.am }, { s: "Python", xp: 0, c: Z.vi }].map((sk, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: Z.x, fontWeight: 600, width: 120 }}>{sk.s}</span>
            <div style={{ flex: 1 }}><Bar v={sk.xp} max={7} c={sk.c} h={4} /></div>
            <span style={{ fontSize: 10, color: Z.g400, width: 20, textAlign: "right" }}>×{sk.xp}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, background: Z.w, borderRadius: 12, border: `1px solid ${Z.g200}`, marginBottom: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: Z.x, margin: "0 0 10px" }}>Empfohlene Sprints</h3>
        {SPRINTS_DATA.slice(0, 3).map((s, i) => {
          const dp = DEPTS.find(d => d.id === s.dept);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: Z.g50, borderRadius: 8, marginBottom: 3, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = Z.g100} onMouseLeave={e => e.currentTarget.style.background = Z.g50}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: Z.x }}>{s.n}</div>
                <div style={{ fontSize: 11, color: Z.g400 }}>{dp?.n} · {s.t} · {s.lv}</div>
              </div>
              <span style={{ color: Z.bl, fontSize: 13 }}>→</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button onClick={() => goSection("news")} style={{ padding: 14, background: Z.w, borderRadius: 10, border: `1px solid ${Z.g200}`, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
          <div style={{ fontSize: 10, color: Z.rd, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 3 }}>NEWSROOM</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: Z.x }}>4 neue Meldungen heute →</div>
        </button>
        <button onClick={() => goSection("deep")} style={{ padding: 14, background: Z.w, borderRadius: 10, border: `1px solid ${Z.g200}`, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
          <div style={{ fontSize: 10, color: Z.vi, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 3 }}>DEEP DIVE</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: Z.x }}>Tiefer einsteigen →</div>
        </button>
      </div>
    </div>
  );
}

// ═══ PWA: SPRINT LIBRARY ═════════════════════════════════════

function SprintLib() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? SPRINTS_DATA : SPRINTS_DATA.filter(s => s.dept === filter);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 4px" }}>Sprint-Bibliothek</h2>
      <p style={{ fontSize: 13, color: Z.g400, margin: "0 0 14px" }}>Wähle deinen nächsten Sprint.</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${filter === "all" ? Z.x : Z.g200}`, background: filter === "all" ? Z.x : Z.w, color: filter === "all" ? Z.w : Z.g500, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Alle</button>
        {DEPTS.map(d => (
          <button key={d.id} onClick={() => setFilter(d.id)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${filter === d.id ? d.c : Z.g200}`, background: filter === d.id ? `${d.c}10` : Z.w, color: filter === d.id ? d.c : Z.g500, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{d.n}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {filtered.map((s, i) => {
          const dp = DEPTS.find(d => d.id === s.dept);
          return (
            <div key={i} style={{ padding: "14px 16px", background: Z.w, borderRadius: 12, border: `1px solid ${Z.g200}`, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = dp?.c || Z.bl; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = Z.g200; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: dp?.c, letterSpacing: "0.04em", textTransform: "uppercase" }}>{dp?.n}</span>
                <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: Z.amL, color: Z.am }}>{s.lv}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 3px" }}>{s.n}</h3>
              <p style={{ fontSize: 11, color: Z.g400, margin: "0 0 6px", lineHeight: 1.4 }}>{s.d}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: Z.g500 }}>⏱ {s.t}</span>
                <span style={{ fontSize: 11, color: Z.bl, fontWeight: 600 }}>Starten →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ PWA: NEWSROOM ════════════════════════════════════════════

function NewsroomPWA() {
  const [sel, setSel] = useState(null);
  const [ti, setTi] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTi(i => i + 1), 3000); return () => clearInterval(iv); }, []);
  const tk = TICKER[ti % TICKER.length];

  if (sel) {
    const a = NEWS.find(x => x.id === sel);
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
        <button onClick={() => setSel(null)} style={{ background: "none", border: "none", fontSize: 13, color: Z.bl, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginBottom: 12, fontFamily: "inherit" }}>← Newsroom</button>
        <Pill c={a.c}>{a.cat}</Pill>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "8px 0 4px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>{a.title}</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: Z.g400 }}>Vor {a.time}</span>
          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${a.ic}10`, color: a.ic }}>{a.impact}</span>
        </div>
        <p style={{ fontSize: 15, color: Z.g600, lineHeight: 1.7, margin: "0 0 20px" }}>{a.sum}</p>
        <div style={{ padding: 16, background: Z.g50, borderRadius: 12, marginBottom: 12 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: Z.x, margin: "0 0 8px" }}>Ressourcen</h3>
          {a.res.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: Z.w, borderRadius: 8, border: `1px solid ${Z.g200}`, marginBottom: 3, cursor: "pointer" }}>
              <span style={{ fontSize: 13 }}>{r.substring(0, 2)}</span>
              <span style={{ fontSize: 12, color: Z.g600, flex: 1 }}>{r.substring(3)}</span>
              <span style={{ fontSize: 12, color: Z.bl }}>→</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 14, background: Z.blL, borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: Z.bl, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 3 }}>SPRINT</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: Z.x }}>{a.sprint}</div>
          </div>
          <div style={{ padding: 14, background: Z.viL, borderRadius: 10, cursor: "pointer" }}>
            <div style={{ fontSize: 10, color: Z.vi, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 3 }}>DEEP DIVE</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: Z.x }}>Tiefer einsteigen →</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: Z.x, borderRadius: 8, marginBottom: 14, overflow: "hidden" }}>
        <span style={{ padding: "2px 5px", borderRadius: 3, background: Z.rd, color: Z.w, fontSize: 9, fontWeight: 800, flexShrink: 0, animation: "pulse 2s infinite" }}>LIVE</span>
        <span style={{ fontSize: 10, color: Z.g400, fontFamily: "monospace", flexShrink: 0 }}>{tk.t}</span>
        <span style={{ fontSize: 12, color: tk.h ? Z.w : Z.g300, fontWeight: tk.h ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tk.tx}</span>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 4px" }}>Newsroom</h2>
      <p style={{ fontSize: 13, color: Z.g400, margin: "0 0 14px" }}>AI-Intelligence. Kuratiert für dein Level.</p>
      {NEWS.map(a => (
        <div key={a.id} onClick={() => setSel(a.id)} style={{ padding: 16, background: Z.w, borderRadius: 12, border: `1px solid ${Z.g200}`, marginBottom: 6, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = a.c; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = Z.g200; e.currentTarget.style.transform = "none"; }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Pill c={a.c}>{a.cat}</Pill><span style={{ fontSize: 11, color: Z.g400 }}>Vor {a.time}</span></div>
            <span style={{ padding: "1px 5px", borderRadius: 3, fontSize: 9, fontWeight: 700, background: `${a.ic}10`, color: a.ic }}>{a.impact}</span>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 3px", lineHeight: 1.3 }}>{a.title}</h3>
          <p style={{ fontSize: 11, color: Z.g400, margin: "0 0 4px" }}>{a.sum.substring(0, 100)}...</p>
          <div style={{ display: "flex", gap: 6, fontSize: 11 }}>
            <span style={{ color: Z.bl, fontWeight: 600 }}>Lesen</span><span style={{ color: Z.g300 }}>·</span>
            <span style={{ color: Z.g400 }}>{a.res.length} Ressourcen</span><span style={{ color: Z.g300 }}>·</span>
            <span style={{ color: Z.vi, fontWeight: 600 }}>Deep Dive</span>
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

// ═══ PWA: DEEP DIVE ══════════════════════════════════════════

function DeepDive() {
  const [ly, setLy] = useState(0);
  const layers = [
    { d: "Sprint-Level", l: "Oberfläche", c: Z.bl, t: "Im Sprint", desc: "Was du jetzt brauchst.", ex: "So rufst du die Claude API auf und streamst die Antwort." },
    { d: "Deep Dive L1", l: "Vertiefung", c: Z.gn, t: "+15 Min", desc: "Warum funktioniert das?", ex: "Deshalb produziert Temperature 0 deterministische Outputs." },
    { d: "Deep Dive L2", l: "Expertise", c: Z.vi, t: "+30 Min", desc: "Architektur & Trade-offs.", ex: "Prompt Caching + Streaming ist hier die optimale Architektur." },
    { d: "Deep Dive L3", l: "Research", c: Z.pk, t: "+60 Min", desc: "Papers & Cutting Edge.", ex: "Mein Vergleich von 3 Prompting-Strategien auf meinem Datensatz." },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 4px" }}>Deep Dive</h2>
      <p style={{ fontSize: 13, color: Z.g400, margin: "0 0 16px" }}>Im Sprint lernst du was du brauchst. Hier lernst du was du willst.</p>
      <div style={{ background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, overflow: "hidden", marginBottom: 14 }}>
        {layers.map((l, i) => (
          <div key={i} onClick={() => setLy(i)} style={{
            padding: "12px 16px", cursor: "pointer", background: ly === i ? `${l.c}04` : "transparent",
            borderLeft: `3px solid ${ly === i ? l.c : Z.g200}`, borderBottom: i < 3 ? `1px solid ${Z.g100}` : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: l.c }}>{l.l}</span><Pill c={l.c}>{l.d}</Pill>
              </div>
              <span style={{ fontSize: 11, color: Z.g400 }}>{l.t}</span>
            </div>
            {ly === i && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 13, color: Z.g500, margin: "0 0 6px" }}>{l.desc}</p>
                <div style={{ padding: "6px 10px", background: `${l.c}06`, borderRadius: 6, fontSize: 12, color: Z.g700, fontStyle: "italic" }}>→ {l.ex}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[{ i: "💡", t: "Optional", d: "Kein Zwang." }, { i: "🔬", t: "Interaktiv", d: "Sandbox & Try-it." }, { i: "🔗", t: "Projektbezogen", d: "Dein echtes Projekt." }].map((f, i) => (
          <div key={i} style={{ padding: 12, background: Z.w, borderRadius: 10, border: `1px solid ${Z.g200}` }}>
            <span style={{ fontSize: 14 }}>{f.i}</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: Z.x, marginTop: 2 }}>{f.t}</div>
            <div style={{ fontSize: 10, color: Z.g400 }}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ PWA: PROGRESS ═══════════════════════════════════════════

function Progress({ scores }) {
  const avg = scores ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length : 2.5;
  const lvl = avg < 1 ? "A1" : avg < 2 ? "A2" : avg < 3 ? "B1" : avg < 4 ? "B2" : "C1";
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 4px" }}>Dein Fortschritt</h2>
      <p style={{ fontSize: 13, color: Z.g400, margin: "0 0 16px" }}>Organisch über Sprints aufgebaut.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Radar scores={scores || {}} size={180} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ v: "1", l: "Sprint fertig", c: Z.bl }, { v: "2h", l: "Investiert", c: Z.gn }, { v: lvl, l: "Level", c: Z.am }, { v: "1", l: "Tag Streak", c: Z.rd }].map((s, i) => (
            <div key={i} style={{ padding: 12, background: Z.w, borderRadius: 10, border: `1px solid ${Z.g200}`, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 10, color: Z.g400, marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, background: Z.w, borderRadius: 12, border: `1px solid ${Z.g200}` }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: Z.x, margin: "0 0 10px" }}>Sprint-Historie</h3>
        {[
          { n: "Prompt Mastery", d: "Automation HQ", dt: "19. Mär", st: "aktiv" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: Z.x }}>{s.n}</div>
              <div style={{ fontSize: 11, color: Z.g400 }}>{s.d} · {s.dt}</div>
            </div>
            <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: s.st === "aktiv" ? Z.amL : Z.gnL, color: s.st === "aktiv" ? Z.am : Z.gn }}>
              {s.st === "aktiv" ? "AKTIV" : "FERTIG"}
            </span>
          </div>
        ))}
        <p style={{ fontSize: 12, color: Z.g400, margin: "12px 0 0", fontStyle: "italic" }}>Mehr Sprints abschließen → mehr Historie, mehr Skills, höheres Level.</p>
      </div>
    </div>
  );
}

// ═══ MAIN APP ═════════════════════════════════════════════════

export default function ZehnxAcademy() {
  const [screen, setScreen] = useState("home");
  const [section, setSection] = useState("dash");
  const [scores, setScores] = useState(null);
  const [path, setPath] = useState("auto");

  const goSection = (s) => { setScreen("pwa"); setSection(s); };

  return (
    <div style={{ minHeight: "100vh", background: Z.bg, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", color: Z.x }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0}
        button{font-family:'Plus Jakarta Sans',sans-serif}
        button:hover{filter:brightness(0.96)}
        ::selection{background:${Z.blL};color:${Z.x}}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${Z.bg}}
        ::-webkit-scrollbar-thumb{background:${Z.g300};border-radius:3px}
        textarea:focus{border-color:${Z.bl}!important}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>
      {screen !== "pwa" && <Nav screen={screen} setScreen={setScreen} section={section} setSection={setSection} />}
      {screen === "home" && <><Home go={setScreen} /><StudyBot onNavigate={setScreen} /></>}
      {screen === "assess" && <Assessment onDone={(s) => { setScores(s); setScreen("results"); }} />}
      {screen === "results" && <Results scores={scores} onContinue={() => setScreen("goal")} />}
      {screen === "engine" && <div style={{maxWidth:780,margin:"0 auto",padding:"20px 20px 60px"}}><SprintEngine /></div>}
      {screen === "engine" && <div style={{maxWidth:780,margin:"0 auto",padding:"20px 20px 60px"}}><SprintEngine /></div>}
      {screen === "skills" && <SkillProfile user={user} />}
          {screen === "path" && <LearningPath />}
          {screen === "business" && <><BusinessInquiry /><EnterpriseBot /></>}
          {screen === "pricing" && <Pricing onSelect={(plan) => console.log(plan)} />}
      {screen === "legal" && <div style={{maxWidth:720,margin:"0 auto",padding:"20px 20px 60px"}}><Legal /></div>}
      {screen === "newsroom" && <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 20px 60px"}}><NewsroomFull /></div>}
      {screen === "readiness" && <div style={{maxWidth:640,margin:"0 auto",padding:"20px 20px 60px"}}><AIReadiness /></div>}
      {screen === "goal" && <GoalScreen onDone={(p) => { setPath(p); setScreen("pwa"); setSection("dash"); }} />}
      {screen === "pwa" && <ResponsiveShell section={section} setSection={setSection}>
      {section === "dash" && <Dash scores={scores} goSection={goSection} />}
      {section === "sprints" && <SprintCatalog />}
      {section === "news" && <NewsroomPWA />}
      {section === "deep" && <DeepDive />}
      {section === "live" && <div style={{maxWidth:720,margin:"0 auto",padding:"20px 20px 60px"}}><LiveTab /></div>}
      {section === "network" && <div style={{maxWidth:720,margin:"0 auto",padding:"20px 20px 60px"}}><NetworkTab /></div>}
      {section === "progress" && <Progress scores={scores} />}
      </ResponsiveShell>}
    </div>
  );
}
