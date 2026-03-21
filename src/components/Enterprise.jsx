import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX ENTERPRISE — AI-Readiness fuer Unternehmen
// Team-Training, AI Act Compliance, Skill-Mapping, Cohorts
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6",
  g200: "#E5E7EB", g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280",
  g600: "#4B5563", g700: "#374151", g800: "#1F2937", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", blPale: "#EFF6FF",
  gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB",
  vi: "#7C3AED", viL: "#F5F3FF",
  rd: "#DC2626",
};

const STATS = [
  { value: "80%", label: "der Unternehmen brauchen AI-Training", sub: "Nur 20% haben geschult" },
  { value: "Art. 4", label: "EU AI Act Pflicht", sub: "Seit Februar 2025" },
  { value: "2.7×", label: "Produktivitaet", sub: "Geschulte vs. Selbstlerner" },
  { value: "€3.70", label: "ROI pro investiertem Euro", sub: "In AI-Weiterbildung" },
];

const FEATURES = [
  {
    icon: "🎯", title: "AI Readiness Assessment",
    desc: "X-SCORE fuer jedes Teammitglied. Misst AI-Kompetenz in 5 Dimensionen. Zeigt Gaps, empfiehlt Sprints. Compliance-Report fuer Art. 4 EU AI Act.",
    tag: "Compliance", tagColor: Z.gn,
  },
  {
    icon: "👥", title: "Sprint Cohorts",
    desc: "Teams lernen zusammen, nicht nebeneinander. Manager weist Sprint zu, alle starten gleichzeitig. 67% hoeheres Engagement als Selbststudium.",
    tag: "Team-Learning", tagColor: Z.bl,
  },
  {
    icon: "📊", title: "Intelligence Dashboard",
    desc: "Echtzeit-Analytics auf Team- und Mitarbeiter-Ebene. Skill-Progression, Engagement-Heatmaps, Time-to-Competency. Export als PDF fuer Quartals-Reviews.",
    tag: "Analytics", tagColor: Z.vi,
  },
  {
    icon: "🧭", title: "AI Skill-Mapping",
    desc: "Automatische Analyse der AI-Kompetenz pro Mitarbeiter und Team. Heatmap ueber alle 8 Departments. L&D kann gezielt Lernpfade zuweisen statt Giesskanne.",
    tag: "Differentiator", tagColor: Z.vi,
  },
  {
    icon: "🤖", title: "AI Learning Coach",
    desc: "Persoenlicher AI-Tutor pro Mitarbeiter. Beantwortet Fragen im Sprint-Kontext, erklaert Code, schlaegt naechste Schritte vor. Firmen koennen eigene Policies einspeisen.",
    tag: "AI-native", tagColor: Z.am,
  },
  {
    icon: "🛡️", title: "Security & DSGVO",
    desc: "Hosting auf Hetzner Frankfurt. Verschluesselt at-rest und in-transit. Audit-Logs, AVV, IP-Whitelisting. Fuer regulierte Branchen geeignet.",
    tag: "Enterprise-Standard", tagColor: Z.gn,
  },
  {
    icon: "🏆", title: "Team Challenges",
    desc: "Woechentliche AI-Challenges fuer Teams. Echte Aufgaben: 'Baut einen Prompt fuer euren Sales-Prozess.' Peer-Voting, Manager-Review, Team-Rankings.",
    tag: "Engagement", tagColor: Z.bl,
  },
  {
    icon: "📋", title: "Custom Content Studio",
    desc: "Eigene Module und Sprints erstellen. Firmeneigene AI-Policies, interne Tools, branchenspezifische Use Cases. AI hilft beim Erstellen von Quizzes aus Firmendokumenten.",
    tag: "Add-On", tagColor: Z.am,
  },
];

