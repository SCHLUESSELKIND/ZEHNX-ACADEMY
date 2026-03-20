import { useState } from "react";

const C = {
  bg: "#F5F5F7", w: "#FFFFFF", x: "#18181B",
  g50: "#FAFAF9", g100: "#F4F4F5", g200: "#E4E4E7", g300: "#D4D4D8",
  g400: "#A1A1AA", g500: "#71717A", g600: "#52525B", g700: "#3F3F46",
  bl: "#2563EB", blL: "#DBEAFE", blXL: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5", gnD: "#047857",
  am: "#D97706", amL: "#FFFBEB",
  rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED",
};

const DIMS = [
  { id:"routine", name:"Routine vs. Kreativität", icon:"◆", sciNote:"Frey & Osborne (2017): Routine-kognitive Aufgaben haben das höchste Automatisierungsrisiko." },
  { id:"knowledge", name:"Wissenstyp", icon:"◇", sciNote:"Dallas Fed (2026): AI substituiert kodifizierbares Wissen, ergänzt aber Erfahrungswissen." },
  { id:"social", name:"Menschliche Verbindung", icon:"⬡", sciNote:"WEF 2025: Empathie, Führung und Kollaboration unter Top-Skills bis 2030." },
  { id:"judgment", name:"Entscheidungskomplexität", icon:"◈", sciNote:"Anthropic Index: Management hat 91% theoretische AI-Abdeckung, aber nur ~25% beobachtete Nutzung." },
  { id:"physical", name:"Physische Präsenz", icon:"◉", sciNote:"McKinsey: Rein digitale Büroarbeiten sind am stärksten exponiert." },
  { id:"adapt", name:"AI-Adaptionsfähigkeit", icon:"◎", sciNote:"PwC: Mitarbeiter mit AI-Skills verdienen 25% mehr." },
  { id:"stakes", name:"Haftung & Verantwortung", icon:"⊕", sciNote:"EU AI Act Art. 6: Hochrisiko-AI in Medizin, Justiz, Personal erfordert menschliche Aufsicht." },
  { id:"market", name:"Marktdynamik", icon:"⬢", sciNote:"Anthropic (2026): IT 35.8%, Admin 34.3%, Finance 28.4% beobachtete AI-Exposure." },
];

