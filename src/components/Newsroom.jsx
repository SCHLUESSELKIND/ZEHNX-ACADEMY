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
];

const IMPACT = {
  critical: { l: "KRITISCH", c: C.rd, bg: C.rdL },
  high: { l: "HOCH", c: C.am, bg: C.amL },
  medium: { l: "MITTEL", c: C.bl, bg: C.blXL },
};

const NEWS = [
  { id:1, cat:"models", impact:"critical", time:"2h", title:"OpenAI launcht GPT-5.4 Mini & Nano — kleiner, schneller, billiger", summary:"Mini kostet $0.75/1M Input Tokens bei 400K Context Window. SWE-Bench Pro: 57.7%. Tool Search reduziert Latenz bei 50+ Tools drastisch.", source:"OpenAI", url:"https://openai.com/index/gpt-5-4-mini/", tags:["GPT-5.4","Small Models"], resources:[{t:"Release Notes",u:"https://releasebot.io/updates/openai",type:"doc"}], sprint:"Prompt Mastery" },
  { id:2, cat:"models", impact:"high", time:"3d", title:"12+ AI-Modelle in einer Woche — März 2026 bricht alle Release-Rekorde", summary:"GPT-5.4, Qwen 3.5, NVIDIA Nemotron 3 Super. Alibabas 9B Open-Source schlägt OpenAIs 120B auf GPQA Diamond (81.7 vs 71.5).", source:"Build Fast with AI", url:"https://www.buildfastwithai.com/blogs/ai-models-march-2026-releases", tags:["Open Source","Qwen"], resources:[{t:"LLM Stats",u:"https://llm-stats.com/ai-news",type:"tool"}], sprint:"RAG Knowledge Bot" },
  { id:3, cat:"models", impact:"high", time:"1w", title:"Gemini 3.1 Pro: 1M-Token Context, 77.1% ARC-AGI-2", summary:"Googles fortschrittlichstes Pro-Modell: Multimodal über Text, Bilder, Audio, Video und Code.", source:"LLM Stats", url:"https://llm-stats.com/ai-news", tags:["Google","Gemini"], resources:[], sprint:"AI Chat Widget" },
  { id:4, cat:"models", impact:"medium", time:"2w", title:"Claude Memory rollt für alle User aus — persistenter Kontext", summary:"Anthropic gibt allen Claude-Usern Memory: Präferenzen, Projekte, Schreibstil über Konversationen gespeichert.", source:"Labla AI", url:"https://www.labla.org/latest-ai-model-releases-past-24-hours/", tags:["Anthropic","Claude"], resources:[], sprint:"AI Onboarding Flow" },
  { id:5, cat:"robotics", impact:"critical", time:"1w", title:"$1.2 Mrd. in einer Woche: Robotics Mega-Round-Ära", summary:"Mind Robotics ($500M), Rhoda AI ($450M), Sunday ($165M Unicorn), Oxa ($103M). 2026 auf Kurs für $20B+ Robotics-Funding.", source:"AI Funding Tracker", url:"https://aifundingtracker.com/ai-startup-funding-news-today/", tags:["Funding","Humanoids"], resources:[{t:"Crunchbase",u:"https://news.crunchbase.com/",type:"data"}], sprint:"AI Strategie Sprint" },
  { id:6, cat:"robotics", impact:"high", time:"3d", title:"Hyundai + Boston Dynamics: LLMs steuern mobile Roboter", summary:"AI+Robotics Roadmap integriert LLMs in mobile Roboter für natürliche Mensch-Maschine-Interaktion.", source:"Mean CEO", url:"https://blog.mean.ceo/new-ai-model-releases-news-march-2026/", tags:["Physical AI"], resources:[], sprint:"Voice Agent MVP" },
  { id:7, cat:"biotech", impact:"high", time:"3d", title:"Science Corp: $230M für Brain-Computer Interfaces", summary:"Lightspeed, Khosla und Y Combinator investieren in Neural Interfaces. Neurotech wird institutionelle Investment-Kategorie.", source:"AI Funding Tracker", url:"https://aifundingtracker.com/ai-startup-funding-news-today/", tags:["BCI","Neurotech"], resources:[], sprint:"AI Strategie Sprint" },
  { id:8, cat:"biotech", impact:"high", time:"2w", title:"AI-entdeckte Medikamente erreichen klinische Spätphasen", summary:"KI-designte Wirkstoffkandidaten in Mid-to-Late-Stage Clinical Trials. Fokus Onkologie und seltene Erkrankungen.", source:"Crescendo AI", url:"https://www.crescendo.ai/news/latest-ai-news-and-updates", tags:["Drug Discovery"], resources:[], sprint:"Marktanalyse in 60 Min" },
  { id:9, cat:"startups", impact:"critical", time:"2w", title:"AMI Labs: €1.03 Mrd. — größte europäische Seed-Runde ever", summary:"Yann LeCuns Lab für World Models (JEPA). Backed by Bezos, NVIDIA, Samsung. Bestfinanzierte Wette gegen ChatGPT-Paradigma.", source:"AI Funding Tracker", url:"https://aifundingtracker.com/ai-startup-funding-news-today/", tags:["JEPA","World Models"], resources:[], sprint:"AI Strategie Sprint" },
  { id:10, cat:"startups", impact:"high", time:"1w", title:"OpenAI bei $25 Mrd. Jahresumsatz — IPO 2026 möglich", summary:"Anthropic nähert sich $19 Mrd. AI-Modell-Markt wächst schneller als jeder andere Tech-Sektor.", source:"Crescendo AI", url:"https://www.crescendo.ai/news/latest-ai-news-and-updates", tags:["OpenAI","IPO"], resources:[], sprint:"AI Act Quick Check" },
  { id:11, cat:"hardware", impact:"critical", time:"5d", title:"NVIDIA GTC: Vera Rubin Plattform, $500 Mrd. Chip-Revenue", summary:"Jensen Huang enthüllt Vera Rubin mit H300 GPUs und AI Foundry für Custom Silicon.", source:"The Information", url:"https://www.theinformation.com/", tags:["NVIDIA","GTC"], resources:[{t:"GTC Keynote",u:"https://www.nvidia.com/en-us/gtc/",type:"video"}], sprint:"AI Strategie Sprint" },
  { id:12, cat:"hardware", impact:"high", time:"2w", title:"Mastercard baut eigenes Foundation Model auf NVIDIA", summary:"Large Tabular Model (LTM) auf strukturierten Transaktionsdaten. Hybrid-Cybersecurity gegen Betrug.", source:"Mastercard", url:"https://www.mastercard.com/us/en/news-and-trends/stories/2026/mastercard-new-generative-ai-model.html", tags:["FinTech"], resources:[], sprint:"Dashboard aus Rohdaten" },
  { id:13, cat:"regulation", impact:"critical", time:"1w", title:"UK fordert von xAI Erklärungen: Grok erzeugt problematische Bilder", summary:"ICO und Ofcom verlangen Details zu Sicherheitsmechanismen. Verstoß gegen Online Safety Act droht.", source:"Crescendo AI", url:"https://www.crescendo.ai/news/latest-ai-news-and-updates", tags:["xAI","Safety"], resources:[], sprint:"Deepfake Defense" },
  { id:14, cat:"regulation", impact:"high", time:"2w", title:"Trump vs. Bundesstaaten: AI-Regulierung eskaliert", summary:"Executive Order soll State AI Laws aushebeln. Lobby-Narrativ: Flickenteppich bremst Innovation gegen China.", source:"MIT Tech Review", url:"https://www.technologyreview.com/", tags:["US Policy"], resources:[], sprint:"AI Act Quick Check" },
  { id:15, cat:"regulation", impact:"high", time:"3w", title:"MCP unter offener Governance bei Linux Foundation", summary:"Anthropics Model Context Protocol jetzt open. A2A vor Major Release. Standardisierte Agent-Interoperabilität.", source:"IBM Think", url:"https://www.ibm.com/think/news/ai-tech-trends-predictions-2026", tags:["MCP","Standards"], resources:[], sprint:"AI Chat Widget" },
  { id:16, cat:"climate", impact:"high", time:"2w", title:"Battery-Startup-Krise: 24M Technologies schließt", summary:"$1 Mrd. Bewertung, jetzt Auktion. Investoren ziehen sich zurück, EV-Batteriemarkt kühlt ab.", source:"MIT Tech Review", url:"https://www.technologyreview.com/", tags:["Batteries","EVs"], resources:[], sprint:"Marktanalyse in 60 Min" },
  { id:17, cat:"quantum", impact:"high", time:"2w", title:"IBM: 2026 wird das Jahr des Quantum Advantage", summary:"Erstmals soll Quantencomputer klassische übertreffen. Qiskit Code Assistant generiert Quantencode mit AI.", source:"IBM Think", url:"https://www.ibm.com/think/news/ai-tech-trends-predictions-2026", tags:["IBM","Quantum"], resources:[], sprint:"AI Strategie Sprint" },
  { id:18, cat:"quantum", impact:"medium", time:"1w", title:"Qutwo: Ex-AMD-Gründer baut AI-Lab für Quantum-Ära", summary:"Nach $665M Exit: Qutwo OS als Orchestration Layer. Erster Kunde: Zalando.", source:"TechCrunch", url:"https://techcrunch.com/2026/03/12/before-quantum-computing-arrives-this-startup-wants-enterprises-already-running-on-it/", tags:["Qutwo"], resources:[], sprint:"AI Strategie Sprint" },
];

