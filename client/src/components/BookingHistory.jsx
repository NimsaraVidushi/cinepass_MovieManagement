import { useState, useEffect } from "react";
import { fetchMyBookings } from "../api/bookings.js";

export default function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMyBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyBookings(user.token);
      setBookings(data);
      if (data.length === 0) {
        setError("You haven't made any bookings yet.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadMyBookings();
    }
  }, [user]);

  return (
    <div className="booking-history admin">
      <div className="booking-header">
        <h2>My Bookings</h2>
        <p className="field-label">View your past tickets and booking status for {user.email}</p>
      </div>

      {loading && <p>Loading your bookings...</p>}
      {error && !loading && <p className="error-banner">{error}</p>}

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
