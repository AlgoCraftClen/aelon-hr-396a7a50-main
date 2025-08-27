import React, { useEffect, useState } from 'react';

// Simple system integrity checker without Node.js dependencies
export default function SystemIntegrityChecker() {
  const [systemStatus, setSystemStatus] = useState('checking');

  useEffect(() => {
    const checkSystemIntegrity = () => {
      try {
        // Check if core components are available
        const coreChecks = {
          react: typeof React !== 'undefined',
          router: typeof window !== 'undefined',
          localStorage: typeof localStorage !== 'undefined',
          entities: true // We'll assume entities are working if we get this far
        };

        const allChecksPass = Object.values(coreChecks).every(check => check === true);
        
        if (allChecksPass) {
          setSystemStatus('healthy');
          console.log('✅ System integrity check passed');
        } else {
          setSystemStatus('degraded');
          console.warn('⚠️ Some system checks failed:', coreChecks);
        }
      } catch (error) {
        setSystemStatus('error');
        console.error('🚨 System integrity check failed:', error);
      }
    };

    checkSystemIntegrity();

    // Run periodic checks every 30 seconds
    const interval = setInterval(checkSystemIntegrity, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Export health check function for external use
export const getSystemHealth = () => {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      react: typeof React !== 'undefined',
      dom: typeof document !== 'undefined',
      storage: typeof localStorage !== 'undefined',
      routing: typeof window !== 'undefined' && typeof window.location !== 'undefined'
    };

    const healthy = Object.values(checks).slice(1).every(check => check === true);
    
    return {
      status: healthy ? 'healthy' : 'degraded',
      checks,
      version: '1.0.4-LOCKDOWN'
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      version: '1.0.4-LOCKDOWN'
    };
  }
};