import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX BUSINESS — Projektanfrage & AI-Kalkulator
// Guided Onboarding → Claude analysiert → Kostenvoranschlag
// Admin-Freigabe vor Versand
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  green: "#059669", greenLight: "#ECFDF5", dark: "#0F172A",
  amber: "#D97706", amberLight: "#FFFBEB",
};

// ═══ SERVICES WE OFFER (basierend auf Toms Stack) ═══

const SERVICES = [
  {
    id: "landing",
    name: "Landing Page",
    desc: "Conversion-optimierte Seite fuer Produkt, Service oder Event",
    range: "2.500 – 5.000 €",
    time: "2–3 Wochen",
    icon: "◎",
  },
  {
    id: "website",
    name: "Unternehmens-Website",
    desc: "Mehrseitige Website mit CMS, mehrsprachig moeglich",
    range: "5.000 – 12.000 €",
    time: "4–8 Wochen",
    icon: "◈",
  },
  {
    id: "webapp",
    name: "Web-App (MVP)",
    desc: "Custom App mit Auth, Datenbank, Dashboard — von der Idee zum MVP",
    range: "8.000 – 20.000 €",
    time: "6–12 Wochen",
    icon: "◆",
  },
  {
    id: "chatbot",
    name: "AI Chatbot / Assistent",
    desc: "Intelligenter Bot fuer Support, Beratung oder Lead-Generierung",
    range: "3.000 – 8.000 €",
    time: "2–4 Wochen",
    icon: "◇",
  },
  {
    id: "automation",
    name: "Prozess-Automation",
    desc: "Workflows mit n8n, E-Mail-Sequenzen, CRM-Anbindung, API-Integration",
    range: "2.000 – 6.000 €",
    time: "1–3 Wochen",
    icon: "⚡",
  },
  {
    id: "ecommerce",
    name: "E-Commerce / Payments",
    desc: "Online-Shop oder Stripe-Integration, Abo-Modelle, Checkout",
    range: "6.000 – 15.000 €",
    time: "4–8 Wochen",
    icon: "◉",
  },
];

const STACK_TAGS = [
  "React", "Supabase", "Vercel", "Stripe", "Claude AI",
  "n8n", "Astro", "Tailwind", "DSGVO-konform", "Hetzner EU",
];

// ═══ GUIDED FLOW QUESTIONS ═══

