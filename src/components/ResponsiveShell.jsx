import { useState, useEffect } from "react";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE", gn: "#059669", vi: "#7C3AED",
};

const PRIMARY_TABS = [
  { id: "dash", icon: "◈", label: "Home" },
  { id: "sprints", icon: "⚡", label: "Sprints" },
  { id: "live", icon: "◉", label: "Live" },
  { id: "network", icon: "👥", label: "Netzwerk" },
];

const MORE_TABS = [
  { id: "news", icon: "📰", label: "Newsroom" },
  { id: "deep", icon: "🔬", label: "Deep Dive" },
  { id: "progress", icon: "📊", label: "Fortschritt" },
  { id: "legal", icon: "📄", label: "Rechtliches" },
];

const ALL_TABS = [
  { id: "dash", icon: "◈", label: "Dashboard" },
  { id: "sprints", icon: "⚡", label: "Sprints" },
  { id: "news", icon: "📰", label: "Newsroom" },
  { id: "deep", icon: "🔬", label: "Deep Dive" },
  { id: "live", icon: "◉", label: "Live" },
  { id: "network", icon: "👥", label: "Netzwerk" },
  { id: "progress", icon: "📊", label: "Fortschritt" },
  { id: "legal", icon: "📄", label: "Rechtliches" },
];

function useResponsive() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024 };
}

// ═══ Desktop Sidebar ════════════════════════════════════════

function Sidebar({ section, setSection, collapsed, setCollapsed }) {
  return (
    <div style={{
      width: collapsed ? 64 : 220, flexShrink: 0,
      height: "100vh", position: "sticky", top: 0,
      background: Z.w, borderRight: `1px solid ${Z.g200}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.2s ease",
      zIndex: 40, overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "18px 12px" : "18px 20px",
        borderBottom: `1px solid ${Z.g100}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {!collapsed && (
          <div style={{ fontSize: 18, fontWeight: 900, color: Z.x, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
            ZEHN<span style={{ color: Z.bl }}>X</span>
            <span style={{ fontWeight: 500, color: Z.g400, fontSize: 11, marginLeft: 6 }}>ACADEMY</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: 28, height: 28, borderRadius: 6, border: "none",
          background: Z.g50, color: Z.g400, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{collapsed ? "→" : "←"}</button>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {ALL_TABS.map(t => {
          const active = section === t.id;
          return (
            <button key={t.id} onClick={() => setSection(t.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 8, border: "none",
              background: active ? Z.blL : "transparent",
              color: active ? Z.bl : Z.g500,
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: "pointer", fontFamily: "inherit",
              marginBottom: 2, transition: "all 0.1s",
              whiteSpace: "nowrap", overflow: "hidden",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" }}>{t.icon}</span>
              {!collapsed && t.label}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${Z.g100}`, fontSize: 11, color: Z.g400 }}>
          Frerich United Ventures GmbH
        </div>
      )}
    </div>
  );
}

// ═══ Mobile Bottom Bar ══════════════════════════════════════

function BottomBar({ section, setSection }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More Drawer */}
      {showMore && (
        <>
          <div onClick={() => setShowMore(false)} style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)", zIndex: 98,
          }} />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
            background: Z.w, borderRadius: "16px 16px 0 0",
            padding: "16px 16px 100px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: Z.g300, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: Z.x, marginBottom: 12 }}>Mehr</div>
            {MORE_TABS.map(t => (
              <button key={t.id} onClick={() => { setSection(t.id); setShowMore(false); }} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "14px 12px", borderRadius: 10, border: "none",
                background: section === t.id ? Z.blL : "transparent",
                color: section === t.id ? Z.bl : Z.g600,
                fontSize: 14, fontWeight: section === t.id ? 700 : 500,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
              }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 97,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderTop: `0.5px solid ${Z.g200}`,
        display: "flex", justifyContent: "space-around",
        padding: "6px 4px", paddingBottom: "max(6px, env(safe-area-inset-bottom))",
      }}>
        {PRIMARY_TABS.map(t => {
          const active = section === t.id;
          return (
            <button key={t.id} onClick={() => { setSection(t.id); setShowMore(false); }} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, padding: "6px 0", border: "none", background: "none",
              cursor: "pointer", flex: 1, minWidth: 0,
            }}>
              <span style={{ fontSize: 20, color: active ? Z.bl : Z.g400, lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? Z.bl : Z.g400 }}>{t.label}</span>
            </button>
          );
        })}
        {/* More Button */}
        <button onClick={() => setShowMore(!showMore)} style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 2, padding: "6px 0", border: "none", background: "none",
          cursor: "pointer", flex: 1, minWidth: 0,
        }}>
          <span style={{ fontSize: 20, color: MORE_TABS.some(t => t.id === section) ? Z.bl : Z.g400, lineHeight: 1 }}>···</span>
          <span style={{ fontSize: 10, fontWeight: MORE_TABS.some(t => t.id === section) ? 700 : 500, color: MORE_TABS.some(t => t.id === section) ? Z.bl : Z.g400 }}>Mehr</span>
        </button>
      </div>
    </>
  );
}

// ═══ Tablet Top Bar ═════════════════════════════════════════

function TopBar({ section, setSection }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      borderBottom: `0.5px solid ${Z.g200}`,
      padding: "0 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: Z.x, letterSpacing: "-0.04em" }}>
          ZEHN<span style={{ color: Z.bl }}>X</span>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {ALL_TABS.slice(0, 7).map(t => {
            const active = section === t.id;
            return (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: "8px 12px", border: "none",
                borderBottom: active ? `2px solid ${Z.bl}` : "2px solid transparent",
                background: "none", color: active ? Z.bl : Z.g400,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", whiteSpace: "nowrap",
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══ Export: ResponsiveShell ════════════════════════════════

export default function ResponsiveShell({ section, setSection, children }) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [collapsed, setCollapsed] = useState(false);

  if (isDesktop) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar section={section} setSection={setSection} collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{ flex: 1, minWidth: 0, maxWidth: 920, margin: "0 auto", padding: "0 20px 40px" }}>
          {children}
        </main>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <TopBar section={section} setSection={setSection} />
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 40px" }}>
          {children}
        </main>
      </div>
    );
  }

  // Mobile
  return (
    <div style={{ minHeight: "100vh" }}>
      <main style={{ padding: "0 16px 100px" }}>
        {children}
      </main>
      <BottomBar section={section} setSection={setSection} />
    </div>
  );
}
