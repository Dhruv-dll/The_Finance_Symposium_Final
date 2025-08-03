import { useState, useEffect } from "react";

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Apply mobile-specific styles
        document.body.classList.add("mobile-static");
      } else {
        document.body.classList.remove("mobile-static");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Return animation configs based on mobile state
  const getAnimationConfig = (
    mobileConfig: any = {},
    desktopConfig: any = {},
  ) => {
    if (isMobile) {
      return {
        initial: { opacity: 1, x: 0, y: 0, scale: 1, ...mobileConfig.initial },
        animate: { opacity: 1, x: 0, y: 0, scale: 1, ...mobileConfig.animate },
        transition: { duration: 0, ...mobileConfig.transition },
      };
    }
    return desktopConfig;
  };

  return {
    isMobile,
    getAnimationConfig,
    // Simple disable function for components
    noAnimation: isMobile,
  };
}
