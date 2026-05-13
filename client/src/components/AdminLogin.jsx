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
    <div className="auth-page-wrapper">
      <div className="auth-background">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" 
          alt="Admin background" 
          style={{ filter: "brightness(0.3) grayscale(0.5)" }}
        />
      </div>

      <div className="auth-card" style={{ border: "1px solid rgba(229, 9, 20, 0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="admin-logo" style={{ margin: "0 auto 1.5rem" }}>CP</div>
          <h2 style={{ fontSize: "1.8rem", margin: 0 }}>ADMIN PORTAL</h2>
          <p style={{ color: "var(--netflix-light-gray)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Authentication Required</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="field-label" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>ADMIN EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@cinepass.com"
              autoFocus
            />
          </div>
          
          <div className="auth-form-group">
            <label className="field-label" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading} style={{ background: "#333", border: "1px solid #555" }}>
            {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
          </button>
        </form>

        <div className="auth-footer" style={{ textAlign: "center" }}>
          <button type="button" onClick={onCancel} style={{ color: "var(--netflix-red)", fontWeight: "700" }}>
            Return to User Login
          </button>
        </div>
      </div>
    </div>
  );
}
