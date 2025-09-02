
// 🔒 CRITICAL SYSTEM FILE - v1.0.5-UNBREAKABLE-LOGOUT-LAW
// ⚠️ WARNING: This file controls guest mode and authentication state
// 📚 See /components/changelog.md for stability requirements before modifying

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, supabase } from '@/lib/supabase';
import { createPageUrl } from '@/utils';
import goTo from '@/lib/navigation';

const GuestModeContext = createContext({
  isAuthenticated: false,
  user: null,
  isGuestMode: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: () => {},
  refreshUser: () => {},
  setGuestMode: () => {},
  switchToGuestMode: () => {},
});

export const useGuestMode = () => {
  const context = useContext(GuestModeContext);
  if (!context) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
};

export default function GuestModeProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isGuestMode: false,
    isCheckingAuth: true
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🎨 THEME SYNCHRONIZATION WITH AUTH STATE
  useEffect(() => {
    const savedTheme = localStorage.getItem('iakwe-hr-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, [authState.isAuthenticated, authState.isGuestMode]);

  const checkAuthStatus = async () => {
    // 🚨 POISON PILL CHECK: This is the antidote.
    const forceGuest = sessionStorage.getItem('force_guest_mode');
    if (forceGuest) {
      console.log("💊 Poison Pill detected. Forcing guest mode and aborting auth check.");
      sessionStorage.removeItem('force_guest_mode'); // Consume the pill
      setAuthState({
        isAuthenticated: false,
        user: null,
        isGuestMode: true,
        isCheckingAuth: false
      });
      return; // Abort mission. Do not call auth.getUser().
    }

    try {
      console.log("🔍 Checking authentication status...");
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 10000)
      );
      
      const userPromise = auth.getUser();
      const user = await Promise.race([userPromise, timeoutPromise]);
      
      console.log("✅ User authenticated:", user);
      setAuthState({
        isAuthenticated: true,
        user,
        isGuestMode: false,
        isCheckingAuth: false
      });
    } catch (error) {
      console.log("❌ User not authenticated, enabling guest mode by default");
      console.warn("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isGuestMode: true, // Default to guest if no user and no other state
        isCheckingAuth: false
      });
    }
  };

  const refreshUser = async () => {
    if (authState.isAuthenticated) {
      try {
        const user = await auth.getUser();
        setAuthState(prev => ({ ...prev, user }));
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  const login = async () => {
    try {
      console.log("🔐 Initiating login...");
      
      // 🚨 CRITICAL: Use SPA-friendly navigation to internal Auth page
      try {
        goTo('Auth?mode=login', { replace: true });
      } catch (e) {
        // fallback preserved inside goTo
      }
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    console.log("🚪 EXECUTING COMPLETE SIGN OUT FUNCTION - THE LAW IS ABSOLUTE");
    setIsLoggingOut(true); // 🚨 NEW: Trigger the logout screen immediately
    
    // STEP 1: Immediate React state reset - no delays, no awaits
    console.log("🔄 Step 1: Resetting authentication state");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isGuestMode: true,
      isCheckingAuth: false
    });

    // STEP 2: Nuclear client-side data wipe - ignore any errors, just clear everything
    console.log("🧹 Step 2: Nuclear client-side data wipe");
    try {
      // Clear localStorage systematically
      if (typeof Storage !== "undefined" && window.localStorage) {
        const localKeys = Object.keys(localStorage);
        localKeys.forEach(key => {
          try { 
            localStorage.removeItem(key); 
            console.log(`✅ Removed localStorage key: ${key}`);
          } catch(e) {
            console.warn(`⚠️ Could not remove localStorage key ${key}:`, e);
          }
        });
      }
      
      // Clear sessionStorage systematically
      if (typeof Storage !== "undefined" && window.sessionStorage) {
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          try { 
            sessionStorage.removeItem(key); 
            console.log(`✅ Removed sessionStorage key: ${key}`);
          } catch(e) {
            console.warn(`⚠️ Could not remove sessionStorage key ${key}:`, e);
          }
        });
      }
    } catch(e) {
      console.warn("⚠️ Storage clearing encountered errors, but proceeding:", e);
    }
    
    // STEP 3: Nuclear cookie clearing
    console.log("🍪 Step 3: Nuclear cookie clearing");
    try {
      const cookies = document.cookie.split(";");
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          // Clear for current path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          // Clear for current domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          // Clear for parent domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          console.log(`🍪 Cleared cookie: ${name}`);
        }
      });
    } catch(e) {
      console.warn("⚠️ Cookie clearing encountered errors, but proceeding:", e);
    }
    
    // STEP 4: Forceful, immediate redirect - THE LAW IS ENFORCED
    console.log("⚖️ Step 4: THE LAW IS ENFORCED. REDIRECTING TO WELCOME PAGE.");
    console.log("🏠 Executing hard redirect to /Welcome");
    
  // 🚨 ABSOLUTE LAW: Force guest mode and redirect to Welcome
  sessionStorage.setItem('force_guest_mode', 'true');
  try { window.location.href = createPageUrl('Welcome'); } catch (e) { window.location.href = '/Welcome'; }
  };

  const setGuestMode = (enabled) => {
    console.log(`👁️ Setting guest mode to: ${enabled}`);
    setAuthState(prev => ({
      ...prev,
      isGuestMode: enabled,
      isAuthenticated: enabled ? false : prev.isAuthenticated,
      user: enabled ? null : prev.user
    }));
  };

  const switchToGuestMode = () => {
    console.log("👁️ SWITCHING TO GUEST MODE - USER REQUESTED");
    (async () => {
      try {
        // If authenticated, attempt a server-side sign out to avoid token leakage
        try {
          const current = await auth.getUser().catch(() => null);
          if (current) {
            console.log('⚠️ Authenticated user detected: signing out server-side before entering guest mode');
            await auth.signOut().catch(e => console.warn('signOut failed, continuing:', e));
          }
        } catch (e) {
          console.warn('Error while checking/signing out user:', e);
        }

        // Persist explicit guest selection so reloads remain in guest mode
  try { sessionStorage.setItem('force_guest_mode', 'true'); } catch (e) { console.warn('Could not set sessionStorage flag for guest mode', e); }
  setGuestMode(true);
  goTo('GuestDashboard', { replace: true });
      } catch (err) {
        console.error('Error switching to guest mode:', err);
        // Best-effort fallback
        setGuestMode(true);
        try { window.location.href = '/GuestDashboard'; } catch (_) { /* ignore */ }
      }
    })();
  };

  // 🚨 CRITICAL: Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 🚨 CRITICAL: Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔍 Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthState({
            isAuthenticated: true,
            user: session.user,
            isGuestMode: false,
            isCheckingAuth: false
          });
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isGuestMode: true,
            isCheckingAuth: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    ...authState,
    isLoggingOut,
    login,
    logout,
    checkAuthStatus,
    refreshUser,
    setGuestMode,
    switchToGuestMode,
  };

  return (
    <GuestModeContext.Provider value={value}>
      {children}
    </GuestModeContext.Provider>
  );
}
