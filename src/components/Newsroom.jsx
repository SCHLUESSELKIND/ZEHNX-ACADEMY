import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F5F5F7", w: "#FFFFFF", x: "#18181B",
  g50: "#FAFAF9", g100: "#F4F4F5", g200: "#E4E4E7", g300: "#D4D4D8",
  g400: "#A1A1AA", g500: "#71717A", g600: "#52525B", g700: "#3F3F46", g800: "#27272A",
  bl: "#2563EB", blL: "#DBEAFE", blXL: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB",
  rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF",
  cy: "#0891B2", cyL: "#ECFEFF",
  pk: "#DB2777", pkL: "#FDF2F8",
  or: "#EA580C", orL: "#FFF7ED",
};

const CATEGORIES = [
  { id: "all", l: "Alle", i: "◆", c: C.x },
  { id: "models", l: "AI Models", i: "◇", c: C.bl },
  { id: "robotics", l: "Robotics", i: "⬡", c: C.vi },
  { id: "biotech", l: "Biotech", i: "◈", c: C.gn },
  { id: "startups", l: "Startups & VC", i: "◎", c: C.or },
  { id: "hardware", l: "Hardware", i: "⊕", c: C.cy },
  { id: "regulation", l: "Regulation", i: "⊘", c: C.rd },
  { id: "climate", l: "Climate", i: "◉", c: C.am },
  { id: "quantum", l: "Quantum", i: "⬢", c: C.pk },
  { id: "tools", l: "Tools", i: "◇", c: C.bl },
  { id: "security", l: "Security", i: "⊕", c: C.rd },
  { id: "research", l: "Research", i: "◈", c: C.vi },
  { id: "business", l: "Business", i: "◎", c: C.gn },
  { id: "tutorials", l: "Tutorials", i: "⬡", c: C.am },
  { id: "community", l: "Community", i: "◉", c: C.cy },
];

const IMPACT = {
  critical: { l: "KRITISCH", c: C.rd, bg: C.rdL },
  high: { l: "HOCH", c: C.am, bg: C.amL },
  medium: { l: "MITTEL", c: C.bl, bg: C.blXL },
  low: { l: "SIGNAL", c: C.g500, bg: C.g100 },
};

// Fallback static data
const STATIC_NEWS = [
  { id: "s1", cat: "models", impact: "critical", title: "OpenAI launcht GPT-5.4 Mini & Nano", summary_b1: "Mini kostet $0.75/1M Input Tokens bei 400K Context Window. SWE-Bench Pro: 57.7%.", source_name: "OpenAI", source_url: "https://openai.com/index/gpt-5-4-mini/", published_at: new Date().toISOString() },
  { id: "s2", cat: "models", impact: "high", title: "12+ AI-Modelle in einer Woche — März 2026 bricht Rekorde", summary_b1: "GPT-5.4, Qwen 3.5, NVIDIA Nemotron 3 Super. Alibabas 9B schlägt OpenAIs 120B auf GPQA Diamond.", source_name: "Build Fast with AI", source_url: "https://www.buildfastwithai.com/blogs/ai-models-march-2026-releases", published_at: new Date().toISOString() },
  { id: "s3", cat: "robotics", impact: "critical", title: "$1.2 Mrd. in einer Woche: Robotics Mega-Round-Ära", summary_b1: "Mind Robotics ($500M), Rhoda AI ($450M), Sunday ($165M). 2026 auf Kurs für $20B+ Funding.", source_name: "AI Funding Tracker", source_url: "https://aifundingtracker.com/", published_at: new Date().toISOString() },
  { id: "s4", cat: "hardware", impact: "critical", title: "NVIDIA GTC 2026: Vera Rubin, $500 Mrd. Chip-Revenue", summary_b1: "Jensen Huang enthüllt Vera Rubin mit H300 GPUs und AI Foundry für Custom Silicon.", source_name: "The Information", source_url: "https://www.theinformation.com/", published_at: new Date().toISOString() },
  { id: "s5", cat: "startups", impact: "critical", title: "AMI Labs: €1.03 Mrd. — größte europäische Seed-Runde", summary_b1: "Yann LeCuns Lab für World Models (JEPA). Backed by Bezos, NVIDIA, Samsung.", source_name: "AI Funding Tracker", source_url: "https://aifundingtracker.com/", published_at: new Date().toISOString() },
  { id: "s6", cat: "regulation", impact: "high", title: "MCP unter offener Governance bei Linux Foundation", summary_b1: "Anthropics Model Context Protocol jetzt open. Standardisierte Agent-Interoperabilität.", source_name: "IBM Think", source_url: "https://www.ibm.com/think/", published_at: new Date().toISOString() },
  { id: "s7", cat: "quantum", impact: "high", title: "IBM: 2026 wird das Jahr des Quantum Advantage", summary_b1: "Erstmals soll Quantencomputer klassische übertreffen. Qiskit Code Assistant mit AI.", source_name: "IBM Think", source_url: "https://www.ibm.com/think/", published_at: new Date().toISOString() },
  { id: "s8", cat: "biotech", impact: "high", title: "Science Corp: $230M für Brain-Computer Interfaces", summary_b1: "Lightspeed, Khosla, YC investieren. Neurotech wird institutionelle Investment-Kategorie.", source_name: "AI Funding Tracker", source_url: "https://aifundingtracker.com/", published_at: new Date().toISOString() },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 3600) return `vor ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)}h`;
  return `vor ${Math.floor(diff / 86400)}d`;
}

