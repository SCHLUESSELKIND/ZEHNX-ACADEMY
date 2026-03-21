import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX ENTERPRISE — Dark Premium Design
// Matches zehnx-enterprise-features.html aesthetic
// Space Grotesk · Gradient Accents · Frosted Glass Cards
// ═══════════════════════════════════════════════════════════════

const D = {
  bg: "#09090B", bgSub: "#111114", surf: "#18181B", raised: "#1E1E22",
  text: "#FAFAFA", sec: "#A1A1AA", muted: "#71717A", dim: "#52525B",
  border: "#27272A", borderAcc: "rgba(79,70,229,0.3)",
  indigo: "#4F46E5", violet: "#7C3AED", pink: "#EC4899",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444",
  grad: "linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)",
};

const STATS = [
  { value: "80%", label: "brauchen AI-Training", sub: "Nur 20% haben geschult" },
  { value: "Art. 4", label: "EU AI Act Pflicht", sub: "Seit Februar 2025" },
  { value: "2.7×", label: "Produktivitaet", sub: "Geschulte vs. Selbstlerner" },
  { value: "€3.70", label: "ROI pro investiertem €", sub: "In AI-Weiterbildung" },
];

const FEATURES = [
  { icon: "🎯", title: "AI Readiness Assessment", desc: "X-SCORE fuer jedes Teammitglied. Misst AI-Kompetenz in 5 Dimensionen. Zeigt Gaps, empfiehlt Sprints. Compliance-Report fuer Art. 4 EU AI Act.", tag: "Compliance", tagType: "green" },
  { icon: "👥", title: "Sprint Cohorts", desc: "Teams lernen zusammen, nicht nebeneinander. Manager weist Sprint zu, alle starten gleichzeitig. 67% hoeheres Engagement als Selbststudium.", tag: "Team-Learning", tagType: "default" },
  { icon: "📊", title: "Intelligence Dashboard", desc: "Echtzeit-Analytics auf Team- und Mitarbeiter-Ebene. Skill-Progression, Engagement-Heatmaps, Time-to-Competency. Export als PDF fuer Quartals-Reviews.", tag: "Analytics", tagType: "violet" },
  { icon: "🧭", title: "AI Skill-Mapping", desc: "Automatische Analyse der AI-Kompetenz pro Mitarbeiter und Team. Heatmap ueber alle 8 Departments. L&D kann gezielt Lernpfade zuweisen.", tag: "Differentiator", tagType: "violet" },
  { icon: "🤖", title: "AI Learning Coach", desc: "Persoenlicher AI-Tutor pro Mitarbeiter. Beantwortet Fragen im Sprint-Kontext, erklaert Code, schlaegt naechste Schritte vor. Firmen koennen eigene Policies einspeisen.", tag: "AI-native", tagType: "amber" },
  { icon: "🛡️", title: "Security & DSGVO", desc: "Hosting auf Hetzner Frankfurt. Verschluesselt at-rest und in-transit. Audit-Logs, AVV, IP-Whitelisting. Fuer regulierte Branchen geeignet.", tag: "Enterprise-Standard", tagType: "green" },
  { icon: "🏆", title: "Team Challenges", desc: "Woechentliche AI-Challenges: Echte Aufgaben wie 'Baut einen Prompt fuer euren Sales-Prozess.' Peer-Voting, Manager-Review, Team-Rankings.", tag: "Engagement", tagType: "default" },
  { icon: "📋", title: "Custom Content Studio", desc: "Eigene Module und Sprints erstellen. Firmeneigene AI-Policies, interne Tools, branchenspezifische Use Cases. AI hilft beim Erstellen von Quizzes.", tag: "Add-On", tagType: "amber" },
];

const PROCESS = [
  { step: "01", title: "Assessment", desc: "X-SCORE fuer Ihr Team — AI-Readiness in 15 Minuten pro Mitarbeiter messen." },
  { step: "02", title: "Lernplan", desc: "Personalisierte Sprint-Pfade fuer jede Rolle und Abteilung, basierend auf Gaps." },
  { step: "03", title: "Cohort Start", desc: "Teams starten gemeinsam. AI Coach begleitet. Manager sieht Fortschritt in Echtzeit." },
  { step: "04", title: "Compliance", desc: "Zertifikate, Skill-Reports, AI Act Nachweis — alles dokumentiert und exportierbar." },
];

