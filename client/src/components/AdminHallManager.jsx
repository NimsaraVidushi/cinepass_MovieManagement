import { useState } from "react";

const AMENITY_OPTIONS = ["IMAX", "Dolby Atmos", "3D", "4DX", "VIP Lounge", "Recliner Seats"];

const emptyForm = { name: "", totalCapacity: "", amenities: [] };

export default function AdminHallManager({ halls, onCreate, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedHall = halls.find((h) => h._id === editId);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(""); }
    else { setSuccess(msg); setError(""); }
    setTimeout(() => { setError(""); setSuccess(""); }, 4000);
  };

  const toggleAmenity = (amenity, current, setter) => {
    setter((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onCreate({ ...form, totalCapacity: Number(form.totalCapacity) });
      setForm(emptyForm);
      flash("Hall created successfully!");
    } catch (err) {
      flash(err.message, true);
    }
  };

  // ── Edit helpers ─────────────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState(emptyForm);

  const selectHall = (id) => {
    setEditId(id);
    const h = halls.find((hall) => hall._id === id);
    if (h) setEditForm({ name: h.name, totalCapacity: h.totalCapacity, amenities: [...h.amenities] });
    else setEditForm(emptyForm);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editId) return;
    setError("");
    try {
      await onUpdate(editId, { ...editForm, totalCapacity: Number(editForm.totalCapacity) });
      flash("Hall updated successfully!");
    } catch (err) {
      flash(err.message, true);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    if (!window.confirm("Delete this hall? This cannot be undone.")) return;
    setError("");
    try {
      await onDelete(editId);
      setEditId("");
      setEditForm(emptyForm);
      flash("Hall deleted.");
    } catch (err) {
      flash(err.message, true);
    }
  };

  return (
    <section className="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Cinema Infrastructure</h2>
        <p className="field-label">Manage halls, screens, and capacity planning</p>
      </div>

      <div className="admin-grid">
        {/* ── Create Hall ───────────────────────────────────── */}
        <div style={{ background: "#222", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Register New Hall</h3>
          <form className="form" onSubmit={handleCreate}>
            <label className="field-label">Hall Name</label>
            <input
              placeholder="e.g. Screen 1 / IMAX Theater"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <label className="field-label">Total Seating Capacity</label>
            <input
              type="number"
              placeholder="e.g. 150"
              min={1}
              value={form.totalCapacity}
              onChange={(e) => setForm((p) => ({ ...p, totalCapacity: e.target.value }))}
              required
            />
            <fieldset className="amenities-fieldset" style={{ border: "1px solid #444", padding: "1rem", borderRadius: "4px" }}>
              <legend style={{ color: "var(--netflix-red)", fontWeight: "bold" }}>Core Amenities</legend>
              <div className="amenities-grid">
                {AMENITY_OPTIONS.map((a) => (
                  <label key={a} className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(a)}
                      onChange={() => toggleAmenity(a, form.amenities, setForm)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" style={{ width: "100%" }}>Initialize Hall</button>
          </form>
        </div>

        {/* ── Edit Hall ─────────────────────────────────────── */}
        <div style={{ background: "#222", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Hall Configuration</h3>
          <select 
            value={editId} 
            onChange={(e) => selectHall(e.target.value)}
            style={{ marginBottom: "1rem" }}
          >
            <option value="">Select hall to configure…</option>
            {halls.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.totalCapacity} seats)
              </option>
            ))}
          </select>

          {selectedHall ? (
            <form className="form" onSubmit={handleUpdate}>
              <label className="field-label">Update Name</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <label className="field-label">Adjust Capacity</label>
              <input
                type="number"
                min={1}
                value={editForm.totalCapacity}
                onChange={(e) => setEditForm((p) => ({ ...p, totalCapacity: e.target.value }))}
                required
              />
              <fieldset className="amenities-fieldset" style={{ border: "1px solid #444", padding: "1rem", borderRadius: "4px" }}>
                <legend style={{ color: "var(--netflix-red)", fontWeight: "bold" }}>Amenities</legend>
                <div className="amenities-grid">
                  {AMENITY_OPTIONS.map((a) => (
                    <label key={a} className="checkbox">
                      <input
                        type="checkbox"
                        checked={editForm.amenities.includes(a)}
                        onChange={() => toggleAmenity(a, editForm.amenities, setEditForm)}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" style={{ width: "100%" }}>Save Configuration</button>
              <button type="button" className="danger" onClick={handleDelete} style={{ width: "100%", marginTop: "0.5rem" }}>
                Decommission Hall
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#666", border: "1px dashed #444", borderRadius: "4px" }}>
              Select a hall from the dropdown to modify its settings or capacity.
            </div>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: "3rem", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
        Active Infrastructure ({halls.filter(h => h.isActive).length})
      </h3>
      <div className="hall-list" style={{ marginTop: "1rem" }}>
        {halls.map((h) => (
          <div key={h._id} className="hall-card" style={{ background: "var(--netflix-dark-gray)", border: "1px solid #333" }}>
            <div className="hall-card-header">
              <span className="hall-name" style={{ fontSize: "1.2rem" }}>{h.name}</span>
              <span className={`status-badge ${h.isActive ? "status-active" : "status-inactive"}`}>
                {h.isActive ? "Online" : "Offline"}
              </span>
            </div>
            <p className="hall-capacity" style={{ margin: "1rem 0" }}>
              <span style={{ fontSize: "1.5rem" }}>🪑</span> <strong>{h.totalCapacity}</strong> total seats
            </p>
            <div className="amenity-pills">
              {h.amenities.map((a) => (
                <span key={a} className="amenity-pill" style={{ background: "#333", color: "var(--netflix-light-gray)" }}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
