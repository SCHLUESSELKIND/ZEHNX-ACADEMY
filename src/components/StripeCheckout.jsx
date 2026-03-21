import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX STRIPE CHECKOUT — Pro Subscription €29/mo
// Creates Stripe Checkout Session via Edge Function
// ═══════════════════════════════════════════════════════════════

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  blue: "#2563EB", blueLight: "#EFF6FF", dark: "#0F172A",
  green: "#059669", greenLight: "#ECFDF5",
};

const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: "0",
    period: "Fuer immer",
    features: [
      "X-SCORE AI Readiness Check",
      "5 Basis-Sprints (A1)",
      "Academy Bot Beratung",
      "Community-Zugang",
    ],
    cta: "Kostenlos starten",
    primary: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29",
    period: "/Monat",
    badge: "Beliebteste Wahl",
    features: [
      "Alle 324 Sprints (A1–C2)",
      "AI Tutor — persoenlicher Begleiter",
      "Skill-Tracking & X-SCORE Dashboard",
      "PDF-Zertifikate pro Sprint",
      "Newsroom mit AI-News",
      "Priority Support",
    ],
    cta: "Pro starten →",
    primary: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "99",
    period: "/Seat/Monat",
    features: [
      "Alles aus Pro",
      "Team-Dashboards & Analytics",
      "AI Act Compliance Reports",
      "Custom Sprints fuer dein Team",
      "SSO & Admin-Panel",
      "Dedizierter Account Manager",
    ],
    cta: "Demo anfragen",
    primary: false,
  },
];

export default function StripeCheckout({ user, onBack }) {
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (planId) => {
    if (planId === "free") {
      onBack?.();
      return;
    }

    if (planId === "enterprise") {
      // Open enterprise contact
      window.location.href = "mailto:hello@zehnx.me?subject=Enterprise%20Anfrage";
      return;
    }

    setLoading(planId);
    try {
      // Call Supabase Edge Function to create Stripe Checkout Session
      const res = await fetch("/rest/v1/rpc/create_checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": window.__SUPABASE_ANON_KEY || "",
          "Authorization": `Bearer ${user?.access_token || ""}`,
        },
        body: JSON.stringify({
          plan: planId,
          success_url: window.location.origin + "?checkout=success",
          cancel_url: window.location.origin + "?checkout=cancel",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback: direct Stripe link (replace with real product link)
        alert("Stripe Checkout wird eingerichtet. Bitte kontaktiere hello@zehnx.me fuer fruehen Zugang.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout voruebergehend nicht verfuegbar. Bitte versuche es spaeter.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{
      maxWidth: 900, margin: "0 auto",
      padding: "40px 16px 60px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {onBack && (
          <button onClick={onBack} style={{
            border: "none", background: "none", color: Z.muted,
            fontSize: 13, cursor: "pointer", marginBottom: 16, fontFamily: "inherit",
          }}>← Zurueck</button>
        )}
        <div style={{
          fontSize: 11, fontWeight: 700, color: Z.blue,
          letterSpacing: "0.08em", marginBottom: 8,
        }}>ZEHNX ACADEMY</div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 32, fontWeight: 900, color: Z.text,
          letterSpacing: "-0.03em", margin: "0 0 8px",
        }}>Waehle deinen Plan</h2>
        <p style={{ fontSize: 15, color: Z.muted, maxWidth: 400, margin: "0 auto" }}>
          Starte kostenlos. Upgrade wenn du bereit bist.
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 16, alignItems: "start",
      }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            borderRadius: 20, overflow: "hidden",
            border: plan.primary ? `2px solid ${Z.blue}` : `1px solid ${Z.border}`,
            background: plan.primary ? Z.dark : Z.surface,
            position: "relative",
          }}>
            {plan.badge && (
              <div style={{
                background: Z.blue, color: "#fff",
                fontSize: 11, fontWeight: 700,
                padding: "6px 0", textAlign: "center",
                letterSpacing: "0.04em",
              }}>{plan.badge}</div>
            )}
            <div style={{ padding: "24px 20px" }}>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: plan.primary ? Z.hint : Z.muted,
                letterSpacing: "0.04em", marginBottom: 4,
              }}>{plan.name.toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{
                  fontSize: plan.price === "0" ? 32 : 40,
                  fontWeight: 900,
                  color: plan.primary ? "#fff" : Z.text,
                  letterSpacing: "-0.03em",
                }}>
                  {plan.price === "0" ? "Gratis" : "€" + plan.price}
                </span>
                {plan.price !== "0" && (
                  <span style={{
                    fontSize: 14,
                    color: plan.primary ? Z.hint : Z.hint,
                  }}>{plan.period}</span>
                )}
              </div>

              {plan.features.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 12, marginTop: 2,
                    color: plan.primary ? Z.blue : Z.green,
                  }}>✓</span>
                  <span style={{
                    fontSize: 13,
                    color: plan.primary ? "#CBD5E1" : Z.muted,
                  }}>{f}</span>
                </div>
              ))}

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                style={{
                  width: "100%", padding: "14px",
                  borderRadius: 12, border: "none",
                  background: plan.primary ? Z.blue : Z.bg,
                  color: plan.primary ? "#fff" : Z.text,
                  fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  marginTop: 16, opacity: loading === plan.id ? 0.6 : 1,
                  boxShadow: plan.primary ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
                }}
              >
                {loading === plan.id ? "Laden..." : plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div style={{
        textAlign: "center", marginTop: 32,
        display: "flex", justifyContent: "center",
        gap: 24, flexWrap: "wrap",
      }}>
        {["Jederzeit kuendbar", "DSGVO-konform", "Deutsche Server", "Sichere Zahlung via Stripe"].map(t => (
          <span key={t} style={{ fontSize: 12, color: Z.hint }}>✓ {t}</span>
        ))}
      </div>
    </div>
  );
}
