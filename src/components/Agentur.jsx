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
    desc: "Familien-PWA mit 32 DB-Tabellen, AI-Features, DSGVO Gold",
    stack: ["React", "Supabase", "Stripe", "PWA"],
  },
  {
    name: "ZEHNX Academy",
    url: "zehnx.me",
    desc: "AI-Lernplattform, 324 Sprints, 3 Claude-Bots, Skill-System",
    stack: ["React", "Supabase", "Claude AI", "Vercel"],
  },
  {
    name: "Automation Projekte",
    url: "",
    desc: "n8n Workflows, Rechnungs-Pipelines, CRM-Integration, E-Mail-Sequenzen",
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
            Von der Landing Page bis zur AI-App — moderne Technik, deutsche Server, faire Preise. Unverbindlichen Kostenvoranschlag in 2 Minuten.
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
          {["React", "Supabase", "Vercel", "Stripe", "Claude AI", "n8n", "Astro", "Tailwind", "DSGVO-konform", "Hetzner EU"].map(t => (
            <span key={t} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: Z.g100, color: Z.g500, fontWeight: 500 }}>{t}</span>
          ))}
        </div>

        {/* SERVICES */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.am, letterSpacing: "0.06em", marginBottom: 12 }}>LEISTUNGEN</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {[
              { icon: "◎", name: "Landing Page", desc: "Conversion-optimiert fuer Produkt, Service oder Event", range: "2.500 – 5.000 €", time: "2–3 Wo." },
              { icon: "◈", name: "Unternehmens-Website", desc: "Mehrseitig mit CMS, mehrsprachig moeglich", range: "5.000 – 12.000 €", time: "4–8 Wo." },
              { icon: "◆", name: "Web-App (MVP)", desc: "Custom App mit Auth, Datenbank, Dashboard", range: "8.000 – 20.000 €", time: "6–12 Wo." },
              { icon: "◇", name: "AI Chatbot / Assistent", desc: "Support, Beratung oder Lead-Generierung", range: "3.000 – 8.000 €", time: "2–4 Wo." },
              { icon: "⚡", name: "Prozess-Automation", desc: "n8n Workflows, E-Mail-Sequenzen, CRM-Anbindung", range: "2.000 – 6.000 €", time: "1–3 Wo." },
              { icon: "◉", name: "E-Commerce / Payments", desc: "Stripe-Integration, Abo-Modelle, Checkout", range: "6.000 – 15.000 €", time: "4–8 Wo." },
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
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Projekt besprechen?</div>
          <p style={{ fontSize: 14, color: "#94A3B8", maxWidth: 400, margin: "0 auto 20px" }}>
            Kostenloses Erstgespraech — wir schaetzen Aufwand, Timeline und Kosten.
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
