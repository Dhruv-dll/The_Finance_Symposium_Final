import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import {
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  PieChart,
  Building2,
  Mail,
  Home,
} from "lucide-react";

interface EnhancedNavigationProps {
  scrolled: boolean;
}

export default function EnhancedNavigation({
  scrolled,
}: EnhancedNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [sponsorsDropdownOpen, setSponsorsDropdownOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      color: "text-finance-electric",
      hoverIcon: "🏠",
    },
    {
      name: "About TFS",
      href: "/about",
      icon: BarChart3,
      color: "text-finance-gold",
      hoverIcon: "📊",
    },
    {
      name: "EVENTS",
      href: "#",
      icon: Calendar,
      color: "text-finance-green",
      hoverIcon: "₹",
      dropdown: [
        {
          name: "Saturday Sessions",
          href: "/events/saturday-sessions",
          icon: "📚",
        },
        { name: "Networking", href: "/events/networking", icon: "🤝" },
        { name: "Flagship Conclave", href: "/events/conclave", icon: "🏆" },
        { type: "separator" },
        { name: "Upcoming Events", href: "/events/upcoming", icon: "📅" },
      ],
    },
    {
      name: "Finsight",
      href: "#insights",
      icon: TrendingUp,
      color: "text-finance-electric",
      hoverIcon: "📈",
    },
    {
      name: "SPONSORS",
      href: "#",
      icon: Building2,
      color: "text-finance-gold",
      hoverIcon: "💼",
      dropdown: [
        { name: "Past Sponsors", href: "/sponsors/past", icon: "🏛️" },
        { name: "Present Sponsors", href: "/sponsors/present", icon: "🤝" },
      ],
    },
    {
      name: "Meet the Team",
      href: "/team",
      icon: Users,
      color: "text-finance-green",
      hoverIcon: "👥",
    },
    {
      name: "Contact Us",
      href: "/contact",
      icon: Mail,
      color: "text-finance-electric",
      hoverIcon: "📧",
    },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setEventsDropdownOpen(false);
      setSponsorsDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getGlowColor = (item: any) => {
    if (item.color === "text-finance-gold")
      return "shadow-[0_0_20px_rgba(255,215,0,0.5)]";
    if (item.color === "text-finance-electric")
      return "shadow-[0_0_20px_rgba(0,255,255,0.5)]";
    if (item.color === "text-finance-green")
      return "shadow-[0_0_20px_rgba(0,255,0,0.5)]";
    return "shadow-[0_0_20px_rgba(255,215,0,0.5)]";
  };

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

      <div className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              {/* TFS Logo with enhanced glow */}
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.1 }}
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
                    marginTop: "-5px",
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

              {/* St. Xavier's Logo with hover effect */}
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="flex items-center justify-center border border-finance-electric/30 rounded-xl"
                  style={{
                    backgroundImage:
                      "url(https://cdn.builder.io/api/v1/image/assets%2F929e4df9940a4d789ccda51924367667%2F73bba102e8354fd08a042b5f690f50cd)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    width: "75px",
                    height: "75px",
                    margin: "1px 0 0 -5px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-finance-navy-light to-finance-electric rounded-xl opacity-0 group-hover:opacity-40 blur-lg -z-10 transition-opacity duration-300"></div>
              </motion.div>
            </div>

            <div className="hidden md:block">
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

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.dropdown ? (
                  <div className="relative">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.name === "EVENTS") {
                          setEventsDropdownOpen(!eventsDropdownOpen);
                          setSponsorsDropdownOpen(false);
                        } else if (item.name === "SPONSORS") {
                          setSponsorsDropdownOpen(!sponsorsDropdownOpen);
                          setEventsDropdownOpen(false);
                        }
                      }}
                      className={`flex items-center space-x-2 text-foreground hover:${item.color} transition-all duration-300 group relative px-4 py-2 rounded-lg overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Hover glow background */}
                      <motion.div
                        className={`absolute inset-0 ${getGlowColor(item)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
                        initial={false}
                      />

                      <item.icon className="w-4 h-4 relative z-10" />
                      <span className="font-medium relative z-10">
                        {item.name}
                      </span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 relative z-10" />

                      {/* Hover icon */}
                      <motion.span
                        className="text-lg ml-2 relative z-10"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.hoverIcon}
                      </motion.span>
                    </motion.button>

                    {/* Enhanced Dropdown Menu */}
                    <AnimatePresence>
                      {((item.name === "EVENTS" && eventsDropdownOpen) ||
                        (item.name === "SPONSORS" && sponsorsDropdownOpen)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute top-full mt-2 w-56 backdrop-blur-xl bg-finance-navy/80 rounded-xl shadow-2xl border border-finance-gold/20 overflow-hidden z-50 ${item.name === "SPONSORS" ? "right-0" : "left-0"}`}
                        >
                          {/* Glow effect background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 -z-10"></div>

                          {item.dropdown.map((dropdownItem, dropdownIndex) => {
                            if (dropdownItem.type === "separator") {
                              return (
                                <motion.div
                                  key={dropdownIndex}
                                  className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-2 mx-4"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: dropdownIndex * 0.1,
                                  }}
                                />
                              );
                            }
                            return (
                              <motion.div
                                key={dropdownIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: dropdownIndex * 0.05,
                                }}
                              >
                                <Link
                                  to={dropdownItem.href}
                                  className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-finance-gold hover:bg-finance-gold/10 transition-all duration-300 group"
                                >
                                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                                    {dropdownItem.icon}
                                  </span>
                                  <span className="font-medium">
                                    {dropdownItem.name}
                                  </span>
                                  <motion.div
                                    className="ml-auto w-2 h-2 bg-finance-electric rounded-full opacity-0 group-hover:opacity-100"
                                    whileHover={{ scale: 1.5 }}
                                  />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 text-foreground hover:${item.color} transition-all duration-300 group relative px-4 py-2 rounded-lg overflow-hidden`}
                  >
                    {/* Hover glow background */}
                    <motion.div
                      className={`absolute inset-0 ${getGlowColor(item)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
                      initial={false}
                    />

                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="font-medium relative z-10">
                      {item.name}
                    </span>

                    {/* Hover icon */}
                    <motion.span
                      className="text-lg ml-2 relative z-10"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.hoverIcon}
                    </motion.span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl backdrop-blur-md bg-finance-navy/30 border border-finance-gold/30 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
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
                      <div>
                        <button
                          onClick={() => {
                            if (item.name === "EVENTS") {
                              setEventsDropdownOpen(!eventsDropdownOpen);
                            } else if (item.name === "SPONSORS") {
                              setSponsorsDropdownOpen(!sponsorsDropdownOpen);
                            }
                          }}
                          className="flex items-center justify-between w-full text-left py-3 px-4 text-foreground hover:text-finance-gold hover:bg-finance-gold/10 rounded-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            <span className="text-lg">{item.hoverIcon}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>

                        <AnimatePresence>
                          {((item.name === "EVENTS" && eventsDropdownOpen) ||
                            (item.name === "SPONSORS" &&
                              sponsorsDropdownOpen)) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-6 mt-2 space-y-1 overflow-hidden"
                            >
                              {item.dropdown.map(
                                (dropdownItem, dropdownIndex) => {
                                  if (dropdownItem.type === "separator") {
                                    return (
                                      <div
                                        key={dropdownIndex}
                                        className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-2"
                                      />
                                    );
                                  }
                                  return (
                                    <Link
                                      key={dropdownIndex}
                                      to={dropdownItem.href}
                                      className="flex items-center space-x-3 py-2 px-3 text-muted-foreground hover:text-finance-gold hover:bg-finance-gold/5 rounded-lg transition-colors duration-200"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <span>{dropdownItem.icon}</span>
                                      <span>{dropdownItem.name}</span>
                                    </Link>
                                  );
                                },
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 py-3 px-4 text-foreground hover:text-finance-gold hover:bg-finance-gold/10 rounded-lg transition-all duration-300 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-lg ml-auto group-hover:scale-110 transition-transform duration-200">
                          {item.hoverIcon}
                        </span>
                      </Link>
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
