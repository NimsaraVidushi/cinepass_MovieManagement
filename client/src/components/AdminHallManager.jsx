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
      <h2>Hall Manager</h2>

      {error && <p className="error-banner">{error}</p>}
      {success && <p className="success-banner">{success}</p>}

      <div className="admin-grid">
        {/* ── Create Hall ───────────────────────────────────── */}
        <div>
          <h3>Register New Hall</h3>
          <form className="form" onSubmit={handleCreate}>
            <input
              placeholder="Hall name (e.g. Screen 1)"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Total capacity (seats)"
              min={1}
              value={form.totalCapacity}
              onChange={(e) => setForm((p) => ({ ...p, totalCapacity: e.target.value }))}
              required
            />
            <fieldset className="amenities-fieldset">
              <legend>Amenities</legend>
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
            <button type="submit">Add Hall</button>
          </form>
        </div>

        {/* ── Edit Hall ─────────────────────────────────────── */}
        <div>
          <h3>Edit Hall</h3>
          <select value={editId} onChange={(e) => selectHall(e.target.value)}>
            <option value="">Select hall…</option>
            {halls.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} — {h.totalCapacity} seats {h.isActive ? "" : "(Inactive)"}
              </option>
            ))}
          </select>

          {selectedHall ? (
            <>
              <form className="form" onSubmit={handleUpdate} style={{ marginTop: "0.75rem" }}>
                <input
                  placeholder="Hall name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <input
                  type="number"
                  placeholder="Total capacity"
                  min={1}
                  value={editForm.totalCapacity}
                  onChange={(e) => setEditForm((p) => ({ ...p, totalCapacity: e.target.value }))}
                  required
                />
                <fieldset className="amenities-fieldset">
                  <legend>Amenities</legend>
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
                <button type="submit">Update Hall</button>
              </form>

              <div className="admin-actions">
                <button className="danger" onClick={handleDelete}>
                  Delete Hall
                </button>
              </div>
            </>
          ) : (
            <p className="info">Select a hall to edit or delete it.</p>
          )}
        </div>
      </div>

      {/* ── Hall List ─────────────────────────────────────── */}
      <h3 style={{ marginTop: "1.5rem" }}>Registered Halls ({halls.length})</h3>
      {halls.length === 0 ? (
        <p className="info">No halls registered yet.</p>
      ) : (
        <div className="hall-list">
          {halls.map((h) => (
            <div key={h._id} className="hall-card">
              <div className="hall-card-header">
                <span className="hall-name">{h.name}</span>
                <span className={`status-badge ${h.isActive ? "status-active" : "status-inactive"}`}>
                  {h.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="hall-capacity">🪑 {h.totalCapacity} seats</p>
              {h.amenities.length > 0 && (
                <div className="amenity-pills">
                  {h.amenities.map((a) => (
                    <span key={a} className="amenity-pill">{a}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
