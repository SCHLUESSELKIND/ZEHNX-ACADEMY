import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// ZEHNX PAYWALL GATE — Free Tier (3 Sprints) vs Pro (All)
// Wraps sprint content, shows upgrade CTA when locked
// ═══════════════════════════════════════════════════════════════

const FREE_SPRINTS = [
  "chatgpt-101", "ai-basics-101", "passwords-101",
  "social-media-101", "adhs-ai-101",
];

const Z = {
  bg: "#FAFAF8", surface: "#FFFFFF", text: "#1A1A1A",
  muted: "#64748B", hint: "#94A3B8", border: "#E2E8F0",
  blue: "#2563EB", blueLight: "#EFF6FF",
  dark: "#0F172A", green: "#059669",
};

export function isSprintFree(sprintId) {
  return FREE_SPRINTS.includes(sprintId);
}

export function canAccessSprint(sprintId, userTier) {
  if (userTier === "pro" || userTier === "enterprise") return true;
  return isSprintFree(sprintId);
}

export default function PaywallGate({ sprintId, sprintName, userTier = "free", onUpgrade, children }) {
  const hasAccess = canAccessSprint(sprintId, userTier);

  if (hasAccess) return children;

  return (
    <div style={{
      maxWidth: 480, margin: "60px auto", padding: "40px 24px",
      textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20,
        background: Z.blueLight, color: Z.blue,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, margin: "0 auto 20px",
      }}>🔒</div>

      <h2 style={{
        fontSize: 24, fontWeight: 800, color: Z.text,
        letterSpacing: "-0.03em", margin: "0 0 8px",
      }}>Pro Sprint</h2>

      <p style={{ fontSize: 15, color: Z.muted, lineHeight: 1.6, margin: "0 0 24px" }}>
        <strong>{sprintName || sprintId}</strong> ist Teil des Pro-Programms.
        Schalte alle 324 Sprints frei — mit AI Tutor, Skill-Tracking und Zertifikaten.
      </p>

      <div style={{
        background: Z.surface, borderRadius: 16,
        border: `1px solid ${Z.border}`, padding: "20px",
        marginBottom: 20, textAlign: "left",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: Z.blue, letterSpacing: "0.04em" }}>PRO</span>
          <div>
            <span style={{ fontSize: 28, fontWeight: 900, color: Z.text }}>€29</span>
            <span style={{ fontSize: 13, color: Z.hint }}>/Monat</span>
          </div>
        </div>
        {[
          "Alle 324 Sprints in 14 Departments",
          "AI Tutor — persoenlicher Lernbegleiter",
          "X-SCORE Skill-Tracking & Zertifikate",
          "Newsroom mit AI-kuratierten Updates",
          "Community & Netzwerk",
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span style={{ color: Z.green, fontSize: 12, marginTop: 2 }}>✓</span>
            <span style={{ fontSize: 13, color: Z.text }}>{f}</span>
          </div>
        ))}
      </div>

      <button onClick={() => onUpgrade?.("pro")} style={{
        width: "100%", padding: "16px", borderRadius: 14,
        background: Z.blue, color: "#fff", border: "none",
        fontSize: 15, fontWeight: 800, cursor: "pointer",
        fontFamily: "inherit", boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
      }}>
        Jetzt upgraden →
      </button>

      <div style={{ marginTop: 16, fontSize: 12, color: Z.hint }}>
        Jederzeit kuendbar · DSGVO-konform · Deutsche Server
      </div>

      <div style={{
        marginTop: 24, padding: "12px 16px", borderRadius: 12,
        background: Z.blueLight, fontSize: 13, color: Z.blue,
      }}>
        💡 Tipp: Starte mit dem kostenlosen X-SCORE um deinen AI-Readiness-Level zu ermitteln.
      </div>
    </div>
  );
}
