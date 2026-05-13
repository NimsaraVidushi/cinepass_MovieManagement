import { useState } from "react";
import { register } from "../api/auth.js";

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await register({
        username,
        email,
        password,
        role: isAdmin ? "admin" : "user",
        adminSecret: isAdmin ? adminSecret : undefined
      });
      onRegisterSuccess(userData);
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
        <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "700", marginBottom: "28px" }}>Register</h1>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              autoFocus
            />
          </div>

          <div className="auth-form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
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

          <div className="auth-form-group checkbox-group" style={{ display: "flex", alignItems: "center", gap: "0.8rem", margin: "1rem 0" }}>
            <input 
              type="checkbox" 
              id="is-admin"
              checked={isAdmin} 
              onChange={(e) => setIsAdmin(e.target.checked)} 
              style={{ width: "auto" }}
            />
            <label htmlFor="is-admin" style={{ margin: 0, cursor: "pointer" }}>Register as Administrator</label>
          </div>

          {isAdmin && (
            <div className="auth-form-group animate-in">
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
                placeholder="Admin Secret Key"
              />
            </div>
          )}
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button type="button" onClick={onSwitchToLogin}>
            Sign in now.
          </button>
        </div>
      </div>
    </div>
  );
}
