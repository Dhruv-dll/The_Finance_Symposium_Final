import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll, useScrollProgress } from "../hooks/useSmoothScroll";
import { useEventPopup } from "../hooks/useEventPopup";
import { useEventsData } from "../hooks/useEventsData";
import { useMarketDashboard } from "../contexts/MarketDashboardContext";
import {
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Building2,
  Mail,
  GraduationCap,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface ModernNavigationProps {
  scrolled: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  color: string;
  hoverIcon: string;
  section: string;
  dropdown?: any[];
  noHover?: boolean;
  mobileOnly?: boolean;
}

export default function ModernNavigation({ scrolled }: ModernNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { toggleOpen: toggleMarketDashboard } = useMarketDashboard();
  const {
    scrollToElement,
    activeSection,
    isScrolling,
    scrollProgress: smoothScrollProgress,
  } = useSmoothScroll();
  const pageScrollProgress = useScrollProgress();
  const { openEventPopup, setEventDetailsData } = useEventPopup();
  const { eventDetails } = useEventsData();

  // Update popup context with event details when they change
  useEffect(() => {
    if (setEventDetailsData && eventDetails) {
      setEventDetailsData(eventDetails);
    }
  }, [eventDetails, setEventDetailsData]);

  const navItems: NavigationItem[] = [
    {
      name: "About",
      href: "#about",
      icon: BarChart3,
      color: "text-finance-gold",
      hoverIcon: "📊",
      section: "about",
      dropdown: [
        {
          name: "About TFS",
          href: "#about",
          icon: "🏛️",
          description: "Learn about The Finance Symposium",
          section: "about",
        },
        {
          name: "About BAF",
          href: "#about-baf",
          icon: "🎓",
          description: "Learn about the BAF programme",
          section: "about-baf",
        },
        {
          name: "Meet the Team",
          href: "#team",
          icon: "👥",
          description: "Our dedicated team members",
          section: "team",
        },
      ],
    },
    {
      name: "EVENTS",
      href: "#events",
      icon: Calendar,
      color: "text-finance-green",
      hoverIcon: "📅",
      section: "events",
      dropdown: [
        {
          name: "Events Portfolio",
          href: "#events",
          icon: "📅",
          description: "All our events in one place",
          section: "events",
        },
        {
          name: "Saturday Sessions",
          href: "#events",
          icon: "📚",
          description: "Weekly learning sessions",
          section: "events",
          eventId: "saturday-sessions",
        },
        {
          name: "Networking Events",
          href: "#events",
          icon: "🤝",
          description: "Connect with professionals",
          section: "events",
          eventId: "networking-events",
        },
        {
          name: "Flagship Conclave",
          href: "#events",
          icon: "🏆",
          description: "Our main annual event",
          section: "events",
          eventId: "flagship-event",
        },
      ],
    },
    {
      name: "Finsight",
      href: "#insights",
      icon: TrendingUp,
      color: "text-finance-electric",
      hoverIcon: "📈",
      section: "insights",
    },
    {
      name: "SPONSORS",
      href: "#sponsors",
      icon: Building2,
      color: "text-finance-gold",
      hoverIcon: "💼",
      section: "sponsors",
      noHover: true,
    },
    {
      name: "Contact Us",
      href: "#contact",
      icon: Mail,
      color: "text-finance-electric",
      hoverIcon: "📧",
      section: "contact",
    },
    {
      name: "Market Dashboard",
      href: "#market",
      icon: BarChart3,
      color: "text-finance-gold",
      hoverIcon: "📊",
      section: "market",
      mobileOnly: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Detect if user prefers reduced motion
      setReducedMotion(
        mobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    };

    // Optimize touch interactions
    const optimizeTouchPerformance = () => {
      if (isMobile) {
        // Reduce animation complexity during touch
        document.body.classList.add("mobile-performance-mode");
      } else {
        document.body.classList.remove("mobile-performance-mode");
      }
    };

    const handleTouchStart = () => {
      if (isMobile) {
        document.body.style.pointerEvents = "auto";
      }
    };

    const handleTouchEnd = () => {
      if (isMobile) {
        // Small delay to ensure smooth completion
        setTimeout(() => {
          document.body.style.pointerEvents = "";
        }, 100);
      }
    };

    checkMobile();
    optimizeTouchPerformance();

    window.addEventListener("resize", checkMobile);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: isMobile ? 0.4 : 0.8,
        ease: "easeOut",
      }}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 group ${
        scrolled
          ? "backdrop-blur-[15px] border-b border-finance-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(0, 0, 0, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(15px)" : "none",
        transition: "all 0.7s ease-in-out",
      }}
      onMouseEnter={
        !isMobile
          ? () => {
              if (scrolled) {
                const nav = document.querySelector("nav");
                if (nav) {
                  nav.style.background = "rgba(0, 0, 0, 0.85)";
                  nav.style.backdropFilter = "blur(20px) saturate(150%)";
                  nav.style.transform = "scale(1.02)";
                  nav.style.boxShadow =
                    "0 8px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2)";
                }
              }
            }
          : undefined
      }
      onMouseLeave={
        !isMobile
          ? () => {
              if (scrolled) {
                const nav = document.querySelector("nav");
                if (nav) {
                  nav.style.background = "rgba(0, 0, 0, 0.7)";
                  nav.style.backdropFilter = "blur(15px)";
                  nav.style.transform = "scale(1)";
                  nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
                }
              }
            }
          : undefined
      }
    >
      {/* Enhanced Glassmorphic background effect */}
      {scrolled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-finance-navy/30 via-finance-navy-light/20 to-finance-navy/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backdropFilter: "blur(25px)",
          }}
        />
      )}

      {/* Enhanced Scroll Progress Indicator */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 origin-left transition-all ${
          isMobile ? "duration-100" : "duration-300"
        } ${
          isScrolling
            ? "bg-gradient-to-r from-finance-electric via-finance-gold to-finance-electric animate-pulse"
            : "bg-gradient-to-r from-finance-gold to-finance-electric"
        }`}
        style={{
          scaleX:
            (isScrolling ? smoothScrollProgress : pageScrollProgress) / 100,
          willChange: "transform",
        }}
        transition={{
          duration: isScrolling
            ? isMobile
              ? 0.02
              : 0.05
            : isMobile
              ? 0.05
              : 0.1,
          ease: "linear",
        }}
      />

      {/* Smooth Scroll Indicator */}
      {isScrolling && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-finance-navy/90 backdrop-blur-sm rounded-full border border-finance-gold/30 text-xs text-finance-gold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Navigating... {Math.round(smoothScrollProgress)}%
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-2 sm:px-6 sm:py-3 md:py-4 relative">
        <div className="flex items-start justify-between">
          {/* Enhanced Logo Section - Aligned top left */}
          <motion.div
            className="flex items-start space-x-1 sm:space-x-2 md:space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* TFS Logo */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToElement("#hero")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToElement("#hero");
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Scroll to top of page"
              title="Back to Top"
            >
              <div
                className="flex items-center justify-center rounded-xl relative overflow-hidden w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] md:w-[65px] md:h-[65px]"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F738f11e9971c4f0f8ef4fd148b7ae990)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  marginTop: "1px",
                  boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 1)",
                }}
              />
              {!reducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-finance-gold to-finance-electric rounded-xl opacity-50 blur-md -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: isMobile ? 6 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>

            {/* St. Xavier's Logo with matching glow effect */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToElement("#hero")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToElement("#hero");
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Scroll to top of page"
              title="Back to Top"
            >
              <div
                className="flex items-center justify-center rounded-xl w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] md:w-[65px] md:h-[65px]"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F73bba102e8354fd08a042b5f690f50cd)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  margin: "1px 0 0 -5px",
                  borderColor: "rgba(255, 236, 179, 1)",
                  boxShadow: "1px 1px 3px 0 rgba(0, 0, 0, 1)",
                }}
              />
              {!reducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-finance-gold to-finance-electric rounded-xl opacity-50 blur-md -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: isMobile ? 6 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5, // Offset animation for visual variety
                  }}
                />
              )}
            </motion.div>

            <div className="hidden md:block ml-4">
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent"
                animate={
                  !reducedMotion
                    ? {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }
                    : {}
                }
                transition={{
                  duration: isMobile ? 10 : 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                The Finance Symposium
              </motion.h1>
              <p className="text-sm text-muted-foreground">
                St. Xavier's College Mumbai
              </p>
            </div>
          </motion.div>

          {/* Modern Desktop Navigation with shadcn/ui */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navItems
                  .filter((item) => !item.mobileOnly)
                  .map((item, index) => (
                    <NavigationMenuItem key={index}>
                      {item.dropdown ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              "group flex items-center space-x-2 bg-transparent",
                              activeSection === item.section
                                ? "text-white"
                                : "text-finance-gold",
                              "hover:bg-transparent hover:text-white",
                              "data-[active]:bg-transparent data-[state=open]:bg-transparent",
                              "focus:bg-transparent focus:text-white",
                              "relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300",
                              "hover:scale-105 hover:tracking-wider",
                              activeSection === item.section && "scale-105",
                            )}
                            style={{
                              textShadow:
                                activeSection === item.section
                                  ? "0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,215,0,0.6), 0 0 25px rgba(255,215,0,0.4)"
                                  : "0 0 4px rgba(255, 215, 0, 0.5)",
                              transition: "all 0.3s ease-in-out",
                            }}
                            onMouseEnter={
                              item.noHover
                                ? undefined
                                : (e) => {
                                    e.currentTarget.style.textShadow =
                                      "0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,215,0,0.6), 0 0 25px rgba(255,215,0,0.4)";
                                    e.currentTarget.style.letterSpacing =
                                      "0.5px";
                                  }
                            }
                            onMouseLeave={
                              item.noHover
                                ? undefined
                                : (e) => {
                                    e.currentTarget.style.textShadow =
                                      "0 0 4px rgba(255, 215, 0, 0.5)";
                                    e.currentTarget.style.letterSpacing =
                                      "normal";
                                  }
                            }
                            onClick={() =>
                              item.section &&
                              scrollToElement(`#${item.section}`)
                            }
                          >
                            <item.icon
                              className="w-4 h-4 relative z-10 transition-all duration-300 group-hover:text-white"
                              style={{
                                filter:
                                  "drop-shadow(0 0 5px rgba(255,255,255,0.8)) drop-shadow(0 0 15px rgba(255,215,0,0.6)) drop-shadow(0 0 25px rgba(255,215,0,0.4))",
                                opacity: 0,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "0";
                              }}
                            />
                            <item.icon className="w-4 h-4 relative z-10 group-hover:opacity-0 transition-opacity duration-300" />

                            <span
                              className="font-medium relative z-10 transition-all duration-300 group-hover:text-white"
                              style={{
                                textShadow: "0 0 4px rgba(255, 215, 0, 0.5)",
                              }}
                            >
                              {item.name}
                            </span>

                            {/* Golden underline effect */}
                            <motion.div
                              className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-finance-gold to-transparent"
                              initial={{ width: 0, x: "-50%" }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />

                            {/* Hover icon */}
                            <motion.span
                              className="text-lg relative z-10"
                              initial={{ opacity: 0, scale: 0 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.hoverIcon}
                            </motion.span>
                          </NavigationMenuTrigger>

                          <NavigationMenuContent>
                            <motion.div
                              className="w-64 p-4 rounded-xl border-2"
                              style={{
                                background: "rgba(0, 0, 0, 0.9)",
                                backdropFilter: "blur(25px)",
                                borderColor: "rgba(255, 215, 0, 0.6)",
                                boxShadow:
                                  "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.3)",
                              }}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <div className="space-y-2">
                                {item.dropdown.map(
                                  (dropdownItem, dropdownIndex) => {
                                    if (dropdownItem.type === "separator") {
                                      return (
                                        <div
                                          key={dropdownIndex}
                                          className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-3"
                                        />
                                      );
                                    }
                                    return (
                                      <NavigationMenuLink
                                        key={dropdownIndex}
                                        asChild
                                      >
                                        <button
                                          onClick={() => {
                                            if (
                                              dropdownItem.eventId &&
                                              openEventPopup
                                            ) {
                                              openEventPopup(
                                                dropdownItem.eventId,
                                              );
                                            } else if (dropdownItem.section) {
                                              scrollToElement(
                                                `#${dropdownItem.section}`,
                                              );
                                            }
                                          }}
                                          className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-finance-gold/10 transition-all duration-300 w-full text-left"
                                        >
                                          <span className="text-lg mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                            {dropdownItem.icon}
                                          </span>
                                          <div className="flex-1">
                                            <div className="font-medium text-foreground group-hover:text-finance-gold transition-colors">
                                              {dropdownItem.name}
                                            </div>
                                            {dropdownItem.description && (
                                              <div className="text-sm text-muted-foreground mt-1">
                                                {dropdownItem.description}
                                              </div>
                                            )}
                                          </div>
                                        </button>
                                      </NavigationMenuLink>
                                    );
                                  },
                                )}
                              </div>
                            </motion.div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            item.section && scrollToElement(`#${item.section}`)
                          }
                          className={cn(
                            "group flex items-center space-x-2 bg-transparent",
                            activeSection === item.section
                              ? "text-white"
                              : "text-finance-gold",
                            "hover:bg-transparent hover:text-white",
                            "relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:scale-105 hover:tracking-wider",
                            activeSection === item.section && "scale-105",
                          )}
                          style={{
                            textShadow:
                              activeSection === item.section
                                ? "0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,215,0,0.6), 0 0 25px rgba(255,215,0,0.4)"
                                : "0 0 4px rgba(255, 215, 0, 0.5)",
                            transition: "all 0.3s ease-in-out",
                          }}
                        >
                          <item.icon className="w-4 h-4 relative z-10 transition-all duration-300" />

                          <span className="font-medium relative z-10 transition-all duration-300">
                            {item.name}
                          </span>

                          <motion.span
                            className="text-lg relative z-10"
                            initial={{ opacity: 0, scale: 0 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.hoverIcon}
                          </motion.span>

                          {/* Golden underline effect */}
                          <motion.div
                            className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-finance-gold to-transparent"
                            initial={{ width: 0, x: "-50%" }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </Button>
                      )}
                    </NavigationMenuItem>
                  ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-3 sm:p-4 rounded-lg sm:rounded-xl backdrop-blur-md bg-finance-navy/30 border border-finance-gold/30 relative overflow-hidden group hover:bg-transparent min-w-[48px] min-h-[48px]"
          >
            <motion.div className="absolute inset-0 bg-gradient-to-br from-finance-gold/20 to-finance-electric/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7 text-finance-gold relative z-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 sm:w-7 sm:h-7 text-finance-gold relative z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: isMobile ? 0.2 : 0.4,
                ease: "easeInOut",
                type: isMobile ? "tween" : "spring",
              }}
              className="lg:hidden mt-2 sm:mt-3 backdrop-blur-xl bg-finance-navy/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-finance-gold/20 overflow-hidden"
              style={{
                willChange: "height, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 -z-10"></div>

              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: isMobile ? 0.15 : 0.3,
                      delay: index * (isMobile ? 0.02 : 0.05),
                      ease: "easeOut",
                    }}
                    style={{
                      willChange: "transform, opacity",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {item.dropdown ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-3 px-4 text-foreground border-b border-finance-gold/20">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-finance-gold" />
                            <span className="font-medium text-finance-gold">
                              {item.name}
                            </span>
                            <span className="text-lg">{item.hoverIcon}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-finance-gold" />
                        </div>

                        <div className="ml-6 space-y-1">
                          {item.dropdown.map((dropdownItem, dropdownIndex) => {
                            if (dropdownItem.type === "separator") {
                              return (
                                <div
                                  key={dropdownIndex}
                                  className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-2"
                                />
                              );
                            }
                            return (
                              <Button
                                key={dropdownIndex}
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-finance-gold hover:bg-finance-gold/5"
                                onClick={() => {
                                  if (dropdownItem.eventId && openEventPopup) {
                                    openEventPopup(dropdownItem.eventId);
                                  } else if (dropdownItem.section) {
                                    scrollToElement(`#${dropdownItem.section}`);
                                  }
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <div className="flex items-center space-x-3 py-2 px-3">
                                  <span>{dropdownItem.icon}</span>
                                  <span>{dropdownItem.name}</span>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:text-finance-gold hover:bg-finance-gold/10 group"
                        onClick={() => {
                          if (item.section === "market") {
                            // Toggle market dashboard using context
                            toggleMarketDashboard();
                          } else if (item.section) {
                            scrollToElement(`#${item.section}`);
                          }
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3 py-3 px-4">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                          <span className="text-lg ml-auto group-hover:scale-110 transition-transform duration-200">
                            {item.hoverIcon}
                          </span>
                        </div>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
