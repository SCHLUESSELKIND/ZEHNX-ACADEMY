import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#FAFAF9", w: "#FFFFFF", x: "#18181B",
  g50: "#FAFAF9", g100: "#F4F4F5", g200: "#E4E4E7", g300: "#D4D4D8",
  g400: "#A1A1AA", g500: "#71717A", g600: "#52525B", g700: "#3F3F46", g800: "#27272A",
  bl: "#2563EB", blD: "#1D4ED8", blL: "#DBEAFE", blXL: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5", gnD: "#047857",
  am: "#D97706", amL: "#FFFBEB", amD: "#B45309",
  rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF",
  cy: "#0891B2",
};

// ═══ 8 DIMENSIONEN — Wissenschaftlich fundiert ═══
const DIMS = [
  { id: "routine", name: "Routine vs. Kreativität", icon: "◆", color: C.bl,
    short: "Wie vorhersehbar sind deine Aufgaben?",
    sciSource: "Frey & Osborne (2017), O*NET Task-Based Analysis",
    humanWin: "Originelle Problemlösung, kontextabhängige Kreativität, Konzeptentwicklung",
    aiWin: "Repetitive Datenverarbeitung, Muster-Erkennung, standardisierte Berichte",
    insight: "Berufe mit >60% Routine-Anteil haben das höchste Transformationspotenzial. Aber: Routine-Aufgaben zu automatisieren macht dich nicht überflüssig — es gibt dir Zeit für wertschöpfende Arbeit." },
  { id: "knowledge", name: "Wissenstyp", icon: "◇", color: C.vi,
    short: "Kodifizierbar oder erfahrungsbasiert?",
    sciSource: "Dallas Fed Research (Feb 2026)",
    humanWin: "Intuition aus jahrelanger Erfahrung, implizites Wissen, Urteilsvermögen in Graubereichen",
    aiWin: "Fakten abrufen, Vorschriften anwenden, Standardverfahren durchführen, Muster in Daten finden",
    insight: "Die Dallas Fed zeigt: In AI-exponierten Berufen steigen die Gehälter für erfahrene Mitarbeiter. AI substituiert kodifizierbares Einstiegswissen, ergänzt aber Erfahrungswissen." },
  { id: "social", name: "Menschliche Verbindung", icon: "⬡", color: C.gn,
    short: "Wie wichtig sind echte Beziehungen?",
    sciSource: "WEF Future of Jobs Report 2025",
    humanWin: "Therapeutische Beziehung, Teamführung, Verhandlung, Vertrauensaufbau, emotionale Intelligenz",
    aiWin: "FAQ-Support, automatisierte Kommunikation, Sentiment-Analyse, Chatbot-Interaktionen",
    insight: "Das WEF rankt Empathie, Führung und Kollaboration unter den Top-Skills bis 2030. Jobs mit hohem Menschenkontakt werden im AI-Zeitalter an Wert GEWINNEN." },
  { id: "judgment", name: "Entscheidungskomplexität", icon: "◈", color: C.am,
    short: "Wie viel Abwägung unter Unsicherheit?",
    sciSource: "Anthropic Economic Index (2026)",
    humanWin: "Ethische Dilemmata, strategische Weichenstellungen, Multi-Stakeholder-Abwägung",
    aiWin: "Regelbasierte Entscheidungen, datengetriebene Optimierung, A/B-Test-Auswertung",
    insight: "Anthropics Index zeigt: Management hat 91.3% theoretische AI-Abdeckung, aber nur ~25% beobachtete Nutzung. Komplexe Entscheidungen unter Unsicherheit bleiben fest in Menschenhand." },
  { id: "physical", name: "Physische Präsenz", icon: "◉", color: "#EA580C",
    short: "Brauchst du physische Anwesenheit?",
    sciSource: "McKinsey Global Institute (2023)",
    humanWin: "Handwerk, Chirurgie, Kinderbetreuung, Vor-Ort-Diagnose, Live-Performance",
    aiWin: "Remote-Datenarbeit, virtuelle Meetings, digitale Analyse, Cloud-Entwicklung",
    insight: "Rein digitale Wissensarbeit ist am stärksten exponiert. Physische Berufe sind durch Robotics erst langfristig betroffen — und selbst dann primär in strukturierten Umgebungen." },
  { id: "adapt", name: "AI-Adaptionsfähigkeit", icon: "◎", color: C.cy,
    short: "Wie bereit bist du für AI-Integration?",
    sciSource: "PwC AI Jobs Barometer (2025), Brookings Adaptive Capacity",
    humanWin: "Du verstehst wo AI hilft und wo sie scheitert — kritisches Denken über AI-Output",
    aiWin: "Du nutzt AI-Tools produktiv für Routine-Aufgaben und Ideation",
    insight: "PwC zeigt: Mitarbeiter mit AI-Skills verdienen 25% mehr. Brookings: Skill-Transferability ist der stärkste Faktor für erfolgreiche Karriere-Adaption." },
  { id: "stakes", name: "Haftung & Verantwortung", icon: "⊕", color: C.rd,
    short: "Was kostet ein Fehler?",
    sciSource: "EU AI Act Art. 6 — Hochrisiko-Klassifizierung",
    humanWin: "Medizinische Diagnose, Rechtsberatung, finanzielle Haftung, Kindeswohl, Audit",
    aiWin: "Niedrigrisiko-Aufgaben: Entwürfe, Vorschläge, Ideation, erste Recherche",
    insight: "Der EU AI Act schreibt menschliche Aufsicht für Hochrisiko-Systeme vor. Je höher die Haftung in deinem Job, desto stärker bist du regulatorisch geschützt." },
  { id: "market", name: "Marktdynamik", icon: "⬢", color: "#DB2777",
    short: "Wie schnell verändert sich deine Branche?",
    sciSource: "Anthropic Labor Market Research (März 2026), Euronews",
    humanWin: "Regulation schützt menschliche Rollen, Branche erfordert Vertrauen",
    aiWin: "Branche investiert massiv in Automatisierung, Wettbewerber nutzen AI bereits",
    insight: "Beobachtete AI-Exposure: IT 35.8%, Admin 34.3%, Finance 28.4%, Sales 26.9%. Die tatsächliche AI-Durchdringung liegt bei nur 25-36% der theoretischen Fähigkeit." },
];

