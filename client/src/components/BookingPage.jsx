import { useState, useMemo } from "react";

export default function BookingPage({ showtime, onNext, onCancel }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Assume 10 seats per row based on capacity
  const rows = useMemo(() => {
    const total = showtime.hall?.totalCapacity || 80;
    const cols = 10;
    const rowCount = Math.ceil(total / cols);
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const grid = [];
    
    for (let r = 0; r < rowCount; r++) {
      const rowLabel = alphabet[r];
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        if (grid.length * cols + rowSeats.length < total) {
          rowSeats.push(`${rowLabel}${c}`);
        }
      }
      grid.push({ label: rowLabel, seats: rowSeats });
    }
    return grid;
  }, [showtime]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        alert("Maximum 10 seats per booking");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    onNext({
      userName,
      userEmail,
      seatsBooked: selectedSeats.length,
      selectedSeatNames: selectedSeats.join(", ") // Added for UI feedback
    });
  };

  if (!showtime) return null;

  return (
    <div className="booking-page glass animate-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="booking-header">
        <button className="secondary glass" onClick={onCancel} style={{ marginBottom: "2rem" }}>← Change Showtime</button>
        
        <div className="stepper" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem" }}>
          <div className="step active"><span>1</span> Seats</div>
          <div className="step-line"></div>
          <div className="step"><span>2</span> Checkout</div>
          <div className="step-line"></div>
          <div className="step"><span>3</span> Payment</div>
        </div>
      </div>

      <div className="booking-layout" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "4rem" }}>
        {/* Seat Selection Area */}
        <div className="seat-selection-container">
          <div className="screen-indicator" style={{ 
            width: "80%", 
            height: "4px", 
            background: "linear-gradient(to right, transparent, var(--netflix-red), transparent)", 
            margin: "0 auto 4rem",
            boxShadow: "0 10px 30px rgba(229, 9, 20, 0.4)",
            position: "relative"
          }}>
            <p style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", color: "#666", letterSpacing: "3px" }}>SCREEN</p>
          </div>

          <div className="seat-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            {rows.map(row => (
              <div key={row.label} style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                <span style={{ color: "#444", width: "20px", fontSize: "0.8rem", fontWeight: "800" }}>{row.label}</span>
                {row.seats.map(seat => {
                  const isSelected = selectedSeats.includes(seat);
                  // Simulate some occupied seats
                  const isOccupied = Math.random() < 0.1; 
                  
                  return (
                    <button
                      key={seat}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => toggleSeat(seat)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "4px",
                        border: "none",
                        background: isOccupied ? "#333" : isSelected ? "var(--netflix-red)" : "rgba(255,255,255,0.1)",
                        cursor: isOccupied ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        color: isSelected ? "#fff" : "transparent"
                      }}
                      title={seat}
                    >
                      {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="legend" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#999" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "2px", background: "rgba(255,255,255,0.1)" }}></div> Available
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#999" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "2px", background: "var(--netflix-red)" }}></div> Selected
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#999" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "2px", background: "#333" }}></div> Occupied
            </div>
          </div>
        </div>

        {/* Sidebar Info & Form */}
        <div className="booking-form-sidebar">
          <div className="glass" style={{ padding: "2.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "2rem" }}>Booking Details</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="field-label">Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={e => setUserName(e.target.value)} 
                  required 
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="field-label">Email</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={e => setUserEmail(e.target.value)} 
                  required 
                  placeholder="Email for confirmation"
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "8px", marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                  <span style={{ color: "#777" }}>Selected Seats:</span>
                  <span style={{ fontWeight: "700" }}>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#777" }}>Total Price:</span>
                  <span style={{ fontWeight: "800", color: "var(--netflix-red)", fontSize: "1.2rem" }}>
                    ${(selectedSeats.length * (showtime.ticketPrice || 12)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={selectedSeats.length === 0} style={{ width: "100%", padding: "1.2rem", fontSize: "1.1rem", borderRadius: "8px" }}>
                Confirm Selection
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
