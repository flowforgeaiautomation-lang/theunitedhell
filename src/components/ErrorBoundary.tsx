import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-serif font-bold text-ink-200 mb-3">Something went wrong</h1>
            <p className="text-ink-500 mb-6">We're having trouble loading the page. Please try refreshing.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
