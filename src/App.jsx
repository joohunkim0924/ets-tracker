import { Toaster } from "@/components/ui/toaster"
import { applyTheme, getSavedTheme } from '@/lib/theme';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import AFT from './pages/AFT';
import Benefits from './pages/Benefits';
import Weapons from './pages/Weapons';

// Initialize theme
applyTheme(getSavedTheme());

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    /* The 'main' tag handles the scrolling for the whole app */
    <main className="h-full w-full min-w-0 max-w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/aft" element={<AFT />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/weapons" element={<Weapons />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App