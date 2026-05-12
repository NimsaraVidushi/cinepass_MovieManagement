export default function BookingSuccess({ booking, onDone }) {
  if (!booking) return null;

  return (
    <div className="booking-page" style={{ textAlign: "center" }}>
      <div className="success-icon" style={{ fontSize: "5rem", color: "#1db954", marginBottom: "1rem" }}>
        ✓
      </div>
      <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Booking Confirmed!</h2>
      <p style={{ color: "var(--netflix-light-gray)", marginBottom: "2rem" }}>
        Your digital ticket has been sent to {booking.user?.email}
      </p>

      <div className="ticket-container">
        <div className="ticket-header">
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>CINEPASS DIGITAL TICKET</h3>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", textAlign: "left", margin: "1rem 0" }}>
          <div>
            <p className="field-label" style={{ color: "#888" }}>MOVIE</p>
            <p style={{ fontWeight: 800 }}>{booking.showtime?.movie?.title}</p>
          </div>
          <div>
            <p className="field-label" style={{ color: "#888" }}>DATE & TIME</p>
            <p style={{ fontWeight: 800 }}>{new Date(booking.showtime?.startTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="field-label" style={{ color: "#888" }}>HALL</p>
            <p style={{ fontWeight: 800 }}>{booking.showtime?.hall?.name}</p>
          </div>
          <div>
            <p className="field-label" style={{ color: "#888" }}>SEATS</p>
            <p style={{ fontWeight: 800 }}>{booking.seatsBooked} Reserved</p>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "1rem", border: "2px solid #000", borderRadius: "4px" }}>
          <p className="field-label" style={{ color: "#888", marginBottom: "0.2rem" }}>BOOKING REFERENCE</p>
          <p className="ticket-ref">{booking.bookingRef}</p>
        </div>
      </div>

      <button onClick={onDone} style={{ marginTop: "1rem" }}>Back to Catalog</button>
    </div>
  );
}
