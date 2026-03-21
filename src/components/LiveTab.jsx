// ═══════════════════════════════════════════════════════════════
// ZEHNX LIVE TAB — Drop-in Component for PWA
// Place in: src/components/LiveTab.jsx
// Add to nav: { id: "live", i: "◉", l: "Live" }
// Render: {section === "live" && <LiveTab supabase={supabase} />}
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

// Uses the SAME Z theme object from the main app
// If your app exports Z, import it. Otherwise this is the identical copy:
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

// ─── Primitives (same patterns as main app) ──────────────────

function Badge({ children, c = Z.bl, bg: bgProp }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: bgProp || (c + "14"), color: c }}>{children}</span>;
}

function Pill({ children, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: active ? Z.x : Z.white, color: active ? Z.white : Z.g500, fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: active ? "none" : `0 0 0 1px ${Z.g200}`, transition: "all 0.15s" }}>{children}</button>;
}

function Card({ children, style: s, onClick }) {
  return <div onClick={onClick} style={{ background: Z.card, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}`, marginBottom: 10, cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.15s", ...s }}>{children}</div>;
}

function IconBox({ icon, c = Z.bl }) {
  return <div style={{ width: 36, height: 36, borderRadius: 10, background: c + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, color: c }}>{icon}</div>;
}

// ─── Sub-tabs within LIVE ────────────────────────────────────

const SUB_TABS = [
  { id: "upcoming", l: "Kommende Events" },
  { id: "library", l: "Bibliothek" },
  { id: "community", l: "Community" },
];

// ─── DEMO DATA (used when Supabase isn't connected yet) ──────

const DEMO_EVENTS = [
  { id: "1", title: "ZEHNX Spotlight #1: Prompt Engineering", type: "spotlight", category: "zehnx", date: new Date(Date.now() + 7 * 86400000).toISOString(), duration_min: 30, speaker: "Tom Frerich", level: "A1", department: "Content Factory", is_featured: true, rsvp_count: 12 },
  { id: "2", title: "Sprint Q&A: App Lab Woche 1", type: "qa", category: "zehnx", date: new Date(Date.now() + 10 * 86400000).toISOString(), duration_min: 30, speaker: "Tom Frerich", level: "A2", department: "App Lab", is_featured: false, rsvp_count: 8 },
  { id: "3", title: "Google Cloud Next 2026", type: "external", category: "global", date: "2026-04-22T09:00:00Z", duration_min: 480, speaker: null, level: "B1", is_featured: true, rsvp_count: 45 },
  { id: "4", title: "DeepLearning.AI Dev 26", type: "external", category: "global", date: "2026-04-28T09:00:00Z", duration_min: 480, speaker: "Andrew Ng", level: "B2", is_featured: true, rsvp_count: 67 },
  { id: "5", title: "Cologne AI Meetup", type: "external", category: "dach", date: new Date(Date.now() + 14 * 86400000).toISOString(), duration_min: 120, speaker: null, level: "A1", is_featured: false, rsvp_count: 23 },
  { id: "6", title: "ZEHNX Masterclass: RAG mit pgvector", type: "masterclass", category: "zehnx", date: new Date(Date.now() + 30 * 86400000).toISOString(), duration_min: 90, speaker: "TBA", level: "B1", department: "Data Intelligence", is_featured: true, price_cents: 2900, rsvp_count: 3 },
];

const DEMO_LIBRARY = [
  { id: "1", type: "video", title: "How AI Could Empower Any Business", source: "Andrew Ng · TED", level: "A2", department: "Business School", is_featured: true, duration_min: 12 },
  { id: "2", type: "video", title: "Attention Is All You Need — visualisiert", source: "3Blue1Brown", level: "B1", department: "Data Intelligence", is_featured: true, duration_min: 27 },
  { id: "3", type: "video", title: "Let's build GPT from scratch", source: "Andrej Karpathy", level: "B2", department: "App Lab", is_featured: true, duration_min: 120 },
  { id: "4", type: "article", title: "EU AI Act: Was Unternehmen wissen müssen", source: "ZEHNX Redaktion", level: "A2", department: "AI Selbstschutz", is_featured: true },
  { id: "5", type: "article", title: "RAG-Architektur für Einsteiger", source: "ZEHNX Deep Dive", level: "B1", department: "Data Intelligence", is_featured: true },
  { id: "6", type: "audio", title: "Latent Space: The Rise of AI Agents", source: "Latent Space Podcast", level: "B2", department: "Automation HQ", duration_min: 75 },
  { id: "7", type: "tool", title: "Prompt Template: Structured Output", source: "ZEHNX Tools", level: "A2", department: "Content Factory" },
  { id: "8", type: "paper", title: "Attention Is All You Need (vereinfacht)", source: "Vaswani et al. → ZEHNX", level: "B1", department: "Data Intelligence", is_featured: true },
];

// ─── TYPE ICONS + COLORS ─────────────────────────────────────

const TYPE_META = {
  spotlight: { i: "◎", c: Z.bl, l: "Spotlight" },
  masterclass: { i: "◆", c: Z.am, l: "Masterclass" },
  qa: { i: "⚡", c: Z.pk, l: "Q&A" },
  ama: { i: "🎤", c: Z.vi, l: "AMA" },
  watch_party: { i: "📺", c: Z.cy, l: "Watch Party" },
  external: { i: "🌐", c: Z.g500, l: "Extern" },
};

const CAT_META = {
  global: { c: Z.bl, l: "GLOBAL" },
  dach: { c: Z.gn, l: "DACH" },
  online: { c: Z.cy, l: "ONLINE" },
  zehnx: { c: Z.bl, l: "ZEHNX" },
};

const LIB_ICONS = { video: "▶", article: "📄", audio: "🎧", tool: "🧪", paper: "📑" };
const LIB_COLORS = { video: Z.pk, article: Z.bl, audio: Z.vi, tool: Z.am, paper: Z.rd };

// ─── DATE FORMATTING ─────────────────────────────────────────

function fmtDate(d) {
  const dt = new Date(d);
  const now = new Date();
  const diff = dt - now;
  if (diff < 0) return "Vergangen";
  if (diff < 86400000) return "Heute";
  if (diff < 172800000) return "Morgen";
  if (diff < 604800000) return `In ${Math.ceil(diff / 86400000)} Tagen`;
  return dt.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

function fmtTime(d) {
  return new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

// ═══ EVENTS VIEW ═════════════════════════════════════════════

function EventsView({ events }) {
  const [filter, setFilter] = useState("all");
  const cats = [{ id: "all", l: "Alle" }, { id: "zehnx", l: "ZEHNX" }, { id: "global", l: "Global" }, { id: "dach", l: "DACH" }, { id: "online", l: "Online" }];
  const filtered = filter === "all" ? events : events.filter(e => e.category === filter);

  return (<div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
      {cats.map(c => <Pill key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.l}</Pill>)}
    </div>

    {/* Featured Event Banner */}
    {filtered.filter(e => e.is_featured).slice(0, 1).map(e => {
      const tm = TYPE_META[e.type] || TYPE_META.external;
      return (
        <div key={e.id + "-feat"} style={{ background: `linear-gradient(135deg, ${Z.g900}, #1a1a2e)`, borderRadius: 18, padding: 22, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <Badge c="#fff" bg="rgba(255,255,255,0.12)">{tm.l}</Badge>
            {e.level && <Badge c="#60A5FA" bg="rgba(96,165,250,0.15)">{e.level}</Badge>}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{e.title}</h3>
          <div style={{ fontSize: 12, color: Z.g400 }}>
            {fmtDate(e.date)} · {fmtTime(e.date)} · {e.duration_min} Min
            {e.speaker && <span> · {e.speaker}</span>}
          </div>
          {e.price_cents > 0 && <Badge c={Z.am}>€{(e.price_cents / 100).toFixed(0)}</Badge>}
        </div>
      );
    })}

    {/* Event List */}
    {filtered.map(e => {
      const tm = TYPE_META[e.type] || TYPE_META.external;
      const cm = CAT_META[e.category];
      return (
        <Card key={e.id}>
          <div style={{ display: "flex", gap: 12 }}>
            <IconBox icon={tm.i} c={tm.c} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
                {cm && <Badge c={cm.c}>{cm.l}</Badge>}
                {e.level && <Badge c={Z.g500} bg={Z.g100}>{e.level}</Badge>}
                {e.type === "masterclass" && <Badge c={Z.am}>LIVE</Badge>}
                {e.price_cents > 0 && <Badge c={Z.am}>€{(e.price_cents / 100).toFixed(0)}</Badge>}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 3px" }}>{e.title}</h4>
              <div style={{ fontSize: 12, color: Z.g400 }}>
                {fmtDate(e.date)} · {fmtTime(e.date)}
                {e.speaker && <span> · {e.speaker}</span>}
                {e.department && <span> · {e.department}</span>}
              </div>
            </div>
          </div>
        </Card>
      );
    })}
  </div>);
}

