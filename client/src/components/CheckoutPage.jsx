import { useState } from "react";
import { validatePromo } from "../api/bookings.js";

export default function CheckoutPage({ booking, onNext, onCancel }) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidating(true);
    setPromoError("");
    try {
      const result = await validatePromo(promoCode);
      if (result.valid) {
        setDiscount(result.discountPct);
      } else {
        setPromoError("Invalid promo code");
        setDiscount(0);
      }
    } catch (err) {
      setPromoError("Error validating promo code");
    } finally {
      setIsValidating(false);
    }
  };

  const unitPrice = booking.unitPrice || booking.showtime?.ticketPrice || 0;
  const seats = booking.seatsBooked || 0;
  const subtotal = unitPrice * seats;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="checkout-page glass animate-in">
      <div className="booking-header">
        <button className="secondary glass" onClick={onCancel} style={{ marginBottom: "2rem" }}>← Back to Seats</button>
        
        <div className="stepper" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem" }}>
          <div className="step active"><span>✓</span> Seats</div>
          <div className="step-line" style={{ background: "var(--netflix-red)" }}></div>
          <div className="step active"><span>2</span> Checkout</div>
          <div className="step-line"></div>
          <div className="step"><span>3</span> Payment</div>
        </div>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "800", textAlign: "center", marginBottom: "0.5rem" }}>Order Summary</h2>
        <p style={{ textAlign: "center", color: "var(--netflix-light-gray)", marginBottom: "3rem" }}>Step 2: Review your order and apply discounts.</p>
      </div>

      <div className="checkout-summary glass" style={{ padding: "2.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="summary-row">
          <span style={{ color: "var(--netflix-light-gray)" }}>Movie</span>
          <span style={{ fontWeight: "700" }}>{booking.showtime?.movie?.title}</span>
        </div>
        <div className="summary-row">
          <span style={{ color: "var(--netflix-light-gray)" }}>Showtime</span>
          <span>{new Date(booking.showtime?.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <div className="summary-row">
          <span style={{ color: "var(--netflix-light-gray)" }}>Quantity</span>
          <span>{seats} Seats</span>
        </div>
        <div className="summary-row">
          <span style={{ color: "var(--netflix-light-gray)" }}>Ticket Price</span>
          <span>${unitPrice.toFixed(2)}</span>
        </div>
        
        <div className="promo-section" style={{ margin: "2rem 0", padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
          <label className="field-label" style={{ fontWeight: "700", marginBottom: "0.8rem" }}>Promo Code</label>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <input 
              type="text" 
              placeholder="ENTER CODE" 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              style={{ flex: 1, background: "rgba(0,0,0,0.3)" }}
            />
            <button className="secondary glass" onClick={handleApplyPromo} disabled={isValidating} style={{ padding: "0 2rem" }}>
              {isValidating ? "..." : "Apply"}
            </button>
          </div>
          {promoError && <p style={{ color: "var(--netflix-red)", fontSize: "0.85rem", marginTop: "0.8rem", fontWeight: "600" }}>⚠ {promoError}</p>}
          {discount > 0 && <p style={{ color: "#46d369", fontSize: "0.85rem", marginTop: "0.8rem", fontWeight: "600" }}>✓ Applied {discount}% discount!</p>}
        </div>

        <div className="summary-row" style={{ marginTop: "1rem" }}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row" style={{ color: "#46d369", fontWeight: "600" }}>
            <span>Promo Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total" style={{ borderTop: "2px solid #333", paddingTop: "1.5rem", marginTop: "1rem" }}>
          <span style={{ fontSize: "1.2rem" }}>Total Amount</span>
          <span style={{ fontSize: "1.8rem" }}>${total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        style={{ width: "100%", marginTop: "3rem", fontSize: "1.3rem", padding: "1.2rem", borderRadius: "8px", boxShadow: "0 10px 20px rgba(229, 9, 20, 0.3)" }}
        onClick={() => onNext({ promoCode, totalAmount: total })}
      >
        Continue to Payment
      </button>
    </div>
  );
}