const QUESTIONS = [
  {
    id: "project_type",
    question: "Was moechtest du umsetzen?",
    type: "select",
    options: SERVICES.map(s => ({ id: s.id, label: s.name, desc: s.desc, icon: s.icon })),
  },
  {
    id: "has_website",
    question: "Hast du bereits eine Website?",
    type: "choice",
    options: [
      { id: "yes", label: "Ja, hier ist der Link" },
      { id: "no", label: "Nein, starte bei null" },
      { id: "rebuild", label: "Ja, aber braucht Relaunch" },
    ],
  },
  {
    id: "website_url",
    question: "Wie lautet die URL deiner aktuellen Website?",
    type: "url",
    condition: (answers) => answers.has_website === "yes" || answers.has_website === "rebuild",
  },
  {
    id: "scope",
    question: "Wie umfangreich soll das Projekt werden?",
    type: "choice",
    options: [
      { id: "minimal", label: "Schlank & schnell — MVP reicht" },
      { id: "standard", label: "Solide — alle Kernfeatures" },
      { id: "premium", label: "Premium — mit Extras und Polish" },
    ],
  },
  {
    id: "features",
    question: "Welche Features brauchst du?",
    type: "multi",
    options: [
      { id: "auth", label: "Login / Registrierung" },
      { id: "cms", label: "CMS (Inhalte selbst pflegen)" },
      { id: "multilang", label: "Mehrsprachig (DE/EN/...)" },
      { id: "payments", label: "Zahlungen / Stripe" },
      { id: "ai", label: "AI-Integration (Chatbot, etc.)" },
      { id: "analytics", label: "Analytics & Tracking" },
      { id: "automation", label: "E-Mail / Workflow Automation" },
      { id: "api", label: "API-Anbindung (extern)" },
    ],
  },
  {
    id: "timeline",
    question: "Wann soll es live gehen?",
    type: "choice",
    options: [
      { id: "asap", label: "So schnell wie moeglich" },
      { id: "month", label: "In 4–6 Wochen" },
      { id: "quarter", label: "In 2–3 Monaten" },
      { id: "flexible", label: "Flexibel" },
    ],
  },
  {
    id: "budget",
    question: "Hast du ein ungefaehres Budget im Kopf?",
    type: "choice",
    options: [
      { id: "under5k", label: "Unter 5.000 €" },
      { id: "5to10k", label: "5.000 – 10.000 €" },
      { id: "10to20k", label: "10.000 – 20.000 €" },
      { id: "over20k", label: "Ueber 20.000 €" },
      { id: "unknown", label: "Keine Ahnung — beraet mich" },
    ],
  },
  {
    id: "description",
    question: "Beschreib dein Projekt kurz in 2–3 Saetzen.",
    type: "text",
    placeholder: "z.B. Wir brauchen eine neue Website fuer unsere Zahnarztpraxis mit Online-Terminbuchung...",
  },
  {
    id: "company",
    question: "Wie heisst dein Unternehmen?",
    type: "text",
    placeholder: "Firmenname",
  },
  {
    id: "contact",
    question: "Wie koennen wir dich erreichen?",
    type: "contact",
  },
];

// ═══ ESTIMATE SYSTEM PROMPT ═══

const ESTIMATE_SYSTEM = `Du bist der Projektkalkulationsassistent von ZEHNX ACADEMY. Du erstellst praezise, realistische Kostenvoranschlaege.

UNSER TECH-STACK:
- Frontend: React/Vite, Astro, Tailwind CSS, PWA
- Backend: Supabase (self-hosted Hetzner EU), Edge Functions
- AI: Claude API, OpenRouter, RAG-Systeme, Custom Chatbots
- Payments: Stripe (Checkout, Subscriptions, Webhooks)
- Automation: n8n (self-hosted), E-Mail-Sequenzen, Webhooks
- Hosting: Vercel (Frontend), Hetzner (Backend/DB), IONOS (Domains)
- CMS: Sanity, Supabase-basiert
- Extras: Mehrsprachig, DSGVO-konform, Analytics (Plausible)

STUNDENSATZ-BASIS: 120 EUR/Stunde (nicht im Output zeigen)

REALISTISCHE PREISE (Orientierung):
- Landing Page (minimal): 2.500 EUR, 2 Wochen
- Landing Page (premium): 4.500 EUR, 3 Wochen
- Corporate Website (5-8 Seiten, CMS): 6.000–10.000 EUR, 5-7 Wochen
- Corporate Website (mehrsprachig, 10+ Seiten): 10.000–15.000 EUR, 8-10 Wochen
- Web-App MVP (Auth, DB, 3-5 Core Features): 10.000–15.000 EUR, 8-10 Wochen
- Web-App Full (10+ Features, Admin, API): 18.000–25.000 EUR, 12-16 Wochen
- AI Chatbot (RAG, Custom Knowledge): 4.000–7.000 EUR, 3-4 Wochen
- E-Commerce (Stripe, Produkte, Checkout): 8.000–15.000 EUR, 6-8 Wochen
- Automation (n8n Workflows, 5-10 Flows): 3.000–5.000 EUR, 2-3 Wochen

AUSGABE-FORMAT (JSON, kein Markdown):
{
  "summary": "1-2 Saetze was wir verstanden haben",
  "scope_items": [
    {"item": "Beschreibung der Leistung", "estimate_hours": 20, "price": 2400}
  ],
  "total_min": 5000,
  "total_max": 8000,
  "total_recommended": 6500,
  "timeline_weeks_min": 4,
  "timeline_weeks_max": 6,
  "phases": [
    {"name": "Konzept & Design", "weeks": "1-2", "description": "Wireframes, Design, Abstimmung"},
    {"name": "Entwicklung", "weeks": "2-4", "description": "Frontend, Backend, Integration"},
    {"name": "Testing & Launch", "weeks": "1", "description": "QA, DNS, Go-Live"}
  ],
  "includes": ["DSGVO-konforme Umsetzung", "Responsive Design", "3 Feedback-Runden"],
  "optional_addons": [
    {"name": "AI Chatbot", "price": 3500, "description": "Intelligenter Support-Bot"}
  ],
  "recommendation": "1-2 Saetze persoenliche Empfehlung"
}

REGELN:
- Antworte NUR mit validem JSON, kein Text drumherum
- Preise IMMER in EUR, realistische deutsche Agentur-Preise
- Bei unklarem Scope: eher konservativ schaetzen (lieber positiv ueberraschen)
- DSGVO-Konformitaet immer inkludieren
- Timeline realistisch — wir sind 1-2 Entwickler, keine 20-Mann-Agentur
- Optional Addons vorschlagen die sinnvoll waeren`;


