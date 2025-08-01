import { useState, useEffect, useCallback } from 'react';

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
}

// Easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const {
    duration = 800,
    offset = 80,
    easing = easeInOutCubic
  } = options;

  const [isScrolling, setIsScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Smooth scroll to element
  const scrollToElement = useCallback((
    target: string | HTMLElement,
    customOffset?: number
  ) => {
    const element = typeof target === 'string' 
      ? document.getElementById(target.replace('#', ''))
      : target;
    
    if (!element) return;

    const targetPosition = element.offsetTop - (customOffset ?? offset);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    setIsScrolling(true);

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easeProgress = easing(progress);
      const currentPosition = startPosition + (distance * easeProgress);
      
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        setIsScrolling(false);
        // Update URL hash
        if (typeof target === 'string' && target.startsWith('#')) {
          window.history.pushState(null, '', target);
        }
      }
    };

    requestAnimationFrame(animation);
  }, [duration, offset, easing]);

  // Detect active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return; // Don't update during programmatic scroll

      const sections = ['hero', 'about', 'team', 'events', 'finsight', 'sponsors', 'contact'];
      const scrollPosition = window.scrollY + offset + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, isScrolling]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToElement(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(() => scrollToElement(window.location.hash), 100);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToElement]);

  return {
    scrollToElement,
    isScrolling,
    activeSection,
  };
};

// Hook for scroll progress indicator
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return scrollProgress;
};
