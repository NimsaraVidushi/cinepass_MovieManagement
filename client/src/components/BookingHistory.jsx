import { useState, useEffect } from "react";
import { fetchBookingsByEmail } from "../api/bookings.js";

export default function BookingHistory() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchBookingsByEmail(email);
      setBookings(data);
      if (data.length === 0) {
        setError("No bookings found for this email.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-history admin">
      <div className="booking-header">
        <h2>My Bookings</h2>
        <p className="field-label">View your past tickets and booking status</p>
      </div>

      <form onSubmit={handleSearch} className="form" style={{ marginBottom: "2rem", maxWidth: "500px" }}>
        <div className="form-group">
          <label className="field-label">Enter your email</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="email" 
              placeholder="user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find Bookings"}
            </button>
          </div>
        </div>
      </form>

      {error && <p className="error-banner">{error}</p>}

      <div className="movie-grid">
        {bookings.map((b) => (
          <div key={b._id} className="card" style={{ padding: "1.5rem", background: "var(--netflix-dark-gray)", border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0 }}>{b.showtime?.movie?.title}</h3>
                <p className="field-label" style={{ marginTop: "0.2rem" }}>Ref: {b.bookingRef}</p>
              </div>
              <span className={`status-badge ${b.status === 'confirmed' ? 'status-active' : 'status-inactive'}`}>
                {b.status}
              </span>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--netflix-light-gray)" }}>
              <p>📅 {new Date(b.showtime?.startTime).toLocaleString()}</p>
              <p>📍 {b.showtime?.hall?.name}</p>
              <p>🎟️ {b.seatsBooked} Seats</p>
              <p style={{ color: "var(--netflix-red)", fontWeight: "bold", fontSize: "1rem", marginTop: "0.5rem" }}>
                Total: ${b.totalAmount?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