// ═══ FRAGEN — 3 pro Dimension, kalibriert ═══
const QS = {
  routine: [
    { q: "Wie viel Prozent deiner täglichen Arbeit folgt einem vorhersehbaren Ablauf?", opts: [
      { l: "Unter 20% — Jeder Tag ist komplett anders", v: 1 },
      { l: "20-40% — Einige wiederkehrende Muster, viel Variation", v: 2 },
      { l: "40-60% — Ausgewogener Mix aus Routine und Neuem", v: 3 },
      { l: "60-80% — Überwiegend standardisierte Abläufe", v: 4 },
      { l: "Über 80% — Fast vollständig vorhersehbar", v: 5 },
    ]},
    { q: "Könnte jemand deinen typischen Arbeitstag als Schritt-für-Schritt-Anleitung dokumentieren?", opts: [
      { l: "Unmöglich — zu viele situationsabhängige Entscheidungen", v: 1 },
      { l: "Die Grundstruktur ja, aber die Details variieren ständig", v: 3 },
      { l: "Ja, ziemlich vollständig beschreibbar", v: 5 },
    ]},
    { q: "Wenn jemand deine Arbeit eine Woche beobachten würde — wie schnell könnte er die Kernaufgaben übernehmen?", opts: [
      { l: "Gar nicht — braucht Jahre an Erfahrung", v: 1 },
      { l: "Die Basics nach Monaten, die Tiefe fehlt aber", v: 2.5 },
      { l: "Die Kernaufgaben nach gründlicher Einarbeitung", v: 4 },
      { l: "Relativ schnell — klare Prozesse vorhanden", v: 5 },
    ]},
  ],
  knowledge: [
    { q: "Was macht dich in deinem Job wirklich gut — besser als andere?", opts: [
      { l: "Intuition und Erfahrungswissen das man nicht nachschlagen kann", v: 1 },
      { l: "Kombination aus tiefem Fachwissen und jahrelanger Praxis", v: 2 },
      { l: "Breites, aktuelles Wissen über Tools und Methoden", v: 3.5 },
      { l: "Geschwindigkeit beim Anwenden bekannter Verfahren", v: 5 },
    ]},
    { q: "Wie viel deines beruflichen Wissens findest du in Büchern, Handbüchern oder Dokumentationen?", opts: [
      { l: "Wenig — das Entscheidende ist implizites Erfahrungswissen", v: 1 },
      { l: "Einiges — aber der wirklich wertvolle Teil nicht", v: 2.5 },
      { l: "Das meiste — gut dokumentiertes Fachgebiet", v: 4 },
      { l: "Praktisch alles — klare Regeln, definierte Prozesse", v: 5 },
    ]},
    { q: "Wie wichtig ist dein persönliches Netzwerk für deinen beruflichen Erfolg?", opts: [
      { l: "Extrem wichtig — mein Netzwerk ist mein größtes Kapital", v: 1 },
      { l: "Wichtig — öffnet Türen, aber nicht alles", v: 2.5 },
      { l: "Hilfreich, aber Ergebnisse zählen mehr", v: 4 },
      { l: "Kaum relevant für meinen Erfolg", v: 5 },
    ]},
  ],
  social: [
    { q: "Wie viel deiner Arbeitszeit verbringst du in direktem Kontakt mit Menschen?", opts: [
      { l: "Über 70% — mein Job IST Menschenkontakt", v: 1 },
      { l: "40-70% — erheblicher Teil meiner Arbeit", v: 2 },
      { l: "20-40% — regelmäßig, aber nicht dominant", v: 3.5 },
      { l: "Unter 20% — überwiegend allein oder digital", v: 5 },
    ]},
    { q: "Müssen Menschen dir persönlich vertrauen, damit du deinen Job gut machen kannst?", opts: [
      { l: "Absolut — Vertrauen ist Grundvoraussetzung (Therapie, Beratung, Pflege)", v: 1 },
      { l: "Ja — Beziehungsqualität beeinflusst meine Ergebnisse stark", v: 2 },
      { l: "Teilweise — hilft, ist aber nicht zentral", v: 3.5 },
      { l: "Nein — das Ergebnis spricht für sich unabhängig von Vertrauen", v: 5 },
    ]},
    { q: "Wie oft musst du emotionale oder konfliktreiche Situationen navigieren?", opts: [
      { l: "Täglich — zentral für meine Arbeit", v: 1 },
      { l: "Regelmäßig — Konflikte, Feedback, schwierige Gespräche", v: 2 },
      { l: "Gelegentlich — kommt vor, ist aber nicht der Kern", v: 3.5 },
      { l: "Selten bis nie", v: 5 },
    ]},
  ],
  judgment: [
    { q: "Wie oft triffst du Entscheidungen ohne vollständige Datenlage?", opts: [
      { l: "Täglich — Unsicherheit ist mein Normalzustand", v: 1 },
      { l: "Oft — muss häufig mit unvollständigen Infos arbeiten", v: 2 },
      { l: "Manchmal — meistens habe ich ausreichend Daten", v: 3.5 },
      { l: "Selten — klare Vorgaben und vollständige Daten vorhanden", v: 5 },
    ]},
    { q: "Wie viele verschiedene Stakeholder musst du bei wichtigen Entscheidungen berücksichtigen?", opts: [
      { l: "5+ verschiedene Interessengruppen — komplexes Geflecht", v: 1 },
      { l: "3-4 Perspektiven — mehrere Stakeholder mit verschiedenen Zielen", v: 2.5 },
      { l: "1-2 — relativ klare Zielgruppe oder Auftraggeber", v: 4 },
      { l: "Keine — ich setze vorgegebene Entscheidungen um", v: 5 },
    ]},
    { q: "Wie oft wägst du zwischen widersprüchlichen Zielen ab? (z.B. Qualität vs. Speed, Kosten vs. Ethik)", opts: [
      { l: "Ständig — das ist der Kern meiner Arbeit", v: 1 },
      { l: "Regelmäßig — gehört zum Alltag", v: 2.5 },
      { l: "Gelegentlich — kommt vor", v: 4 },
      { l: "Selten — klare Prioritäten vorgegeben", v: 5 },
    ]},
  ],
  physical: [
    { q: "Erfordert dein Job physische Anwesenheit an einem bestimmten Ort?", opts: [
      { l: "Immer — Handwerk, Pflege, Labor, Bühne, Baustelle", v: 1 },
      { l: "Meistens — vor Ort nötig, vereinzelt Remote möglich", v: 2 },
      { l: "Hybrid — teils remote, teils vor Ort", v: 3.5 },
      { l: "Komplett digital und ortsunabhängig machbar", v: 5 },
    ]},
    { q: "Nutzt du in deiner Arbeit spezifische manuelle oder körperliche Fähigkeiten?", opts: [
      { l: "Ja, zentral — Chirurgie, Handwerk, Sport, bildende Kunst", v: 1 },
      { l: "Teilweise — Laborarbeit, Kochen, Montage", v: 2 },
      { l: "Minimal — hauptsächlich Tastatur und Bildschirm", v: 4 },
      { l: "Nein — rein kognitive Arbeit", v: 5 },
    ]},
    { q: "Musst du auf unvorhersehbare Umgebungen oder Situationen reagieren?", opts: [
      { l: "Ja, ständig — keine Situation gleicht der anderen", v: 1 },
      { l: "Gelegentlich — manchmal unerwartete Bedingungen", v: 3 },
      { l: "Selten — kontrollierte, vorhersehbare Umgebung", v: 5 },
    ]},
  ],
  adapt: [
    { q: "Wie oft nutzt du AI-Tools (ChatGPT, Claude, Copilot, Midjourney...)?", opts: [
      { l: "Täglich — integraler Teil meiner Arbeit", v: 1 },
      { l: "Mehrmals pro Woche — regelmäßig", v: 2 },
      { l: "Gelegentlich — experimentiere noch", v: 3.5 },
      { l: "Selten oder nie", v: 5 },
    ]},
    { q: "Wie wohl fühlst du dich beim Erlernen neuer digitaler Tools?", opts: [
      { l: "Sehr wohl — lerne schnell und gerne Neues", v: 1 },
      { l: "Gut — brauche etwas Zeit, aber komme zurecht", v: 2 },
      { l: "Gemischt — manche Tools fallen mir schwer", v: 3.5 },
      { l: "Eher unwohl — vermeide neue Tools wenn möglich", v: 5 },
    ]},
    { q: "Hast du Zugang zu AI-Weiterbildung?", opts: [
      { l: "Ja — nutze aktiv Kurse, Sprints und Communities", v: 1 },
      { l: "Ja — Angebot existiert, nutze es aber kaum", v: 2.5 },
      { l: "Nicht wirklich — müsste mich selbst darum kümmern", v: 4 },
      { l: "Nein — keinerlei Angebot oder Zugang", v: 5 },
    ]},
  ],
  stakes: [
    { q: "Was passiert wenn in deiner Arbeit ein Fehler passiert?", opts: [
      { l: "Lebensgefahr oder schwere rechtliche Konsequenzen", v: 1 },
      { l: "Erhebliche finanzielle oder gesundheitliche Folgen", v: 2 },
      { l: "Unzufriedene Kunden, Projektverzögerung, Imageschaden", v: 3.5 },
      { l: "Meist korrigierbar, niedrige Konsequenzen", v: 5 },
    ]},
    { q: "Trägst du persönliche Haftung oder Verantwortung für deine Entscheidungen?", opts: [
      { l: "Ja — berufshaftpflichtrelevant (Arzt, Anwalt, Wirtschaftsprüfer)", v: 1 },
      { l: "Ja — Führungsverantwortung, Budget- oder Personalverantwortung", v: 2 },
      { l: "Teilweise — im Teamkontext mit geteilter Verantwortung", v: 3.5 },
      { l: "Wenig — führe Anweisungen aus, Verantwortung liegt woanders", v: 5 },
    ]},
    { q: "Würden deine Kunden/Patienten/Klienten einem AI-System genauso vertrauen wie dir?", opts: [
      { l: "Niemals — menschliches Gegenüber ist zwingend erforderlich", v: 1 },
      { l: "In manchen Bereichen vielleicht, aber nicht in den wichtigsten", v: 2.5 },
      { l: "Für Standardaufgaben wahrscheinlich schon", v: 4 },
      { l: "Wahrscheinlich ja — Ergebnis zählt, nicht wer es liefert", v: 5 },
    ]},
  ],
  market: [
    { q: "Wie stark investiert deine Branche aktuell in AI-Automatisierung?", opts: [
      { l: "Massiv — Branche wird gerade fundamental umgebaut", v: 5 },
      { l: "Deutlich — viele Pilotprojekte und signifikante Investitionen", v: 4 },
      { l: "Moderat — beginnt langsam, noch explorativ", v: 3 },
      { l: "Kaum — wenig AI-Adoption in meinem Bereich", v: 1.5 },
    ]},
    { q: "Gibt es bereits AI-Tools die Teile deiner Arbeit übernehmen könnten?", opts: [
      { l: "Ja — mehrere spezialisierte AI-Tools existieren bereits", v: 5 },
      { l: "Ja — aber die Qualität reicht noch nicht für Production", v: 3.5 },
      { l: "Teilweise — für Randaufgaben, nicht für den Kern", v: 2 },
      { l: "Nein — kaum brauchbare AI-Tools für meinen Bereich", v: 1 },
    ]},
    { q: "Schützt Regulierung in deiner Branche bestimmte menschliche Rollen?", opts: [
      { l: "Ja — gesetzlich vorgeschrieben (Medizin, Recht, Wirtschaftsprüfung)", v: 1 },
      { l: "Teilweise — gewisse Aufsichtspflichten und Zertifizierungen", v: 2.5 },
      { l: "Wenig — Branche ist relativ flexibel", v: 4 },
      { l: "Nein — keine regulatorischen Hürden für AI-Einsatz", v: 5 },
    ]},
  ],
};

