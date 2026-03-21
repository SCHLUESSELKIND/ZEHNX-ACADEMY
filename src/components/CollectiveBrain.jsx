import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX COLLECTIVE BRAIN — Community Intelligence
// Light mode, matches ZEHNX design system.
// Neural Map + Trending + Heatmap + Live Feed
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6",
  g200: "#E5E7EB", g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280",
  g600: "#4B5563", g700: "#374151", g800: "#1F2937", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", blPale: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB",
  rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF",
  pk: "#DB2777", pkL: "#FDF2F8",
  cy: "#0891B2", cyL: "#ECFEFF",
};

const BRAIN_STATS = { activeNow: 47, sprintsToday: 183, skillsUnlocked: 2847, avgXScore: 42 };

const DEPT_NODES = [
  { label: "Design Studio", color: Z.pk }, { label: "App Lab", color: Z.bl },
  { label: "Conversational AI", color: Z.cy }, { label: "Automation HQ", color: Z.am },
  { label: "Content Factory", color: Z.rd }, { label: "Data Intelligence", color: Z.vi },
  { label: "Business School", color: Z.gn }, { label: "Selbstschutz", color: Z.g700 },
];

const TRENDING = [
  { name: "ChatGPT Grundlagen", dept: "Prompting", done: 89, trend: "+23%", hot: true },
  { name: "React Fullstack", dept: "App Lab", done: 54, trend: "+18%", hot: true },
  { name: "DSGVO komplett", dept: "Legal", done: 47, trend: "+41%", hot: false },
  { name: "n8n Workflows", dept: "Automation", done: 38, trend: "+12%", hot: false },
  { name: "Prompt Engineering", dept: "Prompting", done: 36, trend: "+9%", hot: false },
  { name: "Stripe Payments", dept: "App Lab", done: 31, trend: "+7%", hot: false },
];

const SKILLS = [
  { name: "Prompt Engineering", pct: 92, color: Z.bl },
  { name: "ChatGPT", pct: 88, color: Z.bl },
  { name: "React", pct: 71, color: Z.cy },
  { name: "Supabase", pct: 63, color: Z.cy },
  { name: "DSGVO", pct: 59, color: Z.rd },
  { name: "n8n", pct: 55, color: Z.am },
  { name: "Copywriting", pct: 52, color: Z.pk },
  { name: "SEO", pct: 48, color: Z.pk },
  { name: "Stripe", pct: 41, color: Z.cy },
  { name: "AI Strategie", pct: 38, color: Z.vi },
  { name: "SQL", pct: 35, color: Z.gn },
  { name: "Python", pct: 29, color: Z.cy },
];

const FEED = [
  { ini: "AK", act: "Sprint abgeschlossen", det: "ChatGPT Grundlagen", time: "2 Min", xp: "+40" },
  { ini: "ML", act: "Skill freigeschaltet", det: "React → B1", time: "5 Min", xp: "+20" },
  { ini: "SR", act: "X-SCORE Update", det: "A2 → B1", time: "8 Min", xp: "+100" },
  { ini: "JW", act: "Sprint gestartet", det: "n8n Workflows", time: "12 Min", xp: "" },
  { ini: "TH", act: "Zertifikat erhalten", det: "DSGVO komplett", time: "15 Min", xp: "+50" },
  { ini: "LB", act: "Sprint abgeschlossen", det: "Prompt Engineering", time: "18 Min", xp: "+40" },
];

// ─── NEURAL CANVAS ───────────────────────────────────────────

