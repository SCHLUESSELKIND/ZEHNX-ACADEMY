import { useState, useEffect, useMemo } from "react";
import SprintRunner from "./SprintRunner";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF", pk: "#DB2777", pkL: "#FDF2F8",
  cy: "#0891B2", cyL: "#ECFEFF",
};

const SUPABASE_URL = "";
const SUPABASE_KEY = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlIiwgImlhdCI6IDE3NzQwMDEzNzksICJleHAiOiAyMDg5MzYxMzc5fQ.bGDw2JlrI7NnS4BHiM6OeZxApMXVuuwGFbc-youUHlk";

const LEVEL_COLORS = {
  A1: { c: Z.gn, bg: Z.gnL, label: "Einsteiger" },
  A2: { c: Z.bl, bg: Z.blL, label: "Grundlagen" },
  B1: { c: Z.am, bg: Z.amL, label: "Fortgeschritten" },
  B2: { c: Z.vi, bg: Z.viL, label: "Advanced" },
  C1: { c: Z.pk, bg: Z.pkL, label: "Experte" },
  C2: { c: Z.rd, bg: Z.rdL, label: "Meister" },
};

const DEPT_ICONS = {
  "Content Factory": "✏️", "App Lab": "💻", "Automation HQ": "⚡",
  "Business School": "📊", "AI Selbstschutz": "🛡️", "Data Intelligence": "📈",
  "Conversational AI": "💬", "Design Studio": "🎨", "Marketing Lab": "📣",
  "HR & People": "👥", "Legal & Compliance": "⚖️", "AI Engineering": "🔧",
  "Vertical AI": "🏢", "Creator Economy": "🎬",
};

function Badge({ children, c = Z.bl, bg: b }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: b || (c + "14"), color: c }}>{children}</span>;
}

// ═══ Sprint Card ═══════════════════════════════════════════════

