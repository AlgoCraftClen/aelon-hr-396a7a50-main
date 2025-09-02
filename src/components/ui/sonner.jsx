"use client";
import { Toaster as Sonner } from "sonner"

// Minimal fallback: derive theme from localStorage or the document element.
// This avoids a runtime dependency on `next-themes` while remaining compatible
// with the in-repo ThemeProvider which toggles the `dark` class and writes
// localStorage key 'iakwe-hr-theme'.
function detectTheme() {
  try {
    const saved = typeof window !== 'undefined' && localStorage.getItem('iakwe-hr-theme');
    if (saved) return saved; // 'dark' or 'light'
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) return 'dark';
  } catch (e) {
    // ignore
  }
  return 'system';
}

const Toaster = ({ ...props }) => {
  const theme = detectTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toaster]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toaster]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