// ═══ LIBRARY VIEW ════════════════════════════════════════════

function LibraryView({ items }) {
  const [filter, setFilter] = useState("all");
  const types = [{ id: "all", l: "Alle" }, { id: "video", l: "Videos" }, { id: "article", l: "Artikel" }, { id: "audio", l: "Audio" }, { id: "tool", l: "Tools" }, { id: "paper", l: "Papers" }];
  const filtered = filter === "all" ? items : items.filter(it => it.type === filter);

  return (<div>
    {/* Search */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: Z.white, borderRadius: 12, padding: "10px 14px", border: `1px solid ${Z.g200}`, marginBottom: 12 }}>
      <span style={{ color: Z.g400, fontSize: 14 }}>🔍</span>
      <input placeholder="Suche in Bibliothek..." style={{ border: "none", outline: "none", flex: 1, fontSize: 13, color: Z.x, background: "transparent", fontFamily: "inherit" }} />
    </div>

    <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
      {types.map(t => <Pill key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>{t.l}</Pill>)}
    </div>

    {filtered.map(it => (
      <Card key={it.id}>
        <div style={{ display: "flex", gap: 12 }}>
          <IconBox icon={LIB_ICONS[it.type]} c={LIB_COLORS[it.type]} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
              <Badge c={LIB_COLORS[it.type]}>{it.type.toUpperCase()}</Badge>
              {it.level && <Badge c={Z.g500} bg={Z.g100}>{it.level}</Badge>}
              {it.is_featured && <Badge c={Z.am}>★</Badge>}
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: Z.x, margin: "0 0 2px" }}>{it.title}</h4>
            <div style={{ fontSize: 12, color: Z.g400 }}>
              {it.source}
              {it.department && <span> · {it.department}</span>}
              {it.duration_min && <span> · {it.duration_min} Min</span>}
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>);
}

