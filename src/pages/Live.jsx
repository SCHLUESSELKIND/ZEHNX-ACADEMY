import { useState, useEffect, useMemo, useCallback } from "react";

const T = {
  bg: "#050506", s1: "#0C0C0F", s2: "#111115", s3: "#1A1A20",
  bdr: "#232329", bdr2: "#2E2E36",
  tx: "#F0F0F2", t2: "#A8A8B3", t3: "#6E6E7A", t4: "#4A4A55",
  cy: "#22D3EE", cy2: "#06B6D4", cy3: "#0E7490",
  gn: "#10B981", vi: "#8B5CF6", or: "#F59E0B", ro: "#F43F5E",
  bl: "#3B82F6", pk: "#EC4899",
};

const DEPS = {
  apps: { label: "Apps & Dev", color: T.cy, icon: "⚡" },
  design: { label: "Design", color: T.pk, icon: "◈" },
  chatbots: { label: "Chatbots", color: T.gn, icon: "💬" },
  automation: { label: "Automation", color: T.or, icon: "⚙" },
  content: { label: "Content", color: T.vi, icon: "✦" },
  data: { label: "Data", color: T.bl, icon: "◎" },
  business: { label: "Business", color: "#F59E0B", icon: "◆" },
  "self-protection": { label: "Selbstschutz", color: T.ro, icon: "🛡" },
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function fmtDur(s) { if (!s) return ""; const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m} min`; }
function fmtTime(d) { return new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); }

function Pill({ t, c, active, onClick }) {
  return <button onClick={onClick} style={{
    fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
    color: active ? "#000" : c || T.t3,
    background: active ? (c || T.cy) : `${c || T.t3}10`,
    border: `1px solid ${active ? "transparent" : `${c || T.t3}25`}`,
    borderRadius: 8, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
    fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
  }}>{t}</button>;
}

const VIDEOS = [
  { id:"1", yt:"aircAruvnKk", title:"But what is a neural network?", ch:"3Blue1Brown", dur:1140, dep:"apps", lv:"A1", lang:"en", tags:["neural-networks"], why:"Die beste visuelle Erklärung neuronaler Netze — in 19 Minuten.", sp:"3Blue1Brown", feat:true, pick:true, tier:"free", rat:4.9 },
  { id:"2", yt:"VMj-3S1tku0", title:"But what is a GPT? Visual intro to Transformers", ch:"3Blue1Brown", dur:1620, dep:"apps", lv:"A2", lang:"en", tags:["transformers","gpt"], why:"Transformers visuell verstehen — die Grundlage für jedes LLM.", sp:"3Blue1Brown", feat:true, pick:true, tier:"free", rat:4.8 },
  { id:"3", yt:"zjkBMFhNj_g", title:"Intro to Large Language Models", ch:"Andrej Karpathy", dur:3600, dep:"apps", lv:"A2", lang:"en", tags:["llm"], why:"Die beste LLM-Einführung von Andrej Karpathy. Pflichtprogramm.", sp:"Andrej Karpathy", feat:true, pick:true, tier:"free", rat:4.9 },
  { id:"4", yt:"7xTGNNLPyMI", title:"AI in 100 Seconds", ch:"Fireship", dur:140, dep:"apps", lv:"A1", lang:"en", tags:["ai","quick"], why:"In 100 Sekunden weißt du, was AI ist.", sp:"Fireship", feat:false, pick:false, tier:"free", rat:4.5 },
  { id:"5", yt:"_ZvnD96BXbY", title:"ChatGPT Prompt Engineering for Developers", ch:"DeepLearning.AI", dur:5400, dep:"content", lv:"B1", lang:"en", tags:["prompt-engineering"], why:"Der offizielle Prompt Engineering Kurs — Goldstandard.", sp:"Andrew Ng", feat:true, pick:true, tier:"free", rat:4.8 },
  { id:"6", yt:"ySus5ZS0b94", title:"Every AI Tool You Need In One Video", ch:"Matt Wolfe", dur:1800, dep:"automation", lv:"B1", lang:"en", tags:["ai-tools"], why:"Die ultimative AI-Tool-Landkarte — spart dir Stunden Recherche.", sp:"Matt Wolfe", feat:true, pick:false, tier:"free", rat:4.4 },
  { id:"7", yt:"TRjq7t2Ms5I", title:"I Built 10 AI Automations — Here Are The Best", ch:"The AI Advantage", dur:1200, dep:"automation", lv:"B1", lang:"en", tags:["automation","n8n"], why:"Automation in der Praxis — direkt nachmachen.", sp:"The AI Advantage", feat:false, pick:true, tier:"free", rat:4.3 },
  { id:"8", yt:"T-D1OfcDW1M", title:"Building RAG from Scratch", ch:"DeepLearning.AI", dur:2700, dep:"apps", lv:"B2", lang:"en", tags:["rag","vector-db"], why:"RAG selbst bauen — die wichtigste Skill für AI-Entwickler.", sp:"Andrew Ng", feat:true, pick:true, tier:"pro", rat:4.7 },
  { id:"9", yt:"sal78ACtGTc", title:"What are AI Agents?", ch:"Fireship", dur:480, dep:"apps", lv:"B1", lang:"en", tags:["agents"], why:"Agents in 8 Minuten verstehen — kompakt und auf den Punkt.", sp:"Fireship", feat:false, pick:true, tier:"free", rat:4.5 },
  { id:"10", yt:"jvqFAi7vkBc", title:"State of AI 2025", ch:"AI Explained", dur:3600, dep:"business", lv:"B2", lang:"en", tags:["trends"], why:"Die beste jährliche AI-Standortbestimmung.", sp:"AI Explained", feat:true, pick:true, tier:"pro", rat:4.6 },
  { id:"11", yt:"kCc8FmEb1nY", title:"Let's build GPT: from scratch, in code", ch:"Andrej Karpathy", dur:7200, dep:"apps", lv:"C1", lang:"en", tags:["gpt","from-scratch"], why:"GPT from scratch in 2 Stunden. Für alle die es wirklich verstehen wollen.", sp:"Andrej Karpathy", feat:true, pick:true, tier:"pro", rat:5.0 },
  { id:"12", yt:"YQ_xWvX1n9g", title:"I Tried Every AI Image Generator", ch:"Matt Wolfe", dur:1500, dep:"design", lv:"A2", lang:"en", tags:["midjourney","image-gen"], why:"Alle Bildgeneratoren im Direktvergleich.", sp:"Matt Wolfe", feat:false, pick:false, tier:"free", rat:4.2 },
  { id:"13", yt:"qYNweeDHiyU", title:"I Analyzed Data with ChatGPT", ch:"Tina Huang", dur:720, dep:"data", lv:"B1", lang:"en", tags:["data-analysis"], why:"Datenanalyse in Minuten statt Tagen.", sp:"Tina Huang", feat:false, pick:true, tier:"free", rat:4.3 },
  { id:"14", yt:"Nlkk3glap_U", title:"The Alignment Problem — Intro to AI Safety", ch:"AI Explained", dur:1800, dep:"self-protection", lv:"B2", lang:"en", tags:["ai-safety"], why:"AI Safety verstehen — wichtig für jeden.", sp:"AI Explained", feat:false, pick:false, tier:"pro", rat:4.4 },
];

const EVENTS = [
  { id:"e1", title:"ZEHNX Weekly: AI Tools Update", fmt:"online", at:"2026-03-29T18:00+01:00", dep:"automation", lv:"B1", free:true, org:"ZEHNX Academy", tags:["weekly"], feat:true, tier:"free", rsvp:47 },
  { id:"e2", title:"Prompt Engineering Masterclass", fmt:"online", at:"2026-04-02T19:00+01:00", dep:"content", lv:"B2", free:true, org:"ZEHNX Academy", tags:["workshop"], feat:true, tier:"pro", rsvp:32 },
  { id:"e3", title:"ZEHNX Weekly: AI Tools Update", fmt:"online", at:"2026-04-05T18:00+01:00", dep:"automation", lv:"B1", free:true, org:"ZEHNX Academy", tags:["weekly"], feat:false, tier:"free", rsvp:23 },
  { id:"e4", title:"Hot Seat: Bring Your Project", fmt:"online", at:"2026-04-08T19:00+01:00", dep:"apps", lv:"B1", free:true, org:"ZEHNX Academy", tags:["hot-seat"], feat:true, tier:"expert", rsvp:12 },
  { id:"e5", title:"AI Meetup Köln #24", fmt:"offline", city:"Köln", at:"2026-04-10T18:30+01:00", dep:"business", lv:"B1", free:true, org:"AI Meetup Cologne", tags:["meetup"], feat:true, tier:"free", rsvp:68 },
  { id:"e6", title:"RAG Workshop: Build Your Knowledge Base", fmt:"online", at:"2026-04-12T10:00+01:00", dep:"apps", lv:"B2", free:true, org:"ZEHNX Academy", tags:["rag","hands-on"], feat:true, tier:"pro", rsvp:41 },
  { id:"e7", title:"AI Founders Lunch — Düsseldorf", fmt:"offline", city:"Düsseldorf", at:"2026-04-17T12:00+01:00", dep:"business", lv:"B1", free:true, org:"ZEHNX Community", tags:["lunch"], feat:false, tier:"pro", rsvp:8 },
  { id:"e8", title:"AI Engineer Summit Berlin", fmt:"offline", city:"Berlin", at:"2026-05-15T09:00+01:00", dep:"apps", lv:"B2", free:false, price:599, org:"AI Engineer", tags:["conference"], feat:true, tier:"free", rsvp:234 },
  { id:"e9", title:"Google I/O Watch Party", fmt:"online", at:"2026-05-20T18:00+01:00", dep:"apps", lv:"A2", free:true, org:"ZEHNX Academy", tags:["google"], feat:false, tier:"free", rsvp:89 },
  { id:"e10", title:"WeAreDevelopers AI Day Wien", fmt:"offline", city:"Wien", at:"2026-06-05T09:00+01:00", dep:"apps", lv:"B1", free:false, price:299, org:"WeAreDevelopers", tags:["conference"], feat:false, tier:"free", rsvp:156 },
];

function VCard({ v, onClick }) {
  const d = DEPS[v.dep] || { label: v.dep, color: T.t3 };
  const tc = { free: T.gn, pro: T.cy, expert: T.vi };
  return (
    <div onClick={() => onClick(v)} style={{ background: T.s2, borderRadius: 14, overflow: "hidden", border: `1px solid ${v.pick ? T.cy+"20" : T.bdr}`, cursor: "pointer" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", background: T.s3 }}>
        <img src={`https://img.youtube.com/vi/${v.yt}/mqdefault.jpg`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        <div style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,.85)", borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{fmtDur(v.dur)}</div>
        {v.pick && <div style={{ position: "absolute", top: 6, left: 6, background: T.cy, borderRadius: 6, padding: "2px 7px", fontSize: 9, fontWeight: 800, color: "#000", letterSpacing: ".08em", fontFamily: "'JetBrains Mono', monospace" }}>ZEHNX PICK</div>}
        {v.tier !== "free" && <div style={{ position: "absolute", top: 6, right: 6, background: tc[v.tier], borderRadius: 6, padding: "2px 7px", fontSize: 9, fontWeight: 800, color: "#000", letterSpacing: ".08em", fontFamily: "'JetBrains Mono', monospace" }}>{v.tier.toUpperCase()}</div>}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: d.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{d.icon} {d.label}</span>
          <span style={{ fontSize: 9, color: T.t4 }}>•</span>
          <span style={{ fontSize: 10, color: T.t3, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{v.lv}</span>
          {v.rat > 0 && <><span style={{ fontSize: 9, color: T.t4 }}>•</span><span style={{ fontSize: 10, color: T.or }}>★ {v.rat}</span></>}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.tx, margin: "0 0 4px", lineHeight: 1.35, fontFamily: "'DM Sans', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</h3>
        <div style={{ fontSize: 11.5, color: T.t3, marginBottom: 5 }}>{v.ch}</div>
        <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.why}</div>
      </div>
    </div>
  );
}

