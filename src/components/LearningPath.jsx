import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX LEARNING PATH — Visueller Lernpfad
// Stationsweise Sprint-Roadmap im Profil
// Apple-clean, keine Kitsch-Gamification
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  green: "#059669", greenLight: "#ECFDF5", violet: "#7C3AED",
  amber: "#D97706", dark: "#0F172A",
};

const LEVEL_COLORS = {
  A1: "#059669", A2: "#2563EB", B1: "#D97706",
  B2: "#7C3AED", C1: "#DB2777", C2: "#DC2626",
};

const STATUS_STYLES = {
  completed: { bg: Z.green, border: Z.green, text: "#fff", icon: "✓", line: Z.green },
  active:    { bg: Z.blue, border: Z.blue, text: "#fff", icon: "▶", line: Z.blue },
  locked:    { bg: Z.borderLight, border: Z.border, text: Z.hint, icon: "·", line: Z.border },
};


// ═══ SPRINT STATION ═══

function SprintStation({ step, index, isLast, onStart, expanded, onToggle }) {
  const st = STATUS_STYLES[step.status];
  const levelColor = LEVEL_COLORS[step.level] || Z.muted;

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* Timeline Column */}
      <div style={{ width: 48, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        {/* Node */}
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: st.bg, border: `2px solid ${st.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: step.status === "completed" ? 16 : 14,
          fontWeight: 700, color: st.text,
          transition: "all 0.3s",
          boxShadow: step.status === "active" ? `0 0 0 4px ${Z.blue}20` : "none",
        }}>
          {step.status === "completed" ? "✓" : step.status === "active" ? (index + 1) : (index + 1)}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 20,
            background: step.status === "completed" ? Z.green : Z.border,
            transition: "background 0.3s",
          }} />
        )}
      </div>

      {/* Content Column */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 8 }}>
        <button onClick={onToggle} style={{
          width: "100%", textAlign: "left", border: `1px solid ${step.status === "active" ? Z.blue + "40" : Z.border}`,
          borderRadius: 14, padding: "14px 16px",
          background: step.status === "active" ? Z.blueLight : Z.surface,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.15s",
          opacity: step.status === "locked" ? 0.6 : 1,
          marginBottom: 4,
        }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                background: levelColor + "15", color: levelColor,
              }}>{step.level}</span>
              <span style={{ fontSize: 11, color: Z.hint }}>{step.department}</span>
            </div>
            {step.status === "completed" && step.completedAt && (
              <span style={{ fontSize: 10, color: Z.green }}>
                {new Date(step.completedAt).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
              </span>
            )}
            {step.status === "active" && (
              <span style={{ fontSize: 10, fontWeight: 700, color: Z.blue }}>AKTIV</span>
            )}
            {step.status === "locked" && (
              <span style={{ fontSize: 12, color: Z.hint }}>🔒</span>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: step.status === "locked" ? Z.hint : Z.text,
          }}>{step.title}</div>

          {/* Description */}
          {step.description && (
            <div style={{ fontSize: 12, color: Z.muted, marginTop: 2, lineHeight: 1.4 }}>
              {step.description}
            </div>
          )}
        </button>

        {/* Expanded: Skill Preview */}
        {expanded && step.skills && step.skills.length > 0 && (
          <div style={{
            padding: "10px 16px", borderRadius: 12,
            background: Z.borderLight, marginBottom: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: Z.muted, letterSpacing: "0.04em", marginBottom: 6 }}>
              SKILLS DIE DIESER SPRINT VERBESSERT
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {step.skills.map(sk => (
                <span key={sk.name} style={{
                  fontSize: 11, padding: "3px 9px", borderRadius: 8,
                  background: Z.surface, border: `1px solid ${Z.border}`,
                  color: Z.text, fontWeight: 500,
                }}>
                  {sk.name} <span style={{ color: Z.blue, fontWeight: 700 }}>+{sk.points}</span>
                </span>
              ))}
            </div>
            {step.status === "active" && onStart && (
              <button onClick={(e) => { e.stopPropagation(); onStart(step.sprintId); }} style={{
                marginTop: 10, width: "100%", padding: "10px", borderRadius: 10,
                background: Z.blue, color: "#fff", border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Sprint starten →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ═══ PROGRESS SUMMARY ═══

function ProgressSummary({ steps }) {
  const completed = steps.filter(s => s.status === "completed").length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeStep = steps.find(s => s.status === "active");

  return (
    <div style={{
      background: Z.surface, borderRadius: 16, border: `1px solid ${Z.border}`,
      padding: 20, marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: Z.text }}>Lernpfad-Fortschritt</div>
          <div style={{ fontSize: 12, color: Z.muted, marginTop: 2 }}>
            {completed} von {total} Sprints abgeschlossen
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: pct === 100 ? Z.green : Z.blue, letterSpacing: "-0.03em" }}>
          {pct}%
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 4, background: Z.borderLight, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: pct === 100 ? Z.green : Z.blue,
          width: `${pct}%`,
          transition: "width 0.6s ease",
        }} />
      </div>

      {activeStep && (
        <div style={{ marginTop: 10, fontSize: 12, color: Z.blue, fontWeight: 600 }}>
          Aktuell: {activeStep.title}
        </div>
      )}
    </div>
  );
}


// ═══ MAIN: LEARNING PATH ═══

export default function LearningPath({ steps: propSteps, onStartSprint, pathName }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Demo data if no props
  const steps = propSteps || [
    { sprintId: "chatgpt-101", title: "ChatGPT richtig nutzen", level: "A1", department: "Conversational AI", status: "completed", completedAt: "2026-03-15", description: "Das volle Potenzial von ChatGPT entdecken.", skills: [{ name: "ChatGPT", points: 20 }, { name: "Prompt Engineering", points: 10 }, { name: "AI-Tools", points: 10 }] },
    { sprintId: "prompt-201", title: "Prompt Engineering Grundlagen", level: "A2", department: "Content Factory", status: "completed", completedAt: "2026-03-20", description: "Die Kunst der richtigen Frage.", skills: [{ name: "Prompt Engineering", points: 20 }, { name: "Copywriting", points: 5 }] },
    { sprintId: "vibe-coding-201", title: "Vibe Coding", level: "A2", department: "App Lab", status: "active", description: "Apps bauen durch Beschreiben.", skills: [{ name: "Vibe Coding", points: 20 }, { name: "HTML & CSS", points: 10 }, { name: "JavaScript", points: 5 }] },
    { sprintId: "react-301", title: "React Grundlagen", level: "B1", department: "App Lab", status: "locked", description: "Components, State, Hooks.", skills: [{ name: "React", points: 20 }, { name: "JavaScript", points: 15 }] },
    { sprintId: "supabase-301", title: "Supabase & Datenbanken", level: "B1", department: "App Lab", status: "locked", description: "Auth, Database, RLS.", skills: [{ name: "Supabase", points: 20 }, { name: "SQL", points: 15 }] },
    { sprintId: "claude-code-301", title: "Claude Code", level: "B1", department: "App Lab", status: "locked", description: "Terminal-first AI Coding.", skills: [{ name: "Claude Code", points: 20 }, { name: "Claude", points: 10 }] },
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.violet, letterSpacing: "0.06em" }}>LERNPFAD</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em", margin: "4px 0 0" }}>
          {pathName || "Mein Studienplan"}
        </h2>
      </div>

      {/* Progress Summary */}
      <ProgressSummary steps={steps} />

      {/* Sprint Stations */}
      <div>
        {steps.map((step, i) => (
          <SprintStation
            key={step.sprintId}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
            onStart={onStartSprint}
            expanded={expandedIndex === i}
            onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
          />
        ))}
      </div>

      {/* Completion State */}
      {steps.every(s => s.status === "completed") && (
        <div style={{
          textAlign: "center", padding: 24, marginTop: 16,
          background: Z.greenLight, borderRadius: 16,
          border: `1px solid ${Z.green}20`,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: Z.green }}>Lernpfad abgeschlossen!</div>
          <div style={{ fontSize: 13, color: "#065F46", marginTop: 4 }}>
            Alle {steps.length} Sprints geschafft. Hol dir dein Skill-Zertifikat im Profil.
          </div>
        </div>
      )}
    </div>
  );
}
