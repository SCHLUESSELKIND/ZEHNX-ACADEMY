import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX ENTERPRISE BOT — Projektanfragen & Beratung
// Lebt NUR auf dem Business-Tab.
// Beantwortet Fragen, qualifiziert Anfragen, erstellt Schaetzungen.
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  dark: "#0F172A", darkSurface: "#1E293B",
};

const ENTERPRISE_SYSTEM = `Du bist der ENTERPRISE BOT der ZEHNX ACADEMY — unser digitaler Projektberater fuer Firmenkunden. Du beraetest Unternehmen die digitale Produkte (Websites, Apps, Chatbots, Automations) von uns umsetzen lassen moechten.

═══ PERSOENLICHKEIT ═══
- Professionell, kompetent, loesungsorientiert
- Wie ein erfahrener Solutions Architect in einem ersten Discovery Call
- Duzt (wir sind ein modernes Unternehmen), aber business-angemessen
- Max 4 Saetze pro Antwort — respektiere die Zeit des Gegenubers
- Kein Markdown. Klartext + Zeilenumbrueche.

═══ UNSER STACK & LEISTUNGEN ═══
- Frontend: React/Vite, Astro, Tailwind CSS, PWA
- Backend: Supabase (self-hosted Hetzner EU), Edge Functions, PostgreSQL
- AI: Claude API, OpenRouter, RAG-Systeme, Custom Chatbots, MCP
- Payments: Stripe (Checkout, Subscriptions, Webhooks)
- Automation: n8n (self-hosted), E-Mail-Sequenzen, CRM-Workflows
- Hosting: Vercel (Frontend), Hetzner Deutschland (Backend), IONOS (Domains/SMTP)
- CMS: Sanity, Supabase-basiert
- Extras: Mehrsprachig, DSGVO-konform, Plausible Analytics, Docker

═══ SERVICES & PREISRAHMEN ═══
Landing Page: 2.500–5.000 EUR, 2-3 Wochen
Unternehmens-Website (CMS, multilingual): 5.000–12.000 EUR, 4-8 Wochen
Web-App MVP (Auth, DB, Dashboard): 8.000–20.000 EUR, 6-12 Wochen
AI Chatbot / Assistent (RAG, Custom Knowledge): 3.000–8.000 EUR, 2-4 Wochen
Prozess-Automation (n8n, E-Mail, CRM): 2.000–6.000 EUR, 1-3 Wochen
E-Commerce / Payments (Stripe, Abo): 6.000–15.000 EUR, 4-8 Wochen

═══ GESPRAECHS-STRATEGIE ═══

PHASE 1 — BEGRUESSEN & QUALIFIZIEREN
Begrueesse den Interessenten. Frage nach dem konkreten Vorhaben.

PHASE 2 — BEDARF VERSTEHEN (2-4 Fragen)
Stelle EINE Frage pro Nachricht:
1. Was soll gebaut werden? (Website, App, Chatbot, Automation?)
2. Gibt es eine bestehende Loesung? (Link?)
3. Welche Kern-Features sind noetig?
4. Zeitrahmen und Budget-Vorstellung?

PHASE 3 — EINSCHAETZUNG GEBEN
Basierend auf den Antworten:
- Nenne den passenden Service
- Gib eine realistische Preisspanne
- Nenne einen ungefaehren Zeitrahmen
- Empfehle naechsten Schritt (z.B. "Fuer ein verbindliches Angebot braeuchte ich [X]. Soll ich einen Termin vorschlagen?")

PHASE 4 — LEADS SICHERN
Wenn der Interessent bereit ist: Bitte um E-Mail oder schlage vor den Kalkulator (den Fragebogen auf der Seite) zu nutzen fuer einen detaillierteren Kostenvoranschlag.

═══ QUICK REPLIES ═══
Beende JEDE Nachricht mit:
[ENTERPRISE_QUICK: Option A | Option B | Option C]

Typische Optionen:
- Einstieg: "Website bauen | App entwickeln | AI Chatbot | Automation | Etwas anderes"
- Nach Beschreibung: "Preis schaetzen | Features besprechen | Referenzen sehen"
- Nach Schaetzung: "Termin vereinbaren | Kalkulator nutzen | Weitere Fragen"
- Standard: "Preis erfahren | Referenzen | Kontakt aufnehmen"

═══ REFERENZEN (wenn gefragt) ═══
- Sonnentaucher (sonnentaucher.app): Familien-PWA mit Supabase, 32 DB-Tabellen, DSGVO Gold
- ARTES HeumarktClinic: Medical-Website mit Astro, Sanity CMS, 4 Sprachen
- ZEHNX Academy (zehnx.me): AI-Lernplattform, 324 Sprints, Claude-powered Bots
- Diverse Automation-Projekte mit n8n (Rechnungs-Pipelines, CRM-Integration, E-Mail-Sequenzen)

═══ REGELN ═══
- IMMER Deutsch
- IMMER [ENTERPRISE_QUICK: ...] am Ende
- IMMER nur EINE Frage pro Nachricht
- NIEMALS genaue Festpreise nennen — immer Spannen
- NIEMALS technische Details die den Kunden verwirren
- Bei "zu teuer": Minimal-Variante vorschlagen, MVP-Ansatz erklaearen
- Bei Fragen zum Academy-Programm: "Dafuer ist unser ACADEMY BOT auf der Startseite zustaendig — dort bekommst du einen persoenlichen Lernplan."
- E-Mail fuer Anfragen: hello@zehnx.me`;


