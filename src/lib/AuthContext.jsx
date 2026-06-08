import React, { createContext, useState, useContext, useEffect } from 'react';
import { localStore } from '@/lib/offline-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const currentUser = await localStore.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('Offline app state check failed:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'Failed to load offline data',
      });
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    await checkAppState();
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(true);

    if (shouldRedirect) {
      localStore.auth.logout(window.location.href);
    } else {
      localStore.auth.logout();
    }
  };

  const navigateToLogin = () => {
    localStore.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
