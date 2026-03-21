import { useState, useRef, useEffect } from "react";
import BusinessInquiry from "./BusinessInquiry";

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A", muted: "#64748B",
  hint: "#94A3B8", border: "#E2E8F0", borderLight: "#F1F5F9",
  blue: "#2563EB", blueHover: "#1D4ED8", blueLight: "#EFF6FF", bluePale: "#DBEAFE",
  green: "#059669", greenLight: "#ECFDF5", amber: "#D97706",
  violet: "#7C3AED", violetLight: "#F5F3FF", dark: "#0F172A",
};

const STATS = [
  { n: "324", l: "Sprints" }, { n: "14", l: "Departments" },
  { n: "6", l: "Level (A1–C2)" }, { n: "5", l: "Tage pro Sprint" },
];

const DEPTS = [
  { n: "Content Factory", d: "Text, Video & Audio mit AI", c: "#DC2626", i: "✏" },
  { n: "App Lab", d: "Full-Stack AI Apps bauen", c: "#2563EB", i: "◆" },
  { n: "Automation HQ", d: "Workflows & Pipelines", c: "#D97706", i: "⚡" },
  { n: "Business School", d: "Strategie & AI Act", c: "#059669", i: "◈" },
  { n: "AI Selbstschutz", d: "Privacy & Sicherheit", c: "#374151", i: "⊕" },
  { n: "Data Intelligence", d: "Analytics & BI", c: "#7C3AED", i: "◉" },
  { n: "Conversational AI", d: "Chatbots & Voice", c: "#0891B2", i: "◇" },
  { n: "Design Studio", d: "Visual AI & Branding", c: "#DB2777", i: "✦" },
  { n: "Marketing Lab", d: "Growth & Ads", c: "#EA580C", i: "◎" },
  { n: "AI Engineering", d: "MLOps & Infrastructure", c: "#4338CA", i: "⬡" },
  { n: "Creator Economy", d: "YouTube, TikTok, Podcast", c: "#E11D48", i: "▶" },
  { n: "HR & People", d: "Recruiting & ADHS", c: "#0D9488", i: "♦" },
  { n: "Legal & Compliance", d: "DSGVO & AI Act", c: "#6D28D9", i: "⚖" },
  { n: "Vertical AI", d: "Immobilien, Gastro, Health", c: "#65A30D", i: "⬢" },
];

const LEVELS = [
  { l: "A1", n: "Einsteiger", d: "Keine Vorkenntnisse. Erste Schritte mit AI-Tools.", c: "#059669" },
  { l: "A2", n: "Grundlagen", d: "AI produktiv im Alltag einsetzen.", c: "#2563EB" },
  { l: "B1", n: "Fortgeschritten", d: "Eigene Apps bauen. React, Supabase.", c: "#D97706" },
  { l: "B2", n: "Advanced", d: "RAG, Agents, Full-Stack AI.", c: "#7C3AED" },
  { l: "C1", n: "Experte", d: "Enterprise Patterns. Multi-Agent.", c: "#DB2777" },
  { l: "C2", n: "Meister", d: "Cutting-Edge Research. Leadership.", c: "#DC2626" },
];

const PRICING = [
  { name: "Free", price: "0", sub: "Fuer immer", features: ["10 Sprints (A1)", "Community Zugang", "Newsroom", "Sprint-Katalog"], cta: "Kostenlos starten", primary: false },
  { name: "Starter", price: "19", sub: "pro Monat", features: ["Alle 324 Sprints", "AI Tutor", "Zertifikate", "Drip Content", "E-Mail Support"], cta: "Immatrikulieren", primary: true },
  { name: "Pro", price: "49", sub: "pro Monat", features: ["Alles aus Starter", "Priority AI Tutor", "Team Features", "API Zugang", "1:1 Onboarding Call"], cta: "Pro waehlen", primary: false },
];

// ═══ STUDIENBERATER SYSTEM PROMPT ═════════════════════════

