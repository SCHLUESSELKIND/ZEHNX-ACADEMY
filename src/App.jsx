import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ZehnxApp from './components/ZehnxApp';
// NOTE: When Supabase is connected, uncomment:
// import { useAuth } from './hooks/useAuth';
// import * as api from './lib/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth callback handler
  useEffect(() => {
    if (location.pathname === '/auth/callback') {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  // The complete ZEHNX ACADEMY UI
  // Currently runs in demo mode with local state.
  // To connect to Supabase:
  // 1. Uncomment useAuth import above
  // 2. Pass auth props to ZehnxApp
  // 3. Replace local state in ZehnxApp with api.* calls
  return <ZehnxApp />;
}
