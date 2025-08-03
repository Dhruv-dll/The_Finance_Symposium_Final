import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll, useScrollProgress } from "../hooks/useSmoothScroll";
import { useEventPopup } from "../hooks/useEventPopup";
import { useEventsData } from "../hooks/useEventsData";
import { useMobile } from "../hooks/useMobile";
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

interface MobileOptimizedNavigationProps {
  scrolled: boolean;
}

export default function MobileOptimizedNavigation({
  scrolled,
}: MobileOptimizedNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  const isTablet = useMobile(1024);
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

  const navItems = [
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
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest("nav")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isTablet && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isTablet, mobileMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-[15px] border-b border-finance-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(0, 0, 0, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(15px)" : "none",
      }}
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
        className={`absolute bottom-0 left-0 h-1 origin-left transition-all duration-300 ${
          isScrolling
            ? "bg-gradient-to-r from-finance-electric via-finance-gold to-finance-electric animate-pulse"
            : "bg-gradient-to-r from-finance-gold to-finance-electric"
        }`}
        style={{
          scaleX:
            (isScrolling ? smoothScrollProgress : pageScrollProgress) / 100,
        }}
        transition={{ duration: isScrolling ? 0.05 : 0.1 }}
      />

      <div
        className={`container mx-auto relative ${
          isMobile ? "px-4 py-3" : "px-6 py-4"
        }`}
      >
        <div className="flex items-start justify-between">
          {/* Enhanced Logo Section - Mobile Optimized */}
          <motion.div
            className="flex items-start space-x-2 sm:space-x-3"
            whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* TFS Logo - Responsive sizing */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToElement("#hero")}
              tabIndex={0}
              role="button"
              aria-label="Scroll to top of page"
              title="Back to Top"
            >
              <div
                className="flex items-center justify-center rounded-xl relative overflow-hidden"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F738f11e9971c4f0f8ef4fd148b7ae990)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: isMobile ? "50px" : isTablet ? "60px" : "75px",
                  height: isMobile ? "50px" : isTablet ? "60px" : "75px",
                  marginTop: "1px",
                  boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 1)",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-finance-gold to-finance-electric rounded-xl opacity-50 blur-md -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* St. Xavier's Logo - Responsive sizing */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToElement("#hero")}
              tabIndex={0}
              role="button"
              aria-label="Scroll to top of page"
              title="Back to Top"
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F73bba102e8354fd08a042b5f690f50cd)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: isMobile ? "50px" : isTablet ? "60px" : "75px",
                  height: isMobile ? "50px" : isTablet ? "60px" : "75px",
                  margin: "1px 0 0 -5px",
                  borderColor: "rgba(255, 236, 179, 1)",
                  boxShadow: "1px 1px 3px 0 rgba(0, 0, 0, 1)",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-finance-gold to-finance-electric rounded-xl opacity-50 blur-md -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
            </motion.div>

            {/* Text - Hide on mobile, show on tablet+ */}
            <div
              className={`${isMobile ? "hidden" : "hidden sm:block"} ml-3 sm:ml-4`}
            >
              <motion.h1
                className={`font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent ${
                  isTablet ? "text-lg" : "text-xl"
                }`}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                The Finance Symposium
              </motion.h1>
              <p
                className={`text-muted-foreground ${
                  isTablet ? "text-xs" : "text-sm"
                }`}
              >
                St. Xavier's College Mumbai
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navItems.map((item, index) => (
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
                          onClick={() =>
                            item.section && scrollToElement(`#${item.section}`)
                          }
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
                          >
                            <div className="space-y-2">
                              {item.dropdown.map(
                                (dropdownItem, dropdownIndex) => (
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
                                          openEventPopup(dropdownItem.eventId);
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
                                ),
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
                      </Button>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Enhanced Mobile Menu Button - Optimized touch target */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
              // Mobile haptic feedback
              if (isMobile && navigator.vibrate) {
                navigator.vibrate(50);
              }
            }}
            className={`lg:hidden backdrop-blur-md bg-finance-navy/30 border border-finance-gold/30 relative overflow-hidden group hover:bg-transparent ${
              isMobile
                ? "p-3 rounded-xl min-w-[48px] min-h-[48px]" // Mobile touch target
                : "p-3 rounded-xl"
            }`}
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
                  <X
                    className={`text-finance-gold relative z-10 ${
                      isMobile ? "w-5 h-5" : "w-6 h-6"
                    }`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu
                    className={`text-finance-gold relative z-10 ${
                      isMobile ? "w-5 h-5" : "w-6 h-6"
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Enhanced Mobile Navigation - Optimized for touch */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`lg:hidden backdrop-blur-xl bg-finance-navy/80 rounded-xl border border-finance-gold/20 overflow-hidden ${
                isMobile ? "mt-3 p-3" : "mt-4 p-4"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 -z-10"></div>

              <div
                className={`space-y-1 ${isMobile ? "space-y-0.5" : "space-y-2"}`}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {item.dropdown ? (
                      <div className="space-y-1">
                        <div
                          className={`flex items-center justify-between text-foreground border-b border-finance-gold/20 ${
                            isMobile ? "py-2 px-3" : "py-3 px-4"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon
                              className={`text-finance-gold ${
                                isMobile ? "w-4 h-4" : "w-5 h-5"
                              }`}
                            />
                            <span
                              className={`font-medium text-finance-gold ${
                                isMobile ? "text-sm" : "text-base"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span
                              className={isMobile ? "text-base" : "text-lg"}
                            >
                              {item.hoverIcon}
                            </span>
                          </div>
                          <ChevronDown
                            className={`text-finance-gold ${
                              isMobile ? "w-3 h-3" : "w-4 h-4"
                            }`}
                          />
                        </div>

                        <div
                          className={`space-y-0.5 ${
                            isMobile ? "ml-4" : "ml-6"
                          }`}
                        >
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <Button
                              key={dropdownIndex}
                              variant="ghost"
                              className={`w-full justify-start text-muted-foreground hover:text-finance-gold hover:bg-finance-gold/5 ${
                                isMobile ? "min-h-[44px] text-sm" : "text-base"
                              }`}
                              onClick={() => {
                                if (dropdownItem.eventId && openEventPopup) {
                                  openEventPopup(dropdownItem.eventId);
                                } else if (dropdownItem.section) {
                                  scrollToElement(`#${dropdownItem.section}`);
                                }
                                setMobileMenuOpen(false);
                              }}
                            >
                              <div
                                className={`flex items-center space-x-3 ${
                                  isMobile ? "py-1 px-2" : "py-2 px-3"
                                }`}
                              >
                                <span
                                  className={isMobile ? "text-sm" : "text-base"}
                                >
                                  {dropdownItem.icon}
                                </span>
                                <span>{dropdownItem.name}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-foreground hover:text-finance-gold hover:bg-finance-gold/10 group ${
                          isMobile ? "min-h-[44px] text-sm" : "text-base"
                        }`}
                        onClick={() => {
                          if (item.section) {
                            scrollToElement(`#${item.section}`);
                          }
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div
                          className={`flex items-center space-x-3 ${
                            isMobile ? "py-2 px-3" : "py-3 px-4"
                          }`}
                        >
                          <item.icon
                            className={isMobile ? "w-4 h-4" : "w-5 h-5"}
                          />
                          <span className="font-medium">{item.name}</span>
                          <span
                            className={`ml-auto group-hover:scale-110 transition-transform duration-200 ${
                              isMobile ? "text-base" : "text-lg"
                            }`}
                          >
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