// ═══ SPRINT RECOMMENDATIONS mapped to dimensions ═══
const SPRINT_MAP = [
  { dim: "routine", high: { name: "AI Email Triage", dept: "Automation HQ", why: "Automatisiere deine repetitiven Tasks" }, low: { name: "AI Strategie Sprint", dept: "Business School", why: "Verstehe wie AI deine Kreativarbeit verstärkt" }},
  { dim: "knowledge", high: { name: "RAG Knowledge Bot", dept: "App Lab", why: "Mach dein Fachwissen für AI zugänglich" }, low: { name: "Prompt Mastery", dept: "Automation HQ", why: "Nutze AI als Sparringspartner für dein Erfahrungswissen" }},
  { dim: "adapt", high: { name: "Prompt Mastery", dept: "Automation HQ", why: "Erweitere dein AI-Toolkit" }, low: { name: "Support Bot in 30 Min", dept: "Conversational AI", why: "Sanfter Einstieg in AI-Tools" }},
  { dim: "market", high: { name: "AI Act Quick Check", dept: "Business School", why: "Verstehe die Regulierung deiner Branche" }, low: { name: "Marktanalyse in 60 Min", dept: "Data Intelligence", why: "Analysiere wo AI deine Branche verändert" }},
  { dim: "stakes", high: { name: "Privacy Audit", dept: "Selbstschutz", why: "Sichere deine AI-Nutzung rechtlich ab" }, low: { name: "Deepfake Defense", dept: "Selbstschutz", why: "Schütze dich und dein Team vor AI-Risiken" }},
];

