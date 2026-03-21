import { useState, useEffect } from "react";
import AITutor from "./AITutor";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF", pk: "#DB2777", cy: "#0891B2",
};

const SUPABASE_URL = "";
const SUPABASE_KEY = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlIiwgImlhdCI6IDE3NzQwMDEzNzksICJleHAiOiAyMDg5MzYxMzc5fQ.bGDw2JlrI7NnS4BHiM6OeZxApMXVuuwGFbc-youUHlk";
const SB_HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" };

function Badge({ children, c = Z.bl, bg: b }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: b || (c + "14"), color: c }}>{children}</span>;
}
function Card({ children, style: s }) {
  return <div style={{ background: Z.w, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}`, marginBottom: 10, ...s }}>{children}</div>;
}

function Md({ text }) {
  if (!text) return null;
  return (
    <div style={{ fontSize: 14, color: Z.g700, lineHeight: 1.8 }}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("# ")) return <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: Z.x, margin: "20px 0 10px" }}>{line.slice(2)}</h2>;
        if (line.startsWith("## ")) return <h3 key={i} style={{ fontSize: 17, fontWeight: 700, color: Z.x, margin: "16px 0 8px" }}>{line.slice(3)}</h3>;
        if (line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 16, margin: "4px 0" }}>• {line.slice(2)}</div>;
        if (/^\d+\.\s/.test(line)) return <div key={i} style={{ paddingLeft: 16, margin: "4px 0" }}>{line}</div>;
        if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
        if (line.includes("```") || line.startsWith("`")) return <code key={i} style={{ display: "block", background: Z.g100, padding: "8px 12px", borderRadius: 8, fontFamily: "monospace", fontSize: 12, margin: "6px 0", color: Z.g700, overflowX: "auto" }}>{line.replace(/`/g, "")}</code>;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        if (parts.length > 1) return <p key={i} style={{ margin: "4px 0" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: Z.x }}>{p}</strong> : p)}</p>;
        return <p key={i} style={{ margin: "4px 0" }}>{line}</p>;
      })}
    </div>
  );
}

function Quiz({ questions, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <Card style={{ background: Z.gnL, border: `1px solid ${Z.gn}20` }}>
        <div style={{ textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: Z.gn }}>Uebungs-Lektion — kein Quiz</div>
        </div>
      </Card>
    );
  }

  const q = questions[current];
  const isSubmitted = submitted[q.id];
  const allDone = Object.keys(submitted).length === questions.length;

  const handleSubmit = () => {
    const sel = selected[q.id];
    if (sel === undefined) return;
    let correct = q.type === "multi"
      ? q.opts.every((o, i) => o.ok === (sel || []).includes(i))
      : q.opts[sel]?.ok === true;
    setSubmitted(p => ({ ...p, [q.id]: { correct } }));
    if (correct) setScore(s => s + 1);
  };

  if (allDone) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card style={{ background: pct >= 70 ? Z.gnL : Z.amL }}>
        <div style={{ textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: pct >= 70 ? Z.gn : Z.am }}>{pct}%</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: Z.x }}>{pct >= 70 ? "Bestanden!" : "Knapp daneben"}</div>
          <p style={{ fontSize: 12, color: Z.g500, margin: "4px 0 12px" }}>{score}/{questions.length} richtig</p>
          <button onClick={() => onComplete(pct)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: Z.x, color: Z.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Lektion abschliessen →</button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Badge c={Z.vi}>QUIZ</Badge>
        <span style={{ fontSize: 11, color: Z.g400 }}>{current + 1}/{questions.length}</span>
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 700, color: Z.x, margin: "0 0 14px", lineHeight: 1.4 }}>{q.q}</h4>
      {q.opts.map((o, i) => {
        const isSel = q.type === "multi" ? (selected[q.id] || []).includes(i) : selected[q.id] === i;
        const show = isSubmitted;
        return (
          <button key={i} onClick={() => {
            if (show) return;
            if (q.type === "multi") setSelected(p => { const prev = p[q.id] || []; return { ...p, [q.id]: prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i] }; });
            else setSelected(p => ({ ...p, [q.id]: i }));
          }} style={{
            display: "block", width: "100%", textAlign: "left", padding: "12px 14px", marginBottom: 6,
            borderRadius: 10, fontSize: 13, color: Z.x, fontFamily: "inherit", transition: "all 0.15s",
            background: show ? (o.ok ? Z.gnL : isSel ? Z.rdL : Z.g50) : isSel ? Z.blL : Z.g50,
            border: `1px solid ${show ? (o.ok ? Z.gn + "40" : isSel ? Z.rd + "40" : Z.g200) : isSel ? Z.bl + "40" : Z.g200}`,
            cursor: show ? "default" : "pointer",
          }}>
            <span style={{ fontWeight: 600, color: Z.g400, marginRight: 8 }}>{String.fromCharCode(65 + i)}</span>{o.t}
            {show && o.ok && <span style={{ float: "right", color: Z.gn }}>✓</span>}
            {show && isSel && !o.ok && <span style={{ float: "right", color: Z.rd }}>✗</span>}
          </button>
        );
      })}
      {isSubmitted && q.explain && <div style={{ padding: 12, background: Z.blL, borderRadius: 10, marginTop: 8, fontSize: 13, color: Z.g700, lineHeight: 1.5 }}>💡 {q.explain}</div>}
      <div style={{ marginTop: 12 }}>
        {!isSubmitted ? (
          <button onClick={handleSubmit} disabled={selected[q.id] === undefined} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: selected[q.id] !== undefined ? Z.bl : Z.g200, color: selected[q.id] !== undefined ? Z.w : Z.g400, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Pruefen</button>
        ) : current < questions.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: Z.x, color: Z.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Weiter →</button>
        ) : (
          <button onClick={() => onComplete(Math.round((score + (submitted[q.id]?.correct ? 1 : 0)) / questions.length * 100))} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: Z.gn, color: Z.w, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Quiz abschliessen ✓</button>
        )}
      </div>
    </Card>
  );
}

