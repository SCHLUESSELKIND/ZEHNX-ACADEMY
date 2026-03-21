import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX AI TUTOR — Fachlicher Sprint-Begleiter
// Lebt im SprintRunner. Kennt den Sprint-Kontext.
// Erklaert, gibt Beispiele, quizt, motiviert.
// Farbe: Violet (STUDYBOT = Blue)
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  borderLight: "#F1F5F9", blue: "#2563EB", blueLight: "#EFF6FF",
  violet: "#7C3AED", violetLight: "#F5F3FF", green: "#059669",
  dark: "#0F172A",
};

function buildTutorSystem(sprint, lesson) {
  return `Du bist der ZEHNX AI TUTOR — ein erfahrener, geduldiger Fachtutor der Lernende durch ihren Sprint begleitet.

═══ DEINE ROLLE ═══
Du bist KEIN Studienberater (das ist der STUDYBOT auf der Landing Page). Du bist der fachliche Begleiter INNERHALB eines Sprints. Du erklaerst Inhalte, gibst Beispiele, beantwortest Fragen, und hilfst bei Uebungen.

Stell dir vor du bist ein erfahrener Mentor der neben dem Lernenden sitzt und jederzeit ansprechbar ist.

═══ KONTEXT ═══
Sprint: "${sprint?.title || "Unbekannt"}"
Level: ${sprint?.level || "A1"}
Department: ${sprint?.department || "Unbekannt"}
Aktueller Tag: ${lesson?.day_number || 1} von 5
Lektionstitel: "${lesson?.title || ""}"

${lesson?.content_markdown ? `Aktuelle Lektion (Inhalt):
${lesson.content_markdown.slice(0, 2500)}` : ""}

═══ PERSOENLICHKEIT ═══
- Geduldig wie ein guter Lehrer — keine Frage ist dumm
- Ermutigend aber ehrlich — "Guter Ansatz, aber hier fehlt X"
- Praxisorientiert — immer mit konkreten Beispielen
- Angepasst ans Level: ${sprint?.level === "A1" || sprint?.level === "A2" ? "Einfache Sprache, keine Fachbegriffe ohne Erklaerung, Alltags-Analogien" : sprint?.level === "B1" ? "Fachbegriffe okay aber neue Konzepte erklaeren, Code-Beispiele mit Kommentaren" : "Fachsprache, tiefe Erklaerungen, fortgeschrittene Patterns"}

═══ ANTWORT-REGELN ═══
- Max 150 Woerter pro Antwort (kurz und verdaulich)
- Kein Markdown (kein **, kein ##, kein \`\`\`)
- Code-Beispiele: In Klartext mit Einrueckung, max 10 Zeilen, mit Kommentaren
- IMMER am Ende: Quick-Reply-Vorschlaege
- Beende JEDE Antwort mit: [TUTOR_QUICK: Option A | Option B | Option C]

═══ FAEHIGKEITEN ═══

ERKLAEREN: Etwas unklar → erklaere anders, mit Analogie
"Stell dir Embedding vor wie einen Fingerabdruck fuer Text — aehnliche Texte haben aehnliche Fingerabdruecke."

BEISPIELE: User will Beispiel → konkretes, praxisnahes Beispiel aus seinem Bereich

QUIZ: User will testen → 1 Frage stellen, auf Antwort warten, Feedback geben
"Quizfrage: Was passiert wenn du in React useState aenderst?"

UEBUNG HELFEN: User steckt fest → Schritt fuer Schritt helfen, NICHT komplette Loesung geben
"Lass uns das aufteilen. Schritt 1: Hast du schon X? Zeig mir was du hast."

MOTIVIEREN: User frustriert → normalisieren, ermutigen, kleinen naechsten Schritt geben
"Das ist normal — hier haengen die meisten. Versuch erstmal nur diesen einen Schritt."

VERTIEFEN: User will mehr → Tiefe geben, auf spaetere Sprints verweisen

═══ WAS DU NICHT TUST ═══
- Studienplan aendern → "Dafuer ist der STUDYBOT zustaendig"
- Preise/Features diskutieren → "Check die Pricing-Seite"
- Komplette Uebungen loesen → Schritt fuer Schritt statt Komplett-Loesung
- Vom Thema abschweifen → freundlich zuruecklenken

═══ QUICK REPLIES ═══
Beende JEDE Nachricht mit Quick-Reply-Optionen:
[TUTOR_QUICK: Option A | Option B | Option C]

Passende Optionen je nach Situation:
- Nach Erklaerung: "Verstanden! | Nochmal anders | Beispiel bitte"
- Nach Beispiel: "Noch eins! | Quiz mich | Uebung starten"  
- Nach Quiz-Frage: "Meine Antwort: ... | Tipp geben | Ueberspringen"
- Nach Quiz-Feedback: "Naechste Frage | Erklaer warum | Weiter im Sprint"
- Nach Uebungshilfe: "Hat geklappt! | Noch stuck | Andere Frage"
- Default: "Erklaer nochmal | Beispiel bitte | Quiz mich!"

IMMER Deutsch.`;
}

// ═══ QUICK REPLY PARSER ═══

function parseTutorReplies(text) {
  const match = text.match(/\[TUTOR_QUICK:\s*(.+?)\]/);
  if (!match) return { text, replies: [] };
  const replies = match[1].split("|").map(r => r.trim()).filter(Boolean);
  const cleanText = text.replace(/\[TUTOR_QUICK:\s*.+?\]/, "").trim();
  return { text: cleanText, replies };
}

