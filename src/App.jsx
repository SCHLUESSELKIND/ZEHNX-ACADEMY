// ═══════════════════════════════════════════════════════════════
// ZEHNX ACADEMY — App.jsx (Updated with Auth)
// Replace: src/App.jsx
// ═══════════════════════════════════════════════════════════════

import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import ZehnxApp from './components/ZehnxApp';

function AppContent() {
  const { user, profile, loading, signInWithMagicLink, signInWithGoogle, signOut, updateProfile } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F5F5F7",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#18181B", letterSpacing: "-0.03em", marginBottom: 12 }}>
            ZEHN<span style={{ color: "#2563EB" }}>X</span>
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Laden...</div>
        </div>
      </div>
    );
  }

  // Not logged in → Auth Page
  if (!user) {
    return (
      <AuthPage
        onLogin={signInWithMagicLink}
        onGoogleLogin={signInWithGoogle}
      />
    );
  }

  // Logged in → Main App
  return (
    <ZehnxApp
      user={user}
      profile={profile}
      onSignOut={signOut}
      onUpdateProfile={updateProfile}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