const TIERS = [
  {
    name: "Team", price: "29€", unit: "/ Seat / Monat", desc: "Fuer Teams von 5–50. Manager-Features + Cohorts.",
    highlight: true,
    features: [
      "Alle 324 Sprints (A1–C2)", "Sprint Cohorts (Team-Lernen)", "Team Dashboard & Analytics",
      "AI Learning Coach pro Mitarbeiter", "X-SCORE Readiness Assessment", "Skill-Mapping & Gap-Analyse",
      "Team Challenges", "Slack Integration", "Priority Support",
    ],
  },
  {
    name: "Enterprise", price: "Custom", unit: "", desc: "Ab 50 Seats. Alles, White-Label, dedizierter CSM.",
    highlight: false,
    features: [
      "Alles aus Team", "White-Label (Custom Domain + Branding)", "SSO/SAML + SCIM Provisioning",
      "Custom Content Studio", "AI Act Compliance Reports", "Enterprise Newsroom (branchenspezifisch)",
      "API + Webhooks", "SCORM/xAPI Export", "Dedizierter Customer Success Manager", "SLA + Audit Logs",
    ],
  },
];

const TAG_COLORS = {
  green: { bg: "rgba(16,185,129,0.1)", color: D.green },
  violet: { bg: "rgba(124,58,237,0.1)", color: D.violet },
  amber: { bg: "rgba(245,158,11,0.1)", color: D.amber },
  pink: { bg: "rgba(236,72,153,0.1)", color: D.pink },
  default: { bg: D.bgSub, color: D.muted },
};

function GradText({ children, style }) {
  return <span style={{ background: D.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...style }}>{children}</span>;
}

function Tag({ label, type = "default" }) {
  const c = TAG_COLORS[type] || TAG_COLORS.default;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px", background: c.bg, color: c.color }}>{label}</span>;
}

function FeatureCard({ icon, title, desc, tag, tagType, accent, wide }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: accent ? D.grad : D.surf,
        border: `1px solid ${accent ? "transparent" : hovered ? D.borderAcc : D.border}`,
        borderRadius: 16, padding: "28px",
        transition: "border-color 0.3s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        gridColumn: wide ? "span 2" : undefined,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 8, letterSpacing: "-0.01em", color: accent ? "#fff" : D.text }}>{title}</div>
      <div style={{ fontSize: 14, color: accent ? "rgba(255,255,255,0.7)" : D.sec, lineHeight: 1.7 }}>{desc}</div>
      {tag && <div style={{ marginTop: 12 }}><Tag label={tag} type={accent ? "default" : tagType} /></div>}
    </div>
  );
}

