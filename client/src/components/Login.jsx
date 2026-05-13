import { useState } from "react";
import { login } from "../api/auth.js";

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
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
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-07583708f1a5/1229342e-131b-4861-9f93-013063b464a8/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" 
          alt="Netflix background" 
        />
      </div>

      <div className="auth-card">
        <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "700", marginBottom: "28px" }}>Sign In</h1>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              autoFocus
            />
          </div>
          
          <div className="auth-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New to Cinepass?</span>
          <button type="button" onClick={onSwitchToRegister}>
            Sign up now.
          </button>
        </div>

        <div style={{ marginTop: "3rem", borderTop: "1px solid #333", paddingTop: "1.5rem" }}>
          <button 
            type="button" 
            style={{ 
              background: "none", 
              border: "1px solid #555", 
              color: "#aaa", 
              width: "100%", 
              padding: "0.8rem", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600"
            }}
            onClick={() => onLoginSuccess({ type: "switch-to-admin" })}
          >
            ADMIN PORTAL
          </button>
        </div>
      </div>
    </div>
  );
}
