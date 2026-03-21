import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX STUDYBOT — Studienberater & Lernpfad-Planer
// Lebt auf der Landing Page. Berät, plant, empfiehlt.
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  green: "#059669", greenLight: "#ECFDF5", violet: "#7C3AED",
  dark: "#0F172A",
};

const STUDYBOT_SYSTEM = `Du bist STUDYBOT — der persoenliche Studienberater der ZEHNX Academy. Du bist KEIN allgemeiner Chatbot. Du hast EINE Mission: In 2-4 Nachrichten den perfekten Lernpfad zusammenstellen.

═══ PERSOENLICHKEIT ═══
- Wie der beste Studienberater den man sich vorstellen kann: warmherzig, kompetent, effizient
- Du duzt, bist locker aber nicht kumpelhaft
- Du bist begeistert von AI-Lernen (ohne cringe)
- KURZ: Max 3 Saetze + Quick-Reply-Vorschlaege. Kein Wall-of-Text.
- Kein Markdown. Nur Klartext + Zeilenumbrueche.

═══ GESPRAECHS-ARCHITEKTUR ═══

PHASE 1 — EINSTIEG (1. Nachricht):
Der User hat einen der 3 Buttons geklickt. Reagiere passend:
- "Projekt": Frage nach dem BEREICH (nicht "beschreib dein Projekt" — das ueberfordert)
- "X-Score": Erklaer kurz, leite zur Immatrikulation
- "Umschauen": Zeig die 3 beliebtesten Einstiegs-Sprints

PHASE 2 — BEDARFSANALYSE (2-3 Nachrichten):
Stelle EINE Frage pro Nachricht. Nie zwei. Reihenfolge:
1. BEREICH: "Was willst du erreichen?" (Buttons: App bauen / Content & Marketing / Prozesse automatisieren / Daten & Analytics / Etwas anderes)
2. ERFAHRUNG: "Wie ist dein Stand mit AI?" (Buttons: Noch nie genutzt / Nutze ChatGPT gelegentlich / Arbeite regelmaessig mit AI / Bin Entwickler)
3. OPTIONAL — ZEITRAHMEN nur wenn relevant: "Wie viel Zeit pro Woche?" (Buttons: 2-3h nebenbei / 5-8h ernsthaft / Vollzeit deep dive)

PHASE 3 — STUDIENPLAN (nach 2-3 Fragen):
Erstelle den persoenlichen Lernpfad. Format:

"Dein Studienplan (X Wochen):

1. [Sprint-Name] ([Level]) — [Warum dieser Sprint, 1 Satz]
2. [Sprint-Name] ([Level]) — [Warum]
3. [Sprint-Name] ([Level]) — [Warum]
...

Ergebnis: [Was du nach dem Plan KANNST, 1 Satz]

Bereit loszulegen? Immatrikulier dich kostenlos — die ersten 10 Sprints sind gratis."

Max 4-6 Sprints pro Plan. Aufsteigend nach Schwierigkeit.

═══ QUICK REPLIES ═══
WICHTIG: Beende JEDE Nachricht mit Quick-Reply-Vorschlaegen im Format:
[QUICK: Option A | Option B | Option C]

Das Frontend parsed das und zeigt Buttons. Immer 2-4 Optionen. Kurz (max 4 Woerter pro Option).

Beispiele:
[QUICK: App bauen | Content & Marketing | Automatisieren | Etwas anderes]
[QUICK: Noch nie | ChatGPT ab und zu | Regelmaessig | Bin Entwickler]
[QUICK: Klingt perfekt! | Andere Sprints zeigen | Nochmal von vorn]

═══ VOLLSTAENDIGER SPRINT-KATALOG ═══

CONTENT FACTORY:
A1: ChatGPT Textgenerierung, Social Media Texte, AI Schreibassistenten
A2: Prompt Engineering Grundlagen, Blog & SEO mit AI, Newsletter mit AI, Copywriting mit AI, Video-Produktion mit AI, Podcast-Produktion
B1: Storytelling mit AI, AI Content Strategie, Redaktionsplanung
B2: Multi-Channel Content Ops, Brand Voice Training

APP LAB:
A2: Vibe Coding (Bolt/Lovable/Replit), Cursor & Windsurf
B1: React Grundlagen, Supabase & Datenbanken, Tailwind CSS, Claude Code, Stripe Payments, PWA & Mobile
B2: Full-Stack AI App (React+Supabase+Claude+Stripe), Next.js, Docker, Claude API
C1: Multi-Tenant SaaS, CI/CD, Testing & Performance

AUTOMATION HQ:
A1: Zapier & Make Einstieg
A2: n8n Grundlagen, E-Mail Automation, Spreadsheet Automation
B1: n8n Advanced, API-Integration, CRM Automation, Dokumenten-Pipeline
C1: Enterprise Automation, Compliance Workflows

BUSINESS SCHOOL:
A1: AI Business Grundlagen
A2: AI fuer Freelancer, Pricing & Monetarisierung, AI Geschaeftsmodelle
B1: Lean AI Startup, Growth Hacking, Stripe Payments, Subscription Models
B2: Pitch Deck mit AI, AI-First Company, AI im Mittelstand

DATA INTELLIGENCE:
A1: Daten lesen lernen, Dashboards verstehen
A2: Datenanalyse mit AI, Google Analytics mit AI
B1: SQL Basics, Data Visualization, Analytics & KPIs
B2: Predictive Analytics, AI-gestuetzte BI

CONVERSATIONAL AI:
A1: ChatGPT richtig nutzen
A2: Custom GPTs bauen, Claude vs ChatGPT vs Gemini
B1: Chatbot Development, RAG Basics, Embedding
B2: Claude API, Voice Agents, Multi-Turn Dialogue
C1: Multi-Agent Systeme, Evaluation & Testing

DESIGN STUDIO:
A1: AI Bildgenerierung (Midjourney/DALL-E)
A2: Brand Design mit AI, Logo & Visual Identity
B1: UI/UX mit AI, Figma Workflows, Design Systems
B2: AI Video & Animation

MARKETING LAB:
A1: Social Media Basics, LinkedIn mit AI
A2: Instagram Strategie, TikTok & Reels, SEO mit AI, Email Marketing
B1: Meta/Google Ads mit AI, Growth Marketing, Funnel Optimierung
C1: Marketing Automation, Attribution Modelling

HR & PEOPLE:
A1: ADHS & AI Tools, Remote Work mit AI
A2: AI Recruiting, Bewerbungen mit AI
B1: People Analytics, Onboarding Automation, Employer Branding

LEGAL & COMPLIANCE:
A2: DSGVO Basics, AI Act verstehen, Urheberrecht & AI
B1: Compliance Automation, Datenschutz-Folgenabschaetzung

AI ENGINEERING:
B1: Docker & Deployment, Vector Databases Intro
B2: LangChain, RAG Systeme, Fine-Tuning, Claude API Advanced, MCP & Tool Use
C1: MLOps, Multi-Agent Architektur, Kubernetes
C2: AI System Design, Research Paper Implementation

AI SELBSTSCHUTZ:
A1: Passwoerter & 2FA, Phishing erkennen, Datenschutz & AI
A2: VPN & Verschluesselung, Browser-Sicherheit
B1: Prompt Injection Defence, Privacy by Design

CREATOR ECONOMY:
A2: YouTube mit AI, TikTok Creator, Podcast starten
B1: Monetarisierung, Community Building, Online-Kurs erstellen

VERTICAL AI:
A1: AI in meiner Branche (Ueberblick)
A2: AI fuer Restaurants, AI fuer Immobilien, AI fuer Aerzte
B1: Branchenspezifische Chatbots, E-Commerce mit AI

═══ LERNPFAD-VORLAGEN ═══

PFAD "Content Creator" (A1→B1, 8 Wochen):
1. ChatGPT richtig nutzen (A1) → 2. Prompt Engineering (A2) → 3. Copywriting mit AI (A2) → 4. Social Media / LinkedIn (A2) → 5. SEO mit AI (A2) → 6. Newsletter mit AI (A2)

PFAD "App Builder" (A2→B2, 12 Wochen):
1. Vibe Coding (A2) → 2. React Grundlagen (B1) → 3. Supabase (B1) → 4. Claude Code (B1) → 5. Stripe Payments (B1) → 6. Full-Stack AI App (B2)

PFAD "Automator" (A1→B1, 8 Wochen):
1. Zapier & Make (A1) → 2. n8n Grundlagen (A2) → 3. E-Mail Automation (A2) → 4. n8n Advanced (B1) → 5. CRM Automation (B1)

PFAD "Business Leader" (A1→B1, 6 Wochen):
1. AI Business Grundlagen (A1) → 2. AI fuer Freelancer (A2) → 3. Pricing (A2) → 4. Growth Hacking (B1)

PFAD "AI Developer" (B1→C1, 12 Wochen):
1. Claude Code (B1) → 2. React (B1) → 3. Supabase (B1) → 4. Claude API (B2) → 5. RAG Systeme (B2) → 6. Multi-Agent (C1)

PFAD "ADHS Produktivitaet" (A1→A2, 4 Wochen):
1. ADHS & AI (A1) → 2. ChatGPT richtig nutzen (A1) → 3. Prompt Engineering (A2) → 4. Spreadsheet Automation (A2)

Passe diese Vorlagen an den User an — sie sind Startpunkte, nicht starr.

═══ PREISE ═══
Free: 0 EUR, 10 Sprints, dauerhaft kostenlos
Starter: 19 EUR/Mo, alle 324 Sprints + AI Tutor + Zertifikate
Pro: 49 EUR/Mo, alles + Team Features + Priority Support

═══ STRIKTE REGELN ═══
- IMMER Deutsch
- IMMER [QUICK: ...] am Ende jeder Nachricht
- IMMER nur EINE Frage pro Nachricht
- NIEMALS erfinden — nur Sprints aus dem Katalog empfehlen
- NIEMALS laenger als 5 Saetze (exkl. Studienplan)
- Wenn unklar: "Fang kostenlos an mit ChatGPT richtig nutzen (A1)"
- Antworte auf Fragen zu Preisen, Features, DSGVO, Technik — aber lenke immer zurueck zum Studienplan`;


