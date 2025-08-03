import React, { Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Activity, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
  isRetrying: boolean;
}

class MarketDataErrorBoundary extends Component<Props, State> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      "Market Data Error Boundary caught an error:",
      error,
      errorInfo,
    );
    this.setState({
      error,
      errorInfo,
    });

    // Auto-retry mechanism
    if (this.state.retryCount < 3) {
      this.scheduleRetry();
    }
  }

  scheduleRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    this.setState({ isRetrying: true });

    this.retryTimer = setTimeout(
      () => {
        this.handleRetry();
      },
      2000 + this.state.retryCount * 1000,
    ); // Exponential backoff
  };

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRetrying: false,
    }));
  };

  handleManualRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    this.handleRetry();
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[400px] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full">
            <Alert className="bg-finance-navy/50 border-finance-red/30 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-finance-red" />
              <AlertTitle className="text-finance-red">
                Market Data Service Error
              </AlertTitle>
              <AlertDescription className="text-foreground/80 mt-2">
                {this.state.error?.message ||
                  "Unable to load market data. Please check your connection."}
              </AlertDescription>
            </Alert>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <div className="mt-4 p-4 bg-finance-navy-light/30 rounded-lg border border-finance-gold/20">
                <h4 className="text-sm font-medium text-finance-gold mb-2">
                  Debug Information:
                </h4>
                <pre className="text-xs text-finance-electric overflow-auto max-h-32">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Retry Options */}
            <div className="mt-6 space-y-3">
              {this.state.isRetrying ? (
                <div className="flex items-center justify-center space-x-2 text-finance-electric">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                  <span className="text-sm">Retrying automatically...</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={this.handleManualRetry}
                    className="w-full bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Connection
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    Attempt {this.state.retryCount + 1} of 3
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Wifi className="w-3 h-3" />
                <span>Checking market data connectivity...</span>
              </div>
            </div>

            {/* Fallback Actions */}
            {this.state.retryCount >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-finance-navy-light/20 rounded-lg border border-finance-gold/10"
              >
                <h4 className="text-sm font-medium text-finance-gold mb-2">
                  Alternative Options:
                </h4>
                <ul className="text-xs text-foreground/70 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Refresh the entire page</li>
                  <li>• Try again in a few minutes</li>
                  <li>• Contact support if issue persists</li>
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Loading state component for market data
export const MarketDataLoader = ({
  message = "Loading market data...",
}: {
  message?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center py-12"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-finance-gold border-t-transparent rounded-full mx-auto mb-4"
      />
      <div className="text-finance-electric text-sm">{message}</div>
      <div className="flex items-center justify-center space-x-1 mt-2">
        <Activity className="w-3 h-3 text-finance-gold" />
        <span className="text-xs text-muted-foreground">
          Fetching real-time data...
        </span>
      </div>
    </div>
  </motion.div>
);

// Network status indicator
export const NetworkStatusIndicator = ({
  isOnline = true,
}: {
  isOnline?: boolean;
}) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium hidden md:flex ${
      isOnline
        ? "bg-finance-green/20 text-finance-green border border-finance-green/30"
        : "bg-finance-red/20 text-finance-red border border-finance-red/30"
    }`}
  >
    <div className="flex items-center space-x-1">
      <div
        className={`w-2 h-2 rounded-full ${isOnline ? "bg-finance-green" : "bg-finance-red"}`}
      />
      <span>{isOnline ? "Online" : "Offline"}</span>
    </div>
  </motion.div>
);

export default MarketDataErrorBoundary;
