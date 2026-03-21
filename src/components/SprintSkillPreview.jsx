// ═══════════════════════════════════════════════════════════════
// ZEHNX SPRINT SKILL PREVIEW
// Zeigt bei jedem Sprint welche Skills verbessert werden
// Fuer SprintCatalog-Cards und SprintRunner-Header
// ═══════════════════════════════════════════════════════════════

const Z = {
  text: "#1A1A1A", muted: "#64748B", hint: "#94A3B8",
  border: "#E2E8F0", borderLight: "#F1F5F9",
  blue: "#2563EB", blueLight: "#EFF6FF",
  green: "#059669", greenLight: "#ECFDF5",
};

// Compact version for catalog cards
export function SkillChips({ skills, max = 3 }) {
  if (!skills || skills.length === 0) return null;
  const shown = skills.slice(0, max);
  const remaining = skills.length - max;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
      {shown.map(sk => (
        <span key={sk.name || sk.skill_name} style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 6,
          background: Z.blueLight, color: Z.blue, fontWeight: 600,
        }}>
          {sk.name || sk.skill_name} +{sk.points}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: Z.borderLight, color: Z.hint, fontWeight: 500 }}>
          +{remaining} mehr
        </span>
      )}
    </div>
  );
}

// Detailed version for SprintRunner sidebar
export function SkillBreakdown({ skills, userSkills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: Z.muted, letterSpacing: "0.04em", marginBottom: 8 }}>
        SKILLS IN DIESEM SPRINT
      </div>
      {skills.map(sk => {
        const current = userSkills?.find(us => us.skill_id === sk.skill_id)?.points || 0;
        const after = current + sk.points;
        return (
          <div key={sk.skill_id || sk.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Z.text }}>{sk.name || sk.skill_name}</span>
                <span style={{ fontSize: 11, color: Z.green, fontWeight: 700 }}>+{sk.points}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: Z.borderLight, overflow: "hidden" }}>
                <div style={{ height: "100%", display: "flex" }}>
                  <div style={{ width: `${Math.min((current / 100) * 100, 100)}%`, background: Z.blue, borderRadius: 2 }} />
                  <div style={{ width: `${Math.min((sk.points / 100) * 100, 30)}%`, background: Z.green, opacity: 0.5, borderRadius: "0 2px 2px 0" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
                <span style={{ fontSize: 9, color: Z.hint }}>{current} Pkt</span>
                <span style={{ fontSize: 9, color: Z.green }}>→ {after} Pkt</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Sprint completion reward summary
export function SkillReward({ skills }) {
  if (!skills || skills.length === 0) return null;
  const total = skills.reduce((s, sk) => s + sk.points, 0);

  return (
    <div style={{
      padding: 16, borderRadius: 14,
      background: Z.greenLight, border: `1px solid ${Z.green}20`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: Z.green }}>+{total} Skill-Punkte</div>
      <div style={{ fontSize: 12, color: "#065F46", marginTop: 4 }}>
        {skills.map(sk => `${sk.name || sk.skill_name} +${sk.points}`).join(" · ")}
      </div>
    </div>
  );
}

export default { SkillChips, SkillBreakdown, SkillReward };
