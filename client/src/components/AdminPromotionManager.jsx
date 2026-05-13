import { useState } from "react";

export default function AdminPromotionManager({ promotions, onCreate, onDelete }) {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPct: 10,
    description: "",
    expiryDate: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ code: "", discountPct: 10, description: "", expiryDate: "" });
    setShowCreate(false);
  };

  return (
    <section className="admin animate-in glass">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h2 className="section-title">Promotions & Discounts</h2>
        <button className={showCreate ? "danger" : "active"} onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "✕ Cancel" : "+ Create Promo"}
        </button>
      </div>

      {showCreate && (
        <div className="fade-in glass" style={{ padding: "2.5rem", borderRadius: "12px", marginBottom: "3rem", border: "1px solid var(--netflix-red)" }}>
          <form className="form" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label className="field-label">Promo Code</label>
                <input 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER25" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="field-label">Discount (%)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  value={formData.discountPct} 
                  onChange={e => setFormData({...formData, discountPct: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="field-label">Expiry Date (Optional)</label>
                <input 
                  type="date"
                  value={formData.expiryDate} 
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label className="field-label">Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Details about the offer..." 
                rows="2" 
              />
            </div>
            <button type="submit" style={{ width: "100%", marginTop: "2rem" }}>Launch Promotion</button>
          </form>
        </div>
      )}

      <div className="promo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {promotions.map(promo => (
          <div key={promo._id} className="glass fade-in" style={{ padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--netflix-red)", margin: 0 }}>{promo.code}</h3>
                <span className="status-badge status-active" style={{ fontSize: "0.6rem", marginTop: "0.5rem", display: "inline-block" }}>
                  {promo.discountPct}% OFF
                </span>
              </div>
              <button 
                className="secondary glass" 
                onClick={() => onDelete(promo._id)}
                style={{ padding: "0.5rem", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1.5rem", minHeight: "2.7rem" }}>{promo.description || "No description provided."}</p>
            <div style={{ borderTop: "1px solid #222", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
              <span style={{ color: "#666" }}>Expires:</span>
              <span style={{ color: promo.expiryDate ? "#fff" : "#444" }}>
                {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString() : "Never"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