const QS = {
  routine: [
    { q:"Wie viel deiner täglichen Arbeit folgt einem vorhersehbaren Ablauf?", opts:[{l:"< 20% — Jeder Tag ist anders",v:1},{l:"20-40% — Einige Muster",v:2},{l:"40-60% — Mix",v:3},{l:"60-80% — Überwiegend standardisiert",v:4},{l:"> 80% — Fast vollständig vorhersehbar",v:5}]},
    { q:"Könntest du deinen Arbeitstag in einer Schritt-für-Schritt-Anleitung beschreiben?", opts:[{l:"Unmöglich — zu situationsabhängig",v:1},{l:"Teilweise — Grundstruktur ja",v:3},{l:"Ja, ziemlich gut",v:5}]},
    { q:"Wie schnell könnte jemand deine Kernaufgaben nach 1 Woche Beobachtung nachahmen?", opts:[{l:"Gar nicht — Jahre Erfahrung nötig",v:1},{l:"Teilweise — Basics ja",v:3},{l:"Relativ schnell",v:5}]},
  ],
  knowledge: [
    { q:"Was macht dich in deinem Job besonders gut?", opts:[{l:"Intuition und Erfahrung die man nicht googeln kann",v:1},{l:"Tiefes Fachwissen + Erfahrung",v:2},{l:"Breites aktuelles Tool-Wissen",v:3},{l:"Schnelles Anwenden bekannter Verfahren",v:5}]},
    { q:"Wie viel deines Wissens steht in Dokumentationen?", opts:[{l:"Wenig — das meiste ist implizit",v:1},{l:"Einiges — aber der entscheidende Teil nicht",v:2.5},{l:"Das meiste",v:4},{l:"Fast alles — klare Regeln und Prozesse",v:5}]},
    { q:"Wie wichtig sind persönliche Kontakte für deinen Erfolg?", opts:[{l:"Extrem — mein Netzwerk ist mein Kapital",v:1},{l:"Wichtig — öffnen Türen",v:2.5},{l:"Weniger wichtig",v:4},{l:"Kaum relevant",v:5}]},
  ],
  social: [
    { q:"Wie viel Arbeitszeit verbringst du in direktem Menschenkontakt?", opts:[{l:"> 70% — mein Job IST Menschenkontakt",v:1},{l:"40-70%",v:2},{l:"20-40%",v:3.5},{l:"< 20% — überwiegend digital",v:5}]},
    { q:"Müssen Menschen dir vertrauen, damit du deinen Job gut machen kannst?", opts:[{l:"Absolut — Grundvoraussetzung",v:1},{l:"Ja — Beziehungsqualität beeinflusst Ergebnisse",v:2},{l:"Teilweise",v:3.5},{l:"Nein — Ergebnis spricht für sich",v:5}]},
    { q:"Wie oft navigierst du emotionale Situationen?", opts:[{l:"Täglich — zentral",v:1},{l:"Regelmäßig",v:2},{l:"Gelegentlich",v:3.5},{l:"Selten bis nie",v:5}]},
  ],
  judgment: [
    { q:"Wie oft triffst du Entscheidungen ohne klare Datenlage?", opts:[{l:"Täglich — Unsicherheit ist Normalzustand",v:1},{l:"Oft",v:2},{l:"Manchmal",v:3.5},{l:"Selten — klare Vorgaben",v:5}]},
    { q:"Wie viele Stakeholder musst du bei Entscheidungen berücksichtigen?", opts:[{l:"5+ — komplexes Geflecht",v:1},{l:"3-4",v:2.5},{l:"1-2",v:4},{l:"Keine — setze Vorgaben um",v:5}]},
    { q:"Wie oft wägst du zwischen widersprüchlichen Zielen ab?", opts:[{l:"Ständig — Kern meiner Arbeit",v:1},{l:"Regelmäßig",v:2.5},{l:"Gelegentlich",v:4},{l:"Selten",v:5}]},
  ],
  physical: [
    { q:"Erfordert dein Job physische Anwesenheit?", opts:[{l:"Immer — Handwerk, Pflege, Labor",v:1},{l:"Meistens",v:2},{l:"Hybrid",v:3.5},{l:"Komplett digital",v:5}]},
    { q:"Nutzt du Hände, Körper oder spezifische Motorik?", opts:[{l:"Ja, zentral",v:1},{l:"Teilweise",v:2},{l:"Minimal — Tastatur",v:4},{l:"Nein — rein kognitiv",v:5}]},
    { q:"Musst du auf unvorhersehbare Umgebungen reagieren?", opts:[{l:"Ja, ständig",v:1},{l:"Gelegentlich",v:3},{l:"Selten — kontrollierte Umgebung",v:5}]},
  ],
  adapt: [
    { q:"Wie oft nutzt du AI-Tools?", opts:[{l:"Täglich — integraler Teil",v:1},{l:"Mehrmals pro Woche",v:2},{l:"Gelegentlich",v:3.5},{l:"Selten oder nie",v:5}]},
    { q:"Wie wohl fühlst du dich beim Erlernen neuer Tools?", opts:[{l:"Sehr wohl — lerne schnell",v:1},{l:"Gut — brauche etwas Zeit",v:2},{l:"Mittel",v:3.5},{l:"Unwohl",v:5}]},
    { q:"Hast du Zugang zu AI-Weiterbildung?", opts:[{l:"Ja, aktiv genutzt",v:1},{l:"Ja, aber kaum genutzt",v:2.5},{l:"Nicht wirklich",v:4},{l:"Nein",v:5}]},
  ],
  stakes: [
    { q:"Was passiert bei einem Fehler in deiner Arbeit?", opts:[{l:"Lebensgefahr oder schwere rechtliche Folgen",v:1},{l:"Erhebliche finanzielle/gesundheitliche Folgen",v:2},{l:"Unzufriedene Kunden",v:3.5},{l:"Korrigierbar, niedrige Konsequenzen",v:5}]},
    { q:"Trägst du persönliche Haftung?", opts:[{l:"Ja — berufshaftpflichtrelevant",v:1},{l:"Ja — Führungs-/Budgetverantwortung",v:2},{l:"Teilweise",v:3.5},{l:"Wenig",v:5}]},
    { q:"Würden Kunden einem AI-System genauso vertrauen wie dir?", opts:[{l:"Niemals",v:1},{l:"In manchen Bereichen",v:2.5},{l:"Für Standard vielleicht",v:4},{l:"Wahrscheinlich",v:5}]},
  ],
  market: [
    { q:"Wie stark investiert deine Branche in AI?", opts:[{l:"Massiv — wird gerade umgebaut",v:5},{l:"Deutlich — viele Pilotprojekte",v:4},{l:"Moderat",v:3},{l:"Kaum",v:1.5}]},
    { q:"Gibt es AI-Tools die Teile deiner Arbeit übernehmen könnten?", opts:[{l:"Ja, mehrere spezialisierte",v:5},{l:"Ja, aber Qualität reicht nicht",v:3.5},{l:"Teilweise — Randaufgaben",v:2},{l:"Nein",v:1}]},
    { q:"Schützt Regulierung menschliche Rollen in deiner Branche?", opts:[{l:"Ja — gesetzlich vorgeschrieben",v:1},{l:"Teilweise",v:2.5},{l:"Wenig",v:4},{l:"Nein",v:5}]},
  ],
};

