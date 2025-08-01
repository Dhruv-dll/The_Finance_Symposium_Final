import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll, useScrollProgress } from "../hooks/useSmoothScroll";
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

export default function ModernNavigation({ scrolled }: ModernNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollToElement, activeSection } = useSmoothScroll();
  const scrollProgress = useScrollProgress();

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
        },
        {
          name: "Networking Events",
          href: "#events",
          icon: "🤝",
          description: "Connect with professionals",
          section: "events",
        },
        {
          name: "Flagship Conclave",
          href: "#events",
          icon: "🏆",
          description: "Our main annual event",
          section: "events",
        },
      ],
    },
    {
      name: "Finsight",
      href: "#finsight",
      icon: TrendingUp,
      color: "text-finance-electric",
      hoverIcon: "📈",
      section: "finsight",
    },
    {
      name: "SPONSORS",
      href: "#sponsors",
      icon: Building2,
      color: "text-finance-gold",
      hoverIcon: "💼",
      section: "sponsors",
      dropdown: [
        {
          name: "Our Sponsors",
          href: "#sponsors",
          icon: "🏛️",
          description: "Our amazing partners",
          section: "sponsors",
        },
        {
          name: "Partnership Info",
          href: "#sponsors",
          icon: "🤝",
          description: "Learn about partnerships",
          section: "sponsors",
        },
      ],
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

  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);



  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-xl bg-finance-navy/20 border-b border-finance-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      {/* Glassmorphic background effect */}
      {scrolled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-finance-navy/30 via-finance-navy-light/20 to-finance-navy/30 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Scroll Progress Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-finance-gold to-finance-electric origin-left"
        style={{
          scaleX: scrollProgress / 100,
        }}
        transition={{ duration: 0.1 }}
      />

      <div className="container mx-auto px-6 py-4 relative">
        <div className="flex items-start justify-between">
          {/* Enhanced Logo Section - Aligned top left */}
          <motion.div
            className="flex items-start space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* TFS Logo */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="flex items-center justify-center rounded-xl relative overflow-hidden"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F738f11e9971c4f0f8ef4fd148b7ae990)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "75px",
                  height: "75px",
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

            {/* St. Xavier's Logo with matching glow effect */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  backgroundImage:
                    "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F73bba102e8354fd08a042b5f690f50cd)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "75px",
                  height: "75px",
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
                  delay: 1.5, // Offset animation for visual variety
                }}
              />
            </motion.div>

            <div className="hidden md:block ml-4">
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent"
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
              <p className="text-sm text-muted-foreground">
                St. Xavier's College Mumbai
              </p>
            </div>
          </motion.div>

          {/* Modern Desktop Navigation with shadcn/ui */}
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
                            activeSection === item.section ? "text-white" : "text-finance-gold",
                            "hover:bg-transparent hover:text-white",
                            "data-[active]:bg-transparent data-[state=open]:bg-transparent",
                            "focus:bg-transparent focus:text-white",
                            "relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:scale-105 hover:tracking-wider",
                            activeSection === item.section && "scale-105"
                          )}
                          style={{
                            textShadow: activeSection === item.section
                              ? "0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,215,0,0.6), 0 0 25px rgba(255,215,0,0.4)"
                              : "0 0 4px rgba(255, 215, 0, 0.5)",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() => item.section && scrollToElement(`#${item.section}`)}
                        >
                          <item.icon
                            className="w-4 h-4 relative z-10 transition-all duration-300 group-hover:text-white"
                            style={{
                              filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8)) drop-shadow(0 0 15px rgba(255,215,0,0.6)) drop-shadow(0 0 25px rgba(255,215,0,0.4))",
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
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textShadow = "0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,215,0,0.6), 0 0 25px rgba(255,215,0,0.4)";
                              e.currentTarget.style.letterSpacing = "0.5px";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textShadow = "0 0 4px rgba(255, 215, 0, 0.5)";
                              e.currentTarget.style.letterSpacing = "normal";
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
                          <div
                            className="w-64 p-4 bg-finance-navy/90 backdrop-blur-xl border border-finance-gold/20 rounded-xl"
                            style={{
                              boxShadow: "0 8px 32px rgba(255, 215, 0, 0.2), 0 0 20px rgba(255, 215, 0, 0.1)",
                            }}
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
                                        onClick={() => dropdownItem.section && scrollToElement(`#${dropdownItem.section}`)}
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
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => item.section && scrollToElement(`#${item.section}`)}
                        className={cn(
                          "group flex items-center space-x-2 bg-transparent",
                          activeSection === item.section ? "text-white" : "text-finance-gold",
                          "hover:bg-transparent hover:text-white",
                          "relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300",
                          "hover:scale-105 hover:tracking-wider",
                          activeSection === item.section && "scale-105"
                        )}
                        style={{
                          textShadow: activeSection === item.section
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
            className="lg:hidden p-3 rounded-xl backdrop-blur-md bg-finance-navy/30 border border-finance-gold/30 relative overflow-hidden group hover:bg-transparent"
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
                  <X className="w-6 h-6 text-finance-gold relative z-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-finance-gold relative z-10" />
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden mt-4 backdrop-blur-xl bg-finance-navy/80 rounded-xl p-4 border border-finance-gold/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 -z-10"></div>

              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {item.dropdown ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-3 px-4 text-foreground">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            <span className="text-lg">{item.hoverIcon}</span>
                          </div>
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
                                asChild
                                className="w-full justify-start text-muted-foreground hover:text-finance-gold hover:bg-finance-gold/5"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Link
                                  to={dropdownItem.href}
                                  className="flex items-center space-x-3 py-2 px-3"
                                >
                                  <span>{dropdownItem.icon}</span>
                                  <span>{dropdownItem.name}</span>
                                </Link>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start text-foreground hover:text-finance-gold hover:bg-finance-gold/10 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link
                          to={item.href}
                          className="flex items-center space-x-3 py-3 px-4"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                          <span className="text-lg ml-auto group-hover:scale-110 transition-transform duration-200">
                            {item.hoverIcon}
                          </span>
                        </Link>
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
