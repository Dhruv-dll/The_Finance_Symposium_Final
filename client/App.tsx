import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./components/PlaceholderPage";
import { SoundProvider } from "./components/SoundSystem";
import { useEffect } from "react";
import { optimizeMobileAnimations } from "./utils/mobileOptimization";
import { MarketDashboardProvider } from "./contexts/MarketDashboardContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const cleanup = optimizeMobileAnimations();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SoundProvider>
          <MarketDashboardProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />

                {/* Events Routes */}
                <Route
                  path="/events/saturday-sessions"
                  element={
                    <PlaceholderPage
                      title="Saturday Sessions"
                      description="Educational workshops and seminars held every Saturday, covering trending finance topics and practical skills."
                      category="Educational Events"
                    />
                  }
                />
                <Route
                  path="/events/networking"
                  element={
                    <PlaceholderPage
                      title="Networking Events"
                      description="Connect with finance professionals, alumni, and industry experts through our curated networking sessions."
                      category="Professional Networking"
                    />
                  }
                />
                <Route
                  path="/events/conclave"
                  element={
                    <PlaceholderPage
                      title="Flagship Conclave"
                      description="Our premier annual event featuring keynote speakers, panel discussions, and industry insights."
                      category="Flagship Event"
                    />
                  }
                />
                <Route
                  path="/events/upcoming"
                  element={
                    <PlaceholderPage
                      title="Upcoming Events"
                      description="Stay updated with our upcoming finance events, workshops, and networking opportunities."
                      category="Event Calendar"
                    />
                  }
                />

                {/* Other Routes */}
                <Route
                  path="/finsight"
                  element={
                    <PlaceholderPage
                      title="Finsight Magazine"
                      description="Our digital magazine featuring financial insights, expert perspectives, and student perspectives on finance."
                      category="Publications"
                    />
                  }
                />
                <Route
                  path="/sponsors/past"
                  element={
                    <PlaceholderPage
                      title="Past Sponsors"
                      description="Celebrating our previous sponsors who have supported The Finance Symposium over the years."
                      category="Sponsorship"
                    />
                  }
                />
                <Route
                  path="/sponsors/present"
                  element={
                    <PlaceholderPage
                      title="Present Sponsors"
                      description="Meet our current sponsors and partners who make our events and initiatives possible."
                      category="Sponsorship"
                    />
                  }
                />
                <Route
                  path="/team"
                  element={
                    <PlaceholderPage
                      title="Meet the Team"
                      description="Get to know the dedicated faculty and students who make The Finance Symposium a success."
                      category="Team"
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PlaceholderPage
                      title="Contact Us"
                      description="Get in touch with us for inquiries, collaborations, or to join our finance community."
                      category="Contact"
                    />
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MarketDashboardProvider>
        </SoundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

// Global error handler for unhandled fetch errors to prevent app crashes
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    event.reason.message &&
    (event.reason.message.includes("Failed to fetch") ||
      event.reason.message.includes("fetch") ||
      event.reason.message.includes("Network error"))
  ) {
    console.warn(
      "🔄 Unhandled fetch error caught, preventing crash:",
      event.reason.message,
    );
    event.preventDefault(); // Prevent the error from crashing the app
  }
});