function Ticker({ items }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => { const id = setInterval(() => setOffset(p => p - 0.5), 20); return () => clearInterval(id); }, []);
  const txt = items.slice(0, 8).map(n => `${n.impact === "critical" ? "🔴" : "◆"} ${n.title}`).join("     ·     ");
  return (
    <div style={{ background: C.x, color: C.w, overflow: "hidden", height: 32, display: "flex", alignItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${C.x} 60%, transparent)`, zIndex: 2, display: "flex", alignItems: "center", paddingLeft: 12 }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", color: C.rd, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.rd, animation: "pulse 2s infinite" }} />LIVE
        </span>
      </div>
      <div style={{ whiteSpace: "nowrap", fontSize: 11, fontWeight: 500, transform: `translateX(${offset}px)`, paddingLeft: 80, color: C.g300 }}>{txt + "     ·     " + txt}</div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: `linear-gradient(270deg, ${C.x} 60%, transparent)`, zIndex: 2 }} />
    </div>
  );
}

function ImpactBadge({ impact }) {
  const d = IMPACT[impact]; if (!d) return null;
  return <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", background: d.bg, color: d.c }}>{d.l}</span>;
}

function CatDot({ cat }) {
  const ct = CATEGORIES.find(c => c.id === cat);
  if (!ct) return <span style={{ fontSize: 10, fontWeight: 700, color: C.g400, textTransform: "uppercase" }}>{cat}</span>;
  return <span style={{ fontSize: 10, fontWeight: 700, color: ct.c, letterSpacing: "0.05em", textTransform: "uppercase" }}>{ct.i} {ct.l}</span>;
}

function NewsCard({ item, big }) {
  const cat = item.category || item.cat;
  const summary = item.summary_b1 || item.summary || "";
  const url = item.source_url || "";
  const source = item.source_name || "";
  const time = timeAgo(item.published_at);

  return (
    <div style={{ padding: big ? "20px 24px" : "12px 14px", background: C.w, borderRadius: 14, border: `1px solid ${C.g200}`, cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.bl; e.currentTarget.style.boxShadow = `0 4px 16px ${C.x}06`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.g200; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <ImpactBadge impact={item.impact} /><CatDot cat={cat} />
        <span style={{ fontSize: 10, color: C.g400, marginLeft: "auto" }}>{time}</span>
      </div>
      <h3 style={{ margin: "0 0 4px", fontSize: big ? 20 : 14, fontWeight: 900, color: C.x, lineHeight: 1.25, letterSpacing: "-0.02em" }}>{item.title}</h3>
      <p style={{ margin: "0 0 8px", fontSize: big ? 13 : 12, color: C.g500, lineHeight: 1.5, ...(!big && { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>{summary}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {url && <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: C.bl, textDecoration: "none" }}>{source} ↗</a>}
      </div>
    </div>
  );
}

export default function Newsroom() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const res = await fetch(`${supabaseUrl}/rest/v1/news_items?is_published=eq.true&order=published_at.desc&limit=50`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              const mapped = data.map(d => ({
                ...d, cat: d.category,
              }));
              setLiveCount(mapped.length);
              setNews([...mapped, ...STATIC_NEWS]);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Fallback to static
      }
      setNews(STATIC_NEWS);
      setLoading(false);
    };
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Deduplicate by title
  const seen = new Set();
  const deduped = news.filter(n => {
    const key = (n.title || "").toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const activeCats = [...new Set(deduped.map(n => n.category || n.cat))];
  const visibleCats = CATEGORIES.filter(c => c.id === "all" || activeCats.includes(c.id));

  const filtered = deduped.filter(n => {
    const nCat = n.category || n.cat;
    if (cat !== "all" && nCat !== cat) return false;
    if (search && !n.title?.toLowerCase().includes(search.toLowerCase()) && !(n.summary_b1 || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const hero = filtered.filter(n => n.impact === "critical").slice(0, 2);
  const rest = filtered.filter(n => !hero.includes(n));

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <Ticker items={deduped} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: 0 }}>Newsroom</h2>
        <span style={{ fontSize: 11, color: C.g400 }}>— Das digitale Innovationsmagazin</span>
        {liveCount > 0 && <span style={{ padding: "2px 8px", borderRadius: 4, background: C.gnL, color: C.gn, fontSize: 10, fontWeight: 700 }}>{liveCount} Live</span>}
        <input type="text" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: "auto", width: 160, padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, background: C.w, fontSize: 12, fontFamily: "inherit" }} />
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {visibleCats.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: "4px 10px", borderRadius: 7, border: "none",
            background: cat === c.id ? C.x : "transparent", color: cat === c.id ? C.w : C.g500,
            fontSize: 11, fontWeight: cat === c.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
          }}>{c.i} {c.l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.g400 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${C.g200}`, borderTopColor: C.bl, animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 13 }}>Lade News aus Supabase...</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
            {[{ v: filtered.length, l: "Meldungen", c: C.bl }, { v: liveCount, l: "Live (Crawler)", c: C.gn }, { v: hero.length, l: "Kritisch", c: C.rd }, { v: activeCats.length, l: "Kategorien", c: C.vi }].map((s, i) => (
              <div key={i} style={{ padding: "10px", background: C.w, borderRadius: 10, border: `1px solid ${C.g200}`, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 9, color: C.g500, fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {hero.length > 0 && <div style={{ display: "grid", gridTemplateColumns: hero.length > 1 ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 14 }}>{hero.map((n, i) => <NewsCard key={n.id || i} item={n} big />)}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{rest.map((n, i) => <NewsCard key={n.id || i} item={n} />)}</div>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.g400, fontSize: 13 }}>Keine Meldungen für diesen Filter</div>}
        </>
      )}
    </div>
  );
}
