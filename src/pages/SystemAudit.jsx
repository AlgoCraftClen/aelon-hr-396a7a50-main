import React from 'react';
import SystemAudit from '../components/system/SystemAudit';

export default function SystemAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <SystemAudit />
    </div>
  );
}