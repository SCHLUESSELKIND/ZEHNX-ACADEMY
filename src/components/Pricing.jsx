import { useState } from "react";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", vi: "#7C3AED",
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "fuer immer",
    desc: "Perfekt zum Reinschnuppern",
    cta: "Kostenlos starten",
    ctaBg: Z.g800,
    popular: false,
    features: [
      { t: "5 Einsteiger-Sprints (A1)", ok: true },
      { t: "Grundlegende Lektionen", ok: true },
      { t: "Sprint-Katalog durchsuchen", ok: true },
      { t: "Community-Zugang (Lesen)", ok: true },
      { t: "AI Tutor", ok: false },
      { t: "Alle 324 Sprints", ok: false },
      { t: "Quizzes & Zertifikate", ok: false },
      { t: "Newsroom & Deep Dive", ok: false },
      { t: "Priority Support", ok: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 19,
    period: "pro Monat",
    desc: "Fuer ernsthafte Lernende",
    cta: "Starter waehlen",
    ctaBg: Z.bl,
    popular: true,
    features: [
      { t: "Alle 324 Sprints (A1-C2)", ok: true },
      { t: "1.620 Lektionen mit Content", ok: true },
      { t: "AI Tutor pro Sprint", ok: true },
      { t: "Quizzes & Zertifikate", ok: true },
      { t: "Newsroom & Deep Dive", ok: true },
      { t: "Fortschritts-Tracking", ok: true },
      { t: "Community (Lesen + Schreiben)", ok: true },
      { t: "Woechentlicher Digest", ok: true },
      { t: "Priority Support", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "pro Monat",
    desc: "Fuer Teams & Power-User",
    cta: "Pro waehlen",
    ctaBg: Z.vi,
    popular: false,
    features: [
      { t: "Alles aus Starter", ok: true },
      { t: "Erweiterte AI-Features", ok: true },
      { t: "Live Events & Q&A Zugang", ok: true },
      { t: "Sprint-Buddies Matching", ok: true },
      { t: "Team-Dashboard (bis 10 User)", ok: true },
      { t: "Collective Brain Insights", ok: true },
      { t: "Custom Learning Paths", ok: true },
      { t: "Priority Support (24h)", ok: true },
      { t: "Rechnungen & Admin-Tools", ok: true },
    ],
  },
];

const FAQ = [
  { q: "Kann ich jederzeit kuendigen?", a: "Ja, jederzeit zum Ende der Abrechnungsperiode. Kein Abo-Falle, kein Kleingedrucktes. Du behaaelst bis zum Periodenende Zugang." },
  { q: "Gibt es eine Testphase?", a: "Der Free Plan ist dauerhaft kostenlos — kein Zeitlimit. Du kannst jederzeit upgraden wenn du mehr willst." },
  { q: "Wie funktioniert der AI Tutor?", a: "Jeder Sprint hat einen eigenen AI-Assistenten der den Sprint-Kontext kennt und dir bei Fragen hilft. Powered by Claude." },
  { q: "Sind die Zertifikate anerkannt?", a: "ZEHNX Zertifikate dokumentieren deinen Abschluss und Quiz-Score. Sie sind kein IHK-Zertifikat, aber zeigen konkrete Skills." },
  { q: "Wo werden meine Daten gespeichert?", a: "Auf einem deutschen Hetzner-Server in Nuernberg. 100% DSGVO-konform. Keine US-Cloud." },
  { q: "Kann ich mit dem Team nutzen?", a: "Der Pro Plan unterstuetzt bis zu 10 Team-Mitglieder mit gemeinsamen Dashboard und Fortschritts-Tracking." },
];

export default function Pricing({ onSelect }) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: Z.x, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
          Investiere in dein AI-Wissen
        </h1>
        <p style={{ fontSize: 16, color: Z.g500, margin: "0 0 24px", maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          324 Sprints. 1.620 Lektionen. AI Tutor. Zertifikate. Ab 0 Euro.
        </p>

        {/* Annual Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: Z.g100, borderRadius: 20, padding: 4 }}>
          <button onClick={() => setAnnual(false)} style={{
            padding: "7px 16px", borderRadius: 16, border: "none",
            background: !annual ? Z.x : "transparent", color: !annual ? Z.w : Z.g500,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Monatlich</button>
          <button onClick={() => setAnnual(true)} style={{
            padding: "7px 16px", borderRadius: 16, border: "none",
            background: annual ? Z.x : "transparent", color: annual ? Z.w : Z.g500,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Jaehrlich <span style={{ color: Z.gn, fontSize: 11 }}>-20%</span></button>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 48 }}>
        {PLANS.map(p => {
          const price = p.price === 0 ? 0 : annual ? Math.round(p.price * 0.8) : p.price;
          return (
            <div key={p.id} style={{
              background: Z.w, borderRadius: 18, padding: 24,
              border: p.popular ? `2px solid ${Z.bl}` : `1px solid ${Z.g200}`,
              position: "relative",
              display: "flex", flexDirection: "column",
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: Z.bl, color: Z.w, fontSize: 11, fontWeight: 700,
                  padding: "4px 14px", borderRadius: 20,
                }}>BELIEBTESTE WAHL</div>
              )}

              <div style={{ fontSize: 18, fontWeight: 800, color: Z.x, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: Z.g500, marginBottom: 16 }}>{p.desc}</div>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: Z.x }}>{price === 0 ? "0" : price + "€"}</span>
                <span style={{ fontSize: 14, color: Z.g400, marginLeft: 4 }}>{p.period}</span>
                {annual && p.price > 0 && (
                  <div style={{ fontSize: 12, color: Z.gn, fontWeight: 600, marginTop: 2 }}>
                    {Math.round(p.price * 12 * 0.8)}€/Jahr statt {p.price * 12}€
                  </div>
                )}
              </div>

              <button onClick={() => onSelect?.(p.id)} style={{
                width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                background: p.ctaBg, color: Z.w, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 20,
              }}>{p.cta}</button>

              <div style={{ flex: 1 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: f.ok ? Z.g700 : Z.g400 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 9, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700,
                      background: f.ok ? Z.gnL : Z.g100,
                      color: f.ok ? Z.gn : Z.g400,
                    }}>{f.ok ? "✓" : "—"}</span>
                    <span style={{ textDecoration: f.ok ? "none" : "line-through", opacity: f.ok ? 1 : 0.5 }}>{f.t}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: Z.x, textAlign: "center", marginBottom: 20 }}>Haeufige Fragen</h2>
        {FAQ.map((f, i) => (
          <div key={i} style={{
            background: Z.w, borderRadius: 12, marginBottom: 6,
            border: `1px solid ${Z.g200}`, overflow: "hidden",
          }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
              width: "100%", padding: "14px 16px", border: "none", background: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: Z.x, textAlign: "left" }}>{f.q}</span>
              <span style={{ fontSize: 18, color: Z.g400, flexShrink: 0, marginLeft: 8 }}>{openFaq === i ? "−" : "+"}</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: "0 16px 14px", fontSize: 13, color: Z.g600, lineHeight: 1.6 }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* Trust Bar */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: 12, color: Z.g400 }}>
          <span>🔒 DSGVO-konform</span>
          <span>🇩🇪 Server in Deutschland</span>
          <span>↩️ 14 Tage Widerrufsrecht</span>
          <span>⚡ Jederzeit kuendbar</span>
        </div>
      </div>
    </div>
  );
}
