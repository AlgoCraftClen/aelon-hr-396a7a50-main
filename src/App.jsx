import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/common/ErrorBoundary"
import DevModeBanner from "@/components/common/DevModeBanner"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

// Global error handler
window.addEventListener('error', (event) => {
  // Suppress known errors in development
  if (import.meta.env.DEV) {
    if (event.message.includes('cdn.tailwindcss.com') || 
        event.message.includes('supabase.co')) {
      event.preventDefault();
      return;
    }
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  // Suppress known API errors in development
  if (import.meta.env.DEV) {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('supabase.co') ||
         event.reason.message.includes('auth'))) {
      event.preventDefault();
      return;
    }
  }
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DevModeBanner />
        <Pages />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 