export default function Enterprise({ onContact }) {
  const [animStats, setAnimStats] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const dur = 1000, start = Date.now();
    const targets = [80, 4, 2.7, 3.70];
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setAnimStats(targets.map(t => (t * e)));
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <div style={{ background: D.bg, color: D.text, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes epGlow{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes epFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden",
        padding: "80px 20px 48px",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
          background: "rgba(79,70,229,0.1)", border: `1px solid ${D.borderAcc}`,
          borderRadius: 100, fontSize: 13, color: D.sec, fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 32, position: "relative",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: D.green, animation: "epGlow 2s infinite" }} />
          ENTERPRISE SUITE
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20,
          position: "relative", maxWidth: 700,
        }}>
          Machen Sie Ihr Team{" "}<GradText>AI-ready.</GradText>
        </h1>

        <p style={{ fontSize: 17, color: D.sec, maxWidth: 540, position: "relative", lineHeight: 1.7 }}>
          324 Sprints, AI Act Compliance, Skill-Mapping — alles was L&D-Teams und CTOs brauchen. Ohne Enterprise-Bloat.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, position: "relative" }}>
          <button onClick={() => onContact?.("assessment")} style={{
            padding: "14px 32px", borderRadius: 12, border: "none",
            background: D.indigo, color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: "0 4px 20px rgba(79,70,229,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}>Assessment starten →</button>
          <button onClick={() => onContact?.("demo")} style={{
            padding: "14px 32px", borderRadius: 12,
            border: `1px solid ${D.border}`, background: D.surf, color: D.text,
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif", transition: "border-color 0.2s",
          }}>Demo anfragen</button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ═══ STATS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 64 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "24px 16px",
              background: D.surf, border: `1px solid ${D.border}`, borderRadius: 16,
            }}>
              <div style={{
                fontSize: 32, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.03em", marginBottom: 4,
                background: D.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: D.sec }}>{s.label}</div>
              <div style={{ fontSize: 11, color: D.dim, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ═══ PROCESS ═══ */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: D.indigo, marginBottom: 16 }}>SO FUNKTIONIERT ES</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Von Assessment zu <GradText>Compliance</GradText>
          </div>
          <p style={{ fontSize: 15, color: D.sec, maxWidth: 540, marginBottom: 36, lineHeight: 1.7 }}>In vier Schritten zum AI-ready Team — strukturiert, messbar, nachweisbar.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PROCESS.map((p, i) => (
              <div key={p.step} style={{
                background: D.surf, border: `1px solid ${D.border}`, borderRadius: 16, padding: "24px 18px",
                transition: "border-color 0.3s",
              }}>
                <div style={{
                  fontSize: 36, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                  background: D.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: 12, opacity: 0.5,
                }}>{p.step}</div>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: D.sec, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: D.indigo, marginBottom: 16 }}>ENTERPRISE FEATURES</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
            ZehnX for <GradText>Enterprise</GradText>
          </div>
          <p style={{ fontSize: 15, color: D.sec, maxWidth: 540, marginBottom: 36, lineHeight: 1.7 }}>Alles, was L&D-Teams und CTOs brauchen — ohne den typischen Enterprise-Bloat.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} accent={i === 0} wide={i === 0} />
            ))}
          </div>
        </section>

        {/* ═══ INSIGHT BOX ═══ */}
        <div style={{
          padding: "24px", borderRadius: 16,
          border: `1px dashed ${D.border}`, background: D.bgSub,
          marginBottom: 64, fontSize: 14, color: D.sec, lineHeight: 1.7,
        }}>
          <strong style={{ color: D.text }}>ZehnX-Differenzierung:</strong>{" "}
          Die grossen Player (Coursera for Business ab $399/User/Jahr, LinkedIn Learning ab $380/User/Jahr) bieten breite Kataloge. ZehnX hebt sich ab durch: Hybrid-Positionierung (News + Sprints), reiner AI-Fokus, und radikal bessere UX — Apple-Level in einem Markt voller Legacy-Interfaces.
          <div style={{ fontSize: 11, color: D.dim, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>Quellen: Josh Bersin, Forrester 2024, McKinsey 2025</div>
        </div>

        {/* ═══ PRICING ═══ */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: D.indigo, marginBottom: 16 }}>PRICING</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Klar <GradText>getrennt</GradText>
          </div>
          <p style={{ fontSize: 15, color: D.sec, maxWidth: 540, marginBottom: 36, lineHeight: 1.7 }}>Free bleibt kostenlos — Enterprise-Wert kommt aus Features, nicht Content-Gating.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {TIERS.map(t => (
              <div key={t.name} style={{
                borderRadius: 20, overflow: "hidden",
                border: t.highlight ? `1px solid ${D.borderAcc}` : `1px solid ${D.border}`,
                background: t.highlight ? D.raised : D.surf,
                position: "relative",
              }}>
                {t.highlight && <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: D.grad,
                }} />}
                <div style={{ padding: "32px 24px" }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase",
                    letterSpacing: 2, color: t.highlight ? D.indigo : D.muted, marginBottom: 8,
                  }}>{t.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 40, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "-0.03em", color: D.text,
                    }}>{t.price}</span>
                    {t.unit && <span style={{ fontSize: 14, color: D.muted }}>{t.unit}</span>}
                  </div>
                  <div style={{ fontSize: 14, color: D.sec, marginBottom: 24, lineHeight: 1.6 }}>{t.desc}</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {t.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: D.sec }}>
                        <span style={{ color: D.green, fontSize: 13, marginTop: 1 }}>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => onContact?.(t.name.toLowerCase())} style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: t.highlight ? D.indigo : D.bgSub,
                    color: t.highlight ? "#fff" : D.sec,
                    fontSize: 15, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: t.highlight ? "0 4px 20px rgba(79,70,229,0.25)" : "none",
                    transition: "transform 0.2s",
                  }}>{t.price === "Custom" ? "Demo anfragen" : "Team starten →"}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <div style={{
          textAlign: "center", padding: "48px 24px", borderRadius: 20,
          background: D.surf, border: `1px solid ${D.border}`, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.1), transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12,
            }}>Kostenloses <GradText>AI Readiness Assessment</GradText></div>
            <p style={{ fontSize: 15, color: D.sec, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.7 }}>
              In 15 Minuten wissen Sie, wo Ihr Team steht — und was als Naechstes kommt. Inklusive AI Act Compliance-Check.
            </p>
            <button onClick={() => onContact?.("assessment")} style={{
              padding: "16px 40px", borderRadius: 12, border: "none",
              background: D.indigo, color: "#fff", fontSize: 16, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 4px 20px rgba(79,70,229,0.3)",
            }}>Assessment starten →</button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "48px 0 0", fontSize: 12, color: D.dim }}>
          ZEHNX Academy · Enterprise · Koeln
        </div>

      </div>
    </div>
  );
}
