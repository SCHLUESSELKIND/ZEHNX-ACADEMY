import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX ENTERPRISE — AI Readiness Assessment
// 25 Fragen, 5 Dimensionen, SWOT, Radar, Empfehlungen
// Dark Premium Design (matches Enterprise.jsx)
// ═══════════════════════════════════════════════════════════════

const D = {
  bg: "#09090B", bgSub: "#111114", surf: "#18181B", raised: "#1E1E22",
  text: "#FAFAFA", sec: "#A1A1AA", muted: "#71717A", dim: "#52525B",
  border: "#27272A", borderAcc: "rgba(79,70,229,0.3)",
  indigo: "#4F46E5", violet: "#7C3AED", pink: "#EC4899",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444", cyan: "#06B6D4",
  grad: "linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)",
};

const DIMS = [
  { id: "strategy", label: "AI-Strategie", icon: "🎯", color: D.indigo, desc: "Wie strategisch wird AI in Ihrem Unternehmen gedacht?" },
  { id: "skills", label: "Team-Kompetenz", icon: "🧠", color: D.violet, desc: "Wie AI-fit sind Ihre Mitarbeiter?" },
  { id: "data", label: "Daten & Infrastruktur", icon: "📊", color: D.cyan, desc: "Sind Ihre Daten AI-ready?" },
  { id: "culture", label: "Kultur & Change", icon: "💡", color: D.amber, desc: "Wie offen ist Ihr Unternehmen fuer AI?" },
  { id: "compliance", label: "Governance & Compliance", icon: "🛡️", color: D.green, desc: "EU AI Act, DSGVO, interne Richtlinien" },
];

