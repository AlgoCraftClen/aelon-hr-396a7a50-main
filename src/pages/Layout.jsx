

// 🔒 CRITICAL SYSTEM FILE - v1.0.4-LOCKDOWN
// ⚠️ WARNING: This file controls core routing and authentication flow
// 📚 See /components/changelog.md for stability requirements before modifying

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils/index.ts";
import GuestModeProvider, { useGuestMode } from "@/components/auth/GuestModeProvider";
import GuestModeWrapper from "@/components/auth/GuestModeWrapper";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import GuestLayout from "@/components/layout/GuestLayout";
import ProtectedRoute from "@/components/system/ProtectedRoute";
import LogoutGuard from "@/components/system/LogoutGuard";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import FloatingAIAssistant from "@/components/ai/FloatingAIAssistant";
import GuestDashboard from "@/pages/GuestDashboard";
import LogoutScreen from "@/components/common/LogoutScreen";

// Add immediate redirect monitoring at the very top level
if (typeof window !== 'undefined') {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/login?from_url=') || 
      currentUrl.includes('/login?app_id=') ||
      currentUrl.includes('base44.app/login')) {
    console.log("🚨 EMERGENCY REDIRECT FROM PLATFORM LOGIN");
    window.location.replace('/Welcome');
  }
}