function ECard({ e, rsvpd, onRSVP }) {
  const d = DEPS[e.dep] || { label: e.dep, color: T.t3 };
  const tc = { free: T.gn, pro: T.cy, expert: T.vi };
  return (
    <div style={{ background: T.s2, borderRadius: 14, padding: "16px 18px", border: `1px solid ${e.feat ? d.color+"20" : T.bdr}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ textAlign: "center", marginRight: 14, flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.tx }}>{new Date(e.at).getDate()}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'JetBrains Mono', monospace" }}>{new Date(e.at).toLocaleDateString("de-DE",{month:"short"})}</div>
          <div style={{ fontSize: 10, color: T.t4, fontFamily: "'JetBrains Mono', monospace" }}>{fmtTime(e.at)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: e.fmt==="online"?T.cy:T.or, background: (e.fmt==="online"?T.cy:T.or)+"12", borderRadius: 5, padding: "2px 6px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".06em" }}>{e.fmt==="online"?"ONLINE":e.city||"OFFLINE"}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: d.color, background: d.color+"12", borderRadius: 5, padding: "2px 6px", fontFamily: "'JetBrains Mono', monospace" }}>{d.label}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: tc[e.tier], background: tc[e.tier]+"12", borderRadius: 5, padding: "2px 6px", fontFamily: "'JetBrains Mono', monospace" }}>{e.tier.toUpperCase()}</span>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.tx, margin: "0 0 4px", lineHeight: 1.35 }}>{e.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: T.t3 }}>{e.org}</span>
            {!e.free && <span style={{ fontSize: 11, fontWeight: 700, color: T.or }}>€{e.price}</span>}
            <span style={{ fontSize: 11, color: T.t4 }}>{e.rsvp} going</span>
          </div>
        </div>
        <button onClick={() => onRSVP(e.id)} style={{
          background: rsvpd ? T.gn+"15" : d.color+"15",
          border: `1px solid ${rsvpd ? T.gn+"30" : d.color+"30"}`,
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          color: rsvpd ? T.gn : d.color, fontSize: 11, fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
        }}>{rsvpd ? "✓ Going" : "RSVP"}</button>
      </div>
    </div>
  );
}

export default function ZehnxLive() {
  const [tab, setTab] = useState("library");
  const [q, setQ] = useState("");
  const [dep, setDep] = useState(null);
  const [lv, setLv] = useState(null);
  const [picks, setPicks] = useState(false);
  const [freeF, setFreeF] = useState(false);
  const [calFmt, setCalFmt] = useState(null);
  const [wl, setWl] = useState(new Set());
  const [rsvps, setRsvps] = useState(new Set());
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);

  const vids = useMemo(() => VIDEOS.filter(v => {
    if (q && !v.title.toLowerCase().includes(q.toLowerCase()) && !v.sp.toLowerCase().includes(q.toLowerCase()) && !v.tags.some(t=>t.includes(q.toLowerCase()))) return false;
    if (dep && v.dep !== dep) return false;
    if (lv && v.lv !== lv) return false;
    if (picks && !v.pick) return false;
    if (freeF && v.tier !== "free") return false;
    return true;
  }), [q, dep, lv, picks, freeF]);

  const evts = useMemo(() => EVENTS.filter(e => {
    if (dep && e.dep !== dep) return false;
    if (lv && e.lv !== lv) return false;
    if (calFmt && e.fmt !== calFmt) return false;
    return true;
  }).sort((a,b) => new Date(a.at)-new Date(b.at)), [dep, lv, calFmt]);

  if (sel) {
    const v = sel, d = DEPS[v.dep] || { label: v.dep, color: T.t3 };
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.tx, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: T.bg+"EE", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.bdr}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSel(null)} style={{ background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: "6px 14px", color: T.t2, fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>← Zurück</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.tx, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</span>
        </div>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe src={`https://www.youtube.com/embed/${v.yt}?rel=0&modestbranding=1`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
        <div style={{ padding: "16px 16px 80px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: d.color, background: d.color+"12", borderRadius: 6, padding: "3px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{d.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.t3, background: T.t3+"12", borderRadius: 6, padding: "3px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{v.lv}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.t3, background: T.t3+"12", borderRadius: 6, padding: "3px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{fmtDur(v.dur)}</span>
            {v.rat > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: T.or, background: T.or+"12", borderRadius: 6, padding: "3px 8px", fontFamily: "'JetBrains Mono', monospace" }}>★ {v.rat}</span>}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.tx, margin: "0 0 6px", letterSpacing: "-.01em" }}>{v.title}</h2>
          <div style={{ fontSize: 13, color: T.t3, marginBottom: 14 }}>{v.ch} • {v.sp}</div>
          <div style={{ fontSize: 14, color: T.t2, lineHeight: 1.7, marginBottom: 16 }}>{v.why}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { const n = new Set(wl); n.has(v.id)?n.delete(v.id):n.add(v.id); setWl(n); }} style={{ flex: 1, background: wl.has(v.id)?T.cy+"15":T.s2, border: `1px solid ${wl.has(v.id)?T.cy+"30":T.bdr}`, borderRadius: 10, padding: "10px", color: wl.has(v.id)?T.cy:T.t3, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>{wl.has(v.id) ? "✓ Watchlist" : "+ Watchlist"}</button>
            <button onClick={() => window.open(`https://youtube.com/watch?v=${v.yt}`, "_blank")} style={{ flex: 1, background: T.ro+"15", border: `1px solid ${T.ro}30`, borderRadius: 10, padding: "10px", color: T.ro, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>▶ YouTube</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.tx, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: T.bg+"EE", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: T.cy, fontFamily: "'JetBrains Mono', monospace" }}>ZEHNX ACADEMY</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: T.tx, margin: 0, letterSpacing: "-.02em" }}>LIVE</h1>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["library","calendar"].map(t => (
                <button key={t} onClick={() => { setTab(t); setDep(null); setLv(null); }} style={{
                  background: tab===t?T.cy+"15":"transparent", border: `1px solid ${tab===t?T.cy+"30":"transparent"}`,
                  borderRadius: 10, padding: "7px 14px", cursor: "pointer",
                  color: tab===t?T.cy:T.t4, fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                }}>{t==="library"?"📚 Bibliothek":"📅 Kalender"}</button>
              ))}
            </div>
          </div>
          {tab==="library" && <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Suche nach Titel, Speaker, Tag..." style={{ width: "100%", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: "10px 14px", color: T.tx, fontSize: 13, outline: "none", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />}
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 10 }}>
            {tab==="library" && <>
              <Pill t="ZEHNX Picks" c={T.cy} active={picks} onClick={()=>setPicks(!picks)} />
              <Pill t="Free" c={T.gn} active={freeF} onClick={()=>setFreeF(!freeF)} />
            </>}
            {tab==="calendar" && <>
              <Pill t="Alle" c={T.t3} active={!calFmt} onClick={()=>setCalFmt(null)} />
              <Pill t="Online" c={T.cy} active={calFmt==="online"} onClick={()=>setCalFmt(calFmt==="online"?null:"online")} />
              <Pill t="Offline" c={T.or} active={calFmt==="offline"} onClick={()=>setCalFmt(calFmt==="offline"?null:"offline")} />
            </>}
            <span style={{ width: 1, background: T.bdr, margin: "0 2px", flexShrink: 0 }} />
            {Object.entries(DEPS).map(([k,dd])=><Pill key={k} t={dd.label} c={dd.color} active={dep===k} onClick={()=>setDep(dep===k?null:k)} />)}
            <span style={{ width: 1, background: T.bdr, margin: "0 2px", flexShrink: 0 }} />
            {LEVELS.map(l=><Pill key={l} t={l} c={T.t3} active={lv===l} onClick={()=>setLv(lv===l?null:l)} />)}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 80px" }}>
        {tab==="library" && <>
          <div style={{ fontSize: 12, color: T.t4, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>{vids.length} Videos</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {vids.map(v => <VCard key={v.id} v={v} onClick={setSel} />)}
          </div>
          {vids.length===0 && <div style={{ textAlign: "center", padding: "40px 20px" }}><div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div><div style={{ fontSize: 14, color: T.t3 }}>Keine Videos gefunden.</div></div>}
        </>}
        {tab==="calendar" && <>
          <div style={{ fontSize: 12, color: T.t4, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>{evts.length} Events</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {evts.map(e => <ECard key={e.id} e={e} rsvpd={rsvps.has(e.id)} onRSVP={(id)=>{ const n=new Set(rsvps); n.has(id)?n.delete(id):n.add(id); setRsvps(n); }} />)}
          </div>
          {evts.length===0 && <div style={{ textAlign: "center", padding: "40px 20px" }}><div style={{ fontSize: 32, marginBottom: 10 }}>📅</div><div style={{ fontSize: 14, color: T.t3 }}>Keine Events gefunden.</div></div>}
        </>}
      </div>

      {(wl.size>0||rsvps.size>0) && <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", background: T.s2, border: `1px solid ${T.bdr}`, borderRadius: 14, padding: "8px 16px", display: "flex", gap: 14, alignItems: "center", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,.4)" }}>
        {wl.size>0 && <span style={{ fontSize: 12, color: T.cy, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>📚 {wl.size} Watchlist</span>}
        {rsvps.size>0 && <span style={{ fontSize: 12, color: T.gn, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>📅 {rsvps.size} RSVPs</span>}
      </div>}
    </div>
  );
}