const QUESTIONS = [
  // STRATEGY (5)
  { dim: "strategy", q: "Gibt es eine dokumentierte AI-Strategie in Ihrem Unternehmen?", opts: ["Nein, kein Thema", "Wird diskutiert", "Erste Pilotprojekte", "Klare Strategie vorhanden", "AI ist Kernstrategie"] },
  { dim: "strategy", q: "Wer ist fuer AI-Initiativen verantwortlich?", opts: ["Niemand definiert", "IT-Abteilung nebenbei", "Dedizierter Projektleiter", "C-Level Sponsor", "Chief AI Officer / CDO"] },
  { dim: "strategy", q: "Wie ist AI im Budget verankert?", opts: ["Kein Budget", "Einzelne Posten ad-hoc", "Jaehrliches Innovationsbudget", "Dediziertes AI-Budget", "Signifikanter Anteil am Gesamtbudget"] },
  { dim: "strategy", q: "Wie viele AI-Projekte laufen aktuell?", opts: ["Keine", "1 Pilotprojekt", "2-3 Projekte", "4-10 Projekte", "10+ in Produktion"] },
  { dim: "strategy", q: "Wie messen Sie den ROI von AI-Initiativen?", opts: ["Gar nicht", "Qualitative Einschaetzung", "Einfache KPIs", "Strukturiertes ROI-Framework", "Continuous Measurement Dashboard"] },

  // SKILLS (5)
  { dim: "skills", q: "Wie viele Mitarbeiter nutzen AI-Tools regelmaessig?", opts: ["Unter 5%", "5-15%", "15-35%", "35-60%", "Ueber 60%"] },
  { dim: "skills", q: "Gibt es ein internes AI-Schulungsprogramm?", opts: ["Nein", "Einzelne Workshops", "Online-Kurse verfuegbar", "Strukturiertes Programm", "Continuous Learning mit Zertifizierung"] },
  { dim: "skills", q: "Wie wuerden Sie das AI-Wissen der Fuehrungsebene bewerten?", opts: ["Kein Verstaendnis", "Grundverstaendnis", "Kann Use Cases bewerten", "Treibt AI aktiv voran", "Deep Technical + Strategic Understanding"] },
  { dim: "skills", q: "Haben Sie AI-Spezialisten im Team?", opts: ["Keine", "1-2 Enthusiasten", "Kleine AI-Unit (3-5)", "Dediziertes AI-Team (5+)", "AI Center of Excellence"] },
  { dim: "skills", q: "Wie gut koennen Fachabteilungen AI-Anforderungen formulieren?", opts: ["Gar nicht", "Vage Ideen", "Konkrete Use Cases", "Strukturierte Anforderungen", "Eigenstaendige Prototypen"] },

  // DATA (5)
  { dim: "data", q: "Wie wuerden Sie Ihre Datenqualitaet bewerten?", opts: ["Chaotisch / Silos", "Teilweise strukturiert", "Gute Grundlage", "Hohe Qualitaet, dokumentiert", "Data Governance Framework"] },
  { dim: "data", q: "Wo liegen Ihre Daten?", opts: ["Ueberall verteilt (Excel, E-Mail)", "Zentrale Datenbank, aber veraltet", "Data Warehouse vorhanden", "Cloud Data Platform", "Modern Data Stack (Lake + Warehouse + Pipelines)"] },
  { dim: "data", q: "Wie zugaenglich sind Daten fuer Analysen?", opts: ["Kaum zugaenglich", "Nur ueber IT anfragbar", "Self-Service BI vorhanden", "APIs und Dashboards verfuegbar", "Echtzeit-Datenzugriff fuer alle"] },
  { dim: "data", q: "Nutzen Sie Cloud-Services?", opts: ["Nein, alles On-Premise", "Erste Cloud-Migration", "Hybrid (Cloud + On-Prem)", "Cloud-First Strategie", "Full Cloud Native"] },
  { dim: "data", q: "Wie ist Ihre IT-Infrastruktur fuer AI geruestet?", opts: ["Nicht vorbereitet", "Standard-Server", "GPU-Zugang moeglich", "ML Ops Pipeline vorhanden", "Vollstaendige AI-Infrastruktur"] },

  // CULTURE (5)
  { dim: "culture", q: "Wie steht die Geschaeftsfuehrung zu AI?", opts: ["Skeptisch / Ablehnend", "Neutral, abwartend", "Interesse, aber vorsichtig", "Aktiv unterstuetzend", "Visionaer, treibt AI voran"] },
  { dim: "culture", q: "Wie reagieren Mitarbeiter auf AI-Initiativen?", opts: ["Angst vor Jobverlust", "Skepsis ueberwiegt", "Gemischt", "Ueberwiegend positiv", "Begeisterung, eigene Ideen"] },
  { dim: "culture", q: "Gibt es eine Experimentier-Kultur?", opts: ["Fehler werden bestraft", "Risiko wird vermieden", "Kontrolliertes Experimentieren", "Fail-Fast Mentalitaet", "Innovation Labs / Hackathons"] },
  { dim: "culture", q: "Wie werden AI-Erfolge kommuniziert?", opts: ["Gar nicht", "Intern im Team", "Unternehmensweit", "Extern (Blog, Events)", "Systematisches Storytelling"] },
  { dim: "culture", q: "Gibt es AI Champions in den Fachabteilungen?", opts: ["Nein", "Einzelne Enthusiasten", "In manchen Abteilungen", "In den meisten Abteilungen", "Strukturiertes Champions-Programm"] },

  // COMPLIANCE (5)
  { dim: "compliance", q: "Kennen Sie die Anforderungen des EU AI Act?", opts: ["Nie gehoert", "Grob bekannt", "Grundverstaendnis", "Detailliert bekannt", "Compliance-Programm laeuft"] },
  { dim: "compliance", q: "Gibt es interne AI-Richtlinien?", opts: ["Nein", "Informelle Regeln", "Erste Policy entworfen", "Dokumentierte AI Policy", "Umfassendes AI Governance Framework"] },
  { dim: "compliance", q: "Wie wird DSGVO bei AI-Projekten beruecksichtigt?", opts: ["Gar nicht", "Nachtraeglich geprueft", "Von Anfang an einbezogen", "Privacy by Design Standard", "DPO + AI-spezifische Prozesse"] },
  { dim: "compliance", q: "Werden AI-Entscheidungen dokumentiert und erklaerbar?", opts: ["Nein", "Teilweise", "Bei kritischen Systemen", "Standardmaessig", "Explainable AI als Prinzip"] },
  { dim: "compliance", q: "Gibt es ein AI-Risikomanagement?", opts: ["Nein", "Ad-hoc Bewertungen", "Einfache Risiko-Checkliste", "Strukturiertes Framework", "Continuous Risk Monitoring"] },
];

