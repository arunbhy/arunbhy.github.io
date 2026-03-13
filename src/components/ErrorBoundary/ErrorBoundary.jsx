import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: "2rem",
                    textAlign: "center",
                    fontFamily: "Montserrat, sans-serif",
                }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
                    <p style={{ marginBottom: "1.5rem", opacity: 0.7 }}>Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "0.6rem 1.5rem",
                            border: "2px solid currentColor",
                            borderRadius: "4px",
                            background: "transparent",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: "1rem",
                        }}
                    >
                        Refresh
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