function NeuralCanvas({ width = 800, height = 380 }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const frameRef = useRef(0);

  const init = useCallback(() => {
    const nodes = [];
    const pos = [
      { x: 0.15, y: 0.28 }, { x: 0.38, y: 0.18 }, { x: 0.62, y: 0.22 }, { x: 0.85, y: 0.30 },
      { x: 0.22, y: 0.72 }, { x: 0.45, y: 0.78 }, { x: 0.68, y: 0.75 }, { x: 0.50, y: 0.48 },
    ];
    DEPT_NODES.forEach((d, di) => {
      const p = pos[di];
      nodes.push({ x: p.x * width, y: p.y * height, r: 10, color: d.color, label: d.label, isHub: true, ph: Math.random() * 6.28 });
      for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        const a = (6.28 * i) / (3 + Math.floor(Math.random() * 3)) + Math.random() * 0.6;
        const dist = 28 + Math.random() * 40;
        nodes.push({ x: p.x * width + Math.cos(a) * dist, y: p.y * height + Math.sin(a) * dist, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: 2 + Math.random() * 2.5, color: d.color, hub: di, ph: Math.random() * 6.28 });
      }
    });
    nodesRef.current = nodes;
  }, [width, height]);

  useEffect(() => {
    init();
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf;
    const draw = () => {
      const t = frameRef.current++ * 0.015;
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const hubs = nodes.filter(n => n.isHub);

      // Inter-hub lines
      hubs.forEach((a, i) => { hubs.forEach((b, j) => {
        if (j <= i) return;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 350) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(156,163,175,${0.06 + 0.03 * Math.sin(t * 0.5 + i + j)})`; ctx.lineWidth = 0.8; ctx.stroke(); }
      }); });

      // Satellite lines
      nodes.forEach(n => {
        if (n.hub === undefined) return;
        const h = hubs[n.hub]; if (!h) return;
        ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = n.color + Math.floor((0.1 + 0.05 * Math.sin(t + n.ph)) * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 0.6; ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        if (!n.isHub) {
          n.x += n.vx + Math.sin(t + n.ph) * 0.1;
          n.y += n.vy + Math.cos(t * 0.7 + n.ph) * 0.1;
          if (n.x < 8 || n.x > width - 8) n.vx *= -1;
          if (n.y < 8 || n.y > height - 8) n.vy *= -1;
        }
        const pulse = n.isHub ? 1 + 0.1 * Math.sin(t * 1.5 + n.ph) : 1;
        if (n.isHub) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5 * pulse);
          g.addColorStop(0, n.color + "18"); g.addColorStop(1, n.color + "00");
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3.5 * pulse, 0, 6.28); ctx.fillStyle = g; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * pulse, 0, 6.28);
        ctx.fillStyle = n.color; ctx.globalAlpha = n.isHub ? 0.85 : 0.35 + 0.15 * Math.sin(t + n.ph);
        ctx.fill(); ctx.globalAlpha = 1;
        if (n.isHub) { ctx.font = "600 10px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle = "#9CA3AF"; ctx.textAlign = "center"; ctx.fillText(n.label, n.x, n.y + n.r + 16); }
      });

      // Random pulse
      if (Math.random() < 0.006) {
        const h = hubs[Math.floor(Math.random() * hubs.length)];
        const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 50);
        g.addColorStop(0, h.color + "25"); g.addColorStop(1, h.color + "00");
        ctx.beginPath(); ctx.arc(h.x, h.y, 50, 0, 6.28); ctx.fillStyle = g; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height, init]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%", display: "block" }} />;
}


// ─── MAIN ────────────────────────────────────────────────────

export default function CollectiveBrain() {
  const [tab, setTab] = useState("map");
  const [s, setS] = useState({ activeNow: 0, sprintsToday: 0, skillsUnlocked: 0, avgXScore: 0 });

  useEffect(() => {
    const dur = 1200, start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setS({ activeNow: Math.round(47 * e), sprintsToday: Math.round(183 * e), skillsUnlocked: Math.round(2847 * e), avgXScore: Math.round(42 * e) });
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const tabs = [{ id: "map", l: "Neural Map" }, { id: "trending", l: "Trending" }, { id: "skills", l: "Skill-Heatmap" }, { id: "feed", l: "Live Feed" }];

  return (
    <div style={{ minHeight: "100vh", background: Z.bg, fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", color: Z.x }}>
      <style>{`@keyframes cbDot{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: Z.gn, animation: "cbDot 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: Z.gn, letterSpacing: "0.06em" }}>{s.activeNow} LERNENDE AKTIV</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.04em", margin: 0 }}>Collective Brain</h1>
          <p style={{ fontSize: 15, color: Z.g500, marginTop: 6, maxWidth: 460 }}>Das neuronale Netzwerk der ZEHNX Community. Jeder Sprint staerkt die Verbindungen.</p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { l: "Aktiv jetzt", v: s.activeNow, c: Z.gn },
            { l: "Sprints heute", v: s.sprintsToday, c: Z.bl },
            { l: "Skills freigeschaltet", v: s.skillsUnlocked.toLocaleString(), c: Z.vi },
            { l: "Ø X-Score", v: s.avgXScore + "/100", c: Z.am },
          ].map(st => (
            <div key={st.l} style={{ background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: Z.g400, marginBottom: 4 }}>{st.l}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: st.c, letterSpacing: "-0.03em" }}>{st.v}</div>
            </div>
          ))}
        </div>

        {/* TABS — pill-style segmented control */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: Z.w, borderRadius: 12, padding: 3, border: `1px solid ${Z.g200}`, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 18px", borderRadius: 9, border: "none",
              background: tab === t.id ? Z.x : "transparent",
              color: tab === t.id ? Z.w : Z.g500,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>{t.l}</button>
          ))}
        </div>

        {/* ═══ NEURAL MAP ═══ */}
        {tab === "map" && (
          <div style={{ background: Z.g50, borderRadius: 14, border: `1px solid ${Z.g200}`, position: "relative", overflow: "hidden", height: 400 }}>
            <NeuralCanvas width={920} height={400} />
            <div style={{
              position: "absolute", bottom: 12, left: 14, fontSize: 11, color: Z.g400,
              background: Z.w + "DD", padding: "5px 10px", borderRadius: 8, border: `1px solid ${Z.g200}`,
            }}>8 Departments · 44 Skills · Echtzeit-Verbindungen</div>
          </div>
        )}

        {/* ═══ TRENDING ═══ */}
        {tab === "trending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRENDING.map((t, i) => (
              <div key={i} style={{
                background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`,
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", transition: "border-color 0.15s",
              }} onMouseEnter={e => e.currentTarget.style.borderColor = Z.g300} onMouseLeave={e => e.currentTarget.style.borderColor = Z.g200}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: t.hot ? Z.blPale : Z.g100,
                  border: `1px solid ${t.hot ? Z.bl + "30" : Z.g200}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 900, color: t.hot ? Z.bl : Z.g400,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: Z.x }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: Z.g400 }}>{t.dept}</div>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: Z.x }}>{t.done}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: Z.gn }}>{t.trend}</div>
                </div>
                {t.hot && <span style={{ fontSize: 10, fontWeight: 700, color: Z.am, padding: "3px 8px", borderRadius: 6, background: Z.amL, letterSpacing: "0.04em" }}>HOT</span>}
              </div>
            ))}
          </div>
        )}

        {/* ═══ SKILL HEATMAP ═══ */}
        {tab === "skills" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
            {SKILLS.map(sk => (
              <div key={sk.name} style={{ background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: Z.x }}>{sk.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: sk.color }}>{sk.pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: Z.g100, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: sk.color, width: `${sk.pct}%`, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ LIVE FEED ═══ */}
        {tab === "feed" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FEED.map((a, i) => (
              <div key={i} style={{ background: Z.w, borderRadius: 14, border: `1px solid ${Z.g200}`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: Z.blPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: Z.bl }}>{a.ini}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: Z.x }}>{a.act}</span>
                  <span style={{ fontSize: 13, color: Z.g500 }}> — {a.det}</span>
                </div>
                {a.xp && <span style={{ fontSize: 12, fontWeight: 700, color: Z.gn, padding: "3px 8px", borderRadius: 6, background: Z.gnL }}>{a.xp} XP</span>}
                <span style={{ fontSize: 11, color: Z.g400, minWidth: 48, textAlign: "right" }}>vor {a.time}</span>
              </div>
            ))}
            <div style={{ textAlign: "center", padding: 16, fontSize: 12, color: Z.g400 }}>Updates in Echtzeit wenn Supabase Realtime aktiv</div>
          </div>
        )}

      </div>
    </div>
  );
}
