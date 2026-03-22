import { useState } from "react";
import BusinessInquiry from "./BusinessInquiry";

// ═══════════════════════════════════════════════════════════════
// ZEHNX AGENTUR — Digitale Produkte bauen lassen
// Websites, Apps, Chatbots, Automations
// Separate Saele von Academy und Enterprise
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6",
  g200: "#E5E7EB", g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280",
  g600: "#4B5563", x: "#18181B",
  bl: "#2563EB", blPale: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706",
  vi: "#7C3AED",
};

const REFERENZEN = [
  {
    name: "Sonnentaucher",
    url: "sonnentaucher.app",
    desc: "Full-Stack PWA: 32 DB-Tabellen, AI-Features, DSGVO Gold, Stripe Payments",
    stack: ["React", "Supabase", "Stripe", "PWA"],
  },
  {
    name: "ZEHNX Academy",
    url: "zehnx.me",
    desc: "AI-Lernplattform: 324 Sprints, 3 AI-Bots, Skill-System, Enterprise-Suite",
    stack: ["React", "Supabase", "Claude AI", "Vercel"],
  },
  {
    name: "Automation Projekte",
    url: "",
    desc: "Prozess-Automatisierung: n8n Workflows, CRM-Integration, AI-Pipelines",
    stack: ["n8n", "Stripe", "IONOS SMTP", "Webhooks"],
  },
];

