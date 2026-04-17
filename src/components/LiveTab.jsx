// ═══════════════════════════════════════════════════════════════
// ZEHNX LIVE TAB — Upgraded: Library + Calendar + Video Player
// Drop-in replacement for src/components/LiveTab.jsx
// Nav: { id: "live", i: "◉", l: "Live" }
// Render: {section === "live" && <LiveTab supabase={supabase} />}
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";

const Z = {
  bg: "#F5F5F7", white: "#FFFFFF", card: "#FFFFFF",
  g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB", g300: "#D1D5DB",
  g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563", g700: "#374151",
  g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF", pk: "#DB2777", pkL: "#FDF2F8",
  cy: "#0891B2", cyL: "#ECFEFF",
};

// ─── Primitives ──────────────────────────────────────────────

function Badge({ children, c = Z.bl, bg: bgProp }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: bgProp || (c + "14"), color: c }}>{children}</span>;
}

function Pill({ children, active, onClick, c }) {
  return <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: active ? (c || Z.x) : Z.white, color: active ? Z.white : Z.g500, fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: active ? "none" : `0 0 0 1px ${Z.g200}`, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>{children}</button>;
}

function Card({ children, style: s, onClick }) {
  return <div onClick={onClick} style={{ background: Z.card, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}`, marginBottom: 10, cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.15s", ...s }}>{children}</div>;
}

function IconBox({ icon, c = Z.bl }) {
  return <div style={{ width: 36, height: 36, borderRadius: 10, background: c + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, color: c }}>{icon}</div>;
}

// ─── Constants ────────────────────────────────────────────────

const DEPS = {
  apps: { l: "Apps & Dev", c: Z.bl, i: "◆" },
  design: { l: "Design", c: Z.pk, i: "✦" },
  chatbots: { l: "Chatbots", c: Z.cy, i: "◇" },
  automation: { l: "Automation", c: Z.am, i: "⬡" },
  content: { l: "Content", c: Z.rd, i: "◈" },
  data: { l: "Data", c: Z.vi, i: "◉" },
  business: { l: "Business", c: Z.gn, i: "◎" },
  "self-protection": { l: "Selbstschutz", c: Z.g700, i: "⊕" },
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const SUB_TABS = [
  { id: "library", l: "📚 Bibliothek" },
  { id: "calendar", l: "📅 Events" },
  { id: "community", l: "⬡ Community" },
];

// ─── Helpers ─────────────────────────────────────────────────

function fmtDur(s) { if (!s) return ""; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m} min`; }
function fmtTime(d) { return new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(d) {
  const dt = new Date(d), now = new Date(), diff = dt - now;
  if (diff < 0) return "Vergangen";
  if (diff < 86400000) return "Heute";
  if (diff < 172800000) return "Morgen";
  if (diff < 604800000) return `In ${Math.ceil(diff / 86400000)} Tagen`;
  return dt.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

// ─── Demo Data: Curated YouTube Library ──────────────────────

const VIDEOS = [
  { id: "1", yt: "aircAruvnKk", title: "But what is a neural network?", ch: "3Blue1Brown", dur: 1140, dep: "apps", lv: "A1", tags: ["neural-networks"], why: "Die beste visuelle Erklärung neuronaler Netze — in 19 Minuten.", sp: "3Blue1Brown", pick: true, tier: "free", rat: 4.9 },
  { id: "2", yt: "VMj-3S1tku0", title: "But what is a GPT? Visual intro to Transformers", ch: "3Blue1Brown", dur: 1620, dep: "apps", lv: "A2", tags: ["transformers", "gpt"], why: "Transformers visuell verstehen — die Grundlage für jedes LLM.", sp: "3Blue1Brown", pick: true, tier: "free", rat: 4.8 },
  { id: "3", yt: "zjkBMFhNj_g", title: "Intro to Large Language Models", ch: "Andrej Karpathy", dur: 3600, dep: "apps", lv: "A2", tags: ["llm"], why: "Die beste LLM-Einführung von Andrej Karpathy. Pflichtprogramm.", sp: "Andrej Karpathy", pick: true, tier: "free", rat: 4.9 },
  { id: "4", yt: "7xTGNNLPyMI", title: "AI in 100 Seconds", ch: "Fireship", dur: 140, dep: "apps", lv: "A1", tags: ["ai", "quick"], why: "In 100 Sekunden weißt du, was AI ist.", sp: "Fireship", pick: false, tier: "free", rat: 4.5 },
  { id: "5", yt: "_ZvnD96BXbY", title: "ChatGPT Prompt Engineering for Developers", ch: "DeepLearning.AI", dur: 5400, dep: "content", lv: "B1", tags: ["prompt-engineering"], why: "Der offizielle Prompt Engineering Kurs — Goldstandard.", sp: "Andrew Ng", pick: true, tier: "free", rat: 4.8 },
  { id: "6", yt: "ySus5ZS0b94", title: "Every AI Tool You Need In One Video", ch: "Matt Wolfe", dur: 1800, dep: "automation", lv: "B1", tags: ["ai-tools"], why: "Die ultimative AI-Tool-Landkarte — spart Stunden Recherche.", sp: "Matt Wolfe", pick: false, tier: "free", rat: 4.4 },
  { id: "7", yt: "TRjq7t2Ms5I", title: "I Built 10 AI Automations — Here Are The Best", ch: "The AI Advantage", dur: 1200, dep: "automation", lv: "B1", tags: ["automation", "n8n"], why: "Automation in der Praxis — direkt nachmachen.", sp: "The AI Advantage", pick: true, tier: "free", rat: 4.3 },
  { id: "8", yt: "T-D1OfcDW1M", title: "Building RAG from Scratch", ch: "DeepLearning.AI", dur: 2700, dep: "apps", lv: "B2", tags: ["rag", "vector-db"], why: "RAG selbst bauen — die wichtigste Skill für AI-Entwickler.", sp: "Andrew Ng", pick: true, tier: "pro", rat: 4.7 },
  { id: "9", yt: "sal78ACtGTc", title: "What are AI Agents?", ch: "Fireship", dur: 480, dep: "apps", lv: "B1", tags: ["agents"], why: "Agents in 8 Minuten verstehen — kompakt und auf den Punkt.", sp: "Fireship", pick: true, tier: "free", rat: 4.5 },
  { id: "10", yt: "jvqFAi7vkBc", title: "State of AI 2025", ch: "AI Explained", dur: 3600, dep: "business", lv: "B2", tags: ["trends"], why: "Die beste jährliche AI-Standortbestimmung.", sp: "AI Explained", pick: true, tier: "pro", rat: 4.6 },
  { id: "11", yt: "kCc8FmEb1nY", title: "Let's build GPT: from scratch, in code", ch: "Andrej Karpathy", dur: 7200, dep: "apps", lv: "C1", tags: ["gpt", "from-scratch"], why: "GPT from scratch — für alle die es wirklich verstehen wollen.", sp: "Andrej Karpathy", pick: true, tier: "pro", rat: 5.0 },
  { id: "12", yt: "YQ_xWvX1n9g", title: "I Tried Every AI Image Generator", ch: "Matt Wolfe", dur: 1500, dep: "design", lv: "A2", tags: ["midjourney", "image-gen"], why: "Alle Bildgeneratoren im Direktvergleich.", sp: "Matt Wolfe", pick: false, tier: "free", rat: 4.2 },
  { id: "13", yt: "qYNweeDHiyU", title: "I Analyzed Data with ChatGPT", ch: "Tina Huang", dur: 720, dep: "data", lv: "B1", tags: ["data-analysis"], why: "Datenanalyse in Minuten statt Tagen.", sp: "Tina Huang", pick: true, tier: "free", rat: 4.3 },
  { id: "14", yt: "Nlkk3glap_U", title: "The Alignment Problem — Intro to AI Safety", ch: "AI Explained", dur: 1800, dep: "self-protection", lv: "B2", tags: ["ai-safety"], why: "AI Safety verstehen — wichtig für jeden.", sp: "AI Explained", pick: false, tier: "pro", rat: 4.4 },
  { id: "15", yt: "jC4v5AS4RIM", title: "How To Use ChatGPT To Write Code", ch: "Tina Huang", dur: 900, dep: "apps", lv: "A2", tags: ["chatgpt", "coding"], why: "Coding mit AI starten — ohne Vorkenntnisse.", sp: "Tina Huang", pick: false, tier: "free", rat: 4.1 },
  { id: "16", yt: "2xxziIWmaSA", title: "Build a Custom Chatbot with OpenAI API", ch: "Fireship", dur: 600, dep: "chatbots", lv: "B1", tags: ["chatbot", "openai-api"], why: "Eigenen Chatbot in 10 Minuten — Code zum Mitnehmen.", sp: "Fireship", pick: false, tier: "free", rat: 4.4 },
  { id: "17", yt: "0n1d48QRJA4", title: "Create UI Designs with AI — Figma + Midjourney", ch: "The AI Advantage", dur: 900, dep: "design", lv: "B1", tags: ["figma", "midjourney", "ui-design"], why: "AI + Figma Workflow — sofort einsetzbar.", sp: "The AI Advantage", pick: false, tier: "free", rat: 4.0 },
  { id: "18", yt: "hR4_vAav3WA", title: "Machines of Loving Grace — Dario Amodei", ch: "AI Explained", dur: 2400, dep: "business", lv: "C1", tags: ["ai-safety", "anthropic", "essay"], why: "Die optimistischste AI-Vision — vom Anthropic CEO.", sp: "AI Explained", pick: false, tier: "pro", rat: 4.5 },
  { id: "19", yt: "9uw3F6rndnA", title: "Let's build the GPT Tokenizer", ch: "Andrej Karpathy", dur: 7800, dep: "apps", lv: "C1", tags: ["tokenizer", "bpe", "deep"], why: "Tokenisierung wirklich verstehen — essentiell für Fortgeschrittene.", sp: "Andrej Karpathy", pick: false, tier: "pro", rat: 4.8 },
  { id: "20", yt: "jv6bENpMkRc", title: "How ChatGPT Works Technically", ch: "Fireship", dur: 300, dep: "apps", lv: "A1", tags: ["chatgpt", "explained"], why: "ChatGPT erklärt in 5 Minuten — ohne Vorkenntnisse.", sp: "Fireship", pick: false, tier: "free", rat: 4.3 },
];

const EVENTS = [
  { id: "e1", title: "ZEHNX Weekly: AI Tools Update", fmt: "online", at: "2026-03-29T18:00+01:00", dep: "automation", lv: "B1", free: true, org: "ZEHNX Academy", feat: true, tier: "free", rsvp: 47 },
  { id: "e2", title: "Prompt Engineering Masterclass", fmt: "online", at: "2026-04-02T19:00+01:00", dep: "content", lv: "B2", free: true, org: "ZEHNX Academy", feat: true, tier: "pro", rsvp: 32 },
  { id: "e3", title: "ZEHNX Weekly: AI Tools Update", fmt: "online", at: "2026-04-05T18:00+01:00", dep: "automation", lv: "B1", free: true, org: "ZEHNX Academy", feat: false, tier: "free", rsvp: 23 },
  { id: "e4", title: "Hot Seat: Bring Your Project", fmt: "online", at: "2026-04-08T19:00+01:00", dep: "apps", lv: "B1", free: true, org: "ZEHNX Academy", feat: true, tier: "expert", rsvp: 12 },
  { id: "e5", title: "AI Meetup Köln #24", fmt: "offline", city: "Köln", at: "2026-04-10T18:30+01:00", dep: "business", lv: "B1", free: true, org: "AI Meetup Cologne", feat: true, tier: "free", rsvp: 68 },
  { id: "e6", title: "RAG Workshop: Build Your Knowledge Base", fmt: "online", at: "2026-04-12T10:00+01:00", dep: "apps", lv: "B2", free: true, org: "ZEHNX Academy", feat: true, tier: "pro", rsvp: 41 },
  { id: "e7", title: "AI Founders Lunch — Düsseldorf", fmt: "offline", city: "Düsseldorf", at: "2026-04-17T12:00+01:00", dep: "business", lv: "B1", free: true, org: "ZEHNX Community", feat: false, tier: "pro", rsvp: 8 },
  { id: "e8", title: "AI Engineer Summit Berlin", fmt: "offline", city: "Berlin", at: "2026-05-15T09:00+01:00", dep: "apps", lv: "B2", free: false, price: 599, org: "AI Engineer", feat: true, tier: "free", rsvp: 234 },
  { id: "e9", title: "Google I/O Watch Party", fmt: "online", at: "2026-05-20T18:00+01:00", dep: "apps", lv: "A2", free: true, org: "ZEHNX Academy", feat: false, tier: "free", rsvp: 89 },
  { id: "e10", title: "WeAreDevelopers AI Day Wien", fmt: "offline", city: "Wien", at: "2026-06-05T09:00+01:00", dep: "apps", lv: "B1", free: false, price: 299, org: "WeAreDevelopers", feat: false, tier: "free", rsvp: 156 },
];

// ─── VIDEO CARD ──────────────────────────────────────────────

function VideoCard({ v, onClick }) {
  const d = DEPS[v.dep] || { l: v.dep, c: Z.g500, i: "?" };
  const tierC = { free: Z.gn, pro: Z.bl, expert: Z.vi };
  return (
    <div onClick={() => onClick(v)} style={{ background: Z.white, borderRadius: 14, overflow: "hidden", border: `1px solid ${Z.g200}`, cursor: "pointer", transition: "box-shadow 0.15s" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", background: Z.g100 }}>
        <img src={`https://img.youtube.com/vi/${v.yt}/mqdefault.jpg`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        <div style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,.8)", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700, color: "#fff" }}>{fmtDur(v.dur)}</div>
        {v.pick && <div style={{ position: "absolute", top: 6, left: 6, background: Z.bl, borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: ".06em" }}>ZEHNX PICK</div>}
        {v.tier !== "free" && <div style={{ position: "absolute", top: 6, right: 6, background: tierC[v.tier], borderRadius: 6, padding: "2px 8px", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: ".06em" }}>{v.tier.toUpperCase()}</div>}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 5 }}>
          <Badge c={d.c}>{d.i} {d.l}</Badge>
          <Badge c={Z.g500} bg={Z.g100}>{v.lv}</Badge>
          {v.rat > 0 && <span style={{ fontSize: 11, color: Z.am, fontWeight: 700 }}>★ {v.rat}</span>}
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 3px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</h4>
        <div style={{ fontSize: 12, color: Z.g400, marginBottom: 4 }}>{v.ch}</div>
        <div style={{ fontSize: 12, color: Z.g500, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.why}</div>
      </div>
    </div>
  );
}

// ─── EVENT CARD ──────────────────────────────────────────────

function EventCard({ e, rsvpd, onRSVP }) {
  const d = DEPS[e.dep] || { l: e.dep, c: Z.g500, i: "?" };
  const tierC = { free: Z.gn, pro: Z.bl, expert: Z.vi };
  return (
    <Card>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ textAlign: "center", flexShrink: 0, minWidth: 44 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: Z.x }}>{new Date(e.at).getDate()}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: Z.g400, textTransform: "uppercase" }}>{new Date(e.at).toLocaleDateString("de-DE", { month: "short" })}</div>
          <div style={{ fontSize: 10, color: Z.g400 }}>{fmtTime(e.at)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
            <Badge c={e.fmt === "online" ? Z.cy : Z.am}>{e.fmt === "online" ? "ONLINE" : e.city || "OFFLINE"}</Badge>
            <Badge c={d.c}>{d.l}</Badge>
            <Badge c={tierC[e.tier]}>{e.tier.toUpperCase()}</Badge>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 3px", lineHeight: 1.3 }}>{e.title}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: Z.g400 }}>
            <span>{e.org}</span>
            {!e.free && <span style={{ fontWeight: 700, color: Z.am }}>€{e.price}</span>}
            <span>{e.rsvp} going</span>
          </div>
        </div>
        <button onClick={(ev) => { ev.stopPropagation(); onRSVP(e.id); }} style={{
          background: rsvpd ? Z.gnL : Z.blL, border: `1px solid ${rsvpd ? Z.gn + "30" : Z.bl + "30"}`,
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          color: rsvpd ? Z.gn : Z.bl, fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{rsvpd ? "✓ Going" : "RSVP"}</button>
      </div>
    </Card>
  );
}

// ─── VIDEO PLAYER VIEW ───────────────────────────────────────

function VideoPlayer({ v, onBack, inWatchlist, onToggleWatchlist }) {
  const d = DEPS[v.dep] || { l: v.dep, c: Z.g500 };
  return (
    <div>
      <button onClick={onBack} style={{ background: Z.white, border: `1px solid ${Z.g200}`, borderRadius: 10, padding: "6px 14px", color: Z.g600, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>← Zurück zur Bibliothek</button>
      <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 14, border: `1px solid ${Z.g200}` }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe src={`https://www.youtube.com/embed/${v.yt}?rel=0&modestbranding=1`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        <Badge c={d.c}>{d.l}</Badge>
        <Badge c={Z.g500} bg={Z.g100}>{v.lv}</Badge>
        <Badge c={Z.g500} bg={Z.g100}>{fmtDur(v.dur)}</Badge>
        {v.rat > 0 && <Badge c={Z.am}>★ {v.rat}</Badge>}
        {v.tier !== "free" && <Badge c={Z.vi}>{v.tier.toUpperCase()}</Badge>}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: Z.x, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{v.title}</h3>
      <div style={{ fontSize: 13, color: Z.g400, marginBottom: 12 }}>{v.ch} · {v.sp}</div>
      <p style={{ fontSize: 14, color: Z.g600, lineHeight: 1.7, margin: "0 0 14px" }}>{v.why}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onToggleWatchlist} style={{
          flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer",
          background: inWatchlist ? Z.blL : Z.white,
          border: `1px solid ${inWatchlist ? Z.bl + "30" : Z.g200}`,
          color: inWatchlist ? Z.bl : Z.g500,
        }}>{inWatchlist ? "✓ Auf Watchlist" : "+ Watchlist"}</button>
        <button onClick={() => window.open(`https://youtube.com/watch?v=${v.yt}`, "_blank")} style={{
          flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer",
          background: Z.rdL, border: `1px solid ${Z.rd}20`, color: Z.rd,
        }}>▶ Auf YouTube öffnen</button>
      </div>
    </div>
  );
}

// ─── LIBRARY VIEW ────────────────────────────────────────────

function LibraryView({ videos, onSelect, watchlist, supabase }) {
  const [q, setQ] = useState("");
  const [dep, setDep] = useState(null);
  const [lv, setLv] = useState(null);
  const [picks, setPicks] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => videos.filter(v => {
    if (q && !v.title.toLowerCase().includes(q.toLowerCase()) && !v.sp.toLowerCase().includes(q.toLowerCase()) && !v.tags.some(t => t.includes(q.toLowerCase()))) return false;
    if (dep && v.dep !== dep) return false;
    if (lv && v.lv !== lv) return false;
    if (picks && !v.pick) return false;
    if (freeOnly && v.tier !== "free") return false;
    return true;
  }), [videos, q, dep, lv, picks, freeOnly]);

  return (
    <div>
      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: Z.white, borderRadius: 12, padding: "10px 14px", border: `1px solid ${Z.g200}`, marginBottom: 10 }}>
        <span style={{ color: Z.g400 }}>🔍</span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Suche nach Titel, Speaker, Tag..." style={{ border: "none", outline: "none", flex: 1, fontSize: 13, color: Z.x, background: "transparent", fontFamily: "inherit" }} />
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 12 }}>
        <Pill active={picks} onClick={() => setPicks(!picks)} c={Z.bl}>ZEHNX Picks</Pill>
        <Pill active={freeOnly} onClick={() => setFreeOnly(!freeOnly)} c={Z.gn}>Free</Pill>
        <span style={{ width: 1, background: Z.g200, flexShrink: 0 }} />
        {Object.entries(DEPS).map(([k, d]) => <Pill key={k} active={dep === k} onClick={() => setDep(dep === k ? null : k)} c={d.c}>{d.l}</Pill>)}
        <span style={{ width: 1, background: Z.g200, flexShrink: 0 }} />
        {LEVELS.map(l => <Pill key={l} active={lv === l} onClick={() => setLv(lv === l ? null : l)}>{l}</Pill>)}
      </div>

      <div style={{ fontSize: 12, color: Z.g400, marginBottom: 10 }}>{filtered.length} Videos</div>

      {/* Video Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {filtered.map(v => <VideoCard key={v.id} v={v} onClick={onSelect} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 14, color: Z.g400 }}>Keine Videos gefunden. Probiere andere Filter.</div>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR VIEW ───────────────────────────────────────────

function CalendarView({ events, rsvps, onRSVP }) {
  const [dep, setDep] = useState(null);
  const [fmt, setFmt] = useState(null);

  const filtered = useMemo(() => events.filter(e => {
    if (dep && e.dep !== dep) return false;
    if (fmt && e.fmt !== fmt) return false;
    return true;
  }).sort((a, b) => new Date(a.at) - new Date(b.at)), [events, dep, fmt]);

  // Featured event banner
  const featured = filtered.find(e => e.feat);

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 12 }}>
        <Pill active={!fmt} onClick={() => setFmt(null)}>Alle</Pill>
        <Pill active={fmt === "online"} onClick={() => setFmt(fmt === "online" ? null : "online")} c={Z.cy}>Online</Pill>
        <Pill active={fmt === "offline"} onClick={() => setFmt(fmt === "offline" ? null : "offline")} c={Z.am}>Offline</Pill>
        <span style={{ width: 1, background: Z.g200, flexShrink: 0 }} />
        {Object.entries(DEPS).map(([k, d]) => <Pill key={k} active={dep === k} onClick={() => setDep(dep === k ? null : k)} c={d.c}>{d.l}</Pill>)}
      </div>

      {/* Featured banner */}
      {featured && (
        <div style={{ background: `linear-gradient(135deg, ${Z.g900}, #1a1a2e)`, borderRadius: 18, padding: 22, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <Badge c="#fff" bg="rgba(255,255,255,0.12)">{featured.fmt === "online" ? "ONLINE" : featured.city}</Badge>
            <Badge c="#60A5FA" bg="rgba(96,165,250,0.15)">{featured.lv}</Badge>
            {featured.tier !== "free" && <Badge c="#A78BFA" bg="rgba(167,139,250,0.15)">{featured.tier.toUpperCase()}</Badge>}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{featured.title}</h3>
          <div style={{ fontSize: 12, color: Z.g400 }}>
            {fmtDate(featured.at)} · {fmtTime(featured.at)} · {featured.org}
            {!featured.free && <span> · €{featured.price}</span>}
            <span> · {featured.rsvp} going</span>
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: Z.g400, marginBottom: 10 }}>{filtered.length} Events</div>

      {filtered.map(e => (
        <EventCard key={e.id} e={e} rsvpd={rsvps.has(e.id)} onRSVP={onRSVP} />
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
          <div style={{ fontSize: 14, color: Z.g400 }}>Keine Events gefunden.</div>
        </div>
      )}
    </div>
  );
}

// ─── COMMUNITY VIEW (Phase 3 placeholder) ────────────────────

function CommunityView() {
  return (
    <div>
      <div style={{ padding: 20, background: Z.blL, borderRadius: 14, border: `1px solid ${Z.bl}20`, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⬡</div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 6px" }}>Community kommt in Phase 3</h3>
        <p style={{ fontSize: 13, color: Z.g500, margin: 0, lineHeight: 1.6 }}>Forum, XP-System, Leaderboard und Peer Matching. Erst Events + Bibliothek — dann Community.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        {[
          { i: "🏆", t: "XP & Leaderboard", d: "Punkte für Sprint-Abschluss, Talk-Teilnahme, Q&A", c: Z.am },
          { i: "💬", t: "Sprint-Forum", d: "Jeder Sprint hat ein eigenes Diskussionsforum", c: Z.bl },
          { i: "🤝", t: "Peer Matching", d: "Finde Lernpartner auf deinem Level", c: Z.vi },
          { i: "📡", t: "Watch Parties", d: "Zusammen GTC, Google I/O etc. schauen", c: Z.cy },
        ].map((f, i) => (
          <Card key={i} style={{ opacity: 0.6 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <IconBox icon={f.i} c={f.c} />
              <div><div style={{ fontSize: 13, fontWeight: 700, color: Z.x }}>{f.t}</div><div style={{ fontSize: 12, color: Z.g400 }}>{f.d}</div></div>
              <Badge c={Z.g400}>BALD</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN LIVE TAB ═══════════════════════════════════════════

export default function LiveTab({ supabase }) {
  const [subTab, setSubTab] = useState("library");
  const [videos, setVideos] = useState(VIDEOS);
  const [events, setEvents] = useState(EVENTS);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchlist, setWatchlist] = useState(new Set());
  const [rsvps, setRsvps] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load from Supabase when connected
  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    Promise.all([
      supabase.from("library_videos").select("*").order("is_zehnx_pick", { ascending: false }).order("rating_avg", { ascending: false }),
      supabase.from("events").select("*").gte("start_at", new Date().toISOString()).order("start_at"),
    ]).then(([vRes, eRes]) => {
      if (vRes.data?.length) {
        setVideos(vRes.data.map(v => ({
          id: v.id, yt: v.youtube_id, title: v.title, ch: v.channel_name,
          dur: v.duration_sec, dep: v.department, lv: v.level,
          tags: v.tags || [], why: v.why_watch || v.summary || "",
          sp: v.speaker_name || v.channel_name, pick: v.is_zehnx_pick,
          tier: v.access_tier || "free", rat: Number(v.rating_avg) || 0,
        })));
      }
      if (eRes.data?.length) {
        setEvents(eRes.data.map(e => ({
          id: e.id, title: e.title, fmt: e.format || "online",
          city: e.location_city, at: e.start_at, dep: e.department,
          lv: e.level, free: e.is_free, price: e.price_eur,
          org: e.organizer, feat: e.is_featured, tier: e.access_tier || "free",
          rsvp: e.rsvp_count || 0,
        })));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [supabase]);

  const toggleWatchlist = (id) => setWatchlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleRSVP = (id) => setRsvps(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: 0, letterSpacing: "-0.03em" }}>
            ZEHN<span style={{ color: Z.bl }}>X</span> Live
          </h2>
          <Badge c={Z.gn}>NEU</Badge>
        </div>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>Kuratierte AI-Talks · Events · Bibliothek</p>
      </div>

      {/* Sub-Tab Pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {SUB_TABS.map(t => <Pill key={t.id} active={subTab === t.id} onClick={() => { setSubTab(t.id); setSelectedVideo(null); }}>{t.l}</Pill>)}
      </div>

      {/* Loading */}
      {loading && <div style={{ textAlign: "center", padding: 40, color: Z.g400, fontSize: 13 }}>Lade...</div>}

      {/* Video Player */}
      {!loading && selectedVideo && (
        <VideoPlayer
          v={selectedVideo}
          onBack={() => setSelectedVideo(null)}
          inWatchlist={watchlist.has(selectedVideo.id)}
          onToggleWatchlist={() => toggleWatchlist(selectedVideo.id)}
        />
      )}

      {/* Library */}
      {!loading && subTab === "library" && !selectedVideo && (
        <LibraryView videos={videos} onSelect={setSelectedVideo} watchlist={watchlist} supabase={supabase} />
      )}

      {/* Calendar */}
      {!loading && subTab === "calendar" && (
        <CalendarView events={events} rsvps={rsvps} onRSVP={toggleRSVP} />
      )}

      {/* Community */}
      {!loading && subTab === "community" && <CommunityView />}

      {/* Status bar */}
      {(watchlist.size > 0 || rsvps.size > 0) && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: Z.blL, borderRadius: 12, display: "flex", gap: 14, justifyContent: "center" }}>
          {watchlist.size > 0 && <span style={{ fontSize: 12, color: Z.bl, fontWeight: 700 }}>📚 {watchlist.size} auf Watchlist</span>}
          {rsvps.size > 0 && <span style={{ fontSize: 12, color: Z.gn, fontWeight: 700 }}>📅 {rsvps.size} RSVPs</span>}
        </div>
      )}
    </div>
  );
}
