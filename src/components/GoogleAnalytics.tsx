
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Using the actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-7BZ2L8FHZJ';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      type: string,
      action: string,
      params?: any
    ) => void;
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();
  const { session } = useAuth();
  
  useEffect(() => {
    // Add Google Tag Manager script to head
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
    `;
    
    // Only add the scripts if they don't already exist
    if (!document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
      document.head.appendChild(scriptTag);
      document.head.appendChild(inlineScript);
    }

    return () => {
      // Only remove the scripts if they exist and the component is unmounting
      const existingScriptTag = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
      const existingInlineScript = document.querySelector('script:not([src])');
      
      if (existingScriptTag && existingScriptTag.parentNode) {
        existingScriptTag.parentNode.removeChild(existingScriptTag);
      }
      
      if (existingInlineScript && existingInlineScript.textContent?.includes(`gtag('config', '${GA_MEASUREMENT_ID}'`)) {
        existingInlineScript.parentNode?.removeChild(existingInlineScript);
      }
    };
  }, []);

  // Track page views with user state information
  useEffect(() => {
    if (window.gtag) {
      const isAuthenticated = !!session;
      
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
        user_authenticated: isAuthenticated,
        user_id: isAuthenticated ? session.user.id : undefined, // Send user ID for user-specific analytics
      });
    }
  }, [location, session]);

  return null; // This component doesn't render anything
};

// Track user interactions and clicks
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams
    });
  }
};

// Common interaction tracking helpers
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('interaction', 'button_click', buttonName, undefined, { location });
};

export const trackNavigation = (destination: string, source: string) => {
  trackEvent('navigation', 'navigate', destination, undefined, { source });
};

export const trackBookAction = (action: string, bookId: string, bookTitle: string) => {
  trackEvent('book', action, bookTitle, undefined, { book_id: bookId });
};

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'search_query', query, resultsCount);
};

export const trackFeatureUsage = (featureName: string, detail?: string) => {
  trackEvent('feature', 'use', featureName, undefined, { detail });
};

// New function to track book additions to dashboard
export const trackBookAdded = (book: {
  id: string;
  title: string;
  author: string;
  genre?: string;
  format?: string;
  source?: string;
}) => {
  trackEvent('book', 'add_to_library', book.title, undefined, {
    book_id: book.id,
    author: book.author,
    genre: book.genre || 'Unknown',
    format: book.format || 'Unknown',
    source: book.source || 'manual_entry',
  });
};