function SprintCard({ sprint, onClick }) {
  const lv = LEVEL_COLORS[sprint.level] || LEVEL_COLORS.A1;
  const icon = DEPT_ICONS[sprint.department] || "📚";
  const hasContent = sprint.has_content;

  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left",
      background: Z.w, borderRadius: 14, padding: 16,
      border: `1px solid ${Z.g200}`, marginBottom: 8,
      cursor: "pointer", fontFamily: "inherit",
      transition: "all 0.15s", position: "relative",
    }}>
      {sprint.is_free && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <Badge c={Z.gn} bg={Z.gnL}>GRATIS</Badge>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: lv.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <Badge c={lv.c} bg={lv.bg}>{sprint.level}</Badge>
            <span style={{ fontSize: 10, color: Z.g400 }}>{sprint.department}</span>
            {hasContent && <span style={{ fontSize: 10, color: Z.gn }}>● Content</span>}
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 4px", lineHeight: 1.3 }}>{sprint.title}</h3>
          {sprint.description && (
            <p style={{ fontSize: 12, color: Z.g500, margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {sprint.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <span style={{ fontSize: 10, color: Z.g400 }}>📅 {sprint.duration_days} Tage</span>
            <span style={{ fontSize: 10, color: Z.g400 }}>📖 {sprint.total_lessons} Lektionen</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ═══ Main Catalog ══════════════════════════════════════════════

export default function SprintCatalog() {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [activeSprint, setActiveSprint] = useState(null);
  const [activeSprintData, setActiveSprintData] = useState(null);

  // Fetch sprints from Supabase
  useEffect(() => {
    async function fetchSprints() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/sprints?is_published=eq.true&order=level.asc,sort_order.asc&select=*`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // Check which sprints have content
        const lessonsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/sprint_lessons?content_markdown=not.is.null&select=sprint_id`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const lessonsData = lessonsRes.ok ? await lessonsRes.json() : [];
        const contentSprints = new Set(lessonsData.map(l => l.sprint_id));

        setSprints(data.map(s => ({ ...s, has_content: contentSprints.has(s.id) })));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSprints();
  }, []);

  // Fetch sprint details when selected
  useEffect(() => {
    if (!activeSprint) { setActiveSprintData(null); return; }
    async function fetchDetails() {
      try {
        // Fetch lessons
        const lessonsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/sprint_lessons?sprint_id=eq.${activeSprint}&order=day_number.asc&select=*`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const lessons = lessonsRes.ok ? await lessonsRes.json() : [];

        // Fetch quizzes for each lesson
        const lessonIds = lessons.map(l => l.id);
        let quizzes = [];
        if (lessonIds.length > 0) {
          const quizRes = await fetch(
            `${SUPABASE_URL}/rest/v1/quiz_questions?lesson_id=in.(${lessonIds.join(",")})&order=sort_order.asc&select=*`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
          );
          quizzes = quizRes.ok ? await quizRes.json() : [];
        }

        // Find the sprint
        const sprint = sprints.find(s => s.id === activeSprint);

        // Assemble sprint data for SprintRunner
        setActiveSprintData({
          ...sprint,
          lessons: lessons.map(l => ({
            id: l.id,
            day: l.day_number,
            title: l.title,
            subtitle: l.subtitle,
            type: l.content_type || "mixed",
            minutes: l.estimated_minutes || 30,
            content: l.content_markdown || `# ${l.title}\n\nContent wird gerade erstellt. Schau bald wieder vorbei!`,
            quiz: quizzes
              .filter(q => q.lesson_id === l.id)
              .map(q => ({
                id: q.id,
                q: q.question,
                type: q.question_type || "single",
                opts: (q.options || []).map(o => ({ t: o.text, ok: o.correct })),
                explain: q.explanation,
              })),
          })),
        });
      } catch (e) {
        console.error("Failed to fetch sprint details:", e);
      }
    }
    fetchDetails();
  }, [activeSprint, sprints]);

  // Derived data
  const departments = useMemo(() => [...new Set(sprints.map(s => s.department))].sort(), [sprints]);
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const filtered = useMemo(() => {
    return sprints.filter(s => {
      if (levelFilter !== "all" && s.level !== levelFilter) return false;
      if (deptFilter !== "all" && s.department !== deptFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.title.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [sprints, levelFilter, deptFilter, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(s => {
      if (!g[s.level]) g[s.level] = [];
      g[s.level].push(s);
    });
    return g;
  }, [filtered]);

  // ─── Sprint Runner View ────────────────────────────────

  if (activeSprint && activeSprintData) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 80px" }}>
        <button onClick={() => { setActiveSprint(null); setActiveSprintData(null); }} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 10, border: `1px solid ${Z.g200}`,
          background: Z.w, color: Z.g600, fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", marginBottom: 16,
        }}>
          ← Zurück zum Katalog
        </button>
        <SprintRunner sprintData={activeSprintData} />
      </div>
    );
  }

  // ─── Loading / Error ───────────────────────────────────

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
        <div style={{ fontSize: 14, color: Z.g500 }}>Sprint-Katalog wird geladen...</div>
      </div>
    );
  }

  // ─── Catalog View ──────────────────────────────────────

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: "0 0 4px", letterSpacing: "-0.03em" }}>
          Sprint-Katalog
        </h1>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>
          {sprints.length} Sprints · {sprints.reduce((a, s) => a + s.total_lessons, 0)} Lektionen · 6 Levels · {departments.length} Departments
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sprint suchen..."
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: `1px solid ${Z.g200}`, background: Z.w,
            fontSize: 14, color: Z.x, outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Level Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", paddingBottom: 4 }}>
        <button onClick={() => setLevelFilter("all")} style={{
          padding: "7px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
          background: levelFilter === "all" ? Z.x : Z.w, color: levelFilter === "all" ? Z.w : Z.g500,
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          boxShadow: levelFilter === "all" ? "none" : `0 0 0 1px ${Z.g200}`,
          fontFamily: "inherit",
        }}>Alle Levels</button>
        {levels.map(lv => {
          const c = LEVEL_COLORS[lv];
          const count = sprints.filter(s => s.level === lv).length;
          return (
            <button key={lv} onClick={() => setLevelFilter(lv === levelFilter ? "all" : lv)} style={{
              padding: "7px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
              background: levelFilter === lv ? c.bg : Z.w, color: levelFilter === lv ? c.c : Z.g400,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              boxShadow: levelFilter === lv ? "none" : `0 0 0 1px ${Z.g200}`,
              fontFamily: "inherit",
            }}>{lv} ({count})</button>
          );
        })}
      </div>

      {/* Department Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        <button onClick={() => setDeptFilter("all")} style={{
          padding: "6px 12px", borderRadius: 16, border: "none", whiteSpace: "nowrap",
          background: deptFilter === "all" ? Z.g800 : Z.g100, color: deptFilter === "all" ? Z.w : Z.g500,
          fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>Alle</button>
        {departments.map(d => (
          <button key={d} onClick={() => setDeptFilter(d === deptFilter ? "all" : d)} style={{
            padding: "6px 12px", borderRadius: 16, border: "none", whiteSpace: "nowrap",
            background: deptFilter === d ? Z.g800 : Z.g100, color: deptFilter === d ? Z.w : Z.g500,
            fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{DEPT_ICONS[d] || "📚"} {d}</button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 11, color: Z.g400, marginBottom: 12, fontWeight: 600 }}>
        {filtered.length} Sprint{filtered.length !== 1 ? "s" : ""} gefunden
        {search && ` für "${search}"`}
      </div>

      {/* Sprint List grouped by level */}
      {levels.map(lv => {
        const items = grouped[lv];
        if (!items || items.length === 0) return null;
        const c = LEVEL_COLORS[lv];
        return (
          <div key={lv} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Badge c={c.c} bg={c.bg}>{lv}</Badge>
              <span style={{ fontSize: 14, fontWeight: 700, color: Z.x }}>{c.label}</span>
              <span style={{ fontSize: 11, color: Z.g400 }}>({items.length})</span>
            </div>
            {items.map(s => (
              <SprintCard key={s.id} sprint={s} onClick={() => setActiveSprint(s.id)} />
            ))}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: Z.g400, fontSize: 14 }}>
          Keine Sprints gefunden. Versuch einen anderen Suchbegriff.
        </div>
      )}

      {error && (
        <div style={{ background: Z.amL, border: `1px solid ${Z.am}20`, borderRadius: 12, padding: 16, marginTop: 12 }}>
          <div style={{ fontSize: 12, color: Z.am, fontWeight: 600 }}>⚠️ Verbindung zu Supabase fehlgeschlagen</div>
          <div style={{ fontSize: 11, color: Z.g500, marginTop: 4 }}>{error}</div>
        </div>
      )}
    </div>
  );
}
