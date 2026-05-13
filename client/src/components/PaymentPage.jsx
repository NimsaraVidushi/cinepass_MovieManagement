import { useState } from "react";

export default function PaymentPage({ totalAmount, onPay, onCancel, isProcessing }) {
  const [method, setMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay({ 
      method, 
      cardLast4: cardDetails.number.slice(-4) 
    });
  };

  return (
    <div className="payment-page glass animate-in">
      <div className="booking-header">
        <button className="secondary glass" onClick={onCancel} style={{ marginBottom: "2rem" }}>← Back to Checkout</button>
        
        <div className="stepper" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem" }}>
          <div className="step active"><span>✓</span> Seats</div>
          <div className="step-line" style={{ background: "var(--netflix-red)" }}></div>
          <div className="step active"><span>✓</span> Checkout</div>
          <div className="step-line" style={{ background: "var(--netflix-red)" }}></div>
          <div className="step active"><span>3</span> Payment</div>
        </div>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "800", textAlign: "center", marginBottom: "0.5rem" }}>Secure Payment</h2>
        <p style={{ textAlign: "center", color: "var(--netflix-light-gray)", marginBottom: "3rem" }}>Step 3: Complete your transaction securely.</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "3rem", padding: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="field-label" style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Amount to Pay</p>
        <h3 style={{ fontSize: "3.5rem", margin: "0", color: "var(--netflix-red)", fontWeight: "900" }}>
          ${totalAmount?.toFixed(2)}
        </h3>
      </div>

      <div className="payment-methods" style={{ marginBottom: "2.5rem" }}>
        <div 
          className={`method-card glass ${method === "card" ? "selected" : ""}`}
          onClick={() => setMethod("card")}
          style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}
        >
          <span style={{ fontSize: "1.5rem" }}>💳</span>
          <span style={{ fontWeight: "700" }}>Card</span>
        </div>
        <div 
          className={`method-card glass ${method === "cash" ? "selected" : ""}`}
          onClick={() => setMethod("cash")}
          style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}
        >
          <span style={{ fontSize: "1.5rem" }}>💵</span>
          <span style={{ fontWeight: "700" }}>Cash</span>
        </div>
        <div 
          className={`method-card glass ${method === "online" ? "selected" : ""}`}
          onClick={() => setMethod("online")}
          style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}
        >
          <span style={{ fontSize: "1.5rem" }}>🌐</span>
          <span style={{ fontWeight: "700" }}>Online</span>
        </div>
      </div>

      {method === "card" ? (
        <form className="form" onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="field-label">Cardholder Name</label>
            <input 
              type="text" 
              placeholder="NAME AS IT APPEARS ON CARD" 
              required
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="field-label">Card Number</label>
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              maxLength="16"
              required
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "") })}
              style={{ background: "rgba(255,255,255,0.05)", letterSpacing: "2px" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group">
              <label className="field-label">Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM / YY" 
                maxLength="5"
                required
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
            <div className="form-group">
              <label className="field-label">Security Code (CVV)</label>
              <input 
                type="password" 
                placeholder="•••" 
                maxLength="3"
                required
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>
          <button 
            type="submit" 
            style={{ width: "100%", marginTop: "3rem", height: "4rem", fontSize: "1.3rem", borderRadius: "8px", boxShadow: "0 15px 30px rgba(229, 9, 20, 0.4)" }}
            disabled={isProcessing}
          >
            {isProcessing ? "🔒 Processing Securely..." : "Confirm & Pay Now"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: "1.2rem", color: "var(--netflix-light-gray)", marginBottom: "2rem" }}>
            To complete your {method} payment, please confirm below and proceed to the designated counter.
          </p>
          <button 
            onClick={() => onPay({ method })}
            style={{ padding: "1.2rem 3rem", fontSize: "1.2rem", borderRadius: "8px" }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Confirm ${method} Payment`}
          </button>
        </div>
      )}
    </div>
  );
}
