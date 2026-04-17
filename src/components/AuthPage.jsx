// ═══════════════════════════════════════════════════════════════
// ZEHNX AUTH PAGE — Login / Register / Magic Link
// Place in: src/components/AuthPage.jsx
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";

const Z = {
  bg: "#F5F5F7", white: "#FFFFFF", card: "#FFFFFF",
  g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB", g300: "#D1D5DB",
  g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563", g700: "#374151",
  g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", gnL: "#ECFDF5",
  am: "#D97706", amL: "#FFFBEB", rd: "#DC2626", rdL: "#FEF2F2",
  vi: "#7C3AED", viL: "#F5F3FF",
};

export default function AuthPage({ onLogin, onGoogleLogin, error: externalError }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(externalError || "");
  const [mode, setMode] = useState("login"); // login | register

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onLogin(email.trim());
      if (result?.error) {
        setError(result.error.message || "Etwas ist schiefgelaufen. Versuche es erneut.");
      } else {
        setSent(true);
      }
    } catch (err) {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const result = await onGoogleLogin();
      if (result?.error) {
        setError(result.error.message || "Google Login fehlgeschlagen.");
      }
    } catch (err) {
      setError("Google Login nicht verfügbar.");
    }
  };

  // ─── MAGIC LINK SENT ──────────────────────────────────────
  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: Z.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: Z.x, letterSpacing: "-0.03em" }}>
              ZEHN<span style={{ color: Z.bl }}>X</span>
            </span>
          </div>

          {/* Success Card */}
          <div style={{
            background: Z.white, borderRadius: 16, padding: "40px 32px",
            border: `1px solid ${Z.g200}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: Z.gnL,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 28,
            }}>✉️</div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: Z.x, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Check dein Postfach
            </h2>
            <p style={{ fontSize: 14, color: Z.g500, lineHeight: 1.6, margin: "0 0 20px" }}>
              Wir haben dir einen Magic Link an <strong style={{ color: Z.x }}>{email}</strong> geschickt.
              Klick den Link in der E-Mail um dich einzuloggen.
            </p>

            <div style={{
              background: Z.g50, borderRadius: 10, padding: "12px 16px",
              fontSize: 13, color: Z.g500, lineHeight: 1.6,
            }}>
              💡 Nicht angekommen? Prüfe deinen Spam-Ordner. Der Link ist 60 Minuten gültig.
            </div>

            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{
                marginTop: 20, background: "transparent", border: "none",
                color: Z.bl, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Andere E-Mail verwenden
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN / REGISTER FORM ─────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: Z.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: Z.x, letterSpacing: "-0.03em" }}>
            ZEHN<span style={{ color: Z.bl }}>X</span>
          </span>
          <span style={{ fontSize: 13, color: Z.g400, marginLeft: 8, fontWeight: 500 }}>ACADEMY</span>
        </div>

        {/* Auth Card */}
        <div style={{
          background: Z.white, borderRadius: 16, padding: "36px 32px",
          border: `1px solid ${Z.g200}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>

          {/* Tab Toggle */}
          <div style={{ display: "flex", marginBottom: 28, background: Z.g50, borderRadius: 10, padding: 3 }}>
            {["login", "register"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                  background: mode === m ? Z.white : "transparent",
                  color: mode === m ? Z.x : Z.g400,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {m === "login" ? "Einloggen" : "Registrieren"}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: Z.x, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </h2>
          <p style={{ fontSize: 14, color: Z.g500, margin: "0 0 24px", lineHeight: 1.5 }}>
            {mode === "login"
              ? "Wir senden dir einen Magic Link per E-Mail — kein Passwort nötig."
              : "Starte kostenlos mit 406+ AI-Sprints. Kein Passwort nötig."
            }
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 10,
              border: `1px solid ${Z.g200}`, background: Z.white,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "pointer", fontSize: 14, fontWeight: 600, color: Z.x,
              transition: "all 0.15s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Mit Google {mode === "login" ? "einloggen" : "registrieren"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: Z.g200 }} />
            <span style={{ fontSize: 12, color: Z.g400, fontWeight: 500 }}>oder per E-Mail</span>
            <div style={{ flex: 1, height: 1, background: Z.g200 }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: Z.g700, marginBottom: 6 }}>
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              autoComplete="email"
              autoFocus
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: `1px solid ${error ? Z.rd + "60" : Z.g200}`,
                fontSize: 14, color: Z.x, outline: "none",
                background: Z.white, boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = Z.bl}
              onBlur={e => e.target.style.borderColor = error ? Z.rd + "60" : Z.g200}
            />

            {/* Error Message */}
            {error && (
              <div style={{
                marginTop: 8, padding: "8px 12px", borderRadius: 8,
                background: Z.rdL, color: Z.rd, fontSize: 13, fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: "100%", marginTop: 16, padding: "13px 16px",
                borderRadius: 10, border: "none",
                background: loading || !email.trim() ? Z.g200 : Z.bl,
                color: loading || !email.trim() ? Z.g400 : Z.white,
                fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {loading ? "Sende Magic Link..." : "Magic Link senden →"}
            </button>
          </form>

          {/* Privacy Note */}
          <p style={{ fontSize: 11, color: Z.g400, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            {mode === "register"
              ? "Mit der Registrierung akzeptierst du unsere Nutzungsbedingungen und Datenschutzerklärung. Kein Spam, versprochen."
              : "Wir senden dir einen sicheren Link. Kein Passwort wird gespeichert."
            }
          </p>
        </div>

        {/* Features Preview (Register only) */}
        {mode === "register" && (
          <div style={{
            marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          }}>
            {[
              { icon: "⚡", text: "406+ AI-Sprints" },
              { icon: "🎯", text: "14 Departments" },
              { icon: "📊", text: "Skill-Tracking" },
              { icon: "🆓", text: "Kostenlos starten" },
            ].map((f, i) => (
              <div key={i} style={{
                background: Z.white, borderRadius: 10, padding: "10px 12px",
                border: `1px solid ${Z.g200}`, display: "flex", alignItems: "center", gap: 8,
                fontSize: 12, fontWeight: 600, color: Z.g600,
              }}>
                <span>{f.icon}</span>{f.text}
              </div>
            ))}
          </div>
        )}

        {/* Back to Landing */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a
            href="/"
            style={{ fontSize: 13, color: Z.g400, textDecoration: "none", fontWeight: 500 }}
          >
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}
