export default function BookingSuccess({ booking, onDone }) {
  if (!booking) return null;

  return (
    <div className="booking-page glass animate-in" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <div className="success-icon animate-in" style={{ 
        fontSize: "4rem", 
        color: "#46d369", 
        marginBottom: "1rem",
        background: "rgba(70, 211, 105, 0.1)",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 2rem"
      }}>
        ✓
      </div>
      <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>Enjoy Your Movie!</h2>
      <p style={{ color: "var(--netflix-light-gray)", marginBottom: "3rem", fontSize: "1.1rem" }}>
        Confirmation code sent to <strong style={{ color: "#fff" }}>{booking.user?.email}</strong>
      </p>

      <div className="ticket-container animate-in" style={{ 
        background: "#fff", 
        color: "#000", 
        borderRadius: "16px", 
        padding: "0", 
        overflow: "hidden", 
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        animationDelay: "0.3s"
      }}>
        <div style={{ background: "var(--netflix-red)", padding: "1rem", color: "#fff" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "900", letterSpacing: "2px" }}>CINEPASS PREMIUM</h3>
        </div>
        
        <div style={{ padding: "2rem" }}>
          <div style={{ textAlign: "left", marginBottom: "2rem" }}>
            <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.8rem", fontWeight: "900", lineHeight: "1.1" }}>{booking.showtime?.movie?.title}</h4>
            <p style={{ color: "#666", margin: 0, fontWeight: "600" }}>{booking.showtime?.hall?.name}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left", marginBottom: "2rem", borderTop: "1px dashed #ddd", paddingTop: "2rem" }}>
            <div>
              <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.3rem" }}>Date</p>
              <p style={{ fontWeight: 800, fontSize: "1rem" }}>{new Date(booking.showtime?.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.3rem" }}>Time</p>
              <p style={{ fontWeight: 800, fontSize: "1rem" }}>{new Date(booking.showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.3rem" }}>Seats</p>
              <p style={{ fontWeight: 800, fontSize: "1rem" }}>{booking.seatsBooked} Premium Seats</p>
            </div>
            <div>
              <p style={{ color: "#999", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.3rem" }}>Reference</p>
              <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--netflix-red)" }}>{booking.bookingRef}</p>
            </div>
          </div>

          <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "120px", height: "120px", border: "4px solid #000", padding: "8px", display: "flex", flexWrap: "wrap" }}>
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} style={{ width: "14.28%", height: "14.28%", background: Math.random() > 0.5 ? "#000" : "transparent" }}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div style={{ height: "12px", background: "repeating-linear-gradient(90deg, #000, #000 10px, transparent 10px, transparent 20px)" }}></div>
      </div>

      <button className="active" onClick={onDone} style={{ marginTop: "3rem", padding: "1.2rem 3rem", fontSize: "1.1rem", borderRadius: "8px" }}>
        Back to Home
      </button>
    </div>
  );
}
