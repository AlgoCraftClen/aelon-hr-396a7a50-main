import { createPageUrl } from '../utils';

export type GoToOptions = {
  replace?: boolean; // use replaceState (true) or pushState (false)
  forceReload?: boolean; // if true, always use hard reload
};

export function goTo(target: string, opts: GoToOptions = {}) {
  // target may be a raw path ('/GuestDashboard' or '/Welcome') or a pageName ('GuestDashboard' or 'Auth?mode=login')
  const isRaw = target.startsWith('/') || target.includes('://');
  const url = isRaw ? target : createPageUrl(target);

  if (opts.forceReload) {
    try {
      window.location.href = url;
      return;
    } catch (e) {
      // fallthrough
    }
  }

  try {
    if (opts.replace ?? true) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
    // Let route listeners handle the change
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch (e) {
    // Final fallback
    try { window.location.href = url; } catch (_) { /* ignore */ }
  }
}

export default goTo;
