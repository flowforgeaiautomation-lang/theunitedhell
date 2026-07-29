import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; retryKey: number }

export default class ErrorBoundary extends Component<Props, State> {
  retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryKey: 0 };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, retryKey: 0 };
  }

  componentDidCatch() {
    this.retryTimer = setTimeout(() => {
      this.setState({ hasError: false, retryKey: this.state.retryKey + 1 });
    }, 2000);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <div className="kicker">Loading</div>
            <h1 className="display-2 mt-3">Loading the page…</h1>
            <p className="dek mt-3">This should only take a moment.</p>
          </div>
        </div>
      );
    }
    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}
