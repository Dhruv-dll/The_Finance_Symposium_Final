import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react";

interface NavigationProps {
  scrolled: boolean;
}

export default function Navigation({ scrolled }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [sponsorsDropdownOpen, setSponsorsDropdownOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: null },
    { name: "About TFS", href: "/about", icon: BarChart3 },
    {
      name: "EVENTS",
      href: "#",
      icon: Calendar,
      dropdown: [
        { name: "Saturday Sessions", href: "/events/saturday-sessions" },
        { name: "Networking", href: "/events/networking" },
        { name: "Flagship Conclave", href: "/events/conclave" },
        { type: "separator" },
        { name: "Upcoming Events", href: "/events/upcoming" },
      ],
    },
    { name: "Finsight", href: "/finsight", icon: TrendingUp },
    {
      name: "SPONSORS",
      href: "#",
      icon: Users,
      dropdown: [
        { name: "Past Sponsors", href: "/sponsors/past" },
        { name: "Present Sponsors", href: "/sponsors/present" },
      ],
    },
    { name: "Meet the Team", href: "/team", icon: Users },
    { name: "Contact Us", href: "/contact", icon: null },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setEventsDropdownOpen(false);
      setSponsorsDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glassmorphism backdrop-blur-md bg-background/80 border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* TFS Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg flex items-center justify-center market-glow">
                  <span className="text-finance-navy font-bold text-xl">
                    TFS
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg opacity-50 blur-md -z-10"></div>
              </div>

              {/* St. Xavier's Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-finance-navy-light to-finance-electric rounded-lg flex items-center justify-center">
                  <span className="text-finance-gold font-bold text-sm">
                    SXC
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-finance-navy-light to-finance-electric rounded-lg opacity-30 blur-md -z-10"></div>
              </div>
            </div>

            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-glow bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
                The Finance Symposium
              </h1>
              <p className="text-sm text-muted-foreground">
                St. Xavier's College Mumbai
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.dropdown ? (
                  <div className="relative">
                    <button
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
                      className="flex items-center space-x-1 text-foreground hover:text-finance-gold transition-all duration-300 group glow-effect"
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span className="font-medium">{item.name}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      <span className="text-finance-gold text-lg ml-1">₹</span>
                    </button>

                    {/* Dropdown Menu */}
                    {((item.name === "EVENTS" && eventsDropdownOpen) ||
                      (item.name === "SPONSORS" && sponsorsDropdownOpen)) && (
                      <div className="absolute top-full left-0 mt-2 w-48 glassmorphism rounded-lg shadow-lg border border-border/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 -z-10"></div>
                        {item.dropdown.map((dropdownItem, dropdownIndex) => {
                          if (dropdownItem.type === "separator") {
                            return (
                              <div
                                key={dropdownIndex}
                                className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-2"
                              ></div>
                            );
                          }
                          return (
                            <Link
                              key={dropdownIndex}
                              to={dropdownItem.href}
                              className="block px-4 py-3 text-foreground hover:text-finance-gold hover:bg-finance-gold/10 transition-all duration-300 glow-effect"
                            >
                              {dropdownItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center space-x-1 text-foreground hover:text-finance-gold transition-all duration-300 group glow-effect"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span className="font-medium">{item.name}</span>
                    {(item.name === "About TFS" ||
                      item.name === "SPONSORS") && (
                      <span className="text-finance-electric text-lg ml-1">
                        📊
                      </span>
                    )}
                    {item.name === "Meet the Team" && (
                      <span className="text-finance-green text-lg ml-1">
                        💼
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg glassmorphism market-glow"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-finance-gold" />
            ) : (
              <Menu className="w-6 h-6 text-finance-gold" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 glassmorphism rounded-lg p-4 border border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/10 to-finance-electric/10 rounded-lg -z-10"></div>
            <div className="space-y-3">
              {navItems.map((item, index) => (
                <div key={index}>
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
                        className="flex items-center justify-between w-full text-left py-2 text-foreground hover:text-finance-gold transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {((item.name === "EVENTS" && eventsDropdownOpen) ||
                        (item.name === "SPONSORS" && sponsorsDropdownOpen)) && (
                        <div className="ml-6 mt-2 space-y-2">
                          {item.dropdown.map((dropdownItem, dropdownIndex) => {
                            if (dropdownItem.type === "separator") {
                              return (
                                <div
                                  key={dropdownIndex}
                                  className="h-px bg-gradient-to-r from-transparent via-finance-gold to-transparent my-2"
                                ></div>
                              );
                            }
                            return (
                              <Link
                                key={dropdownIndex}
                                to={dropdownItem.href}
                                className="block py-1 text-muted-foreground hover:text-finance-gold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center space-x-2 py-2 text-foreground hover:text-finance-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