// ═══ AI TUTOR COMPONENT ═══

export default function AITutor({ sprint, lesson, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const scrollRef = useRef(null);
  const prevRef = useRef(null);

  // Reset conversation when sprint or lesson changes
  useEffect(() => {
    const key = `${sprint?.id}-${lesson?.day_number}`;
    if (prevRef.current && prevRef.current !== key) {
      setMessages([]);
      setQuickReplies([]);
    }
    prevRef.current = key;
  }, [sprint?.id, lesson?.day_number]);

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
          max_tokens: 400,
          system: buildTutorSystem(sprint, lesson),
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Da ist was schiefgelaufen — frag nochmal!";
      const { text: cleanText, replies } = parseTutorReplies(raw);

      setMessages([...newMessages, { role: "bot", content: cleanText }]);
      setQuickReplies(replies.length > 0 ? replies : ["Erklaer nochmal", "Beispiel bitte", "Quiz mich!"]);
    } catch {
      setMessages([...newMessages, { role: "bot", content: "Verbindungsfehler — versuch es gleich nochmal!" }]);
      setQuickReplies([]);
    } finally {
      setLoading(false);
    }
  };

  // ═══ FAB — Closed State ═══
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} aria-label="AI Tutor oeffnen" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 22px", borderRadius: 50,
        background: `linear-gradient(135deg, ${Z.violet}, #6D28D9)`,
        color: "#fff", border: "none",
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", letterSpacing: "-0.01em",
        boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 14,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/>
          </svg>
        </span>
        AI TUTOR
      </button>
    );
  }

  // ═══ OPEN STATE ═══
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 400, maxWidth: "calc(100vw - 32px)",
      height: 560, maxHeight: "calc(100vh - 48px)",
      background: Z.surface, borderRadius: 20,
      border: `1px solid ${Z.border}`,
      boxShadow: "0 16px 48px rgba(124,58,237,0.15)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `linear-gradient(135deg, ${Z.violet}, #6D28D9)`,
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>AI TUTOR</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>
              {sprint?.title ? `${sprint.title} · Tag ${lesson?.day_number || 1}` : "Dein Lern-Begleiter"}
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{
          width: 30, height: 30, borderRadius: 10, border: "none",
          background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)",
          fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* ═══ CONTEXT BAR ═══ */}
      {sprint && (
        <div style={{
          padding: "7px 16px", background: Z.violetLight,
          borderBottom: `1px solid ${Z.border}`,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11, color: Z.violet, fontWeight: 600,
        }}>
          <span style={{
            padding: "2px 7px", borderRadius: 5,
            background: Z.violet, color: "#fff", fontSize: 10, fontWeight: 700,
          }}>{sprint.level}</span>
          <span>{sprint.department}</span>
          <span style={{ color: Z.hint }}>·</span>
          <span>Tag {lesson?.day_number || 1}/5</span>
        </div>
      )}

      {/* ═══ MESSAGES ═══ */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{ padding: "4px 0" }}>
            <div style={{
              padding: "14px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
              background: Z.violetLight, color: Z.text,
              fontSize: 13, lineHeight: 1.6, marginBottom: 14,
            }}>
              {sprint?.title
                ? `Hey! Ich bin dein AI Tutor fuer "${sprint.title}". Frag mich alles zur Lektion — ich erklaere, gebe Beispiele und helfe bei Uebungen.`
                : "Hey! Ich bin dein AI Tutor. Starte einen Sprint — ich begleite dich fachlich durch jede Lektion."
              }
            </div>
            {sprint && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Fass die Lektion zusammen", "Erklaer den Kernpunkt", "Gib mir ein Beispiel", "Quiz mich!", "Hilf bei der Uebung"].map(q => (
                  <button key={q} onClick={() => sendMessage(q)} style={{
                    padding: "9px 14px", borderRadius: 20,
                    border: `1.5px solid ${Z.violet}20`, background: Z.violetLight,
                    color: Z.violet, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{q}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10, alignItems: "flex-end",
          }}>
            {m.role === "bot" && (
              <div style={{
                width: 24, height: 24, borderRadius: 8, marginRight: 6, flexShrink: 0,
                background: Z.violet, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4"/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "bot" ? 4 : 16,
              background: m.role === "user" ? Z.violet : Z.borderLight,
              color: m.role === "user" ? "#fff" : Z.text,
              fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8, marginRight: 6,
              background: Z.violet, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: Z.borderLight }}>
              <span style={{ display: "flex", gap: 5 }}>
                {[0, 0.15, 0.3].map((d, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: 4, background: Z.violet, opacity: 0.4, animation: `tutorPulse 1s infinite ${d}s` }}/>
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
              padding: "8px 13px", borderRadius: 20,
              border: `1.5px solid ${Z.violet}20`, background: Z.violetLight,
              color: Z.violet, fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* ═══ INPUT ═══ */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${Z.borderLight}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Frag mich was zur Lektion..."
            disabled={loading}
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 14,
              border: `1px solid ${Z.border}`, background: Z.bg,
              fontSize: 13, color: Z.text, outline: "none", fontFamily: "inherit",
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: 14, border: "none",
            background: input.trim() && !loading ? Z.violet : Z.border,
            color: input.trim() && !loading ? "#fff" : Z.hint,
            fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>

      <style>{`@keyframes tutorPulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}