const TIERS = [
  {
    name: "Team", price: "29", unit: "/ Seat / Monat", desc: "Fuer Teams von 5–50",
    highlight: true,
    features: [
      "Alle 324 Sprints (A1–C2)",
      "Sprint Cohorts (Team-Lernen)",
      "Team Dashboard & Analytics",
      "AI Learning Coach pro Mitarbeiter",
      "X-SCORE Readiness Assessment",
      "Skill-Mapping & Gap-Analyse",
      "Team Challenges",
      "Slack Integration",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise", price: "Custom", unit: "", desc: "Ab 50 Seats. Alles.",
    highlight: false,
    features: [
      "Alles aus Team",
      "White-Label (eigenes Branding + Domain)",
      "SSO/SAML + SCIM Provisioning",
      "Custom Content Studio",
      "AI Act Compliance Reports",
      "Enterprise Newsroom (branchenspezifisch)",
      "API + Webhooks",
      "SCORM/xAPI Export",
      "Dedizierter Customer Success Manager",
      "SLA + Audit Logs",
    ],
  },
];

const PROCESS = [
  { step: "01", title: "Assessment", desc: "X-SCORE fuer Ihr Team — AI-Readiness in 15 Minuten pro Mitarbeiter messen." },
  { step: "02", title: "Lernplan", desc: "Basierend auf Gaps: personalisierte Sprint-Pfade fuer jede Rolle und Abteilung." },
  { step: "03", title: "Cohort Start", desc: "Teams starten gemeinsam. AI Coach begleitet. Manager sieht Fortschritt in Echtzeit." },
  { step: "04", title: "Compliance", desc: "Zertifikate, Skill-Reports, AI Act Nachweis — alles dokumentiert und exportierbar." },
];

function Card({ children, style, hover }) {
  return (
    <div style={{
      background: Z.w, borderRadius: 16, border: `1px solid ${Z.g200}`,
      transition: "border-color 0.2s, box-shadow 0.2s",
      ...style,
    }} onMouseEnter={hover ? e => { e.currentTarget.style.borderColor = Z.g300; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"; } : undefined}
       onMouseLeave={hover ? e => { e.currentTarget.style.borderColor = Z.g200; e.currentTarget.style.boxShadow = "none"; } : undefined}>
      {children}
    </div>
  );
}

export default function Enterprise({ onContact }) {
  return (
    <div style={{ minHeight: "100vh", background: Z.bg, fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", color: Z.x }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: Z.vi, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>ENTERPRISE</span>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 12px" }}>
            Machen Sie Ihr Team <span style={{ color: Z.bl }}>AI-ready.</span>
          </h1>
          <p style={{ fontSize: 16, color: Z.g500, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            324 Sprints, AI Act Compliance, Skill-Mapping — alles was L&D-Teams und CTOs brauchen. Ohne Enterprise-Bloat.
          </p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 48 }}>
          {STATS.map(s => (
            <Card key={s.label} style={{ padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: Z.bl, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: Z.x, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: Z.g400, marginTop: 2 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* PROCESS */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.vi, letterSpacing: "0.06em", marginBottom: 12 }}>SO FUNKTIONIERT ES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {PROCESS.map(p => (
              <Card key={p.step} hover style={{ padding: "20px 16px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: Z.g200, marginBottom: 8 }}>{p.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: Z.x, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: Z.g500, lineHeight: 1.5 }}>{p.desc}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.vi, letterSpacing: "0.06em", marginBottom: 12 }}>FEATURES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {FEATURES.map(f => (
              <Card key={f.title} hover style={{ padding: "22px 18px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: Z.x, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: Z.g500, lineHeight: 1.6, marginBottom: 10 }}>{f.desc}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: f.tagColor, padding: "3px 10px", borderRadius: 20, background: `${f.tagColor}10` }}>{f.tag}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.vi, letterSpacing: "0.06em", marginBottom: 12 }}>PRICING</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {TIERS.map(t => (
              <div key={t.name} style={{
                borderRadius: 20, overflow: "hidden",
                border: t.highlight ? `2px solid ${Z.bl}` : `1px solid ${Z.g200}`,
                background: t.highlight ? Z.x : Z.w,
              }}>
                {t.highlight && <div style={{ background: Z.bl, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 0", textAlign: "center", letterSpacing: "0.04em" }}>EMPFOHLEN</div>}
                <div style={{ padding: "24px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.highlight ? Z.g400 : Z.g500, letterSpacing: "0.04em" }}>{t.name.toUpperCase()}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: t.highlight ? "#fff" : Z.x, letterSpacing: "-0.03em" }}>
                      {t.price === "Custom" ? t.price : `€${t.price}`}
                    </span>
                    {t.unit && <span style={{ fontSize: 13, color: t.highlight ? Z.g400 : Z.g400 }}>{t.unit}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: t.highlight ? Z.g400 : Z.g500, marginBottom: 16 }}>{t.desc}</div>
                  {t.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: t.highlight ? Z.bl : Z.gn, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: t.highlight ? "#CBD5E1" : Z.g600 }}>{f}</span>
                    </div>
                  ))}
                  <button onClick={() => onContact?.(t.name.toLowerCase())} style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none", marginTop: 16,
                    background: t.highlight ? Z.bl : Z.bg, color: t.highlight ? "#fff" : Z.x,
                    fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: t.highlight ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
                  }}>{t.price === "Custom" ? "Demo anfragen" : "Team starten →"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card style={{ padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: Z.x, marginBottom: 8 }}>Kostenloses AI Readiness Assessment</div>
          <p style={{ fontSize: 14, color: Z.g500, maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
            In 15 Minuten wissen Sie, wo Ihr Team steht — und was als Naechstes kommt. Inklusive AI Act Compliance-Check.
          </p>
          <button onClick={() => onContact?.("assessment")} style={{
            padding: "14px 36px", borderRadius: 12, border: "none",
            background: Z.x, color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>Assessment starten →</button>
        </Card>

      </div>
    </div>
  );
}
