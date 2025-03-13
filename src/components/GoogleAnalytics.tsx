
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// The ID should be replaced with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID

declare global {
  interface Window {
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
    // Initialize Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);

    return () => {
      // Clean up scripts when component unmounts
      document.head.removeChild(script1);
      document.head.removeChild(script2);
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

