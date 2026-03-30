import React from "react";
import "./index.css";
import "./App.css";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div className="app-root">
      <div className="auth-card">
        {/* Left marketing panel */}
        <div className="left-panel">
          <div className="left-content">
            <h1 className="left-title">
              Simplify management<br />With Our dashboard.
            </h1>
            <p className="left-subtitle">
              Simplify your e-commerce management with our
              user‑friendly admin dashboard.
            </p>

            {/* Fake analytics widget area */}
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-label">Total Sales</span>
                <span className="stat-value">$24,560</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">New Orders</span>
                <span className="stat-value">146</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="right-panel">
          <div className="right-content">
            <h2 className="brand-title">Welcome to Mercantix</h2>
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="auth-footer">
        <nav className="footer-links">
          <a href="/">Home</a>
          <a href="/">Services</a>
          <a href="/">Pricing</a>
          <a href="/">Contact</a>
          <a href="/">FAQ</a>
        </nav>
        <button className="btn btn-outline">Sign Up</button>
      </div>
    </div>
  );
}

export default App;