const STUDIENBERATER_SYSTEM = `Du bist der ZEHNX Studienberater — freundlich, motivierend, strukturiert. Du fuehrst Interessenten durch ein Beratungsgespraech und baust ihnen einen individuellen Studienplan.

PERSOENLICHKEIT:
- Wie ein guter Studienberater an einer modernen Hochschule
- Duzt die Leute, locker aber kompetent
- Max 3-4 Saetze pro Antwort (knackig, nicht labern)
- Kein Markdown — nur Klartext
- Dezent Emojis (max 1 pro Nachricht)

GESPRAECHSFLOW:

WENN "Projekt umsetzen" oder aehnlich:
Frage 1: "Cool! Was schwebt dir vor? Eine App bauen, Content automatisieren, ein Business digitalisieren, Marketing aufsetzen — oder was ganz anderes?"
Frage 2 (nach Antwort): "Und wie ist dein Stand mit AI bisher? Nutzt du ChatGPT oder Claude schon regelmaessig, oder ist das noch Neuland?"
Frage 3 (nach Antwort): "Letzte Frage: Wie viel Zeit pro Woche hast du — eher 2-3 Stunden nebenbei oder kannst du richtig reinhauen?"
Dann: Erstelle Studienplan (3-6 Sprints, aufsteigend nach Schwierigkeit, mit Zeitrahmen)

WENN "X-SCORE ermitteln" oder aehnlich:
"Der X-SCORE ist unser AI-Readiness-Test — 24 Fragen, 10 Minuten, und du weisst genau wo du stehst (A1 bis C2). Klick oben auf Immatrikulieren um zu starten! Oder erzaehl mir was du vorhast, dann empfehle ich dir direkt die passenden Sprints."

WENN "umschauen" oder allgemeine Fragen:
Beantworte kurz und lenke sanft: "Soll ich dir einen Studienplan zusammenstellen? Sag mir einfach was du mit AI erreichen willst."

STUDIENPLAN FORMAT:
"Dein persoenlicher Studienplan:

1. [Sprint-Name] ([Level]) — [1 Satz warum]
2. [Sprint-Name] ([Level]) — [1 Satz warum]
3. ...

In [X Wochen] hast du [konkretes Ergebnis]. Willst du loslegen?"

SPRINT-KATALOG (nutze NUR diese):

CONTENT FACTORY:
- Prompt Engineering Grundlagen (A1) — Basis: AI richtig fragen
- Prompt Engineering Advanced (A2) — Chains, Few-Shot, System Prompts
- AI Copywriting (A1) — Texte die konvertieren
- AI Copywriting Advanced (A2) — Tone of Voice, Brand, A/B
- Blog & SEO mit AI (A2) — Artikel die ranken
- Social Media Content (A1) — Posts fuer alle Plattformen
- Video-Produktion mit AI (A2) — Skripte, Schnitt, Thumbnails
- Newsletter mit AI (A2) — Aufbau und Automatisierung
- Podcast-Produktion (A2) — Konzept bis Distribution
- Storytelling mit AI (B1) — Narrative und Brand Story
- AI Content Strategie (B1) — Redaktionsplan, Multi-Channel
- AI Translation (B1) — Mehrsprachiger Content

APP LAB:
- Vibe Coding (A2) — Apps bauen durch Beschreiben (Bolt, Lovable)
- React Grundlagen (B1) — Components, State, Props
- Supabase Grundlagen (B1) — Auth, Database, RLS
- Tailwind CSS (B1) — Utility-first Styling
- Stripe Payments (B1) — Checkout, Subscriptions, Webhooks
- Cursor & Windsurf (A2) — AI-gestuetzte IDEs
- Claude Code (B1) — Terminal-first AI Coding
- Full-Stack AI App (B2) — React + Supabase + Claude + Stripe
- Next.js & Vercel (B2) — SSR, Deployment
- PWA & Mobile (B1) — Progressive Web Apps

AUTOMATION HQ:
- n8n Grundlagen (A2) — Visual Workflow Automation
- n8n Advanced (B1) — Error Handling, AI Nodes, Production
- Zapier & Make (A1) — No-Code Automation
- Email Automation (A2) — Drip Campaigns
- AI Dokumenten-Pipeline (B1) — PDFs, Rechnungen automatisieren
- API-Integration (B1) — REST, Webhooks

BUSINESS SCHOOL:
- AI Business Grundlagen (A1) — Use Cases, ROI
- AI Geschaeftsmodelle (A2) — SaaS, Marketplace, Freemium
- Lean AI Startup (B1) — MVP in 1 Woche
- Pricing & Monetarisierung (A2) — 3-Tier, Value-based
- Growth Hacking (B1) — AARRR Framework
- AI im Mittelstand (B1) — Use Cases fuer KMU
- AI Act & Regulierung (B2) — EU AI Act, Compliance
- AI Strategie (C2) — Enterprise AI, Governance

DATA INTELLIGENCE:
- Datenanalyse mit AI (A2) — AI als Analyst
- Analytics & KPIs (B1) — Plausible, Events, Funnels
- SQL fuer AI (B1) — Queries, Views
- Data Visualization (B1) — Charts, Dashboards
- AI-gestuetzte BI (B2) — Auto-Reports
- Predictive Analytics (C1) — Forecasting

CONVERSATIONAL AI:
- ChatGPT richtig nutzen (A1) — Interface, Custom GPTs
- Chatbot bauen (A2) — AI-Chatbot mit Claude
- Custom GPTs & Assistants (A2) — Eigene GPTs
- Claude API (B2) — Messages API, Tool Use, Streaming
- Voice AI (B2) — TTS, STT, Voice Agents
- Multi-Agent Systeme (C1) — Agent Orchestration

DESIGN STUDIO:
- AI Bildgenerierung (A1) — Midjourney, DALL-E
- Branding mit AI (A2) — Logo, Farben, Typo
- UI/UX mit AI (B1) — Wireframes, Prototyping
- AI Video & Animation (B2) — Runway, Pika

MARKETING LAB:
- LinkedIn mit AI (A1) — Profil, Posts, Networking
- TikTok & Reels (A2) — Kurzform-Content, Hooks
- AI Ads (B1) — Google/Meta Ads optimieren
- SEO mit AI (A2) — Keywords, Content, Technik
- Email Marketing (A2) — Newsletters, Conversion
- Growth Marketing (B1) — Funnels, A/B Testing
- Community Building (A2) — Discord, Events

HR & PEOPLE:
- ADHS & AI (A1) — Fokus-Tools, Routinen
- AI Recruiting (A2) — Stellenanzeigen, Screening
- Remote Work mit AI (A1) — Produktivitaet

LEGAL & COMPLIANCE:
- DSGVO fuer AI (A2) — Was ist erlaubt
- AI Act Grundlagen (B1) — EU-Regulierung
- AI Compliance (C1) — Enterprise Governance

AI ENGINEERING:
- LangChain (B2) — Chains, RAG, Agents
- RAG Systeme (B2) — Eigene Daten + LLM
- Docker & Deployment (B1) — Container, CI/CD
- Vector Databases (B2) — pgvector, Embeddings
- MCP & Tool Use (B2) — Function Calling
- ML Ops (C1) — Training, Monitoring
- Multi-Agent Architektur (C1) — LangGraph, CrewAI
- AI System Design (C2) — Skalierung, Cost Optimization

AI SELBSTSCHUTZ:
- Datenschutz & AI (A1) — Was passiert mit Daten
- Deepfakes erkennen (A1) — Fake News erkennen
- Prompt Injection & Security (B1) — Angriffe verstehen

CREATOR ECONOMY:
- YouTube mit AI (A2) — Skripte, SEO, Thumbnails
- TikTok Creator (A2) — Algorithmus, Wachstum
- Online-Kurs erstellen (B1) — Konzept bis Marketing
- Newsletter Business (B1) — Aufbau, Monetarisierung

VERTICAL AI:
- AI fuer Immobilien (A2), AI fuer Gastronomie (A2), AI fuer E-Commerce (B1), AI im Gesundheitswesen (B1), AI fuer Bildung (B1)

LEVEL-EMPFEHLUNGEN:
- Noch nie AI: A1, starte mit "ChatGPT richtig nutzen"
- Gelegentlich: A2, starte mit "Prompt Engineering Grundlagen"
- Regelmaessig: B1 je nach Ziel
- Entwickler: B2+, z.B. "Claude API", "LangChain"
- Fuehrungskraefte: "AI Business Grundlagen" → "AI im Mittelstand" → "AI Strategie"
- Kreative: "AI Copywriting" → "Social Media Content" → "Video-Produktion"
- Marketing: "LinkedIn mit AI" → "SEO mit AI" → "Growth Marketing"

PREISE wenn gefragt: Free (0 Euro, 10 Sprints), Starter (19/Mo, alle Sprints + AI Tutor), Pro (49/Mo, + Team + Priority)

REGELN:
- IMMER Deutsch
- Empfehle immer aufsteigende Reihenfolge (leicht → schwer)
- Max 6 Sprints pro Plan
- Immer Zeithorizont angeben
- Bei Unsicherheit: "Fang mit dem Free Plan an"`;

