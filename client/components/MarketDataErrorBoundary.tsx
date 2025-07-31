import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class MarketDataErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Market data component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallback || (
        <div className="p-4 rounded-lg border border-finance-red/20 bg-finance-red/10">
          <div className="flex items-center space-x-2 text-finance-red mb-2">
            <div className="w-2 h-2 bg-finance-red rounded-full"></div>
            <span className="text-sm font-medium">Market Data Error</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Unable to display market data. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 text-xs text-finance-gold hover:text-finance-electric transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