// ═══ PROFILE LOGIC ═══
function getProfile(scores) {
  const vals = Object.values(scores);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const humanEdge = Object.entries(scores).filter(([, v]) => v < 2.5).map(([k]) => k);
  const aiEdge = Object.entries(scores).filter(([, v]) => v > 3.5).map(([k]) => k);
  const balanced = Object.entries(scores).filter(([, v]) => v >= 2.5 && v <= 3.5).map(([k]) => k);

  let profile, emoji, headline, advice, color;
  if (avg <= 2) {
    profile = "AI-Resilient Pro"; emoji = "🛡️"; color = C.gn;
    headline = "Dein Berufsprofil hat starke natürliche Schutzfaktoren.";
    advice = "AI wird dich in den nächsten Jahren eher unterstützen als bedrohen. Deine Stärken — menschliche Verbindung, Erfahrungswissen, physische Präsenz — sind genau das, was AI nicht kann. Nutze AI-Tools gezielt als Multiplikator für deine Stärken.";
  } else if (avg <= 3) {
    profile = "Hybrid-Potenzial"; emoji = "⚡"; color = C.bl;
    headline = "Du bist im produktivsten Bereich: Mensch + AI zusammen.";
    advice = "Dein Mix aus menschlichen und automatisierbaren Aufgaben ist ideal für AI-Augmentation. Die Forschung zeigt: Genau in dieser Zone liegt das größte Produktivitäts-Potenzial. Wer jetzt AI-Skills aufbaut, wird zum unersetzlichen Multiplikator im Team.";
  } else if (avg <= 3.8) {
    profile = "Transformation Ahead"; emoji = "🔄"; color = C.am;
    headline = "Teile deiner Arbeit werden sich in 2-5 Jahren verändern.";
    advice = "Das ist kein Grund zur Panik — es ist eine Einladung. Die gleiche Analyse zeigt dir genau, welche deiner Fähigkeiten WERTVOLLER werden. Mit gezieltem Upskilling wirst du in deinem Bereich unersetzbar — weil du AI verstehst UND die menschliche Expertise mitbringst.";
  } else {
    profile = "Aktiver Wandel"; emoji = "🚀"; color = C.rd;
    headline = "Dein Berufsfeld erlebt starke AI-Durchdringung.";
    advice = "Die gute Nachricht: Wer sich jetzt positioniert, profitiert am meisten. Historisch entstehen aus Technologie-Umbrüchen mehr Jobs als verloren gehen — 60% heutiger US-Jobs existierten 1940 nicht (Goldman Sachs). Die empfohlenen Sprints helfen dir, dich optimal zu positionieren.";
  }
  return { avg, profile, emoji, headline, advice, color, humanEdge, aiEdge, balanced };
}