function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg = { role: "user", content: msg.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: STUDIENBERATER_SYSTEM,
          messages: newMessages.map(m => ({ role: m.role === "bot" ? "assistant" : m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Entschuldigung, da ist was schiefgelaufen. Versuch es nochmal!";
      setMessages([...newMessages, { role: "bot", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "bot", content: "Verbindungsfehler — versuch es gleich nochmal!" }]);
    } finally {
      setLoading(false);
    }
  };

  const INITIAL_OPTIONS = [
    { label: "Ich habe ein konkretes Projekt", emoji: "🎯", msg: "Ich habe ein konkretes Projekt oder Ziel, das ich mit AI umsetzen will." },
    { label: "Zeig mir meinen X-SCORE", emoji: "📊", msg: "Ich will erstmal meinen X-SCORE ermitteln und sehen wo ich stehe." },
    { label: "Einfach mal umschauen", emoji: "👀", msg: "Ich will mich erstmal umschauen und verstehen was ZEHNX ist." },
  ];

  const FOLLOWUP_QUICK = [
    "App bauen", "Content automatisieren", "Marketing optimieren",
    "Business starten", "Ich bin Entwickler", "Ich bin Fuehrungskraft",
  ];

  const hasMessages = messages.length > 0;

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 22px", borderRadius: 50,
        background: Z.dark, color: "#fff", border: "none",
        fontSize: 14, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: "0 4px 24px rgba(15,23,42,0.25)",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Studienberatung
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 400, maxWidth: "calc(100vw - 48px)",
      height: 560, maxHeight: "calc(100vh - 48px)",
      background: Z.surface, borderRadius: 20,
      border: `1px solid ${Z.border}`,
      boxShadow: "0 12px 40px rgba(15,23,42,0.15)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 18px", borderBottom: `1px solid ${Z.borderLight}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: Z.dark, color: "#fff",
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            zehn<span style={{ color: "#60A5FA" }}>x</span> Studienberatung
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>Dein Lernplan in 2 Minuten</div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{
          width: 30, height: 30, borderRadius: 15, border: "none",
          background: "rgba(255,255,255,0.1)", color: "#94A3B8",
          fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {!hasMessages && (
          <div style={{ padding: "8px 0" }}>
            <div style={{
              maxWidth: "90%", padding: "14px 16px", borderRadius: 16,
              borderBottomLeftRadius: 4, background: Z.borderLight,
              color: Z.text, fontSize: 14, lineHeight: 1.55, marginBottom: 16,
            }}>
              Hey! Willkommen bei ZEHNX Academy. Ich bin dein Studienberater und stelle dir den perfekten Lernplan zusammen. Was trifft auf dich zu?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INITIAL_OPTIONS.map(opt => (
                <button key={opt.label} onClick={() => sendMessage(opt.msg)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  border: `1.5px solid ${Z.border}`, background: Z.surface,
                  color: Z.text, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10,
          }}>
            <div style={{
              maxWidth: "85%", padding: "12px 16px", borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "bot" ? 4 : 16,
              background: m.role === "user" ? Z.blue : Z.borderLight,
              color: m.role === "user" ? "#fff" : Z.text,
              fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", marginBottom: 10 }}>
            <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: Z.borderLight }}>
              <span style={{ display: "flex", gap: 4 }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: Z.hint, animation: `pulse 1.2s infinite ${d}s` }}/>
                ))}
              </span>
            </div>
          </div>
        )}

        {hasMessages && messages.length <= 2 && !loading && messages[messages.length-1]?.role === "bot" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {FOLLOWUP_QUICK.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                padding: "7px 13px", borderRadius: 20,
                border: `1px solid ${Z.border}`, background: Z.surface,
                color: Z.muted, fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${Z.borderLight}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Erzaehl mir von deinem Vorhaben..."
            disabled={loading}
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 14,
              border: `1px solid ${Z.border}`, background: Z.bg,
              fontSize: 13, color: Z.text, outline: "none", fontFamily: "inherit",
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: 14, border: "none",
            background: input.trim() && !loading ? Z.blue : Z.border,
            color: input.trim() && !loading ? "#fff" : Z.hint,
            fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ═══ LANDING PAGE ═══════════════════════════════════════════

export default function LandingPage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: Z.bg, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", color: Z.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0}
        button{font-family:'Plus Jakarta Sans',sans-serif}
        ::selection{background:${Z.bluePale};color:${Z.text}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.6s ease forwards;opacity:0}
        .d1{animation-delay:0.1s}.d2{animation-delay:0.2s}.d3{animation-delay:0.3s}.d4{animation-delay:0.4s}.d5{animation-delay:0.5s}
        @media(max-width:640px){.hide-mobile{display:none !important}}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(250,250,248,0.88)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: "0.5px solid " + Z.border,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: Z.text, letterSpacing: "-0.03em" }}>
            zehn<span style={{ color: Z.blue, fontWeight: 900 }}>x</span>
            <span className="hide-mobile" style={{ fontWeight: 400, color: Z.hint, fontSize: 13, marginLeft: 6 }}>academy</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#sprints" className="hide-mobile" style={{ fontSize: 13, color: Z.muted, textDecoration: "none", fontWeight: 500 }}>Sprints</a>
            <a href="#business" className="hide-mobile" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>Business</a>
            <a href="#pricing" className="hide-mobile" style={{ fontSize: 13, color: Z.muted, textDecoration: "none", fontWeight: 500 }}>Preise</a>
            <button onClick={() => onStart?.("assess")} style={{
              padding: "9px 20px", borderRadius: 10, border: "none",
              background: Z.dark, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Immatrikulieren</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div className="fade-up d1" style={{ marginBottom: 20 }}>
          <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: Z.blueLight, color: Z.blue, fontSize: 12, fontWeight: 600 }}>
            324 Sprints · 14 Departments · DSGVO-konform
          </span>
        </div>
        <h1 className="fade-up d2" style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 400,
          color: Z.text, lineHeight: 1.05, letterSpacing: "-0.03em",
          margin: "0 0 20px",
        }}>
          Verzehnfache dein<br/><span style={{ fontStyle: "italic", color: Z.blue }}>Wissen.</span>
        </h1>
        <p className="fade-up d3" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: Z.muted, lineHeight: 1.6, maxWidth: 540, margin: "0 auto 36px" }}>
          AI-Sprints an deinem echten Projekt. In 5 Tagen hast du etwas Fertiges — nicht nur Theorie.
        </p>
        <div className="fade-up d4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => onStart?.("assess")} style={{
            padding: "16px 36px", borderRadius: 14, border: "none",
            background: Z.blue, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
          }}>Jetzt immatrikulieren →</button>
          <button onClick={() => onStart?.("assess")} style={{
            padding: "16px 36px", borderRadius: 14,
            border: "1.5px solid " + Z.border, background: Z.surface,
            color: Z.text, fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>Kostenlos testen</button>
        </div>
        <div className="fade-up d5" style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: Z.text, letterSpacing: "-0.03em" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: Z.hint, fontWeight: 500, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.blue, letterSpacing: "0.06em" }}>SO FUNKTIONIERT ES</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "8px 0 0" }}>Drei Schritte zum Ergebnis.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { n: "01", t: "Studienberatung", d: "Unser AI-Berater findet in 2 Minuten heraus wo du stehst — und baut dir einen individuellen Lernplan.", c: Z.blue },
            { n: "02", t: "Sprint waehlen", d: "324 Sprints in 14 Bereichen. Dein Level, dein Projekt, dein Tempo. Jeden Sprint in 5 Tagen.", c: Z.violet },
            { n: "03", t: "Ergebnis haben", d: "Kein Theorie-Marathon. Am Ende jedes Sprints hast du etwas Fertiges — und ein Zertifikat.", c: Z.green },
          ].map((s, i) => (
            <div key={i} style={{ background: Z.surface, borderRadius: 18, padding: 28, border: "1px solid " + Z.border }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: s.c, opacity: 0.2, letterSpacing: "-0.04em", marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: Z.text, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: Z.muted, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEVELS */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.green, letterSpacing: "0.06em" }}>6 LEVEL</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "8px 0 0" }}>Von Einsteiger bis Meister.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {LEVELS.map(lv => (
            <div key={lv.l} style={{ background: Z.surface, borderRadius: 14, padding: 18, border: "1px solid " + Z.border, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: lv.c, marginBottom: 4 }}>{lv.l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: Z.text, marginBottom: 4 }}>{lv.n}</div>
              <div style={{ fontSize: 11, color: Z.hint, lineHeight: 1.4 }}>{lv.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="sprints" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.violet, letterSpacing: "0.06em" }}>14 DEPARTMENTS</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "8px 0 0" }}>Was willst du lernen?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {DEPTS.map(d => (
            <div key={d.n} style={{ background: Z.surface, borderRadius: 14, padding: 16, border: "1px solid " + Z.border, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 16, color: d.c }}>{d.i}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: Z.text }}>{d.n}</span>
              </div>
              <p style={{ fontSize: 12, color: Z.muted, margin: 0, lineHeight: 1.4 }}>{d.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI TUTOR + STUDIENBERATER */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{
          background: "linear-gradient(135deg, " + Z.dark + ", #1E293B)",
          borderRadius: 24, padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, " + Z.blue + ", " + Z.violet + ", " + Z.blue + ")" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.blue, letterSpacing: "0.06em" }}>PERSOENLICHE BETREUUNG</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: "#fff", margin: "8px 0 16px" }}>AI Studienberater + AI Tutor.</h2>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 24px" }}>
            Der Studienberater baut dir deinen Lernplan. Der AI Tutor begleitet dich in jedem Sprint — erklaert, gibt Beispiele, beantwortet Fragen.
          </p>
          <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["Welche Sprints passen zu mir?", "Erklaer mir das nochmal", "Gib mir ein Beispiel"].map(q => (
              <span key={q} style={{ padding: "8px 14px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#CBD5E1", fontSize: 12, fontWeight: 500 }}>{q}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SPRINT PREVIEW */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.amber, letterSpacing: "0.06em" }}>BELIEBTE SPRINTS</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "8px 0 0" }}>Womit andere starten.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {[
            { t: "Prompt Engineering Grundlagen", l: "A1", d: "Content Factory", desc: "Die Kunst der richtigen Frage.", free: true },
            { t: "ChatGPT richtig nutzen", l: "A1", d: "Conversational AI", desc: "Interface, Features, Custom GPTs.", free: true },
            { t: "Vibe Coding", l: "A2", d: "App Lab", desc: "Apps bauen durch Beschreiben.", free: false },
            { t: "Claude Code", l: "B1", d: "App Lab", desc: "Das #1 AI Coding Tool 2026.", free: false },
            { t: "ADHS & AI", l: "A1", d: "HR & People", desc: "Fokus-Tools, Routinen mit AI.", free: true },
            { t: "n8n Grundlagen", l: "A2", d: "Automation HQ", desc: "Visual Workflow Automation.", free: false },
          ].map((s, i) => (
            <div key={i} style={{ background: Z.surface, borderRadius: 16, padding: 20, border: "1px solid " + Z.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: s.l === "A1" ? Z.greenLight : s.l === "A2" ? Z.blueLight : Z.violetLight, color: s.l === "A1" ? Z.green : s.l === "A2" ? Z.blue : Z.violet }}>{s.l}</span>
                  <span style={{ fontSize: 11, color: Z.hint }}>{s.d}</span>
                </div>
                {s.free && <span style={{ fontSize: 9, fontWeight: 700, color: Z.green, background: Z.greenLight, padding: "2px 7px", borderRadius: 10 }}>GRATIS</span>}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: Z.text, margin: "0 0 4px" }}>{s.t}</h3>
              <p style={{ fontSize: 12, color: Z.muted, margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DSGVO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ background: Z.greenLight, borderRadius: 20, padding: "32px 40px", border: "1px solid " + Z.green + "20", textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: Z.green, margin: "0 0 8px" }}>DSGVO-konform. Deutsche Server.</h3>
          <p style={{ fontSize: 14, color: "#065F46", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
            Self-hosted auf Hetzner in Nuernberg. Keine US-Cloud. Plausible Analytics ohne Cookies.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: Z.blue, letterSpacing: "0.06em" }}>PREISE</span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "8px 0 0" }}>Starte kostenlos. Skaliere wenn du bereit bist.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {PRICING.map((p, i) => (
            <div key={i} style={{ background: p.primary ? Z.dark : Z.surface, borderRadius: 20, padding: 28, border: p.primary ? "none" : "1px solid " + Z.border, position: "relative" }}>
              {p.primary && <div style={{ position: "absolute", top: 14, right: 14 }}><span style={{ fontSize: 10, fontWeight: 700, color: Z.blue, background: Z.blueLight, padding: "3px 10px", borderRadius: 10 }}>BELIEBT</span></div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: p.primary ? "#94A3B8" : Z.muted, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: p.primary ? "#fff" : Z.text, letterSpacing: "-0.03em" }}>{p.price === "0" ? "Gratis" : "€" + p.price}</span>
                {p.price !== "0" && <span style={{ fontSize: 14, color: p.primary ? "#64748B" : Z.hint }}>{p.sub}</span>}
              </div>
              <div style={{ margin: "16px 0 20px" }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: p.primary ? Z.blue : Z.green }}>✓</span>
                    <span style={{ fontSize: 13, color: p.primary ? "#CBD5E1" : Z.muted }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onStart?.("assess")} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: p.primary ? Z.blue : Z.bg, color: p.primary ? "#fff" : Z.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      
      {/* BUSINESS ANFRAGEN */}
      <section id="business" style={{ background: "#F8FAFC", padding: "60px 0" }}>
        <BusinessInquiry />
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, color: Z.text, margin: "0 0 12px" }}>Bereit loszulegen?</h2>
        <p style={{ fontSize: 16, color: Z.muted, marginBottom: 28 }}>Dein erster Sprint wartet. Kein Abo noetig — starte kostenlos.</p>
        <button onClick={() => onStart?.("assess")} style={{
          padding: "18px 48px", borderRadius: 14, border: "none",
          background: Z.blue, color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
        }}>Jetzt immatrikulieren →</button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid " + Z.border, padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: Z.text, letterSpacing: "-0.03em" }}>zehn<span style={{ color: Z.blue, fontWeight: 900 }}>x</span><span style={{ fontWeight: 400, color: Z.hint, fontSize: 11, marginLeft: 6 }}>academy</span></span>
            <div style={{ fontSize: 11, color: Z.hint, marginTop: 4 }}>ZEHNX Academy · Koeln</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <a onClick={() => onStart?.("legal")} style={{ fontSize: 12, color: Z.muted, textDecoration: "none", cursor: "pointer" }}>Impressum</a>
            <a onClick={() => onStart?.("legal")} style={{ fontSize: 12, color: Z.muted, textDecoration: "none", cursor: "pointer" }}>Datenschutz</a>
            <a onClick={() => onStart?.("legal")} style={{ fontSize: 12, color: Z.muted, textDecoration: "none", cursor: "pointer" }}>AGB</a>
          </div>
        </div>
      </footer>

      {/* STUDIENBERATER CHATBOT */}
      <Chatbot onNavigate={onStart} />
    </div>
  );
}