// Main Layout Wrapper that handles auth state
function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuestMode, isAuthenticated, user, isCheckingAuth, isLoggingOut } = useGuestMode();
  const [isLoading, setIsLoading] = useState(true);

  // Define whether to render the AI assistant. It should NOT appear on the Welcome page.
  const shouldRenderAI = currentPageName !== 'Welcome';

  // � PROTECTED: Public pages list - maintain this list
  // Public pages must render without sidebars even if guest mode is active.
  const publicPages = ['Welcome', 'Auth', 'ForgotPassword', 'Pricing'];
  const isPublicPage = publicPages.includes(currentPageName);

  // �🚨 REMOVED: Guest navigation useEffect - This was causing the race condition
  // The switchToGuestMode() function now handles navigation directly
  // The previous useEffect block for guest mode navigation was here:
  /*
  useEffect(() => {
    if (isGuestMode && location.pathname !== '/GuestDashboard') {
      console.log("👁️ GUEST MODE DETECTED - NAVIGATING TO GUEST DASHBOARD");
      navigate('/GuestDashboard', { replace: true });
    }
  }, [isGuestMode, navigate, location.pathname]);
  */

  useEffect(() => {
    if (!isCheckingAuth) {
      console.log("🔍 ROUTING DECISION:", {
        pathname: location.pathname,
        isAuthenticated,
        isGuestMode,
        userExists: !!user
      });

      // 🚨 ABSOLUTE LAW: Welcome page is ALWAYS accessible and enforced.
      if (location.pathname === '/Welcome') {
        console.log("✅ WELCOME PAGE ACCESS - ALLOWED");
        setIsLoading(false);
        return;
      }

      // 🚨 ABSOLUTE LAW: Root path ALWAYS goes to Welcome
      if (location.pathname === '/' || location.pathname === '') {
        console.log("🏠 ROOT TO WELCOME ENFORCEMENT");
        navigate('/Welcome', { replace: true });
        return;
      }
      
      // 🚨 ENFORCE LOGOUT LAW: If not authenticated AND NOT A GUEST, redirect to Welcome.
      // This is the safety net that guarantees no access after logout, while allowing guests in.
      if (!isAuthenticated && !isGuestMode && location.pathname !== '/Auth') {
        console.log("🔒 ENFORCING LOGOUT LAW: NOT AUTHENTICATED & NOT GUEST - REDIRECTING TO WELCOME FROM:", location.pathname);
        navigate('/Welcome', { replace: true });
        return;
      }

      setIsLoading(false);
    }
  }, [location.pathname, navigate, isCheckingAuth, isAuthenticated, isGuestMode, user]); // Added 'user' to dependencies due to new log

  // 🎨 ACCESSIBILITY: Enhanced form contrast styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 🎨 ENHANCED FORM CONTRAST - ACCESSIBILITY IMPROVEMENTS */

      /* Input Fields - Dark Mode */
      .dark input[type="text"],
      .dark input[type="email"],
      .dark input[type="password"],
      .dark input[type="number"],
      .dark input[type="date"],
      .dark input[type="tel"],
      .dark input[type="search"],
      .dark input[type="url"],
      .dark textarea,
      .dark select {
        background-color: #2C2C2C !important;
        color: #F1F5F9 !important;
        border-color: #475569 !important;
      }

      .dark input::placeholder,
      .dark textarea::placeholder {
        color: #94A3B8 !important;
        opacity: 1 !important;
      }

      /* Input Fields - Light Mode */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="number"],
      input[type="date"],
      input[type="tel"],
      input[type="search"],
      input[type="url"],
      textarea,
      select {
        background-color: #FFFFFF !important;
        color: #1E293B !important;
        border-color: #D1D5DB !important;
      }

      input::placeholder,
      textarea::placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
      }

      /* Focus States */
      .dark input:focus,
      .dark textarea:focus,
      .dark select:focus {
        border-color: #8B5CF6 !important;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: #8B5CF6 !important;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
      }

      /* Labels - Enhanced Contrast */
      .dark label {
        color: #E2E8F0 !important;
        font-weight: 500 !important;
      }

      label {
        color: #374151 !important;
        font-weight: 500 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // 🚨 Intercept rendering to show logout screen
  if (isLoggingOut) {
    return <LogoutScreen />;
  }

  // Show loading screen while checking auth or handling initial redirect
  if (isCheckingAuth || isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
            <p className="text-gray-600">Loading IAKWE HR...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // If this is a public page, render without sidebars regardless of guest/auth state
  if (isPublicPage) {
    console.log("🌐 RENDERING PUBLIC PAGE EXPERIENCE (PRIORITY)");
    return (
      <ErrorBoundary>
        <ProtectedRoute pageName={currentPageName}>
          <GuestModeWrapper>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
              {children}
              {shouldRenderAI && <FloatingAIAssistant />}
            </div>
          </GuestModeWrapper>
        </ProtectedRoute>
      </ErrorBoundary>
    );
  }

  // 🚨 HARDENED: EXPLICIT GUEST MODE HANDLING - Now with pure state guarantee
  if (isGuestMode) {
    console.log("👁️ RENDERING GUEST EXPERIENCE - VERIFIED PURE GUEST STATE");
    console.log("🔍 Guest State Verification:", { isAuthenticated, user: user ? 'CONTAMINATED' : 'PURE', isGuestMode });
    
    return (
      <ErrorBoundary>
        <ProtectedRoute pageName={currentPageName}>
          <GuestLayout>
            {children}
            {shouldRenderAI && <FloatingAIAssistant />}
          </GuestLayout>
        </ProtectedRoute>
      </ErrorBoundary>
    );
  }

  // If user is authenticated (not guest), show protected authenticated layout
  if (isAuthenticated && !isGuestMode && !isPublicPage) {
    console.log("🔐 RENDERING AUTHENTICATED EXPERIENCE");
    return (
      <ErrorBoundary>
        <ProtectedRoute pageName={currentPageName}>
          <AuthenticatedLayout currentPageName={currentPageName} user={user}>
            {children}
            {shouldRenderAI && <FloatingAIAssistant />}
          </AuthenticatedLayout>
        </ProtectedRoute>
      </ErrorBoundary>
    );
  }

  // If we reach here, the page is neither public nor guest-only; default to authenticated fallback
  console.log("🌐 RENDERING FALLBACK - DEFAULTING TO SIMPLE WRAPPER");
  return (
    <ErrorBoundary>
      <ProtectedRoute pageName={currentPageName}>
        <GuestModeWrapper>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
            {children}
            {shouldRenderAI && <FloatingAIAssistant />}
          </div>
        </GuestModeWrapper>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ErrorBoundary>
      <GuestModeProvider>
        <LogoutGuard />
        <LayoutContent children={children} currentPageName={currentPageName} />
      </GuestModeProvider>
    </ErrorBoundary>
  );
}

