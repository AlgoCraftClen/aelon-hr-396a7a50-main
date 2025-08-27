import React from 'react'
import { AlertTriangle, Database, Code } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DevModeBanner() {
  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md">
      <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          <div className="flex items-center gap-2">
            <Code className="h-3 w-3" />
            <span className="font-medium">Development Mode</span>
          </div>
          <p className="mt-1 text-sm">
            Running with mock data. Configure Supabase for full functionality.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
