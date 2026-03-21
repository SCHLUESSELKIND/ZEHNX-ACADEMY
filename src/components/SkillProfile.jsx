import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX SKILL PROFILE — X-Score + Skill Tracking + Zertifikat
// Apple-clean, ADHD-friendly, tagesaktuell
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  green: "#059669", greenLight: "#ECFDF5", violet: "#7C3AED",
  amber: "#D97706", dark: "#0F172A",
};

const LEVELS = [
  { id: "A1", min: 0, max: 19, label: "Einsteiger", color: "#059669" },
  { id: "A2", min: 20, max: 39, label: "Grundlagen", color: "#2563EB" },
  { id: "B1", min: 40, max: 59, label: "Fortgeschritten", color: "#D97706" },
  { id: "B2", min: 60, max: 79, label: "Advanced", color: "#7C3AED" },
  { id: "C1", min: 80, max: 94, label: "Experte", color: "#DB2777" },
  { id: "C2", min: 95, max: 999, label: "Meister", color: "#DC2626" },
];

function getLevel(points) {
  return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
}

function getOverallLevel(categories) {
  if (!categories.length) return LEVELS[0];
  const avg = categories.reduce((s, c) => s + c.avgPoints, 0) / categories.length;
  return getLevel(Math.round(avg));
}

// ═══ RADAR CHART (SVG, no dependencies) ═══

function RadarChart({ categories, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = categories.length;
  if (n === 0) return null;

  const angleStep = (2 * Math.PI) / n;
  const maxPoints = 100;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];
  const ringLabels = ["A1", "A2", "B1", "C1"];

  // Data points
  const points = categories.map((cat, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const pct = Math.min(cat.avgPoints / maxPoints, 1);
    return {
      x: cx + Math.cos(angle) * r * pct,
      y: cy + Math.sin(angle) * r * pct,
      labelX: cx + Math.cos(angle) * (r + 24),
      labelY: cy + Math.sin(angle) * (r + 24),
      axisX: cx + Math.cos(angle) * r,
      axisY: cy + Math.sin(angle) * r,
      ...cat,
    };
  });

  const dataPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      {/* Grid rings */}
      {rings.map((ring, i) => (
        <polygon key={i} fill="none" stroke={Z.border} strokeWidth="0.75"
          points={Array.from({ length: n }, (_, j) => {
            const a = j * angleStep - Math.PI / 2;
            return `${cx + Math.cos(a) * r * ring},${cy + Math.sin(a) * r * ring}`;
          }).join(" ")} />
      ))}
      {/* Ring labels */}
      {rings.map((ring, i) => (
        <text key={`rl${i}`} x={cx + 4} y={cy - r * ring + 4} fontSize="8" fill={Z.hint} fontFamily="inherit">{ringLabels[i]}</text>
      ))}
      {/* Axis lines */}
      {points.map((p, i) => (
        <line key={`ax${i}`} x1={cx} y1={cy} x2={p.axisX} y2={p.axisY} stroke={Z.borderLight} strokeWidth="0.75" />
      ))}
      {/* Data fill */}
      <polygon fill={`${Z.blue}15`} stroke={Z.blue} strokeWidth="2" points={points.map(p => `${p.x},${p.y}`).join(" ")} />
      {/* Data dots */}
      {points.map((p, i) => (
        <circle key={`dot${i}`} cx={p.x} cy={p.y} r="4" fill={Z.blue} stroke="#fff" strokeWidth="2" />
      ))}
      {/* Labels */}
      {points.map((p, i) => (
        <text key={`lb${i}`} x={p.labelX} y={p.labelY} fontSize="10" fontWeight="600" fill={Z.text}
          textAnchor={p.labelX > cx + 10 ? "start" : p.labelX < cx - 10 ? "end" : "middle"}
          dominantBaseline="central" fontFamily="inherit">
          {p.shortName}
        </text>
      ))}
    </svg>
  );
}


// ═══ SKILL BAR ═══

function SkillBar({ name, points, level }) {
  const lv = getLevel(points);
  const nextLv = LEVELS[LEVELS.indexOf(lv) + 1];
  const pct = nextLv
    ? ((points - lv.min) / (nextLv.min - lv.min)) * 100
    : 100;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: Z.text }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: Z.hint }}>{points} Pkt</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
            background: lv.color + "15", color: lv.color,
          }}>{lv.id}</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: Z.borderLight, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: lv.color,
          width: `${Math.min(pct, 100)}%`,
          transition: "width 0.6s ease",
        }} />
      </div>
      {nextLv && (
        <div style={{ fontSize: 10, color: Z.hint, marginTop: 2, textAlign: "right" }}>
          {nextLv.min - points} Pkt bis {nextLv.id}
        </div>
      )}
    </div>
  );
}


// ═══ CATEGORY CARD ═══

