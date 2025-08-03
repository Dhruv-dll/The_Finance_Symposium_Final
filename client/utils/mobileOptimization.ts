// Mobile optimization utility to disable animations and improve scroll performance

export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
};

export const applyMobileOptimizations = () => {
  if (typeof window === "undefined") return;

  const mobile = isMobileDevice();

  if (mobile) {
    // Add mobile-specific classes
    document.body.classList.add("mobile-static");
    document.body.classList.add("mobile-no-entrance-animations");

    // Disable complex animations
    const style = document.createElement("style");
    style.textContent = `
      @media (max-width: 768px) {
        * {
          animation-duration: 0.1s !important;
          animation-delay: 0s !important;
          transition-duration: 0.2s !important;
        }
        
        [data-framer-motion] {
          transform: none !important;
          opacity: 1 !important;
        }
        
        .motion-reduce {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  } else {
    // Remove mobile classes on desktop
    document.body.classList.remove("mobile-static");
    document.body.classList.remove("mobile-no-entrance-animations");
  }
};

export const optimizeMobileAnimations = () => {
  if (typeof window === "undefined") return;

  const handleResize = () => {
    applyMobileOptimizations();
  };

  // Apply optimizations immediately
  applyMobileOptimizations();

  // Listen for resize events
  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
  };
};
