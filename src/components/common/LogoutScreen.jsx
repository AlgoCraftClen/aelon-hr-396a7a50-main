import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LogoutScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 text-gray-900 dark:text-slate-100 transition-opacity duration-300">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Signing Out</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Please wait while we securely log you out.</p>
      </div>
    </div>
  );
}