import { useState } from "react";

export default function BookingPage({ showtime, onNext, onCancel }) {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    seatsBooked: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  if (!showtime) return null;

  return (
    <div className="booking-page glass animate-in">
      <div className="booking-header">
        <button className="secondary glass" onClick={onCancel} style={{ marginBottom: "2rem" }}>← Back to Showtimes</button>
        
        <div className="stepper" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem" }}>
          <div className="step active"><span>1</span> Seats</div>
          <div className="step-line"></div>
          <div className="step"><span>2</span> Checkout</div>
          <div className="step-line"></div>
          <div className="step"><span>3</span> Payment</div>
        </div>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "800", textAlign: "center", marginBottom: "0.5rem" }}>Reserve Your Seats</h2>
        <p style={{ textAlign: "center", color: "var(--netflix-light-gray)", marginBottom: "3rem" }}>Step 1: Choose how many people are joining you.</p>
      </div>

      <div className="booking-content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
        <div className="booking-summary-mini glass" style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)", height: "fit-content" }}>
          {showtime.movie?.posterUrl && (
            <img 
              src={showtime.movie.posterUrl} 
              alt={showtime.movie.title} 
              style={{ width: "100%", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", marginBottom: "1.5rem" }}
            />
          )}
          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>{showtime.movie?.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "1rem", color: "var(--netflix-light-gray)" }}>
            <p>📅 {new Date(showtime.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p>🕒 {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>🎬 {showtime.hall?.name}</p>
          </div>
          <div className="status-badge status-active" style={{ marginTop: "1.5rem", display: "inline-block", padding: "0.5rem 1rem" }}>
            {showtime.availableSeats} Seats Left
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="field-label" style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.8rem" }}>Number of Seats</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input
                type="number"
                min="1"
                max={Math.min(10, showtime.availableSeats)}
                value={formData.seatsBooked}
                onChange={(e) => setFormData({ ...formData, seatsBooked: parseInt(e.target.value) })}
                style={{ fontSize: "1.5rem", fontWeight: "800", textAlign: "center", width: "100px", background: "rgba(255,255,255,0.1)", border: "none" }}
                required
              />
              <span style={{ color: "var(--netflix-light-gray)" }}>Max 10 per booking</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="field-label">Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "2.5rem" }}>
            <label className="field-label">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}
              required
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", borderRadius: "8px", boxShadow: "0 10px 20px rgba(229, 9, 20, 0.3)" }}>
            Continue to Checkout
          </button>
        </form>
      </div>
    </div>
  );
}
