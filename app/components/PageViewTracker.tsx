'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Generate a session ID if not exists
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics-session-id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('analytics-session-id', sessionId);
  }
  return sessionId;
}

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Record page view
    const recordView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_path: pathname,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            session_id: getSessionId(),
          }),
        });
      } catch (error) {
        // Silent fail - don't break the app if analytics fails
        console.error('Failed to record page view:', error);
      }
    };

    // Debounce to avoid duplicate calls
    const timeoutId = setTimeout(recordView, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
