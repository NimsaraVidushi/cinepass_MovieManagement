import { useState } from "react";
import { login } from "../api/auth.js";

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role !== "admin") {
        throw new Error("Access Denied: Only administrators can log in here.");
      }
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">CP</div>
          <h2>ADMIN PORTAL</h2>
          <p>Secure authentication required</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-error-message">{error}</div>}
          
          <div className="admin-form-group">
            <label htmlFor="admin-email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@cinepass.com"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">PASSWORD</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "LOGIN TO DASHBOARD"}
          </button>
          
          <button type="button" className="admin-cancel-btn" onClick={onCancel}>
            Return to User Login
          </button>
        </form>

        <div className="admin-login-footer">
          <p>© 2024 CinePass Management System v2.0.4</p>
        </div>
      </div>
    </div>
  );
}
