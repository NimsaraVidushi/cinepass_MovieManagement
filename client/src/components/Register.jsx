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
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose a password"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              checked={isAdmin} 
              onChange={(e) => setIsAdmin(e.target.checked)} 
            />
            Register as Administrator
          </label>
        </div>

        {isAdmin && (
          <div className="form-group">
            <label htmlFor="adminSecret">Admin Secret Key</label>
            <input
              type="password"
              id="adminSecret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
              placeholder="Enter secret key"
            />
          </div>
        )}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={onSwitchToLogin}>
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