// ═══ QUICK REPLY PARSER ═══

function parseQuickReplies(text) {
  const match = text.match(/\[QUICK:\s*(.+?)\]/);
  if (!match) return { text, replies: [] };
  const replies = match[1].split("|").map(r => r.trim()).filter(Boolean);
  const cleanText = text.replace(/\[QUICK:\s*.+?\]/, "").trim();
  return { text: cleanText, replies };
}


// ═══ STUDYBOT COMPONENT ═══

export default function StudyBot({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [planDelivered, setPlanDelivered] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg = { role: "user", content: msg.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setQuickReplies([]);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: STUDYBOT_SYSTEM,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Da ist was schiefgelaufen. Versuch es nochmal!";
      const { text: cleanText, replies } = parseQuickReplies(raw);

      // Detect if a study plan was delivered
      if (cleanText.includes("Studienplan") || cleanText.includes("1.") && cleanText.includes("2.")) {
        setPlanDelivered(true);
      }

      const updated = [...newMessages, { role: "bot", content: cleanText }];
      setMessages(updated);
      setQuickReplies(replies.length > 0 ? replies : []);
    } catch {
      setMessages([...newMessages, { role: "bot", content: "Verbindungsfehler — versuch es gleich nochmal!" }]);
      setQuickReplies([]);
    } finally {
      setLoading(false);
    }
  };

  const INITIAL_OPTIONS = [
    { label: "Ich will was Konkretes umsetzen", icon: "🎯" },
    { label: "Wo stehe ich? (X-Score)", icon: "📊" },
    { label: "Erstmal umschauen", icon: "👀" },
  ];

  // ═══ CLOSED STATE — FLOATING BUTTON ═══
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} aria-label="STUDYBOT oeffnen" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 22px", borderRadius: 50,
        background: Z.dark, color: "#fff", border: "none",
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", letterSpacing: "-0.01em",
        boxShadow: "0 4px 24px rgba(15,23,42,0.3)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 14,
          background: Z.blue, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, color: "#fff",
        }}>S</span>
        STUDYBOT
      </button>
    );
  }

  // ═══ OPEN STATE — CHAT WINDOW ═══
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 400, maxWidth: "calc(100vw - 32px)",
      height: 580, maxHeight: "calc(100vh - 48px)",
      background: Z.surface, borderRadius: 20,
      border: `1px solid ${Z.border}`,
      boxShadow: "0 16px 48px rgba(15,23,42,0.2)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        padding: "14px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: Z.dark, color: "#fff",
        borderBottom: "2px solid #2563EB",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: Z.blue, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900,
          }}>S</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>STUDYBOT</div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Dein Studienplan in 2 Minuten</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{
          width: 30, height: 30, borderRadius: 10, border: "none",
          background: "rgba(255,255,255,0.08)", color: "#94A3B8",
          fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* ═══ MESSAGES ═══ */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {/* Welcome state */}
        {messages.length === 0 && (
          <div style={{ padding: "4px 0" }}>
            <div style={{
              padding: "14px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
              background: Z.borderLight, color: Z.text,
              fontSize: 14, lineHeight: 1.6, marginBottom: 14,
            }}>
              Hey! Ich bin der STUDYBOT — dein persoenlicher Studienberater.{"\n"}Ich finde in 2-3 Fragen den perfekten Lernpfad fuer dich.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INITIAL_OPTIONS.map(opt => (
                <button key={opt.label} onClick={() => sendMessage(opt.label)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  border: `1.5px solid ${Z.border}`, background: Z.surface,
                  color: Z.text, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "border-color 0.15s",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10, alignItems: "flex-end",
          }}>
            {m.role === "bot" && (
              <div style={{
                width: 24, height: 24, borderRadius: 8, marginRight: 6, flexShrink: 0,
                background: Z.blue, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900,
              }}>S</div>
            )}
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "bot" ? 4 : 16,
              background: m.role === "user" ? Z.blue : Z.borderLight,
              color: m.role === "user" ? "#fff" : Z.text,
              fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8, marginRight: 6,
              background: Z.blue, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900,
            }}>S</div>
            <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: Z.borderLight }}>
              <span style={{ display: "flex", gap: 5 }}>
                {[0, 0.15, 0.3].map((d, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: 4, background: Z.hint, animation: `studybotPulse 1s infinite ${d}s` }}/>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ═══ QUICK REPLIES ═══ */}
      {quickReplies.length > 0 && !loading && (
        <div style={{ padding: "4px 14px 2px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {quickReplies.map(q => (
            <button key={q} onClick={() => sendMessage(q)} style={{
              padding: "9px 14px", borderRadius: 20,
              border: `1.5px solid ${Z.blue}25`, background: Z.blueLight,
              color: Z.blue, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* ═══ CTA after plan ═══ */}
      {planDelivered && !loading && (
        <div style={{ padding: "6px 14px 2px" }}>
          <button onClick={() => onNavigate?.("assess")} style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: Z.blue, color: "#fff", border: "none",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>Jetzt kostenlos immatrikulieren →</button>
        </div>
      )}

      {/* ═══ INPUT ═══ */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${Z.borderLight}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Oder schreib einfach was du vorhast..."
            disabled={loading}
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 14,
              border: `1px solid ${Z.border}`, background: Z.bg,
              fontSize: 13, color: Z.text, outline: "none", fontFamily: "inherit",
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: 14, border: "none",
            background: input.trim() && !loading ? Z.dark : Z.border,
            color: input.trim() && !loading ? "#fff" : Z.hint,
            fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>

      <style>{`@keyframes studybotPulse{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
    </div>
  );
}
