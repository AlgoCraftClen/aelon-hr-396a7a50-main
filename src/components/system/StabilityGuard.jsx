import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * STABILITY GUARD - v1.0-STABLE Protection System
 * 
 * This component monitors critical application components and alerts
 * if any core functionality is compromised.
 */

const CRITICAL_COMPONENTS = [
  'AuthenticatedLayout',
  'FloatingAIAssistant', 
  'Dashboard',
  'EmployeeDirectory',
  'Navigation'
];

const PROTECTED_PAGES = [
  '/Dashboard',
  '/EmployeeDirectory', 
  '/Onboarding',
  '/TrainingCenter',
  '/LeaveManagement',
  '/PerformanceReviews',
  '/Compliance',
  '/Analytics',
  '/Recruitment',
  '/AdminChat',
  '/Glossary',
  '/Settings',
  '/Support'
];

export default function StabilityGuard({ children }) {
  const [systemStatus, setSystemStatus] = useState('checking');
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    performStabilityCheck();
  }, []);

  const performStabilityCheck = () => {
    const detectedIssues = [];

    // Check if we're in the correct dark theme
    if (!document.documentElement.classList.contains('dark')) {
      detectedIssues.push('Dark theme not applied - v1.0-STABLE requires dark mode');
    }

    // Check for navigation elements
    const sidebarExists = document.querySelector('[class*="sidebar-bg"]');
    if (!sidebarExists) {
      detectedIssues.push('Sidebar navigation missing - core layout compromised');
    }

    // Check for AI assistant
    const aiAssistantExists = document.querySelector('[class*="fixed bottom-6 right-6"]');
    if (!aiAssistantExists) {
      detectedIssues.push('Floating AI Assistant not detected - critical component missing');
    }

    // Check for proper styling
    const hasGradientColors = document.querySelector('[class*="from-purple"]');
    if (!hasGradientColors) {
      detectedIssues.push('Brand gradient colors missing - UI consistency compromised');
    }

    setIssues(detectedIssues);
    setSystemStatus(detectedIssues.length === 0 ? 'stable' : 'compromised');
  };

  // Only show warning if there are critical issues
  if (systemStatus === 'compromised') {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-600 bg-red-100 dark:bg-red-900/50 mb-6">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>STABILITY ALERT:</strong> v1.0-STABLE integrity compromised. 
              Critical components are missing or modified.
            </AlertDescription>
          </Alert>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Protection Active
            </h2>
            
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                The following critical issues were detected:
              </p>
              
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Recovery Instructions:
                </h3>
                <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>Execute rollback to v1.0-STABLE baseline</li>
                  <li>Verify all protected components are restored</li>
                  <li>Run stability check again</li>
                  <li>Contact system administrator if issues persist</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // System is stable, render normally with silent monitoring
  return (
    <>
      {children}
      {/* Hidden stability indicator for debugging */}
      <div className="fixed bottom-2 left-2 z-50 opacity-20 hover:opacity-100 transition-opacity">
        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          v1.0-STABLE
        </div>
      </div>
    </>
  );
}