function parseEnterpriseReplies(text) {
  const match = text.match(/\[ENTERPRISE_QUICK:\s*(.+?)\]/);
  if (!match) return { text, replies: [] };
  const replies = match[1].split("|").map(r => r.trim()).filter(Boolean);
  const cleanText = text.replace(/\[ENTERPRISE_QUICK:\s*.+?\]/, "").trim();
  return { text: cleanText, replies };
}


export default function EnterpriseBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
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
      const res = await fetch("/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: ENTERPRISE_SYSTEM,
          messages: newMessages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })),
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Da ist was schiefgelaufen — versuch es nochmal!";
      const { text: cleanText, replies } = parseEnterpriseReplies(raw);
      setMessages([...newMessages, { role: "bot", content: cleanText }]);
      setQuickReplies(replies.length > 0 ? replies : []);
    } catch {
      setMessages([...newMessages, { role: "bot", content: "Verbindungsfehler — versuch es gleich nochmal!" }]);
      setQuickReplies([]);
    } finally {
      setLoading(false);
    }
  };

  const INITIAL = [
    { label: "Ich brauche eine Website", icon: "◈" },
    { label: "Ich will eine App bauen lassen", icon: "◆" },
    { label: "AI Chatbot fuer mein Business", icon: "◇" },
    { label: "Prozesse automatisieren", icon: "⚡" },
  ];

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} aria-label="Enterprise Bot oeffnen" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 22px", borderRadius: 50,
        background: Z.dark, color: "#fff", border: "none",
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", letterSpacing: "-0.01em",
        boxShadow: "0 4px 24px rgba(15,23,42,0.35)",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 14,
          background: Z.darkSurface, border: "1.5px solid #334155",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, color: "#fff",
        }}>E</span>
        ENTERPRISE BOT
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 420, maxWidth: "calc(100vw - 32px)",
      height: 580, maxHeight: "calc(100vh - 48px)",
      background: Z.surface, borderRadius: 20,
      border: `1px solid ${Z.border}`,
      boxShadow: "0 16px 48px rgba(15,23,42,0.2)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* HEADER */}
      <div style={{
        padding: "14px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: Z.dark, color: "#fff",
        borderBottom: "2px solid #334155",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: Z.darkSurface, border: "1.5px solid #334155",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900,
          }}>E</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>ENTERPRISE BOT</div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>Projektberatung & Kostenvoranschlag</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{
          width: 30, height: 30, borderRadius: 10, border: "none",
          background: "rgba(255,255,255,0.08)", color: "#94A3B8",
          fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* MESSAGES */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {messages.length === 0 && (
          <div style={{ padding: "4px 0" }}>
            <div style={{
              padding: "14px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
              background: Z.borderLight, color: Z.text,
              fontSize: 14, lineHeight: 1.6, marginBottom: 14,
            }}>
              Hey! Ich bin der Enterprise Bot von ZEHNX. Ich helfe dir bei Projektanfragen — von der ersten Idee bis zum Kostenvoranschlag. Was hast du vor?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INITIAL.map(opt => (
                <button key={opt.label} onClick={() => sendMessage(opt.label)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  border: `1.5px solid ${Z.border}`, background: Z.surface,
                  color: Z.text, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center", color: Z.dark }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10, alignItems: "flex-end",
          }}>
            {m.role === "bot" && (
              <div style={{
                width: 24, height: 24, borderRadius: 8, marginRight: 6, flexShrink: 0,
                background: Z.dark, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900,
              }}>E</div>
            )}
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "bot" ? 4 : 16,
              background: m.role === "user" ? Z.dark : Z.borderLight,
              color: m.role === "user" ? "#fff" : Z.text,
              fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8, marginRight: 6,
              background: Z.dark, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900,
            }}>E</div>
            <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: Z.borderLight }}>
              <span style={{ display: "flex", gap: 5 }}>
                {[0, 0.15, 0.3].map((d, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: 4, background: Z.dark, opacity: 0.3, animation: `ebotPulse 1s infinite ${d}s` }}/>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* QUICK REPLIES */}
      {quickReplies.length > 0 && !loading && (
        <div style={{ padding: "4px 14px 2px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {quickReplies.map(q => (
            <button key={q} onClick={() => sendMessage(q)} style={{
              padding: "9px 14px", borderRadius: 20,
              border: `1.5px solid ${Z.dark}20`, background: `${Z.dark}08`,
              color: Z.dark, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${Z.borderLight}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Beschreib dein Projekt..."
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

      <style>{`@keyframes ebotPulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );
}