// ═══ RADAR CHART (SVG) ═══
function RadarChart({ scores, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const dims = DIMS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / DIMS.length - Math.PI / 2;
    const val = scores[d.id] || 2.5;
    const pct = val / 5;
    return { ...d, angle, val, pct, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: cx + Math.cos(angle) * r * pct, vy: cy + Math.sin(angle) * r * pct };
  });
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const dataPath = dims.map((d, i) => `${i === 0 ? "M" : "L"}${d.vx},${d.vy}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((l, i) => (
        <polygon key={i} points={dims.map(d => `${cx + Math.cos(d.angle) * r * l},${cy + Math.sin(d.angle) * r * l}`).join(" ")}
          fill="none" stroke={C.g200} strokeWidth={i === 4 ? 1.5 : 0.5} />
      ))}
      {dims.map((d, i) => <line key={i} x1={cx} y1={cy} x2={d.x} y2={d.y} stroke={C.g200} strokeWidth={0.5} />)}
      <polygon points={dims.map(d => `${d.vx},${d.vy}`).join(" ")} fill={`${C.bl}18`} stroke={C.bl} strokeWidth={2} />
      {dims.map((d, i) => (
        <g key={i}>
          <circle cx={d.vx} cy={d.vy} r={4} fill={C.w} stroke={d.color} strokeWidth={2} />
          <text x={d.x + Math.cos(d.angle) * 16} y={d.y + Math.sin(d.angle) * 16}
            textAnchor={d.angle > Math.PI / 2 || d.angle < -Math.PI / 2 ? "end" : d.angle === Math.PI / 2 || d.angle === -Math.PI / 2 ? "middle" : "start"}
            dominantBaseline="central" fontSize={9} fontWeight={700} fill={d.color}>{d.icon}</text>
        </g>
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={900} fill={C.x}>
        {(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.g400}>/ 5.0</text>
    </svg>
  );
}

// ═══ DIMENSION BAR ═══
function DimBar({ dim, score, delay = 0 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 100 + delay); return () => clearTimeout(t); }, [score, delay]);
  const pct = (animated / 5) * 100;
  const clr = pct < 40 ? C.gn : pct > 60 ? C.am : C.bl;
  const label = pct < 40 ? "Mensch stärker" : pct > 60 ? "AI-Potenzial" : "Gleichauf";

  return (
    <div style={{ padding: "14px 16px", background: C.w, borderRadius: 12, border: `1px solid ${C.g200}`, marginBottom: 8, transition: "all 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = dim.color}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.g200}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: dim.color }}>{dim.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.x }}>{dim.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: clr }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: clr, fontFamily: "'JetBrains Mono', monospace", minWidth: 32, textAlign: "right" }}>{score.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ height: 8, background: C.g100, borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: C.g300, zIndex: 1 }} />
        <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: `linear-gradient(90deg, ${C.gn}, ${C.bl}, ${C.am})`, transition: "width 0.8s ease", transitionDelay: `${delay}ms` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.g400, marginTop: 3 }}>
        <span>🧠 Mensch</span><span>🤖 AI</span>
      </div>
    </div>
  );
}

// ═══ SCREENS ═══

function IntroScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${C.bl}, ${C.vi})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 36 }}>🧠</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: C.x, letterSpacing: "-0.04em", margin: "0 0 6px" }}>X-SCORE</h1>
      <p style={{ fontSize: 15, color: C.g500, lineHeight: 1.65, margin: "0 0 20px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
        Deine persönliche AI-Readiness-Analyse. Wo unterstützt KI dich — und wo sind deine menschlichen Stärken unersetzbar?
      </p>

      <div style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, padding: 20, marginBottom: 20, textAlign: "left" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.bl, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>Wissenschaftliche Grundlage</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { t: "Anthropic Economic Index", d: "Beobachtete AI-Nutzung in 800+ Berufen (März 2026)" },
            { t: "Brookings Adaptive Capacity", d: "Skills, Finanzen, Alter, Standort als Resilienz-Faktoren" },
            { t: "Dallas Fed Research", d: "AI ergänzt Erfahrungswissen, substituiert Einstiegswissen" },
            { t: "Yale Budget Lab", d: "33 Monate Arbeitsmarkt-Daten seit ChatGPT — kein Umbruch" },
            { t: "EU AI Act Art. 4 & 6", d: "Regulatorischer Schutz für Hochrisiko-Bereiche" },
            { t: "PwC AI Jobs Barometer", d: "Mitarbeiter mit AI-Skills verdienen 25% mehr" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 10, background: C.g50, borderRadius: 10, border: `1px solid ${C.g100}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.x }}>{s.t}</div>
              <div style={{ fontSize: 10, color: C.g500, marginTop: 2, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 14, background: C.gnL, borderRadius: 12, marginBottom: 20, textAlign: "left", border: `1px solid ${C.gn}20` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.gnD, marginBottom: 4 }}>💡 Kein Angst-Feature</div>
        <div style={{ fontSize: 12, color: C.g700, lineHeight: 1.65 }}>
          Der X-SCORE analysiert nicht ob du "ersetzt" wirst — sondern <strong>welche deiner Aufgaben</strong> sich verändern und wie du mit AI-Kompetenz zum Multiplikator wirst. AI ersetzt keine Menschen. AI ersetzt Menschen <em>die AI nicht nutzen</em>.
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.g500, justifyContent: "center", marginBottom: 20 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.bl }} />24 Fragen</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.vi }} />8 Dimensionen</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.gn }} />~8 Minuten</span>
      </div>

      <button onClick={onStart} style={{
        padding: "14px 48px", borderRadius: 14, border: "none",
        background: C.x, color: C.w, fontSize: 16, fontWeight: 800,
        cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.02em",
        boxShadow: `0 4px 20px ${C.x}25`,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${C.x}30`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 20px ${C.x}25`; }}>
        X-SCORE starten →
      </button>
    </div>
  );
}