function getProfile(scores) {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const humanEdge = Object.entries(scores).filter(([, v]) => v < 2.5).map(([k]) => k);
  const aiEdge = Object.entries(scores).filter(([, v]) => v > 3.5).map(([k]) => k);
  let profile, advice, emoji;
  if (avg <= 2) { profile = "AI-Resilient Pro"; emoji = "🛡️"; advice = "Dein Profil hat starke menschliche Schutzfaktoren. AI wird dich unterstützen, nicht bedrohen. Nutze AI-Tools um deine Stärken zu multiplizieren."; }
  else if (avg <= 3) { profile = "Hybrid-Potenzial"; emoji = "⚡"; advice = "Du arbeitest im produktivsten Bereich: Mensch + AI zusammen. Wer jetzt AI-Skills aufbaut, wird zum Multiplikator im Team."; }
  else if (avg <= 3.8) { profile = "Transformation Ahead"; emoji = "🔄"; advice = "Teile deiner Arbeit verändern sich in 2-5 Jahren. Die gleiche Analyse zeigt dir, welche Fähigkeiten WERTVOLLER werden und wo du mit AI-Kompetenz unersetzbar wirst."; }
  else { profile = "Aktiver Wandel"; emoji = "🚀"; advice = "Dein Feld erlebt starke AI-Durchdringung. Wer sich jetzt positioniert, profitiert am meisten. Historisch entstehen mehr Jobs als verloren gehen."; }
  return { avg, profile, advice, emoji, humanEdge, aiEdge };
}

function DimBar({ score, label }) {
  const pct = (score / 5) * 100;
  const clr = pct < 40 ? C.gn : pct > 60 ? C.am : C.bl;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: C.x, marginBottom: 3 }}>
        <span>{label}</span><span style={{ color: clr, fontSize: 11 }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ height: 7, background: C.g100, borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: C.g300 }} />
        <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: clr, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

