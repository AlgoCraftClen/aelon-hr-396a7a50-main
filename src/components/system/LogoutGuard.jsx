// 🔒 CRITICAL SYSTEM GUARD - v1.0.4-LOGOUT-LOCKDOWN
// ⚠️ WARNING: This component monitors and enforces logout behavior
// 🚨 PERMANENT LOCK: Prevents any re-introduction of platform logout calls

import React, { useEffect } from 'react';

export default function LogoutGuard() {
  useEffect(() => {
    console.log("🛡️ LOGOUT GUARD ACTIVE - PERMANENT SYSTEM PROTECTION");
    
    // Monitor for unwanted redirects to base44 login
    const enforceWelcomePageLaw = () => {
      const currentUrl = window.location.href;
      
      // If we detect any platform login URLs, immediately redirect to Welcome
      if (currentUrl.includes('/login?from_url=') || 
          currentUrl.includes('/login?app_id=') ||
          currentUrl.includes('base44.app/login') ||
          currentUrl.includes('base44.com/login')) {
        console.log("⚠️ PLATFORM LOGIN DETECTED - ENFORCING WELCOME REDIRECT");
        console.log("⚠️ Blocked URL:", currentUrl);
  try { const goTo = require('@/lib/navigation').default; goTo('/Welcome', { replace: true }); } catch (e) { try { window.location.replace(createPageUrl('Welcome')); } catch (_) { window.location.replace('/Welcome'); } }
      }
    };
    
    // Check immediately and monitor continuously
    enforceWelcomePageLaw();
    const guardInterval = setInterval(enforceWelcomePageLaw, 100);
    
    // Override browser navigation methods to prevent platform redirects
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
  history.pushState = function(state, title, url) {
      if (url && (url.includes('/login?') || url.includes('base44.app/login') || url.includes('base44.com/login'))) {
        console.log("⚠️ BLOCKED PLATFORM LOGIN PUSH:", url);
  try { const goTo = require('@/lib/navigation').default; goTo('/Welcome', { replace: true }); } catch (e) { try { window.location.href = createPageUrl('Welcome'); } catch (_) { window.location.href = '/Welcome'; } }
        return;
      }
      return originalPushState.apply(history, arguments);
    };
    
  history.replaceState = function(state, title, url) {
      if (url && (url.includes('/login?') || url.includes('base44.app/login') || url.includes('base44.com/login'))) {
        console.log("⚠️ BLOCKED PLATFORM LOGIN REPLACE:", url);
    try { const goTo = require('@/lib/navigation').default; goTo('/Welcome', { replace: true }); } catch (e) { try { window.location.href = createPageUrl('Welcome'); } catch (_) { window.location.href = '/Welcome'; } }
        return;
      }
      return originalReplaceState.apply(history, arguments);
    };
    
    // Monitor for any window location changes
    let lastUrl = window.location.href;
    const urlChangeInterval = setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        enforceWelcomePageLaw();
      }
    }, 50);
    
    return () => {
      clearInterval(guardInterval);
      clearInterval(urlChangeInterval);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
  
  return null; // This is a monitoring component, no UI
}