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
    <div className="booking-page">
      <div className="booking-header">
        <button className="secondary" onClick={onCancel} style={{ marginBottom: "1rem" }}>← Back</button>
        <h2>Select Seats</h2>
      </div>

      <div className="booking-summary-mini">
        {showtime.movie?.posterUrl && <img src={showtime.movie.posterUrl} alt={showtime.movie.title} />}
        <div>
          <h3>{showtime.movie?.title}</h3>
          <p>{new Date(showtime.startTime).toLocaleString()} • {showtime.hall?.name}</p>
          <p className="status-badge status-active">{showtime.availableSeats} Seats Available</p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="field-label">Number of Seats</label>
          <input
            type="number"
            min="1"
            max={Math.min(10, showtime.availableSeats)}
            value={formData.seatsBooked}
            onChange={(e) => setFormData({ ...formData, seatsBooked: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label className="field-label">Your Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="field-label">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={formData.userEmail}
            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1.5rem" }}>Review Booking</button>
      </form>
    </div>
  );
}