export default function AIReadiness() {
  const [phase, setPhase] = useState("intro"); // intro, questions, result
  const [dimIdx, setDimIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});

  const dimIds = DIMS.map(d => d.id);
  const totalQ = dimIds.reduce((a, id) => a + QS[id].length, 0);
  const currentQ = dimIds.slice(0, dimIdx).reduce((a, id) => a + QS[id].length, 0) + qIdx + 1;

  const handleAnswer = (v) => {
    const dimId = dimIds[dimIdx];
    const key = `${dimId}_${qIdx}`;
    const na = { ...answers, [key]: v };
    setAnswers(na);
    if (qIdx < QS[dimId].length - 1) { setQIdx(qIdx + 1); }
    else {
      const vals = Array.from({ length: QS[dimId].length }, (_, i) => na[`${dimId}_${i}`] || 2.5);
      const ns = { ...scores, [dimId]: vals.reduce((a, b) => a + b, 0) / vals.length };
      setScores(ns);
      if (dimIdx < dimIds.length - 1) { setDimIdx(dimIdx + 1); setQIdx(0); }
      else { setScores(ns); setPhase("result"); }
    }
  };

  const restart = () => { setPhase("intro"); setDimIdx(0); setQIdx(0); setAnswers({}); setScores({}); };

  // ─── INTRO ─────────────────────────────────────
  if (phase === "intro") return (
    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>🧠</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: "0 0 6px" }}>X-SCORE</h2>
      <p style={{ fontSize: 14, color: C.g600, lineHeight: 1.6, margin: "0 0 16px" }}>
        Finde heraus, wo KI dich unterstützen kann — und wo deine menschlichen Stärken unersetzbar sind. Keine Angstmache, sondern fundierte Analyse.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
        {[{t:"Anthropic Economic Index",d:"800+ Berufe"},{t:"Brookings Adaptive Capacity",d:"Skills & Resilienz"},{t:"Dallas Fed 2026",d:"Kodifizierbar vs. Tacit"},{t:"O*NET Task-Based",d:"Task-Level Analyse"},{t:"EU AI Act",d:"Regulatorischer Schutz"},{t:"PwC AI Barometer",d:"+25% Gehalt mit AI-Skills"}].map((s,i) => (
          <div key={i} style={{ padding: "6px 8px", background: C.g50, borderRadius: 8, border: `1px solid ${C.g100}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.x }}>{s.t}</div>
            <div style={{ fontSize: 9, color: C.g500 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 12, background: C.gnL, borderRadius: 10, marginBottom: 16, textAlign: "left", border: `1px solid ${C.gn}20` }}>
        <div style={{ fontSize: 12, color: C.g700, lineHeight: 1.6 }}>
          <strong style={{ color: C.gnD }}>💡 Unser Ansatz:</strong> Wir analysieren 8 Dimensionen — nicht ob du "ersetzt" wirst, sondern <strong>welche Aufgaben</strong> sich verändern und wie du mit AI zum Multiplikator wirst.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: C.g500, justifyContent: "center", marginBottom: 16 }}>
        <span>24 Fragen</span><span>·</span><span>~8 Min</span><span>·</span><span>8 Dimensionen</span>
      </div>
      <button onClick={() => setPhase("questions")} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: C.x, color: C.w, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Analyse starten</button>
    </div>
  );

  // ─── QUESTIONS ──────────────────────────────────
  if (phase === "questions") {
    const dim = DIMS[dimIdx];
    const question = QS[dimIds[dimIdx]][qIdx];
    return (
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ height: 3, background: C.g200, borderRadius: 2, marginBottom: 16 }}>
          <div style={{ height: "100%", width: `${(currentQ / totalQ) * 100}%`, background: C.bl, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: C.bl, letterSpacing: "0.05em", textTransform: "uppercase" }}>{dim.icon} {dim.name}</span>
          <span style={{ fontSize: 11, color: C.g400 }}>{currentQ}/{totalQ}</span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: C.x, margin: "0 0 14px", lineHeight: 1.3 }}>{question.q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {question.opts.map((o, i) => (
            <button key={i} onClick={() => handleAnswer(o.v)} style={{
              padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.g200}`, background: C.w,
              textAlign: "left", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: C.x, fontWeight: 500, transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.bl; e.currentTarget.style.background = C.blXL; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.g200; e.currentTarget.style.background = C.w; }}>
              {o.l}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 10, background: C.g50, borderRadius: 8, fontSize: 10, color: C.g500, lineHeight: 1.5 }}>
          <strong style={{ color: C.g400 }}>Wissenschaft:</strong> {dim.sciNote}
        </div>
      </div>
    );
  }

  // ─── RESULT ─────────────────────────────────────
  const p = getProfile(scores);
  const dims = DIMS.map(d => ({ ...d, score: scores[d.id] || 2.5 })).sort((a, b) => a.score - b.score);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>{p.emoji}</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.bl, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dein X-SCORE Profil</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: C.x, margin: "4px 0" }}>{p.profile}</h2>
        <span style={{ padding: "3px 12px", borderRadius: 16, background: p.avg <= 2.5 ? C.gnL : p.avg <= 3.5 ? C.blXL : C.amL, color: p.avg <= 2.5 ? C.gn : p.avg <= 3.5 ? C.bl : C.am, fontSize: 13, fontWeight: 800 }}>
          Score: {p.avg.toFixed(1)} / 5.0
        </span>
      </div>

      <div style={{ padding: 16, background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.g700, lineHeight: 1.65 }}>{p.advice}</div>
      </div>

      <div style={{ background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: C.x, margin: "0 0 10px" }}>8 Dimensionen</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.g400, marginBottom: 6 }}>
          <span style={{ color: C.gn }}>← Mensch stärker</span><span style={{ color: C.am }}>AI-Vorteil →</span>
        </div>
        {dims.map(d => <DimBar key={d.id} score={d.score} label={`${d.icon} ${d.name}`} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ padding: 14, background: C.gnL, borderRadius: 12, border: `1px solid ${C.gn}20` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.gnD, marginBottom: 6 }}>🛡️ Menschliche Stärken</div>
          {p.humanEdge.length > 0 ? p.humanEdge.map(id => <div key={id} style={{ fontSize: 11, color: C.g700, padding: "2px 0" }}>{DIMS.find(d=>d.id===id)?.icon} {DIMS.find(d=>d.id===id)?.name}</div>)
          : <div style={{ fontSize: 11, color: C.g500 }}>Ausgewogenes Profil</div>}
        </div>
        <div style={{ padding: 14, background: C.amL, borderRadius: 12, border: `1px solid ${C.am}20` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.am, marginBottom: 6 }}>⚡ AI-Potenzial</div>
          {p.aiEdge.length > 0 ? p.aiEdge.map(id => <div key={id} style={{ fontSize: 11, color: C.g700, padding: "2px 0" }}>{DIMS.find(d=>d.id===id)?.icon} {DIMS.find(d=>d.id===id)?.name}</div>)
          : <div style={{ fontSize: 11, color: C.g500 }}>Wenig Automatisierungspotenzial</div>}
        </div>
      </div>

      <div style={{ padding: 12, background: C.g50, borderRadius: 10, border: `1px solid ${C.g100}`, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: C.g700, lineHeight: 1.6 }}>
          <strong style={{ color: C.bl }}>Fazit:</strong> AI ersetzt nicht Jobs — AI verändert Aufgaben innerhalb von Jobs. Anthropics Forschung zeigt: tatsächliche AI-Durchdringung liegt bei nur 25-36% der Fähigkeit. Die Dallas Fed bestätigt: erfahrene Mitarbeiter in AI-Berufen verdienen <em>mehr</em>.
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={restart} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${C.g200}`, background: C.w, color: C.x, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Erneut analysieren</button>
      </div>
    </div>
  );
}
