import { Component } from "react";

/**
 * App-level error boundary. Catches render errors (including failed lazy chunk
 * loads) so users see a graceful recovery screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd forward to Sentry/LogRocket/etc.
    console.error("Uncaught UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/home");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center bg-[--color-ivory] px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow !text-[--color-mist]">Something went wrong</p>
          <h1 className="font-display text-4xl md:text-5xl text-[--color-ink] mt-3">
            A small snag.
          </h1>
          <p className="text-sm text-[--color-mist] mt-4">
            We hit an unexpected error while loading this view. Refreshing usually
            sorts it out.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-8 inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-[0.08em] uppercase rounded-[--radius-xs] bg-[--color-ink] text-[--color-ivory] hover:bg-[--color-bronze-700] transition-colors"
          >
            Back to shopping
          </button>
        </div>
      </div>
    );
  }
}