function QuestionScreen({ dimIndex, qIndex, question, dimension, onAnswer, total, current }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => { setSelected(null); }, [dimIndex, qIndex]);

  const handleSelect = (v) => {
    setSelected(v);
    setTimeout(() => onAnswer(v), 300);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* PROGRESS */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 4, background: C.g200, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg, ${C.bl}, ${dimension.color})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontSize: 11, color: C.g400, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{current}/{total}</span>
      </div>

      {/* DIMENSION BADGE */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 12px", background: `${dimension.color}08`, borderRadius: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: `${dimension.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: dimension.color }}>{dimension.icon}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: dimension.color, letterSpacing: "0.03em" }}>{dimension.name}</div>
          <div style={{ fontSize: 10, color: C.g500 }}>{dimension.short}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, color: C.g400 }}>Frage {qIndex + 1} von 3</div>
      </div>

      {/* QUESTION */}
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.x, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.35 }}>{question.q}</h2>

      {/* OPTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.opts.map((opt, i) => {
          const isSelected = selected === opt.v;
          return (
            <button key={i} onClick={() => handleSelect(opt.v)} style={{
              padding: "14px 18px", borderRadius: 12,
              border: `2px solid ${isSelected ? dimension.color : C.g200}`,
              background: isSelected ? `${dimension.color}08` : C.w,
              textAlign: "left", cursor: "pointer", fontFamily: "inherit",
              fontSize: 14, color: C.x, fontWeight: isSelected ? 700 : 500, lineHeight: 1.45,
              transition: "all 0.2s",
              transform: isSelected ? "scale(1.01)" : "none",
            }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = `${dimension.color}60`; e.currentTarget.style.transform = "translateX(4px)"; }}}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.g200; e.currentTarget.style.transform = "none"; }}}>
              {isSelected && <span style={{ marginRight: 8, color: dimension.color }}>✓</span>}
              {opt.l}
            </button>
          );
        })}
      </div>

      {/* SCIENCE NOTE */}
      <div style={{ marginTop: 16, padding: "12px 14px", background: C.g50, borderRadius: 10, border: `1px solid ${C.g100}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.g400, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Wissenschaftlicher Hintergrund · {dimension.sciSource}</div>
        <div style={{ fontSize: 11, color: C.g500, lineHeight: 1.55 }}>{dimension.insight}</div>
      </div>
    </div>
  );
}

function ResultScreen({ scores, onRestart }) {
  const p = getProfile(scores);
  const dims = DIMS.map(d => ({ ...d, score: scores[d.id] || 2.5 }));
  const sorted = [...dims].sort((a, b) => a.score - b.score);
  const sprintRecs = SPRINT_MAP.map(s => {
    const score = scores[s.dim] || 2.5;
    const rec = score > 3.5 ? s.high : s.low;
    return { ...rec, dim: s.dim, score, dimName: DIMS.find(d => d.id === s.dim)?.name };
  });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* ═══ HEADER ═══ */}
      <div style={{ background: C.x, borderRadius: 20, padding: "28px 24px", marginBottom: 20, color: C.w, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${p.color}15` }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.bl, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Dein X-SCORE Ergebnis</div>
              <div style={{ fontSize: 36, marginBottom: 4 }}>{p.emoji}</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.03em" }}>{p.profile}</h1>
              <p style={{ fontSize: 13, color: C.g400, margin: 0, maxWidth: 340, lineHeight: 1.5 }}>{p.headline}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <RadarChart scores={scores} size={180} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ INTERPRETATION ═══ */}
      <div style={{ padding: 20, background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: "0 0 8px" }}>Was bedeutet das für dich?</h3>
        <p style={{ fontSize: 13, color: C.g700, lineHeight: 1.75, margin: 0 }}>{p.advice}</p>
      </div>

      {/* ═══ 8 DIMENSIONEN ═══ */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: "0 0 12px" }}>Dein Profil in 8 Dimensionen</h3>
        {sorted.map((d, i) => <DimBar key={d.id} dim={d} score={d.score} delay={i * 80} />)}
      </div>

      {/* ═══ STÄRKEN + CHANCEN ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 18, background: C.gnL, borderRadius: 14, border: `1px solid ${C.gn}20` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.gnD, marginBottom: 10 }}>🛡️ Deine menschlichen Stärken</div>
          {p.humanEdge.length > 0 ? p.humanEdge.map(id => {
            const d = DIMS.find(x => x.id === id);
            return (
              <div key={id} style={{ padding: "6px 0", borderBottom: `1px solid ${C.gn}10` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.x }}>{d.icon} {d.name}</div>
                <div style={{ fontSize: 10, color: C.g600, marginTop: 2 }}>{d.humanWin}</div>
              </div>
            );
          }) : <div style={{ fontSize: 12, color: C.g500 }}>Ausgewogenes Profil — gute Basis für Hybrid-Arbeit mit AI</div>}
        </div>
        <div style={{ padding: 18, background: C.amL, borderRadius: 14, border: `1px solid ${C.am}20` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.amD, marginBottom: 10 }}>⚡ Größtes AI-Potenzial</div>
          {p.aiEdge.length > 0 ? p.aiEdge.map(id => {
            const d = DIMS.find(x => x.id === id);
            return (
              <div key={id} style={{ padding: "6px 0", borderBottom: `1px solid ${C.am}10` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.x }}>{d.icon} {d.name}</div>
                <div style={{ fontSize: 10, color: C.g600, marginTop: 2 }}>{d.aiWin}</div>
              </div>
            );
          }) : <div style={{ fontSize: 12, color: C.g500 }}>Wenig Automatisierungspotenzial — starkes Human-Profil</div>}
        </div>
      </div>

      {/* ═══ SPRINT EMPFEHLUNGEN ═══ */}
      <div style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: "0 0 12px" }}>⚡ Empfohlene ZEHNX Sprints</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sprintRecs.map((s, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.g50, borderRadius: 10, border: `1px solid ${C.g100}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.x }}>{s.name}</span>
                <span style={{ padding: "2px 8px", borderRadius: 4, background: C.blXL, color: C.bl, fontSize: 10, fontWeight: 700 }}>{s.dept}</span>
              </div>
              <div style={{ fontSize: 11, color: C.g600, lineHeight: 1.5 }}>{s.why}</div>
              <div style={{ fontSize: 10, color: C.g400, marginTop: 4 }}>Basierend auf: {s.dimName} ({s.score.toFixed(1)})</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FORSCHUNGSKONTEXT ═══ */}
      <div style={{ padding: 18, background: C.w, borderRadius: 16, border: `1px solid ${C.g200}`, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: "0 0 10px" }}>📊 Einordnung: Was sagt die Forschung?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { stat: "25-36%", desc: "Tatsächliche AI-Durchdringung vs. theoretische Fähigkeit", src: "Anthropic Economic Index" },
            { stat: "+25%", desc: "Gehaltsplus für Mitarbeiter mit AI-Skills", src: "PwC AI Jobs Barometer" },
            { stat: "60%", desc: "Der heutigen US-Jobs existierten 1940 nicht", src: "Goldman Sachs Research" },
            { stat: "0%", desc: "Systematische Arbeitslosigkeit durch AI seit ChatGPT", src: "Yale Budget Lab" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 12, background: C.g50, borderRadius: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.bl, fontFamily: "'JetBrains Mono', monospace" }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: C.g700, lineHeight: 1.4, marginTop: 2 }}>{s.desc}</div>
              <div style={{ fontSize: 9, color: C.g400, marginTop: 4 }}>{s.src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ QUELLENVERZEICHNIS ═══ */}
      <div style={{ padding: 16, background: C.g50, borderRadius: 12, border: `1px solid ${C.g100}`, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.g400, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>Quellen & Methodik</div>
        <div style={{ fontSize: 10, color: C.g500, lineHeight: 1.8, columns: 2, columnGap: 20 }}>
          {[
            "Anthropic Economic Index — Labor Market Impacts (März 2026)",
            "Brookings Institution — Measuring AI Adaptive Capacity (Feb 2026)",
            "Federal Reserve Bank of Dallas — AI & Wages (Feb 2026)",
            "Yale Budget Lab — Evaluating AI Labor Market Impact",
            "Eloundou et al. — GPTs are GPTs (OpenAI, 2023)",
            "Frey & Osborne — Future of Employment (Oxford, 2017)",
            "WEF — Future of Jobs Report (2025)",
            "PwC — AI Jobs Barometer (2025)",
            "Goldman Sachs — Generative AI & Labor Markets",
            "EU AI Act — Art. 4 (AI Literacy), Art. 6 (High-Risk)",
          ].map((s, i) => <div key={i} style={{ breakInside: "avoid", padding: "1px 0" }}>• {s}</div>)}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onRestart} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${C.g200}`, background: C.w, color: C.x, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          ↻ Erneut analysieren
        </button>
        <button style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: C.x, color: C.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          ⚡ Empfohlene Sprints starten
        </button>
      </div>
    </div>
  );
}

// ═══ MAIN ═══
export default function XScore() {
  const [phase, setPhase] = useState("intro");
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
      else { setPhase("result"); }
    }
  };

  const restart = () => { setPhase("intro"); setDimIdx(0); setQIdx(0); setAnswers({}); setScores({}); };

  return (
    <div style={{ padding: "20px 0 60px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');`}</style>
      {phase === "intro" && <IntroScreen onStart={() => setPhase("questions")} />}
      {phase === "questions" && (
        <QuestionScreen dimIndex={dimIdx} qIndex={qIdx}
          question={QS[dimIds[dimIdx]][qIdx]} dimension={DIMS[dimIdx]}
          onAnswer={handleAnswer} total={totalQ} current={currentQ} />
      )}
      {phase === "result" && <ResultScreen scores={scores} onRestart={restart} />}
    </div>
  );
}
