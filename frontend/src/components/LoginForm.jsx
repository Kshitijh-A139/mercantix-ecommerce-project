import React, { useState } from "react";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);

    // TODO: plug in your real login fetch here
    // await fetch("/api/auth/login", {...})
    setTimeout(() => {
      setLoading(false);
      console.log("Login with: ", form);
    }, 600);
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              // TODO: optional: toggle visibility
            >
              👁
            </button>
          </div>
          <button type="button" className="link-button small">
            Forgot Password?
          </button>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="divider">
        <span>Or sign in with</span>
      </div>

      <div className="social-row">
        <button className="btn btn-social google">Google</button>
        <button className="btn btn-social facebook">Facebook</button>
      </div>
    </>
  );
};

export default LoginForm;