const TICKER = [
  { t: "NVIDIA GTC 2026 — Vera Rubin, $500B Revenue-Prognose", hot: true },
  { t: "GPT-5.4 Mini: $0.75/1M Tokens, 400K Context", hot: true },
  { t: "Robotics-Funding März: >$1.2 Mrd. in einer Woche", hot: false },
  { t: "AMI Labs (LeCun): €1.03 Mrd. Seed — EU-Rekord", hot: true },
  { t: "Apple: KI-Siri mit Gemini kommt März 2026", hot: true },
  { t: "Rogue AI Agent verursacht Security-Incident bei Meta", hot: true },
  { t: "IBM: Quantum Advantage 2026", hot: false },
  { t: "Claude Memory für alle User ausgerollt", hot: false },
];

function Ticker() {
  const [offset, setOffset] = useState(0);
  useEffect(() => { const id = setInterval(() => setOffset(p => p - 0.5), 20); return () => clearInterval(id); }, []);
  const txt = TICKER.map(t => `${t.hot ? "🔴" : "◆"} ${t.t}`).join("     ·     ");
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
  return <span style={{ fontSize: 10, fontWeight: 700, color: ct?.c, letterSpacing: "0.05em", textTransform: "uppercase" }}>{ct?.i} {ct?.l}</span>;
}

