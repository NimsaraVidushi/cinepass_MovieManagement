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
    <div className="payment-page">
      <div className="booking-header">
        <button className="secondary" onClick={onCancel}>← Back</button>
        <h2>Payment</h2>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p className="field-label">Amount to Pay</p>
        <h3 style={{ fontSize: "2.5rem", margin: "0.5rem 0", color: "var(--netflix-red)" }}>
          ${totalAmount?.toFixed(2)}
        </h3>
      </div>

      <div className="payment-methods">
        <div 
          className={`method-card ${method === "card" ? "selected" : ""}`}
          onClick={() => setMethod("card")}
        >
          <span>💳 Card</span>
        </div>
        <div 
          className={`method-card ${method === "cash" ? "selected" : ""}`}
          onClick={() => setMethod("cash")}
        >
          <span>💵 Cash</span>
        </div>
        <div 
          className={`method-card ${method === "online" ? "selected" : ""}`}
          onClick={() => setMethod("online")}
        >
          <span>🌐 Online</span>
        </div>
      </div>

      {method === "card" ? (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="field-label">Cardholder Name</label>
            <input 
              type="text" 
              placeholder="NAME ON CARD" 
              required
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="form-group">
            <label className="field-label">Card Number</label>
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              maxLength="16"
              required
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="field-label">Expiry (MM/YY)</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                maxLength="5"
                required
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="field-label">CVV</label>
              <input 
                type="password" 
                placeholder="000" 
                maxLength="3"
                required
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>
          <button 
            type="submit" 
            style={{ width: "100%", marginTop: "2rem", height: "3.5rem" }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem", background: "#222", borderRadius: "8px" }}>
          <p>Please proceed to the counter to complete your {method} payment.</p>
          <button 
            onClick={() => onPay({ method })}
            style={{ marginTop: "1rem" }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Confirm ${method} Payment`}
          </button>
        </div>
      )}
    </div>
  );
}
