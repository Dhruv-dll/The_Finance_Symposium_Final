import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  category?: string;
}

export default function PlaceholderPage({
  title,
  description,
  category,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-navy via-finance-navy-light to-finance-navy">
      <Navigation scrolled={true} />

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-finance-gold hover:text-finance-electric transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {/* Placeholder Content */}
            <div className="glassmorphism p-12 rounded-2xl border border-finance-gold/20 market-glow">
              <div className="w-20 h-20 bg-gradient-to-br from-finance-gold to-finance-electric rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-finance-navy" />
              </div>

              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
                {title}
              </h1>

              {category && (
                <div className="inline-block px-4 py-2 bg-finance-electric/20 text-finance-electric rounded-full text-sm font-medium mb-4">
                  {category}
                </div>
              )}

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {description}
              </p>

              <div className="bg-finance-navy-light/50 border border-finance-gold/20 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-finance-gold mb-3">
                  Coming Soon!
                </h3>
                <p className="text-muted-foreground">
                  This page is currently under development. Our team is working
                  hard to bring you an amazing experience with cutting-edge
                  design and functionality.
                </p>
              </div>

              <div className="text-center">
                <p className="text-finance-electric mb-4">
                  Want to see this page completed? Continue the conversation!
                </p>
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy font-medium rounded-lg">
                  <span>Prompt me to build this page</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-finance-gold/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg flex items-center justify-center">
              <span className="text-finance-navy font-bold text-sm">TFS</span>
            </div>
            <span className="text-finance-gold font-medium">
              The Finance Symposium
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 The Finance Symposium. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
