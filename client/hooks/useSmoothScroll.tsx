import { useState, useEffect, useCallback, useRef } from "react";

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
}

// Enhanced easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};

// Professional cubic-bezier equivalent (0.25, 0.8, 0.25, 1)
const professionalEase = (t: number): number => {
  const c1 = 0.25;
  const c2 = 0.8;
  const c3 = 0.25;
  const c4 = 1;

  return t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? 2 * t * t * ((c1 + 1) * 2 * t - c1)
        : 1 + 2 * (t - 1) * (t - 1) * ((c1 + 1) * 2 * (t - 1) + c1);
};

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const {
    duration = 0, // Make instant
    offset = 80,
    easing = professionalEase,
  } = options;

  const [isScrolling, setIsScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRequestRef = useRef<number | null>(null);
  const lastClickTime = useRef<number>(0);

  // Enhanced smooth scroll to element with performance optimizations
  const scrollToElement = useCallback(
    (target: string | HTMLElement, customOffset?: number) => {
      // Prevent multiple rapid clicks
      const now = Date.now();
      if (now - lastClickTime.current < 100) return;
      lastClickTime.current = now;

      const element =
        typeof target === "string"
          ? document.getElementById(target.replace("#", ""))
          : target;

      if (!element) return;

      // Cancel any existing scroll animation
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }

      const targetPosition = element.offsetTop - (customOffset ?? offset);
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;

      // Skip animation for very small distances
      if (Math.abs(distance) < 10) {
        window.scrollTo(0, targetPosition);
        if (typeof target === "string" && target.startsWith("#")) {
          window.history.pushState(null, "", target);
        }
        return;
      }

      let startTime: number | null = null;
      setIsScrolling(true);

      // Apply scroll lock to prevent conflicts
      document.body.style.overflow = "hidden";

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const easeProgress = easing(progress);
        const currentPosition = startPosition + distance * easeProgress;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
          scrollRequestRef.current = requestAnimationFrame(animation);
        } else {
          // Animation complete
          setIsScrolling(false);
          document.body.style.overflow = "";
          scrollRequestRef.current = null;

          // Gentle deceleration effect
          const finalPosition = targetPosition;
          window.scrollTo({
            top: finalPosition,
            behavior: "auto",
          });

          // Update URL hash
          if (typeof target === "string" && target.startsWith("#")) {
            window.history.pushState(null, "", target);
          }
        }
      };

      scrollRequestRef.current = requestAnimationFrame(animation);
    },
    [duration, offset, easing],
  );

  // Detect active section based on scroll position
  useEffect(() => {
    // Safety guard for HMR
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (isScrolling) return; // Don't update during programmatic scroll

      try {
        const sections = [
          "hero",
          "about",
          "about-baf",
          "team",
          "events",
          "insights",
          "sponsors",
          "contact",
        ];
        const scrollPosition = window.scrollY + offset + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      } catch (error) {
        // Silently handle errors during HMR
        console.warn("Active section detection error:", error);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      try {
        window.removeEventListener("scroll", handleScroll);
      } catch (error) {
        // Silently handle cleanup errors during HMR
      }
    };
  }, [offset, isScrolling]);

  // Handle browser back/forward navigation
  useEffect(() => {
    // Safety guard for HMR
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToElement(hash);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Handle initial hash on page load
    if (window.location.hash) {
      const timeout = setTimeout(
        () => scrollToElement(window.location.hash),
        100,
      );
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("popstate", handlePopState);
      };
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToElement]);

  return {
    scrollToElement,
    isScrolling,
    activeSection,
    scrollProgress,
  };
};

// Hook for scroll progress indicator
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Safety guard for HMR
    if (typeof window === "undefined") return;

    const updateScrollProgress = () => {
      try {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        // Ensure progress is properly bounded and updated
        const boundedProgress = Math.max(0, Math.min(progress, 100));
        setScrollProgress(boundedProgress);
      } catch (error) {
        // Silently handle errors during HMR
        console.warn("Scroll progress update error:", error);
      }
    };

    // Add throttling for better performance
    let ticking = false;
    const throttledUpdateScrollProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledUpdateScrollProgress, {
      passive: true,
    });
    updateScrollProgress();

    return () => {
      try {
        window.removeEventListener("scroll", throttledUpdateScrollProgress);
      } catch (error) {
        // Silently handle cleanup errors during HMR
      }
    };
  }, []);

  return scrollProgress;
};
