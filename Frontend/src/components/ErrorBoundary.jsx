import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p style={{ padding: "20px", color: "red" }}>
        Oops! Something went wrong in this section.
      </p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