function Certificate({ sprint, level, score }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${Z.g900}, #1a1a2e)`, borderRadius: 20, padding: 32, textAlign: "center", border: `2px solid ${Z.am}40`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${Z.bl}, ${Z.vi}, ${Z.am})` }} />
      <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.1em", marginBottom: 16 }}>ZEHNX ACADEMY ZERTIFIKAT</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#60A5FA", marginBottom: 6 }}>{sprint}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
        <div><span style={{ fontSize: 11, color: Z.g500 }}>Level</span><div style={{ fontSize: 16, fontWeight: 700, color: Z.w }}>{level}</div></div>
        <div><span style={{ fontSize: 11, color: Z.g500 }}>Score</span><div style={{ fontSize: 16, fontWeight: 700, color: Z.gn }}>{score}%</div></div>
        <div><span style={{ fontSize: 11, color: Z.g500 }}>Datum</span><div style={{ fontSize: 16, fontWeight: 700, color: Z.w }}>{new Date().toLocaleDateString("de-DE")}</div></div>
      </div>
    </div>
  );
}

// ═══ MAIN: Sprint Runner V2 ═════════════════════════════════

export default function SprintRunner({ sprintData }) {
  const sprint = sprintData;
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [sprintDone, setSprintDone] = useState(false);
  const [quizScores, setQuizScores] = useState({});
  const [startedAt, setStartedAt] = useState(null);

  // Load completion state from localStorage (Supabase when auth is ready)
  useEffect(() => {
    if (!sprint?.id) return;
    const saved = localStorage.getItem(`zehnx_sprint_${sprint.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedLessons(new Set(data.completed || []));
      setQuizScores(data.quizScores || {});
      setStartedAt(data.startedAt || new Date().toISOString());
      if (data.completed?.length >= (sprint.lessons?.length || 5)) {
        setSprintDone(true);
      }
    } else {
      setStartedAt(new Date().toISOString());
    }
  }, [sprint?.id]);

  // Save completion state
  const saveProgress = (completed, scores) => {
    if (!sprint?.id) return;
    const data = { completed: [...completed], quizScores: scores, startedAt };
    localStorage.setItem(`zehnx_sprint_${sprint.id}`, JSON.stringify(data));
  };

  // Drip Content: Check if lesson is accessible
  const isLessonAccessible = (lessonIndex) => {
    if (lessonIndex === 0) return true; // Day 1 always accessible
    // Previous lesson must be completed for next to unlock
    const prevLesson = sprint.lessons[lessonIndex - 1];
    return completedLessons.has(prevLesson?.id);
  };

  if (!sprint?.lessons?.length) return <Card style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 14, color: Z.g500 }}>Sprint wird geladen...</div></Card>;

  const lesson = sprint.lessons[activeLesson];
  const progress = Math.round((completedLessons.size / sprint.lessons.length) * 100);

  const completeLesson = (quizScore) => {
    const nc = new Set(completedLessons);
    nc.add(lesson.id);
    setCompletedLessons(nc);
    const newScores = quizScore !== undefined ? { ...quizScores, [lesson.id]: quizScore } : quizScores;
    if (quizScore !== undefined) setQuizScores(newScores);
    setShowQuiz(false);
    saveProgress(nc, newScores);

    if (nc.size >= sprint.lessons.length) {
      setSprintDone(true);
    } else if (activeLesson < sprint.lessons.length - 1) {
      setActiveLesson(a => a + 1);
    }
  };

  if (sprintDone) {
    const avg = Object.values(quizScores).length > 0 ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length) : 0;
    return (<div>
      <Certificate sprint={sprint.title} level={sprint.level} score={avg} />
      <Card style={{ marginTop: 14, textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: Z.gn }}>Sprint abgeschlossen!</div>
        <p style={{ fontSize: 13, color: Z.g500, margin: "4px 0" }}>{sprint.lessons.length} Lektionen absolviert.{avg > 0 && ` Score: ${avg}%.`}</p>
      </Card>
    </div>);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: Z.x, margin: 0 }}>{sprint.title}</h2>
          <Badge c={Z.bl}>{sprint.level}</Badge>
        </div>
        <p style={{ fontSize: 12, color: Z.g400, margin: 0 }}>{sprint.department} · {sprint.duration_days} Tage</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: Z.g500 }}>{completedLessons.size}/{sprint.lessons.length}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: Z.bl }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: Z.g100, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: Z.bl, borderRadius: 3, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Day Pills with Drip */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {sprint.lessons.map((l, i) => {
          const done = completedLessons.has(l.id);
          const active = i === activeLesson;
          const accessible = isLessonAccessible(i);
          return (
            <button
              key={l.id}
              onClick={() => { if (accessible) { setActiveLesson(i); setShowQuiz(false); } }}
              style={{
                padding: "8px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
                background: active ? Z.x : done ? Z.gnL : !accessible ? Z.g100 : Z.w,
                color: active ? Z.w : done ? Z.gn : !accessible ? Z.g300 : Z.g500,
                fontSize: 12, fontWeight: 600,
                cursor: accessible ? "pointer" : "not-allowed",
                boxShadow: active ? "none" : `0 0 0 1px ${Z.g200}`,
                fontFamily: "inherit",
                opacity: accessible ? 1 : 0.6,
              }}
            >
              {done ? "✓ " : !accessible ? "🔒 " : ""}Tag {l.day}
            </button>
          );
        })}
      </div>

      {/* Locked Lesson Notice */}
      {!isLessonAccessible(activeLesson) ? (
        <Card style={{ textAlign: "center", padding: 24, background: Z.g50 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: Z.x, marginBottom: 4 }}>Lektion gesperrt</div>
          <p style={{ fontSize: 12, color: Z.g500, margin: 0 }}>Schliesse erst Tag {sprint.lessons[activeLesson - 1]?.day} ab um diese Lektion freizuschalten.</p>
        </Card>
      ) : (
        /* Lesson Content */
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Badge c={lesson.type === "exercise" ? Z.am : Z.bl}>{lesson.type === "exercise" ? "UEBUNG" : "LEKTION"}</Badge>
            <span style={{ fontSize: 11, color: Z.g400 }}>~{lesson.minutes} Min</span>
            {completedLessons.has(lesson.id) && <Badge c={Z.gn}>FERTIG</Badge>}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: Z.x, margin: "0 0 4px" }}>{lesson.title}</h3>
          <p style={{ fontSize: 13, color: Z.g400, margin: "0 0 16px" }}>{lesson.subtitle}</p>
          {!showQuiz ? (<>
            <Md text={lesson.content} />
            <div style={{ marginTop: 20 }}>
              {lesson.quiz?.length > 0 ? (
                <button onClick={() => setShowQuiz(true)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: Z.bl, color: Z.w, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Zum Quiz →</button>
              ) : (
                <button onClick={() => completeLesson()} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: completedLessons.has(lesson.id) ? Z.gn : Z.x, color: Z.w, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{completedLessons.has(lesson.id) ? "✓ Abgeschlossen" : "Als fertig markieren ✓"}</button>
              )}
            </div>
          </>) : (
            <Quiz questions={lesson.quiz} onComplete={(s) => completeLesson(s)} />
          )}
        </Card>
      )}

      {/* AI Tutor FAB */}
      <AITutor
        sprintTitle={sprint.title}
        sprintLevel={sprint.level}
        department={sprint.department}
        lessonTitle={lesson.title}
        lessonContent={lesson.content?.substring(0, 500)}
      />
    </div>
  );
}