// ═══ QUESTION COMPONENTS ═══

function SelectQuestion({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", borderRadius: 14, textAlign: "left",
          border: value === opt.id ? `2px solid ${Z.blue}` : `1.5px solid ${Z.border}`,
          background: value === opt.id ? Z.blueLight : Z.surface,
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}>
          {opt.icon && <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{opt.icon}</span>}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: Z.text }}>{opt.label}</div>
            {opt.desc && <div style={{ fontSize: 12, color: Z.muted, marginTop: 2 }}>{opt.desc}</div>}
          </div>
        </button>
      ))}
    </div>
  );
}

function ChoiceQuestion({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{
          padding: "10px 18px", borderRadius: 12,
          border: value === opt.id ? `2px solid ${Z.blue}` : `1.5px solid ${Z.border}`,
          background: value === opt.id ? Z.blueLight : Z.surface,
          color: value === opt.id ? Z.blue : Z.text,
          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

function MultiQuestion({ options, value = [], onChange }) {
  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => toggle(opt.id)} style={{
          padding: "10px 16px", borderRadius: 12,
          border: value.includes(opt.id) ? `2px solid ${Z.blue}` : `1.5px solid ${Z.border}`,
          background: value.includes(opt.id) ? Z.blueLight : Z.surface,
          color: value.includes(opt.id) ? Z.blue : Z.text,
          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>{value.includes(opt.id) ? "✓ " : ""}{opt.label}</button>
      ))}
    </div>
  );
}

function TextQuestion({ value, onChange, placeholder, multiline }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <Tag value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || ""} rows={multiline ? 3 : undefined}
      style={{
        width: "100%", padding: "12px 16px", borderRadius: 14,
        border: `1.5px solid ${Z.border}`, background: Z.surface,
        fontSize: 14, color: Z.text, fontFamily: "inherit",
        outline: "none", resize: multiline ? "vertical" : "none",
      }}
    />
  );
}