const LEVELS = [
  { min: 0, max: 20, name: "Einstieg", color: D.red, desc: "AI ist noch kein Thema. Grosse Chance, frueh die richtigen Weichen zu stellen." },
  { min: 21, max: 40, name: "Bewusst", color: D.amber, desc: "Erste Schritte sind gemacht. Jetzt braucht es Struktur und Kompetenz." },
  { min: 41, max: 60, name: "Aktiv", color: D.cyan, desc: "AI-Projekte laufen. Der naechste Schritt: Skalierung und Governance." },
  { min: 61, max: 80, name: "Fortgeschritten", color: D.violet, desc: "Starke AI-Basis. Fokus auf Optimierung, Compliance und ROI-Maximierung." },
  { min: 81, max: 100, name: "AI-Leader", color: D.green, desc: "Exzellente AI-Reife. Fokus auf Innovation und Wettbewerbsvorsprung." },
];

function getLevel(score) { return LEVELS.find(l => score >= l.min && score <= l.max) || LEVELS[0]; }

function generateSWOT(dimScores) {
  const strengths = [], weaknesses = [], opportunities = [], threats = [];
  const ds = Object.entries(dimScores);

  ds.forEach(([id, score]) => {
    const dim = DIMS.find(d => d.id === id);
    if (score >= 60) strengths.push(`${dim.icon} ${dim.label}: ${score}% — solide Basis`);
    if (score < 40) weaknesses.push(`${dim.icon} ${dim.label}: ${score}% — dringender Handlungsbedarf`);
  });

  // Opportunities based on gaps
  if (dimScores.strategy < 50) opportunities.push("Fruehe AI-Strategie schafft Wettbewerbsvorsprung im Mittelstand");
  if (dimScores.skills < 50) opportunities.push("EUR 5 Mrd. Bundesfoerderung fuer AI-Weiterbildung nutzbar");
  if (dimScores.compliance < 50) opportunities.push("EU AI Act Compliance als Vertrauenssignal gegenueber Kunden");
  if (dimScores.data < 50) opportunities.push("Strukturierte Daten ermoeglichen schnelle AI-Skalierung");
  if (dimScores.culture < 50) opportunities.push("AI Champions Programm kann Kultur in 3-6 Monaten wandeln");
  opportunities.push("40,9% der deutschen Unternehmen nutzen AI — Nachzuegler verlieren Marktanteile");

  // Threats
  if (dimScores.compliance < 40) threats.push("EU AI Act: Bussgelder bis zu 7% des Jahresumsatzes ab 2026");
  if (dimScores.skills < 40) threats.push("72% der Unternehmen nennen Skills-Mangel als groessten AI-Blocker");
  if (dimScores.strategy < 30) threats.push("Ohne AI-Strategie: Gefahr von Ad-hoc-Projekten ohne ROI");
  threats.push("Wettbewerber investieren: 82% der Unternehmen erhoehen AI-Budgets");

  return { strengths, weaknesses, opportunities, threats };
}

function generateRecommendations(dimScores, totalScore) {
  const recs = [];
  const sorted = Object.entries(dimScores).sort((a, b) => a[1] - b[1]);

  // Always recommend assessment first
  if (totalScore < 40) {
    recs.push({ priority: "Sofort", title: "AI Readiness Workshop", desc: "2-Tages-Workshop mit Ihrem Fuehrungsteam: Use Case Identification, Quick Wins definieren, 90-Tage-Plan erstellen.", service: "Enterprise", icon: "🎯" });
  }

  // Skills gap
  if (dimScores.skills < 50) {
    recs.push({ priority: "Hoch", title: "Team AI-Training (Sprint Cohorts)", desc: "324 Sprints, A1-C2 Level. Teams lernen gemeinsam in Cohorts. 67% hoeheres Engagement als Selbststudium.", service: "Academy", icon: "🧠" });
  }

  // Compliance
  if (dimScores.compliance < 50) {
    recs.push({ priority: "Dringend", title: "EU AI Act Compliance Check", desc: "Art. 4 Schulungspflicht seit Feb 2025. Wir pruefen Ihren Status, identifizieren Risiken, erstellen Compliance-Roadmap.", service: "Enterprise", icon: "🛡️" });
  }

  // Strategy
  if (dimScores.strategy < 50) {
    recs.push({ priority: "Hoch", title: "AI-Strategie & Roadmap", desc: "Von Use Case Discovery bis ROI-Framework. In 2-4 Wochen zu einer klaren AI-Strategie fuer Ihr Unternehmen.", service: "Agentur", icon: "📋" });
  }

  // Data
  if (dimScores.data < 50) {
    recs.push({ priority: "Mittel", title: "Data Readiness Assessment", desc: "Analyse Ihrer Datenlandschaft, Qualitaetsbewertung, Architekturempfehlung fuer AI-Workloads.", service: "Agentur", icon: "📊" });
  }

  // Culture
  if (dimScores.culture < 50) {
    recs.push({ priority: "Mittel", title: "AI Champions Programm", desc: "Identifizieren und schulen Sie 5-10 AI-Champions in Fachabteilungen. Multiplikatoren-Effekt in 3-6 Monaten.", service: "Enterprise", icon: "💡" });
  }

  // High performers
  if (totalScore > 60) {
    recs.push({ priority: "Growth", title: "Custom AI-Entwicklung", desc: "Ihre Basis ist stark. Naechster Schritt: massgeschneiderte AI-Loesungen fuer Ihre spezifischen Use Cases.", service: "Agentur", icon: "⚡" });
  }

  return recs;
}

