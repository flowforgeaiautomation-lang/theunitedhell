import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  retryKey: number;
}

/**
 * Wraps a component so that if it throws during render, only it is
 * affected — the rest of the page continues to work. Auto-retries
 * after 2 seconds in case the error was transient.
 */
export class SafeComponent extends Component<Props, State> {
  retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryKey: 0 };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, retryKey: 0 };
  }

  componentDidCatch(error: Error) {
    console.warn(`[SafeComponent${this.props.name ? `: ${this.props.name}` : ""}] caught:`, error.message);
    this.retryTimer = setTimeout(() => {
      this.setState((prev) => ({ hasError: false, retryKey: prev.retryKey + 1 }));
    }, 2000);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}
