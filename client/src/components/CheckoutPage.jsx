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
    <div className="checkout-page">
      <div className="booking-header">
        <button className="secondary" onClick={onCancel}>← Back</button>
        <h2>Review Order</h2>
      </div>

      <div className="checkout-summary">
        <div className="summary-row">
          <span>Movie</span>
          <span>{booking.showtime?.movie?.title}</span>
        </div>
        <div className="summary-row">
          <span>Showtime</span>
          <span>{new Date(booking.showtime?.startTime).toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Seats</span>
          <span>{seats} x ${unitPrice.toFixed(2)}</span>
        </div>
        
        <div className="promo-section" style={{ margin: "1.5rem 0" }}>
          <label className="field-label">Promo Code</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              placeholder="ENTER CODE" 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            />
            <button className="secondary" onClick={handleApplyPromo} disabled={isValidating}>
              {isValidating ? "..." : "Apply"}
            </button>
          </div>
          {promoError && <p style={{ color: "var(--netflix-red)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{promoError}</p>}
          {discount > 0 && <p style={{ color: "#1db954", fontSize: "0.8rem", marginTop: "0.4rem" }}>Applied {discount}% discount!</p>}
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row" style={{ color: "#1db954" }}>
            <span>Discount ({discount}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        style={{ width: "100%", marginTop: "2rem", fontSize: "1.2rem" }}
        onClick={() => onNext({ promoCode, totalAmount: total })}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