// ─── RADAR CHART (SVG) ───────────────────────────────────

function RadarChart({ scores, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = DIMS.length;
  const angleStep = (Math.PI * 2) / n;

  const getPoint = (i, val) => {
    const a = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      {/* Grid */}
      {gridLevels.map(level => {
        const pts = DIMS.map((_, i) => getPoint(i, level));
        return <polygon key={level} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={D.border} strokeWidth={0.5} />;
      })}
      {/* Axes */}
      {DIMS.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={D.border} strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      {scores && (() => {
        const pts = DIMS.map((d, i) => getPoint(i, scores[d.id] || 0));
        const path = pts.map(p => `${p.x},${p.y}`).join(" ");
        return <>
          <polygon points={path} fill="url(#radarGrad)" fillOpacity={0.25} stroke={D.indigo} strokeWidth={2} />
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={DIMS[i].color} />)}
        </>;
      })()}
      {/* Labels */}
      {DIMS.map((d, i) => {
        const p = getPoint(i, 120);
        return <text key={d.id} x={p.x} y={p.y} fill={D.sec} fontSize={10} fontFamily="'Space Grotesk', sans-serif" textAnchor="middle" dominantBaseline="middle">{d.label}</text>;
      })}
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={D.indigo} />
          <stop offset="100%" stopColor={D.violet} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────

export default function EnterpriseAssessment({ onBack, onContact }) {
  const [step, setStep] = useState("intro"); // intro | questions | results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState({ name: "", size: "", industry: "" });
  const resultsRef = useRef(null);

  const totalQuestions = QUESTIONS.length;
  const progress = (currentQ / totalQuestions) * 100;

  function answer(qi, value) {
    setAnswers(prev => ({ ...prev, [qi]: value }));
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("results");
    }
  }

  function calcScores() {
    const dimScores = {};
    DIMS.forEach(d => {
      const qs = QUESTIONS.map((q, i) => ({ q, i })).filter(x => x.q.dim === d.id);
      const total = qs.reduce((sum, x) => sum + (answers[x.i] || 0), 0);
      const max = qs.length * 4;
      dimScores[d.id] = Math.round((total / max) * 100);
    });
    const totalScore = Math.round(Object.values(dimScores).reduce((a, b) => a + b, 0) / DIMS.length);
    return { dimScores, totalScore };
  }

  // ─── INTRO ─────────────────────────────

  if (step === "intro") {
    return (
      <div style={{ background: D.bg, color: D.text, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 3, color: D.indigo, marginBottom: 24 }}>AI READINESS ASSESSMENT</div>
            <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
              Wie <span style={{ background: D.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-ready</span> ist Ihr Unternehmen?
            </h1>
            <p style={{ fontSize: 16, color: D.sec, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px" }}>
              25 Fragen, 5 Dimensionen, 10 Minuten. Sie erhalten: SWOT-Analyse, Radar-Chart, Maturity Level, personalisierte Empfehlungen und EU AI Act Compliance-Check.
            </p>
          </div>

          {/* Company Info */}
          <div style={{ background: D.surf, border: `1px solid ${D.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: D.sec, marginBottom: 16 }}>Ueber Ihr Unternehmen (optional)</div>
            {[
              { key: "name", label: "Unternehmen", placeholder: "GmbH / AG" },
              { key: "size", label: "Mitarbeiter", placeholder: "z.B. 150" },
              { key: "industry", label: "Branche", placeholder: "z.B. Manufacturing, Finance" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: D.dim, marginBottom: 4, fontFamily: "'JetBrains Mono'" }}>{f.label}</div>
                <input
                  value={company[f.key]}
                  onChange={e => setCompany(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: D.bgSub, border: `1px solid ${D.border}`,
                    color: D.text, fontSize: 14, fontFamily: "inherit",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dimensions preview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 32 }}>
            {DIMS.map(d => (
              <div key={d.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: D.surf, border: `1px solid ${D.border}`, borderRadius: 12 }}>
                <span style={{ fontSize: 20 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: D.text }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: D.dim }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setStep("questions")} style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none",
            background: D.indigo, color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Space Grotesk'",
            boxShadow: "0 4px 20px rgba(79,70,229,0.3)",
          }}>Assessment starten →</button>

          <div style={{ textAlign: "center", fontSize: 12, color: D.dim, marginTop: 16 }}>
            Kostenlos · Keine Registrierung · Ergebnis sofort
          </div>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ─────────────────────────

  if (step === "questions") {
    const q = QUESTIONS[currentQ];
    const dim = DIMS.find(d => d.id === q.dim);

    return (
      <div style={{ background: D.bg, color: D.text, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>

          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: D.dim, fontFamily: "'JetBrains Mono'" }}>{dim.icon} {dim.label}</span>
              <span style={{ fontSize: 11, color: D.dim, fontFamily: "'JetBrains Mono'" }}>{currentQ + 1} / {totalQuestions}</span>
            </div>
            <div style={{ height: 3, background: D.surf, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: D.grad, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Question */}
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1.3 }}>{q.q}</h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => answer(currentQ, i)} style={{
                padding: "16px 18px", borderRadius: 14, textAlign: "left",
                background: answers[currentQ] === i ? D.raised : D.surf,
                border: `1px solid ${answers[currentQ] === i ? D.indigo : D.border}`,
                color: D.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: answers[currentQ] === i ? D.indigo : D.bgSub,
                  border: `1px solid ${answers[currentQ] === i ? D.indigo : D.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: answers[currentQ] === i ? "#fff" : D.dim,
                  fontFamily: "'JetBrains Mono'",
                }}>{i + 1}</div>
                <span style={{ lineHeight: 1.4 }}>{opt}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(currentQ - 1)} style={{
              marginTop: 20, padding: "10px 20px", borderRadius: 10,
              background: "transparent", border: `1px solid ${D.border}`,
              color: D.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>← Zurueck</button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ───────────────────────────

  const { dimScores, totalScore } = calcScores();
  const level = getLevel(totalScore);
  const swot = generateSWOT(dimScores);
  const recs = generateRecommendations(dimScores, totalScore);

  return (
    <div ref={resultsRef} style={{ background: D.bg, color: D.text, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 3, color: D.indigo, marginBottom: 12 }}>AI READINESS REPORT{company.name ? ` — ${company.name.toUpperCase()}` : ""}</div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
            <span style={{ background: D.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{totalScore}%</span> AI-Readiness
          </h1>
          <div style={{ display: "inline-flex", padding: "6px 16px", borderRadius: 100, background: `${level.color}15`, border: `1px solid ${level.color}30`, fontSize: 14, fontWeight: 600, color: level.color }}>
            Level: {level.name}
          </div>
          <p style={{ fontSize: 15, color: D.sec, marginTop: 16, maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7 }}>{level.desc}</p>
        </div>

        {/* RADAR + DIMENSIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
          <div style={{ background: D.surf, border: `1px solid ${D.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: D.indigo, marginBottom: 16 }}>RADAR</div>
            <RadarChart scores={dimScores} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: D.indigo, marginBottom: 4 }}>DIMENSIONEN</div>
            {DIMS.map(d => (
              <div key={d.id} style={{ background: D.surf, border: `1px solid ${D.border}`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.icon} {d.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{dimScores[d.id]}%</span>
                </div>
                <div style={{ height: 4, background: D.bgSub, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: d.color, width: `${dimScores[d.id]}%`, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: D.indigo, marginBottom: 12 }}>SWOT-ANALYSE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { title: "Staerken", items: swot.strengths, color: D.green, bg: "rgba(16,185,129,0.05)" },
              { title: "Schwaechen", items: swot.weaknesses, color: D.red, bg: "rgba(239,68,68,0.05)" },
              { title: "Chancen", items: swot.opportunities, color: D.cyan, bg: "rgba(6,182,212,0.05)" },
              { title: "Risiken", items: swot.threats, color: D.amber, bg: "rgba(245,158,11,0.05)" },
            ].map(s => (
              <div key={s.title} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 14, padding: "18px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 10, fontFamily: "'Space Grotesk'" }}>{s.title}</div>
                {s.items.length === 0 ? (
                  <div style={{ fontSize: 12, color: D.dim, fontStyle: "italic" }}>Keine identifiziert</div>
                ) : (
                  s.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: D.sec, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${s.color}30` }}>{item}</div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: D.indigo, marginBottom: 12 }}>EMPFEHLUNGEN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recs.map((r, i) => (
              <div key={i} style={{
                background: D.surf, border: `1px solid ${D.border}`, borderRadius: 14,
                padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{r.title}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: r.priority === "Dringend" || r.priority === "Sofort" ? `${D.red}20` : `${D.indigo}15`, color: r.priority === "Dringend" || r.priority === "Sofort" ? D.red : D.indigo, fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>{r.priority}</span>
                  </div>
                  <div style={{ fontSize: 13, color: D.sec, lineHeight: 1.6 }}>{r.desc}</div>
                  <div style={{ fontSize: 11, color: D.dim, marginTop: 6, fontFamily: "'JetBrains Mono'" }}>zehnx {r.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EU AI ACT */}
        <div style={{
          background: dimScores.compliance < 40 ? `${D.red}08` : D.surf,
          border: `1px solid ${dimScores.compliance < 40 ? `${D.red}30` : D.border}`,
          borderRadius: 16, padding: "24px 20px", marginBottom: 40,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: dimScores.compliance < 40 ? D.red : D.green, marginBottom: 12 }}>EU AI ACT COMPLIANCE</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk'", marginBottom: 8 }}>
            {dimScores.compliance < 30 ? "⚠️ Kritischer Handlungsbedarf" : dimScores.compliance < 50 ? "⚡ Handlungsbedarf erkannt" : dimScores.compliance < 70 ? "✓ Grundlagen vorhanden" : "✅ Gute Compliance-Basis"}
          </div>
          <div style={{ fontSize: 13, color: D.sec, lineHeight: 1.7 }}>
            {dimScores.compliance < 50
              ? "Seit Februar 2025 gilt Art. 4 EU AI Act: AI-Kompetenzpflicht fuer alle Mitarbeiter, die mit AI-Systemen arbeiten. Bussgelder bis zu 7% des Jahresumsatzes. Wir empfehlen einen sofortigen Compliance-Check und strukturiertes Training."
              : "Ihr Compliance-Status ist solide. Empfehlung: regelmaessige Audits, Dokumentation der AI-Systeme, und kontinuierliche Schulung bei neuen Regelungen. Wir unterstuetzen Sie mit laufenden Updates und Compliance-Reports."}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          <button onClick={() => onContact?.("enterprise")} style={{
            padding: "18px", borderRadius: 14, border: "none",
            background: D.indigo, color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Space Grotesk'",
            boxShadow: "0 4px 20px rgba(79,70,229,0.3)",
          }}>Ergebnisse besprechen →</button>
          <button onClick={() => { setStep("intro"); setCurrentQ(0); setAnswers({}); }} style={{
            padding: "18px", borderRadius: 14,
            border: `1px solid ${D.border}`, background: D.surf,
            color: D.text, fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Space Grotesk'",
          }}>Neues Assessment</button>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: D.dim, fontFamily: "'JetBrains Mono'", lineHeight: 1.6 }}>
          ZEHNX Academy · Enterprise Assessment · {new Date().toLocaleDateString("de-DE")}<br/>
          Basierend auf Marktdaten von Josh Bersin, Forrester, McKinsey 2025/2026
        </div>
      </div>
    </div>
  );
}