export default function Agentur() {
  const [view, setView] = useState("overview"); // overview | calculator

  if (view === "calculator") {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 20px 0" }}>
          <button onClick={() => setView("overview")} style={{
            border: "none", background: "none", color: Z.g400,
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>← Zurueck zur Uebersicht</button>
        </div>
        <BusinessInquiry />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: Z.bg, fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", color: Z.x }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>AGENTUR</span>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 12px" }}>
            Wir bauen Ihr <span style={{ color: Z.bl }}>digitales Produkt.</span>
          </h1>
          <p style={{ fontSize: 16, color: Z.g500, maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
            AI-Implementierung von Strategie bis Produktion. In Wochen, nicht Monaten. Beratung + Umsetzung + Training aus einer Hand.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setView("calculator")} style={{
              padding: "14px 32px", borderRadius: 12, border: "none",
              background: Z.x, color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>Kostenvoranschlag →</button>
            <button onClick={() => window.location.href = "mailto:hello@zehnx.me?subject=Projektanfrage"} style={{
              padding: "14px 32px", borderRadius: 12,
              border: `1.5px solid ${Z.g200}`, background: Z.w, color: Z.x,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Gespraech vereinbaren</button>
          </div>
        </div>

        {/* TECH STACK */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {["Claude AI", "GPT-4", "Python", "React", "Supabase", "n8n", "Hetzner Frankfurt", "DSGVO-konform", "EU AI Act", "ISO 27001"].map(t => (
            <span key={t} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: Z.g100, color: Z.g500, fontWeight: 500 }}>{t}</span>
          ))}
        </div>

        {/* SERVICES */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.06em", marginBottom: 12 }}>LEISTUNGEN</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {[
              { icon: "◎", name: "AI-Strategie", desc: "AI-Strategie & Roadmap-Entwicklung fuer Ihren Use Case", range: "5.000 – 15.000 €", time: "3–6 Wo." },
              { icon: "◈", name: "Custom AI-Entwicklung", desc: "Custom AI-Loesungen: NLP, Computer Vision, Predictive Analytics", range: "15.000 – 40.000 €", time: "4–12 Wo." },
              { icon: "◆", name: "AI Governance", desc: "Prozessoptimierung & Automatisierung mit AI", range: "50.000 – 150.000 €", time: "4–12 Wo." },
              { icon: "◇", name: "Generative AI", desc: "Generative AI-Anwendungen fuer interne und externe Prozesse", range: "30.000 – 80.000 €", time: "3–6 Wo." },
              { icon: "⚡", name: "AI Governance", desc: "EU AI Act Compliance, AI Governance, Risikobewertung", range: "20.000 – 60.000 €", time: "4–8 Wo." },
              { icon: "◉", name: "AI-Training", desc: "AI-Training & Capability Building fuer Ihr Team", range: "50.000 – 200.000 €", time: "4–12 Wo." },
            ].map(s => (
              <div key={s.name} onClick={() => setView("calculator")} style={{
                background: Z.w, borderRadius: 16, border: `1px solid ${Z.g200}`,
                padding: "20px 18px", cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }} onMouseEnter={e => { e.currentTarget.style.borderColor = Z.g300; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = Z.g200; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: Z.x, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: Z.g500, lineHeight: 1.5, marginBottom: 10 }}>{s.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: Z.bl, fontWeight: 700 }}>{s.range}</span>
                  <span style={{ color: Z.g400 }}>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROCESS */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.06em", marginBottom: 12 }}>UNSER PROZESS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              { n: "01", t: "Anfrage", d: "Kostenvoranschlag in 2 Min oder persoenliches Gespraech" },
              { n: "02", t: "Konzept", d: "Wireframes, Architektur, Angebot innerhalb von 48h" },
              { n: "03", t: "Build", d: "Iteratives Development mit woechentlichen Updates" },
              { n: "04", t: "Launch", d: "DNS, SSL, Monitoring — wir begleiten den Go-Live" },
            ].map(p => (
              <div key={p.n} style={{ background: Z.w, borderRadius: 16, border: `1px solid ${Z.g200}`, padding: "18px 14px" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: Z.g200, marginBottom: 6 }}>{p.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: Z.x, marginBottom: 4 }}>{p.t}</div>
                <div style={{ fontSize: 12, color: Z.g500, lineHeight: 1.5 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>

        
        {/* DIFFERENZIERUNG */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.06em", marginBottom: 12 }}>WARUM ZEHNX</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Grosse Beratungen", speed: "6-12 Monate", cost: "EUR 250K+ Minimum", result: "Empfehlungen" },
              { label: "Boutique-Agenturen", speed: "Variabel", cost: "EUR 20K-100K", result: "Teilloesung" },
              { label: "zehnx Agentur", speed: "4-12 Wochen bis MVP", cost: "EUR 50K-250K", result: "Funktionierendes AI-System", highlight: true },
            ].map(d => (
              <div key={d.label} style={{
                background: d.highlight ? Z.x : Z.w, borderRadius: 16,
                border: d.highlight ? "none" : "1px solid " + Z.g200,
                padding: "18px 16px", color: d.highlight ? "#fff" : Z.x,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: d.highlight ? "#94A3B8" : Z.g500, marginBottom: 4 }}>Speed: {d.speed}</div>
                <div style={{ fontSize: 12, color: d.highlight ? "#94A3B8" : Z.g500, marginBottom: 4 }}>Budget: {d.cost}</div>
                <div style={{ fontSize: 12, color: d.highlight ? Z.bl : Z.gn, fontWeight: 600 }}>Ergebnis: {d.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* REFERENZEN */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.06em", marginBottom: 12 }}>REFERENZEN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REFERENZEN.map(r => (
              <div key={r.name} style={{
                background: Z.w, borderRadius: 16, border: `1px solid ${Z.g200}`,
                padding: "18px 20px", display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: Z.x }}>{r.name}</div>
                  {r.url && <div style={{ fontSize: 12, color: Z.bl }}>{r.url}</div>}
                  <div style={{ fontSize: 13, color: Z.g500, marginTop: 4 }}>{r.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 200, justifyContent: "flex-end" }}>
                  {r.stack.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: Z.g100, color: Z.g500, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: Z.x, borderRadius: 20, padding: "36px 28px",
          textAlign: "center", color: "#fff",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Vom Wissen zur Wertschoepfung</div>
          <p style={{ fontSize: 14, color: "#94A3B8", maxWidth: 400, margin: "0 auto 20px" }}>
            Jedes Projekt wird zum Case Study, jeder Case Study zum Sprint-Inhalt. Kostenloses Erstgespraech — Aufwand, Timeline und Kosten in 48h.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => setView("calculator")} style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: Z.bl, color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>Kostenvoranschlag →</button>
            <button onClick={() => window.location.href = "mailto:hello@zehnx.me?subject=Projektanfrage"} style={{
              padding: "14px 28px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>hello@zehnx.me</button>
          </div>
        </div>

      </div>
    </div>
  );
}