function CategoryCard({ cat, skills, expanded, onToggle }) {
  const lv = getLevel(Math.round(cat.avgPoints));
  return (
    <div style={{
      background: Z.surface, borderRadius: 16, border: `1px solid ${Z.border}`,
      overflow: "hidden", marginBottom: 10,
    }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "14px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{cat.icon}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: Z.text }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: Z.hint }}>{skills.length} Skills</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
            background: lv.color + "15", color: lv.color,
          }}>{lv.id}</span>
          <span style={{ fontSize: 14, color: Z.hint, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>
      </button>
      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          {skills.map(s => (
            <SkillBar key={s.id} name={s.name} points={s.points} />
          ))}
        </div>
      )}
    </div>
  );
}


// ═══ CERTIFICATE (print-ready) ═══

function Certificate({ user, categories, skills, overallLevel }) {
  return (
    <div id="zehnx-certificate" style={{
      width: 800, padding: 60, background: "#fff",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      border: `2px solid ${Z.border}`, borderRadius: 24,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: Z.text }}>
            zehn<span style={{ color: Z.blue, fontWeight: 900 }}>x</span>
          </span>
          <span style={{ fontSize: 14, color: Z.hint, marginLeft: 8 }}>academy</span>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: Z.hint }}>
          <div>Skill-Zertifikat</div>
          <div>{new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      {/* User + Overall Score */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 16, color: Z.muted, marginBottom: 4 }}>Skill-Profil von</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em" }}>
          {user?.display_name || user?.email || "Lernende/r"}
        </div>
        <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 14, background: overallLevel.color + "10", border: `2px solid ${overallLevel.color}30` }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: overallLevel.color }}>{overallLevel.id}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: overallLevel.color }}>{overallLevel.label}</div>
            <div style={{ fontSize: 11, color: Z.muted }}>Gesamt X-Score</div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {categories.map(cat => {
          const lv = getLevel(Math.round(cat.avgPoints));
          return (
            <div key={cat.id} style={{ padding: 16, borderRadius: 12, border: `1px solid ${Z.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: Z.text }}>{cat.icon} {cat.name}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, background: lv.color + "15", padding: "2px 8px", borderRadius: 5 }}>{lv.id}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: Z.borderLight, marginTop: 8 }}>
                <div style={{ height: "100%", borderRadius: 2, background: lv.color, width: `${Math.min((cat.avgPoints / 100) * 100, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Skills */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: Z.text, marginBottom: 10 }}>Top Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {skills.filter(s => s.points > 0).sort((a, b) => b.points - a.points).slice(0, 12).map(s => {
            const lv = getLevel(s.points);
            return (
              <span key={s.id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: Z.borderLight, color: Z.text, fontWeight: 600 }}>
                {s.name} <span style={{ color: lv.color, fontWeight: 700 }}>{lv.id}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${Z.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 10, color: Z.hint }}>
        <span>ZEHNX Academy · Koeln · zehnx.me</span>
        <span>zehnx.de</span>
      </div>
    </div>
  );
}


// ═══ MAIN: SKILL PROFILE ═══

export default function SkillProfile({ user, supabase }) {
  const [tab, setTab] = useState("xscore");
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);
  const [showCert, setShowCert] = useState(false);

  // DEMO DATA (replace with Supabase queries when Auth is live)
  useEffect(() => {
    // In production: fetch from supabase user_skills_with_level view
    // For now: demo data
    const demoCategories = [
      { id: "prompting", name: "Prompting", icon: "💬", shortName: "Prompting", avgPoints: 35 },
      { id: "development", name: "Development", icon: "◆", shortName: "Dev", avgPoints: 22 },
      { id: "automation", name: "Automation", icon: "⚡", shortName: "Auto", avgPoints: 18 },
      { id: "content", name: "Content", icon: "✏", shortName: "Content", avgPoints: 42 },
      { id: "data", name: "Data", icon: "◉", shortName: "Data", avgPoints: 12 },
      { id: "business", name: "Business", icon: "◈", shortName: "Biz", avgPoints: 28 },
      { id: "security", name: "Security", icon: "⊕", shortName: "Sec", avgPoints: 15 },
      { id: "leadership", name: "Leadership", icon: "★", shortName: "Lead", avgPoints: 8 },
    ];
    const demoSkills = [
      { id: "chatgpt", name: "ChatGPT", categoryId: "prompting", points: 40 },
      { id: "prompt-engineering", name: "Prompt Engineering", categoryId: "prompting", points: 35 },
      { id: "claude", name: "Claude", categoryId: "prompting", points: 30 },
      { id: "react", name: "React", categoryId: "development", points: 25 },
      { id: "supabase", name: "Supabase", categoryId: "development", points: 20 },
      { id: "vibe-coding", name: "Vibe Coding", categoryId: "development", points: 20 },
      { id: "n8n", name: "n8n", categoryId: "automation", points: 25 },
      { id: "zapier-make", name: "Zapier & Make", categoryId: "automation", points: 15 },
      { id: "copywriting", name: "Copywriting", categoryId: "content", points: 45 },
      { id: "seo", name: "SEO", categoryId: "content", points: 40 },
      { id: "social-media", name: "Social Media", categoryId: "content", points: 42 },
      { id: "business-model", name: "Geschaeftsmodelle", categoryId: "business", points: 30 },
      { id: "growth", name: "Growth", categoryId: "business", points: 25 },
      { id: "dsgvo", name: "DSGVO", categoryId: "security", points: 20 },
      { id: "cyber-security", name: "Cyber Security", categoryId: "security", points: 10 },
    ];
    setCategories(demoCategories);
    setSkills(demoSkills);
  }, []);

  const overallLevel = getOverallLevel(categories);
  const totalPoints = skills.reduce((s, sk) => s + sk.points, 0);
  const completedSprints = Math.floor(totalPoints / 40); // rough estimate

  const TABS = [
    { id: "xscore", label: "X-Score" },
    { id: "skills", label: "Skills" },
    { id: "zertifikat", label: "Zertifikat" },
  ];

  const printCertificate = () => {
    const el = document.getElementById("zehnx-certificate");
    if (!el) return;
    const w = window.open("", "", "width=900,height=700");
    w.document.write(`<html><head><title>ZEHNX Skill-Zertifikat</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>*{margin:0;box-sizing:border-box}body{padding:20px;font-family:'Plus Jakarta Sans',sans-serif}</style>
    </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.blue, letterSpacing: "0.06em", marginBottom: 6 }}>DEIN PROFIL</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em", margin: 0 }}>
          Skill-Profil
        </h1>
        <div style={{ fontSize: 13, color: Z.muted, marginTop: 4 }}>{user?.display_name || "Lernende/r"}</div>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        <div style={{ background: overallLevel.color + "10", borderRadius: 14, padding: 16, textAlign: "center", border: `1px solid ${overallLevel.color}20` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: overallLevel.color, letterSpacing: "-0.03em" }}>{overallLevel.id}</div>
          <div style={{ fontSize: 11, color: Z.muted, fontWeight: 500 }}>X-Score Level</div>
        </div>
        <div style={{ background: Z.surface, borderRadius: 14, padding: 16, textAlign: "center", border: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em" }}>{totalPoints}</div>
          <div style={{ fontSize: 11, color: Z.muted, fontWeight: 500 }}>Skill-Punkte</div>
        </div>
        <div style={{ background: Z.surface, borderRadius: 14, padding: 16, textAlign: "center", border: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em" }}>{completedSprints}</div>
          <div style={{ fontSize: 11, color: Z.muted, fontWeight: 500 }}>Sprints</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${Z.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setShowCert(t.id === "zertifikat"); }} style={{
            padding: "10px 20px", border: "none", background: "none",
            borderBottom: tab === t.id ? `2px solid ${Z.blue}` : "2px solid transparent",
            color: tab === t.id ? Z.blue : Z.hint,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══ TAB: X-SCORE ═══ */}
      {tab === "xscore" && (
        <div>
          {/* Radar */}
          <div style={{ background: Z.surface, borderRadius: 20, border: `1px solid ${Z.border}`, padding: 20, marginBottom: 16 }}>
            <RadarChart categories={categories.map(c => ({ ...c, shortName: c.shortName || c.name.slice(0, 6) }))} />
          </div>

          {/* Category breakdown */}
          <div style={{ fontSize: 12, fontWeight: 700, color: Z.muted, letterSpacing: "0.04em", marginBottom: 10 }}>8 DIMENSIONEN</div>
          {categories.map(cat => {
            const lv = getLevel(Math.round(cat.avgPoints));
            return (
              <div key={cat.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 12, marginBottom: 6,
                background: Z.surface, border: `1px solid ${Z.border}`,
              }}>
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: Z.text }}>{cat.name}</div>
                  <div style={{ height: 4, borderRadius: 2, background: Z.borderLight, marginTop: 4 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: lv.color, width: `${Math.min((cat.avgPoints / 100) * 100, 100)}%`, transition: "width 0.5s" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, background: lv.color + "15", padding: "3px 8px", borderRadius: 6 }}>{lv.id}</span>
                <span style={{ fontSize: 11, color: Z.hint, width: 32, textAlign: "right" }}>{Math.round(cat.avgPoints)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ TAB: SKILLS ═══ */}
      {tab === "skills" && (
        <div>
          {categories.map(cat => {
            const catSkills = skills.filter(s => s.categoryId === cat.id).sort((a, b) => b.points - a.points);
            if (catSkills.length === 0) return null;
            return (
              <CategoryCard
                key={cat.id}
                cat={cat}
                skills={catSkills}
                expanded={expandedCat === cat.id}
                onToggle={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              />
            );
          })}
        </div>
      )}

      {/* ═══ TAB: ZERTIFIKAT ═══ */}
      {tab === "zertifikat" && (
        <div>
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <button onClick={printCertificate} style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: Z.dark, color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>Als PDF drucken / speichern</button>
          </div>
          <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
            <Certificate user={user} categories={categories} skills={skills} overallLevel={overallLevel} />
          </div>
        </div>
      )}
    </div>
  );
}