function ContactQuestion({ value = {}, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input value={value.name || ""} onChange={e => update("name", e.target.value)}
        placeholder="Dein Name" style={inputStyle} />
      <input value={value.email || ""} onChange={e => update("email", e.target.value)}
        placeholder="E-Mail" type="email" style={inputStyle} />
      <input value={value.phone || ""} onChange={e => update("phone", e.target.value)}
        placeholder="Telefon (optional)" style={inputStyle} />
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 14,
  border: `1.5px solid ${Z.border}`, background: Z.surface,
  fontSize: 14, color: Z.text, fontFamily: "inherit", outline: "none",
};


// ═══ ESTIMATE DISPLAY ═══

function EstimateCard({ estimate }) {
  if (!estimate) return null;
  const e = estimate;

  return (
    <div style={{ background: Z.surface, borderRadius: 20, border: `1px solid ${Z.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${Z.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.blue, letterSpacing: "0.06em" }}>UNVERBINDLICHER KOSTENVORANSCHLAG</div>
        <div style={{ fontSize: 14, color: Z.muted, marginTop: 6, lineHeight: 1.5 }}>{e.summary}</div>
      </div>

      {/* Scope Items */}
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${Z.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: Z.muted, letterSpacing: "0.04em", marginBottom: 10 }}>LEISTUNGEN</div>
        {e.scope_items?.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < e.scope_items.length - 1 ? `1px solid ${Z.borderLight}` : "none" }}>
            <span style={{ fontSize: 13, color: Z.text, flex: 1 }}>{item.item}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: Z.text, marginLeft: 12 }}>{item.price?.toLocaleString("de-DE")} €</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ padding: "16px 24px", background: Z.blueLight, borderBottom: `1px solid ${Z.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: Z.muted }}>Geschaetztes Investment</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: Z.blue, letterSpacing: "-0.03em" }}>
              {e.total_recommended?.toLocaleString("de-DE")} €
            </div>
            <div style={{ fontSize: 11, color: Z.hint }}>
              Spanne: {e.total_min?.toLocaleString("de-DE")} – {e.total_max?.toLocaleString("de-DE")} €
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: Z.muted }}>Timeline</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: Z.text }}>
              {e.timeline_weeks_min}–{e.timeline_weeks_max}
            </div>
            <div style={{ fontSize: 11, color: Z.hint }}>Wochen</div>
          </div>
        </div>
      </div>

      {/* Phases */}
      {e.phases && (
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: Z.muted, letterSpacing: "0.04em", marginBottom: 10 }}>PROJEKT-PHASEN</div>
          {e.phases.map((phase, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: Z.blueLight, color: Z.blue,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: Z.text }}>{phase.name} <span style={{ fontWeight: 400, color: Z.hint }}>({phase.weeks} Wo.)</span></div>
                <div style={{ fontSize: 12, color: Z.muted }}>{phase.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Includes */}
      {e.includes && (
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: Z.green, letterSpacing: "0.04em", marginBottom: 6 }}>INKLUSIVE</div>
          <div style={{ fontSize: 12, color: Z.text, lineHeight: 1.6 }}>
            {e.includes.join(" · ")}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {e.optional_addons?.length > 0 && (
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${Z.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: Z.amber, letterSpacing: "0.04em", marginBottom: 6 }}>OPTIONALE ERWEITERUNGEN</div>
          {e.optional_addons.map((addon, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: Z.text }}>{addon.name}</span>
                <span style={{ fontSize: 12, color: Z.muted, marginLeft: 8 }}>{addon.description}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: Z.amber }}>+{addon.price?.toLocaleString("de-DE")} €</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {e.recommendation && (
        <div style={{ padding: "16px 24px" }}>
          <div style={{ fontSize: 13, color: Z.text, lineHeight: 1.5, fontStyle: "italic" }}>
            "{e.recommendation}"
          </div>
          <div style={{ fontSize: 11, color: Z.hint, marginTop: 4 }}>— ZEHNX ACADEMY</div>
        </div>
      )}
    </div>
  );
}


// ═══ MAIN: BUSINESS INQUIRY ═══

