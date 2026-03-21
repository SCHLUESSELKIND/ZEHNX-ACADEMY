import { useState, useEffect } from "react";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF", pk: "#DB2777", pkL: "#FDF2F8",
  cy: "#0891B2", cyL: "#ECFEFF",
};

// ─── Primitives ──────────────────────────────────────────────

function Badge({ children, c = Z.bl, bg: b }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: b || (c + "14"), color: c }}>{children}</span>;
}
function Pill({ children, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: active ? Z.x : Z.w, color: active ? Z.w : Z.g500, fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: active ? "none" : `0 0 0 1px ${Z.g200}`, transition: "all 0.15s" }}>{children}</button>;
}
function Card({ children, style: s, onClick }) {
  return <div onClick={onClick} style={{ background: Z.w, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}`, marginBottom: 10, cursor: onClick ? "pointer" : "default", ...s }}>{children}</div>;
}

const SUB = [
  { id: "discover", l: "Entdecken" },
  { id: "projects", l: "Projekte" },
  { id: "show", l: "Show & Tell" },
  { id: "profile", l: "Mein Profil" },
];

// ─── Demo Data ───────────────────────────────────────────────

const COLORS = [Z.bl, Z.vi, Z.gn, Z.am, Z.pk, Z.cy, Z.rd, Z.g700];

const DEMO_PROFILES = [
  { id: "1", name: "Sarah K.", city: "Berlin", building: "AI-gestützter Recruiting-Chatbot", can_help: "Python, NLP, Prompt Engineering", needs_help: "React Frontend, UI Design", slack: "@sarah_k", help_count: 18, level: "B2", dept: "App Lab", offers: ["Python", "Prompt Engineering"], seeks: ["React", "UI Design"] },
  { id: "2", name: "Marcus B.", city: "München", building: "Automatisierte Buchhaltung mit n8n", can_help: "n8n Workflows, DATEV, Supabase", needs_help: "Machine Learning, Daten-Analyse", slack: "@marcus_b", help_count: 7, level: "B1", dept: "Automation HQ", offers: ["n8n", "Supabase"], seeks: ["Machine Learning"] },
  { id: "3", name: "Lisa W.", city: "Köln", building: "E-Commerce Texte mit AI", can_help: "Content, SEO, Claude API", needs_help: "Tech-Architektur, Deployment", slack: "@lisa_w", help_count: 24, level: "A2", dept: "Content Factory", offers: ["Claude API", "SEO"], seeks: ["Deployment"] },
  { id: "4", name: "Jan P.", city: "Hamburg", building: "RAG-System für Rechtsberatung", can_help: "pgvector, RAG, LangChain, Docker", needs_help: "UX Research, Nutzer-Interviews", slack: "@jan_p", help_count: 31, level: "C1", dept: "Data Intelligence", offers: ["pgvector", "RAG", "Docker"], seeks: ["UX Research"] },
  { id: "5", name: "Alina R.", city: "Stuttgart", building: "AI-Assistentin für Lehrkräfte", can_help: "Pädagogik, Curriculum Design", needs_help: "API-Integration, Supabase Auth", slack: "@alina_r", help_count: 5, level: "A2", dept: "Business School", offers: ["Pädagogik"], seeks: ["Supabase Auth"] },
  { id: "6", name: "Felix H.", city: "Köln", building: "Smart-Home mit AI", can_help: "IoT, Python, Home Assistant", needs_help: "Prompt Engineering, Fine-Tuning", slack: "@felix_h", help_count: 12, level: "B1", dept: "Automation HQ", offers: ["Python", "IoT"], seeks: ["Prompt Engineering"] },
  { id: "7", name: "Nina S.", city: "Berlin", building: "AI Art Direction Tool", can_help: "Figma, UI/UX, Design Systems", needs_help: "Backend, Datenbanken, Hosting", slack: "@nina_s", help_count: 9, level: "B1", dept: "Design Studio", offers: ["UI/UX", "Figma"], seeks: ["Backend"] },
  { id: "8", name: "David M.", city: "Wien", building: "Podcast-Transkription mit AI", can_help: "Whisper API, Audio, FFmpeg", needs_help: "Marketing, Growth, Community", slack: "@david_m", help_count: 14, level: "B2", dept: "Content Factory", offers: ["Whisper API", "Audio"], seeks: ["Marketing"] },
];

const DEMO_PROJECTS = [
  { id: "1", user: "Jan P.", title: "RAG-System: Chunking-Strategie testen", desc: "Suche jemanden der mit mir verschiedene Chunking-Methoden für juristische Texte vergleicht.", seeking: ["NLP", "Python", "Evaluation"], status: "open", interests: 3 },
  { id: "2", user: "Nina S.", title: "Landing Page für AI Art Tool", desc: "Design steht, brauche Hilfe beim React-Build und Vercel Deploy.", seeking: ["React", "Vercel", "Tailwind"], status: "open", interests: 5 },
  { id: "3", user: "Lisa W.", title: "SEO-optimierte Produkttexte Pipeline", desc: "Claude API → n8n → Shopify. Pipeline steht zu 80%, brauche Review.", seeking: ["n8n", "Review", "Feedback"], status: "in_progress", interests: 2 },
];

const DEMO_SHOWS = [
  { id: "1", user: "Jan P.", title: "RAG mit 95% Accuracy auf juristischen Texten", desc: "Nach 3 Wochen Tuning: Hybrid Search (pgvector + BM25) schlägt reine Vektor-Suche um 23%. Hier mein Setup.", comments: 8, time: "vor 2h" },
  { id: "2", user: "Sarah K.", title: "Recruiting-Bot: Erste 50 Gespräche analysiert", desc: "Die häufigsten Fragen von Bewerbern sind nicht die, die ich erwartet hätte. Daten + Learnings.", comments: 12, time: "vor 5h" },
  { id: "3", user: "Felix H.", title: "Home Assistant + Claude = Magic", desc: "Sprachsteuerung die tatsächlich versteht was ich meine. Demo-Video im Slack.", comments: 6, time: "gestern" },
];

// ─── Profile Card ────────────────────────────────────────────

function ProfileCard({ p, i }) {
  const [expanded, setExpanded] = useState(false);
  const c = COLORS[i % COLORS.length];
  return (
    <Card onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${c}, ${c}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
          {p.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: Z.x }}>{p.name}</span>
            <Badge c={Z.g500} bg={Z.g100}>{p.level}</Badge>
            <span style={{ fontSize: 11, color: Z.g400 }}>{p.city}</span>
          </div>

          {/* Building */}
          <div style={{ fontSize: 12.5, color: Z.g600, marginBottom: 6 }}>
            <span style={{ color: Z.bl, fontWeight: 600 }}>baut:</span> {p.building}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: expanded ? 10 : 0 }}>
            {p.offers.slice(0, 3).map((t, j) => <Badge key={j} c={Z.gn}>{t}</Badge>)}
            {p.seeks.slice(0, 2).map((t, j) => <Badge key={j} c={Z.vi}>{t}</Badge>)}
          </div>

          {/* Expanded */}
          {expanded && (
            <div style={{ marginTop: 8 }}>
              <div style={{ padding: 10, background: Z.gnL, borderRadius: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: Z.gn, marginBottom: 2 }}>KANN HELFEN BEI</div>
                <div style={{ fontSize: 12, color: Z.g700 }}>{p.can_help}</div>
              </div>
              <div style={{ padding: 10, background: Z.viL, borderRadius: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: Z.vi, marginBottom: 2 }}>SUCHT HILFE BEI</div>
                <div style={{ fontSize: 12, color: Z.g700 }}>{p.needs_help}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: Z.g50, borderRadius: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: Z.gn }}>{p.help_count}×</div>
                  <div style={{ fontSize: 9, color: Z.g400 }}>geholfen</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "6px 0", background: Z.g50, borderRadius: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: Z.bl }}>{p.dept}</div>
                  <div style={{ fontSize: 9, color: Z.g400 }}>Department</div>
                </div>
              </div>
              {p.slack && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: Z.x, borderRadius: 8, textAlign: "center", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: Z.w }}>💬 {p.slack} auf Slack</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── DISCOVER ────────────────────────────────────────────────

function Discover() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const cities = ["all", "Köln", "Berlin", "München", "Hamburg", "Stuttgart", "Wien"];

  const filtered = DEMO_PROFILES.filter(p => {
    if (cityFilter !== "all" && p.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.building.toLowerCase().includes(q) ||
        p.can_help.toLowerCase().includes(q) || p.needs_help.toLowerCase().includes(q) ||
        p.offers.some(t => t.toLowerCase().includes(q)) || p.seeks.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (<div>
    {/* Search */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: Z.w, borderRadius: 12, padding: "10px 14px", border: `1px solid ${Z.g200}`, marginBottom: 12 }}>
      <span style={{ color: Z.g400, fontSize: 14 }}>🔍</span>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche nach Skills, Projekten, Personen..." style={{ border: "none", outline: "none", flex: 1, fontSize: 13, color: Z.x, background: "transparent", fontFamily: "inherit" }} />
    </div>

    {/* City Filter */}
    <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
      {cities.map(c => <Pill key={c} active={cityFilter === c} onClick={() => setCityFilter(c)}>{c === "all" ? "Alle Städte" : c}</Pill>)}
    </div>

    {/* Legend */}
    <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 11, color: Z.g400 }}>
      <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: Z.gn + "30", marginRight: 4 }} />bietet an</span>
      <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: Z.vi + "30", marginRight: 4 }} />sucht</span>
      <span style={{ marginLeft: "auto" }}>{filtered.length} Mitglieder</span>
    </div>

    {/* Profiles */}
    {filtered.map((p, i) => <ProfileCard key={p.id} p={p} i={i} />)}

    {filtered.length === 0 && (
      <div style={{ textAlign: "center", padding: 40, color: Z.g400, fontSize: 13 }}>
        Keine Ergebnisse für "{search}". Probier andere Begriffe.
      </div>
    )}
  </div>);
}

// ─── PROJECTS ────────────────────────────────────────────────

function Projects() {
  return (<div>
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 4px" }}>Projekt-Board</h3>
      <p style={{ fontSize: 12, color: Z.g400, margin: 0 }}>Finde Mitstreiter oder biete deine Skills an.</p>
    </div>

    {DEMO_PROJECTS.map(p => (
      <Card key={p.id}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Badge c={p.status === "open" ? Z.gn : Z.am}>{p.status === "open" ? "OFFEN" : "IN ARBEIT"}</Badge>
          <span style={{ fontSize: 11, color: Z.g400 }}>{p.user}</span>
          <span style={{ fontSize: 11, color: Z.g400, marginLeft: "auto" }}>{p.interests} interessiert</span>
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 6px" }}>{p.title}</h4>
        <p style={{ fontSize: 12.5, color: Z.g500, margin: "0 0 8px", lineHeight: 1.5 }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: Z.g400, marginRight: 4 }}>Sucht:</span>
          {p.seeking.map((s, i) => <Badge key={i} c={Z.vi}>{s}</Badge>)}
        </div>
      </Card>
    ))}

    <div style={{ padding: "14px 18px", background: Z.blL, borderRadius: 12, border: `1px solid ${Z.bl}20`, textAlign: "center", cursor: "pointer", marginTop: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: Z.bl }}>+ Eigenes Projekt posten</span>
    </div>
  </div>);
}

// ─── SHOW & TELL ─────────────────────────────────────────────

function ShowTell() {
  return (<div>
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 4px" }}>Show & Tell</h3>
      <p style={{ fontSize: 12, color: Z.g400, margin: 0 }}>Zeig was du gebaut hast. Bekomm Feedback. Kein Like-Button — nur Substanz.</p>
    </div>

    {DEMO_SHOWS.map(s => (
      <Card key={s.id}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Badge c={Z.am}>SHOW & TELL</Badge>
          <span style={{ fontSize: 11, color: Z.g400 }}>{s.user} · {s.time}</span>
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 4px" }}>{s.title}</h4>
        <p style={{ fontSize: 12.5, color: Z.g500, margin: "0 0 8px", lineHeight: 1.5 }}>{s.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: Z.g400 }}>💬 {s.comments} Kommentare</span>
          <span style={{ fontSize: 12, color: Z.gn, fontWeight: 600, marginLeft: "auto", cursor: "pointer" }}>Feedback geben →</span>
        </div>
      </Card>
    ))}
  </div>);
}

// ─── MY PROFILE ──────────────────────────────────────────────

function MyProfile() {
  const [name, setName] = useState("Tom F.");
  const [city, setCity] = useState("Köln");
  const [building, setBuilding] = useState("AI-Lernplattform mit Sprint-System");
  const [canHelp, setCanHelp] = useState("Supabase, n8n, Prompt Engineering, React PWA");
  const [needsHelp, setNeedsHelp] = useState("pgvector / RAG, Marketing, UI-Feedback");
  const [slack, setSlack] = useState("@tom_f");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${Z.g200}`, fontSize: 13, color: Z.x, fontFamily: "inherit", outline: "none", background: Z.w };
  const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4, display: "block" };

  return (<div>
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 4px" }}>Mein Profil</h3>
      <p style={{ fontSize: 12, color: Z.g400, margin: 0 }}>So sehen andere dich. Kein CV — nur was zählt.</p>
    </div>

    <Card>
      {/* Avatar + Name */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${Z.bl}, ${Z.vi})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
          {name.split(" ").map(n => n[0]).join("")}
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ ...labelStyle, color: Z.g500 }}>ANZEIGENAME</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Vorname + Initial" />
        </div>
      </div>

      {/* City */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ ...labelStyle, color: Z.g500 }}>STADT</label>
        <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} placeholder="z.B. Köln" />
      </div>

      {/* Building */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ ...labelStyle, color: Z.bl }}>WAS ICH BAUE</label>
        <input value={building} onChange={e => setBuilding(e.target.value.slice(0, 140))} style={{ ...inputStyle, borderColor: Z.bl + "40" }} placeholder="Max. 140 Zeichen" />
        <div style={{ fontSize: 10, color: Z.g400, textAlign: "right", marginTop: 2 }}>{building.length}/140</div>
      </div>

      {/* Can help */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ ...labelStyle, color: Z.gn }}>KANN HELFEN BEI</label>
        <input value={canHelp} onChange={e => setCanHelp(e.target.value)} style={{ ...inputStyle, borderColor: Z.gn + "40" }} placeholder="Skills die du anbieten kannst" />
      </div>

      {/* Needs help */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ ...labelStyle, color: Z.vi }}>SUCHE UNTERSTÜTZUNG BEI</label>
        <input value={needsHelp} onChange={e => setNeedsHelp(e.target.value)} style={{ ...inputStyle, borderColor: Z.vi + "40" }} placeholder="Skills die du suchst" />
      </div>

      {/* Slack */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ ...labelStyle, color: Z.g500 }}>SLACK-HANDLE</label>
        <input value={slack} onChange={e => setSlack(e.target.value)} style={inputStyle} placeholder="@dein_name" />
      </div>

      {/* Save */}
      <button onClick={save} style={{
        width: "100%", padding: "12px", borderRadius: 10, border: "none",
        background: saved ? Z.gn : Z.x, color: Z.w, fontSize: 14, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
      }}>
        {saved ? "✓ Gespeichert" : "Profil speichern"}
      </button>
    </Card>

    {/* Preview */}
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: Z.g400, letterSpacing: "0.04em", marginBottom: 8 }}>VORSCHAU</div>
      <ProfileCard p={{
        id: "me", name, city, building, can_help: canHelp, needs_help: needsHelp,
        slack, help_count: 0, level: "B2", dept: "App Lab",
        offers: canHelp.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3),
        seeks: needsHelp.split(",").map(s => s.trim()).filter(Boolean).slice(0, 2),
      }} i={0} />
    </div>
  </div>);
}

// ═══ MAIN ════════════════════════════════════════════════════

const PAGES = { discover: Discover, projects: Projects, show: ShowTell, profile: MyProfile };

export default function NetworkTab({ supabase }) {
  const [sub, setSub] = useState("discover");
  const Page = PAGES[sub];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: 0, letterSpacing: "-0.03em" }}>
            ZEHN<span style={{ color: Z.bl }}>X</span> Connect
          </h2>
          <Badge c={Z.gn}>NEU</Badge>
        </div>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>Vernetzen · Zusammenarbeiten · Profitieren</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {SUB.map(t => <Pill key={t.id} active={sub === t.id} onClick={() => setSub(t.id)}>{t.l}</Pill>)}
      </div>

      <Page />
    </div>
  );
}
