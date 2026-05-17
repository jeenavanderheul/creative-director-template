import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** If set, log via this prefix instead of swallowing silently. */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors in subtrees so a single broken component
 * (e.g. WebGL context failure) does not blank the whole page.
 * Falls back to `fallback` (or null) and logs once with `label`.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const tag = this.props.label ? `[ErrorBoundary:${this.props.label}]` : "[ErrorBoundary]";
    console.warn(tag, error.message, info.componentStack?.split("\n")[1]?.trim());
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