export default function BusinessInquiry() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const currentQ = QUESTIONS.filter(q => !q.condition || q.condition(answers));
  const activeQ = currentQ[step];
  const isLast = step === currentQ.length - 1;
  const progress = ((step + 1) / currentQ.length) * 100;

  const canAdvance = () => {
    if (!activeQ) return false;
    const val = answers[activeQ.id];
    if (activeQ.type === "contact") return val?.name && val?.email;
    if (activeQ.type === "multi") return val?.length > 0;
    return !!val;
  };

  const next = () => {
    if (isLast) {
      generateEstimate();
    } else {
      setStep(step + 1);
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const generateEstimate = async () => {
    setLoading(true);
    try {
      const prompt = `Erstelle einen Kostenvoranschlag basierend auf diesen Projektanforderungen:

Projekttyp: ${SERVICES.find(s => s.id === answers.project_type)?.name || answers.project_type}
Bestehende Website: ${answers.has_website} ${answers.website_url ? `(${answers.website_url})` : ""}
Umfang: ${answers.scope}
Gewuenschte Features: ${(answers.features || []).join(", ")}
Timeline: ${answers.timeline}
Budget: ${answers.budget}
Projektbeschreibung: ${answers.description || "Keine Beschreibung"}
Unternehmen: ${answers.company || "Nicht angegeben"}

Antworte NUR mit JSON gemaess dem definierten Format.`;

      const res = await fetch("/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: ESTIMATE_SYSTEM,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setEstimate(parsed);
    } catch (err) {
      console.error("Estimate error:", err);
      setEstimate({
        summary: "Wir konnten den Kostenvoranschlag nicht automatisch erstellen. Unser Team meldet sich persoenlich bei dir.",
        scope_items: [],
        total_min: 0, total_max: 0, total_recommended: 0,
        timeline_weeks_min: 0, timeline_weeks_max: 0,
        phases: [], includes: [], optional_addons: [],
        recommendation: "Bitte kontaktiere uns direkt unter hello@zehnx.me"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitInquiry = () => {
    // In production: POST to Supabase + trigger n8n workflow for admin notification
    setSubmitted(true);
  };

  // ═══ LANDING: Services Overview ═══
  if (step === 0 && !answers.project_type && !estimate) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.blue, letterSpacing: "0.08em", marginBottom: 8 }}>ZEHNX ACADEMY</div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 36, fontWeight: 400, color: Z.text,
            letterSpacing: "-0.02em", margin: "0 0 12px",
          }}>
            Wir bauen dein <em>digitales Produkt.</em>
          </h2>
          <p style={{ fontSize: 16, color: Z.muted, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Von der Landing Page bis zur AI-App — moderne Technik, deutsche Server, faire Preise. Kostenvoranschlag in 2 Minuten.
          </p>
        </div>

        {/* Stack Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {STACK_TAGS.map(tag => (
            <span key={tag} style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 8,
              background: Z.borderLight, color: Z.muted, fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>

        {/* Service Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 32 }}>
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => { setAnswers({ ...answers, project_type: s.id }); setStep(1); }}
              style={{
                padding: 20, borderRadius: 16, textAlign: "left",
                border: `1.5px solid ${Z.border}`, background: Z.surface,
                cursor: "pointer", fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: Z.text, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: Z.muted, lineHeight: 1.5, marginBottom: 10 }}>{s.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: Z.blue, fontWeight: 700 }}>{s.range}</span>
                <span style={{ color: Z.hint }}>{s.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: Z.muted, marginBottom: 8 }}>
            Nicht sicher was du brauchst?
          </div>
          <button onClick={() => setStep(0)} style={{
            padding: "12px 28px", borderRadius: 12,
            background: Z.dark, color: "#fff", border: "none",
            fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>Beratungsgespraech anfragen →</button>
        </div>
      </div>
    );
  }

  // ═══ ESTIMATE RESULT ═══
  if (estimate && !submitted) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "30px 16px 60px" }}>
        <button onClick={() => { setEstimate(null); setStep(0); setAnswers({}); }}
          style={{ border: "none", background: "none", color: Z.muted, fontSize: 13, cursor: "pointer", marginBottom: 16, fontFamily: "inherit" }}>
          ← Zurueck
        </button>

        <EstimateCard estimate={estimate} />

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={submitInquiry} style={{
            flex: 1, padding: "14px", borderRadius: 14,
            background: Z.blue, color: "#fff", border: "none",
            fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>Anfrage absenden</button>
          <button onClick={() => { setEstimate(null); setStep(0); setAnswers({}); }} style={{
            padding: "14px 20px", borderRadius: 14,
            background: Z.surface, color: Z.muted, border: `1px solid ${Z.border}`,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Nochmal</button>
        </div>

        <div style={{ fontSize: 11, color: Z.hint, textAlign: "center", marginTop: 12 }}>
          Unverbindlich — der finale Kostenvoranschlag wird nach persoenlicher Pruefung erstellt.
        </div>
      </div>
    );
  }

  // ═══ SUBMITTED ═══
  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: Z.text, marginBottom: 8 }}>Anfrage eingegangen!</h3>
        <p style={{ fontSize: 14, color: Z.muted, lineHeight: 1.6 }}>
          Wir pruefen deinen Kostenvoranschlag und melden uns innerhalb von 24 Stunden bei dir. Fuer dringende Anfragen: hello@zehnx.me
        </p>
        <button onClick={() => { setSubmitted(false); setEstimate(null); setStep(0); setAnswers({}); }}
          style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, background: Z.dark, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Neue Anfrage
        </button>
      </div>
    );
  }

  // ═══ LOADING ═══
  if (loading) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: Z.muted, marginBottom: 12 }}>AI analysiert dein Projekt...</div>
        <div style={{ height: 4, borderRadius: 2, background: Z.borderLight, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
          <div style={{ height: "100%", background: Z.blue, borderRadius: 2, width: "60%", animation: "estimateLoad 1.5s infinite" }} />
        </div>
        <style>{`@keyframes estimateLoad{0%{width:10%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:10%;margin-left:90%}}`}</style>
      </div>
    );
  }

  // ═══ QUESTIONNAIRE FLOW ═══
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "30px 16px 60px" }}>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <button onClick={prev} disabled={step === 0} style={{
            border: "none", background: "none", color: step > 0 ? Z.muted : "transparent",
            fontSize: 13, cursor: step > 0 ? "pointer" : "default", fontFamily: "inherit",
          }}>← Zurueck</button>
          <span style={{ fontSize: 11, color: Z.hint }}>{step + 1} / {currentQ.length}</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: Z.borderLight }}>
          <div style={{ height: "100%", borderRadius: 2, background: Z.blue, width: `${progress}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: Z.text, marginBottom: 16, letterSpacing: "-0.02em" }}>
        {activeQ?.question}
      </h3>

      {/* Answer Input */}
      {activeQ?.type === "select" && (
        <SelectQuestion options={activeQ.options} value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} />
      )}
      {activeQ?.type === "choice" && (
        <ChoiceQuestion options={activeQ.options} value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} />
      )}
      {activeQ?.type === "multi" && (
        <MultiQuestion options={activeQ.options} value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} />
      )}
      {activeQ?.type === "text" && (
        <TextQuestion value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} placeholder={activeQ.placeholder} multiline={activeQ.id === "description"} />
      )}
      {activeQ?.type === "url" && (
        <TextQuestion value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} placeholder="https://..." />
      )}
      {activeQ?.type === "contact" && (
        <ContactQuestion value={answers[activeQ.id]} onChange={v => setAnswers({ ...answers, [activeQ.id]: v })} />
      )}

      {/* Next Button */}
      <button onClick={next} disabled={!canAdvance()} style={{
        marginTop: 20, width: "100%", padding: "14px", borderRadius: 14,
        background: canAdvance() ? Z.dark : Z.border,
        color: canAdvance() ? "#fff" : Z.hint,
        border: "none", fontSize: 14, fontWeight: 700, cursor: canAdvance() ? "pointer" : "not-allowed",
        fontFamily: "inherit", transition: "all 0.15s",
      }}>
        {isLast ? "Kostenvoranschlag berechnen →" : "Weiter"}
      </button>
    </div>
  );
}