// ═══ COMMUNITY VIEW ══════════════════════════════════════════

function CommunityView() {
  return (
    <div>
      <div style={{ padding: 20, background: Z.blL, borderRadius: 14, border: `1px solid ${Z.bl}20`, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⬡</div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: Z.x, margin: "0 0 6px" }}>Community kommt in Phase 3</h3>
        <p style={{ fontSize: 13, color: Z.g500, margin: 0, lineHeight: 1.6 }}>
          Forum, XP-System, Leaderboard und Peer Matching. Erst Events + Bibliothek — dann Community.
        </p>
      </div>

      {/* Preview cards */}
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
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: Z.x }}>{f.t}</div>
                <div style={{ fontSize: 12, color: Z.g400 }}>{f.d}</div>
              </div>
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
  const [subTab, setSubTab] = useState("upcoming");
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [library, setLibrary] = useState(DEMO_LIBRARY);
  const [loading, setLoading] = useState(false);

  // Load real data from Supabase (if connected)
  useEffect(() => {
    if (!supabase) return; // use demo data
    
    setLoading(true);
    
    Promise.all([
      supabase.from('live_events').select('*').gte('date', new Date().toISOString()).order('date'),
      supabase.from('library_items').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false }),
    ]).then(([evRes, libRes]) => {
      if (evRes.data?.length) setEvents(evRes.data);
      if (libRes.data?.length) setLibrary(libRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [supabase]);

  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: Z.x, margin: 0, letterSpacing: "-0.03em" }}>
            ZEHN<span style={{ color: Z.bl }}>X</span> Live
          </h2>
          <Badge c={Z.gn}>NEU</Badge>
        </div>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>Talks · Q&A · Events · Bibliothek</p>
      </div>

      {/* Sub-Tab Pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {SUB_TABS.map(t => (
          <Pill key={t.id} active={subTab === t.id} onClick={() => setSubTab(t.id)}>{t.l}</Pill>
        ))}
      </div>

      {/* Loading */}
      {loading && <div style={{ textAlign: "center", padding: 40, color: Z.g400, fontSize: 13 }}>Lade...</div>}

      {/* Content */}
      {!loading && subTab === "upcoming" && <EventsView events={events} />}
      {!loading && subTab === "library" && <LibraryView items={library} />}
      {!loading && subTab === "community" && <CommunityView />}
    </div>
  );
}