function NewsCard({ item, big }) {
  return (
    <div style={{ padding: big ? "20px 24px" : "12px 14px", background: C.w, borderRadius: 14, border: `1px solid ${C.g200}`, cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.bl; e.currentTarget.style.boxShadow = `0 4px 16px ${C.x}06`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.g200; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <ImpactBadge impact={item.impact} /><CatDot cat={item.cat} />
        <span style={{ fontSize: 10, color: C.g400, marginLeft: "auto" }}>vor {item.time}</span>
      </div>
      <h3 style={{ margin: "0 0 4px", fontSize: big ? 20 : 14, fontWeight: 900, color: C.x, lineHeight: 1.25, letterSpacing: "-0.02em" }}>{item.title}</h3>
      <p style={{ margin: "0 0 8px", fontSize: big ? 13 : 12, color: C.g500, lineHeight: 1.5, ...(!big && { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>{item.summary}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: C.bl, textDecoration: "none" }}>{item.source} ↗</a>
        {item.tags.map((t, i) => <span key={i} style={{ padding: "1px 6px", borderRadius: 4, background: C.g100, color: C.g600, fontSize: 9, fontWeight: 600 }}>#{t}</span>)}
        {item.resources.map((r, i) => <a key={i} href={r.u} target="_blank" rel="noopener noreferrer" style={{ padding: "2px 7px", borderRadius: 5, background: C.g100, border: `1px solid ${C.g200}`, color: C.g700, fontSize: 10, fontWeight: 500, textDecoration: "none" }}>{r.t} ↗</a>)}
        {item.sprint && <span style={{ fontSize: 10, color: C.bl, fontWeight: 600, background: C.blXL, padding: "2px 6px", borderRadius: 4 }}>⚡ {item.sprint}</span>}
      </div>
    </div>
  );
}

export default function Newsroom() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = NEWS.filter(n => {
    if (cat !== "all" && n.cat !== cat) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const hero = filtered.filter(n => n.impact === "critical").slice(0, 2);
  const rest = filtered.filter(n => !hero.includes(n));

  return (
    <div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <Ticker />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: 0 }}>Newsroom</h2>
        <span style={{ fontSize: 11, color: C.g400 }}>— Das digitale Innovationsmagazin</span>
        <input type="text" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: "auto", width: 160, padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.g200}`, background: C.w, fontSize: 12, fontFamily: "inherit" }} />
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: "4px 10px", borderRadius: 7, border: "none",
            background: cat === c.id ? C.x : "transparent", color: cat === c.id ? C.w : C.g500,
            fontSize: 11, fontWeight: cat === c.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
          }}>{c.i} {c.l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
        {[{ v: "271+", l: "AI Models Q1", c: C.bl }, { v: "$340B", l: "VC H1 2026", c: C.gn }, { v: "$14B", l: "Robotics '25", c: C.vi }, { v: "50%+", l: "VC → AI", c: C.am }].map((s, i) => (
          <div key={i} style={{ padding: "10px", background: C.w, borderRadius: 10, border: `1px solid ${C.g200}`, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 9, color: C.g500, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {hero.length > 0 && <div style={{ display: "grid", gridTemplateColumns: hero.length > 1 ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 14 }}>{hero.map(n => <NewsCard key={n.id} item={n} big />)}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{rest.map(n => <NewsCard key={n.id} item={n} />)}</div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.g400, fontSize: 13 }}>Keine Meldungen für diesen Filter</div>}
    </div>
  );
}
