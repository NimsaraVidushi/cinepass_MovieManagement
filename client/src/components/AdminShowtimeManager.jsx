import { useState } from "react";

/**
 * Converts a local datetime-local string (e.g. "2025-06-15T14:30")
 * to a UTC ISO-8601 string for the API.
 */
const toUtcIso = (localStr) => {
  if (!localStr) return "";
  return new Date(localStr).toISOString();
};

/** Format a UTC Date string back to a datetime-local input value */
const toLocalInput = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  // Offset to local time
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d - offset).toISOString().slice(0, 16);
};

const emptyForm = { movieId: "", hallId: "", startTime: "", ticketPrice: "" };

export default function AdminShowtimeManager({
  movies,
  halls,
  showtimes,
  onCreate,
  onUpdate,
  onCancel
}) {
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({ startTime: "", hallId: "", ticketPrice: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedShowtime = showtimes.find((s) => s._id === editId);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(""); }
    else { setSuccess(msg); setError(""); }
    setTimeout(() => { setError(""); setSuccess(""); }, 5000);
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.movieId || !form.hallId || !form.startTime || !form.ticketPrice) {
      return flash("Please fill in all required fields.", true);
    }
    try {
      await onCreate({
        movieId: form.movieId,
        hallId: form.hallId,
        startTime: toUtcIso(form.startTime),
        ticketPrice: Number(form.ticketPrice)
      });
      setForm(emptyForm);
      flash("Showtime scheduled successfully!");
    } catch (err) {
      flash(err.message, true);
    }
  };

  // ── Select for edit ──────────────────────────────────────────────────────────
  const selectShowtime = (id) => {
    setEditId(id);
    const s = showtimes.find((st) => st._id === id);
    if (s) {
      setEditForm({
        startTime: toLocalInput(s.startTime),
        hallId: s.hall?._id || "",
        ticketPrice: s.ticketPrice
      });
    } else {
      setEditForm({ startTime: "", hallId: "", ticketPrice: "" });
    }
  };

  // ── Update (reschedule) ──────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editId) return;
    setError("");
    try {
      const payload = { ticketPrice: Number(editForm.ticketPrice) };
      if (editForm.startTime) payload.startTime = toUtcIso(editForm.startTime);
      if (editForm.hallId) payload.hallId = editForm.hallId;
      await onUpdate(editId, payload);
      flash("Showtime rescheduled!");
    } catch (err) {
      flash(err.message, true);
    }
  };

  // ── Cancel ──────────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!editId) return;
    if (!window.confirm("Cancel this showtime? Seats will no longer be bookable.")) return;
    setError("");
    try {
      await onCancel(editId);
      setEditId("");
      flash("Showtime cancelled.");
    } catch (err) {
      flash(err.message, true);
    }
  };

  const formatDt = (isoStr) => {
    if (!isoStr) return "—";
    return new Date(isoStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <section className="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Screen Scheduling</h2>
        <p className="field-label">Manage showtimes and hall assignments</p>
      </div>

      <div className="admin-grid">
        {/* ── Schedule Showtime ─────────────────────────────── */}
        <div style={{ background: "#222", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Schedule New Showtime</h3>
          <form className="form" onSubmit={handleCreate}>
            <label className="field-label">Target Movie</label>
            <select
              value={form.movieId}
              onChange={(e) => setForm((p) => ({ ...p, movieId: e.target.value }))}
              required
            >
              <option value="">Select movie…</option>
              {movies.filter((m) => m.isActive).map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.duration} min)
                </option>
              ))}
            </select>

            <label className="field-label">Assign to Hall</label>
            <select
              value={form.hallId}
              onChange={(e) => setForm((p) => ({ ...p, hallId: e.target.value }))}
              required
            >
              <option value="">Select hall…</option>
              {halls.filter((h) => h.isActive).map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.totalCapacity} seats
                </option>
              ))}
            </select>

            <label className="field-label">
              Start Time <span className="tz-note">(UTC-aware)</span>
            </label>
            <input
              type="datetime-local"
              value={form.startTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
              required
            />

            <label className="field-label">Ticket Price ($)</label>
            <input
              type="number"
              placeholder="e.g. 12.50"
              min={0}
              step={0.01}
              value={form.ticketPrice}
              onChange={(e) => setForm((p) => ({ ...p, ticketPrice: e.target.value }))}
              required
            />

            <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>Finalize Schedule</button>
          </form>
        </div>

        {/* ── Reschedule Showtime ───────────────────────────── */}
        <div style={{ background: "#222", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Reschedule / Adjust</h3>
          <select 
            value={editId} 
            onChange={(e) => selectShowtime(e.target.value)}
            style={{ marginBottom: "1rem" }}
          >
            <option value="">Select active session…</option>
            {showtimes.filter(s => s.isActive).map((s) => (
              <option key={s._id} value={s._id}>
                {s.movie?.title} @ {s.hall?.name} — {formatDt(s.startTime)}
              </option>
            ))}
          </select>

          {selectedShowtime ? (
            <form className="form" onSubmit={handleUpdate}>
              <label className="field-label">New Slot Start</label>
              <input
                type="datetime-local"
                value={editForm.startTime}
                onChange={(e) => setEditForm((p) => ({ ...p, startTime: e.target.value }))}
              />

              <label className="field-label">Relocate to Hall</label>
              <select
                value={editForm.hallId}
                onChange={(e) => setEditForm((p) => ({ ...p, hallId: e.target.value }))}
              >
                <option value="">Keep current hall</option>
                {halls.filter((h) => h.isActive).map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} — {h.totalCapacity} seats
                  </option>
                ))}
              </select>

              <label className="field-label">Update Price ($)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={editForm.ticketPrice}
                onChange={(e) => setEditForm((p) => ({ ...p, ticketPrice: e.target.value }))}
              />

              <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>Update Slot</button>
              <button 
                type="button" 
                className="danger" 
                onClick={handleCancel}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                Cancel Session
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#666", border: "1px dashed #444", borderRadius: "4px" }}>
              Select a showtime to reschedule or relocate it to a different screen.
            </div>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: "3rem", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
        Scheduling Grid ({showtimes.length})
      </h3>
      <div className="showtime-table-wrapper" style={{ marginTop: "1rem" }}>
        <table className="showtime-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Hall</th>
              <th>Start</th>
              <th>Seats Available</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => (
              <tr key={s._id} className={!s.isActive ? "row-cancelled" : ""}>
                <td style={{ fontWeight: "bold" }}>{s.movie?.title || "—"}</td>
                <td>{s.hall?.name || "—"}</td>
                <td style={{ color: "var(--netflix-light-gray)" }}>{formatDt(s.startTime)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ 
                      flex: 1, 
                      height: "4px", 
                      background: "#333", 
                      borderRadius: "2px",
                      overflow: "hidden" 
                    }}>
                      <div style={{ 
                        width: `${(s.availableSeats / (s.hall?.totalCapacity || 1)) * 100}%`,
                        height: "100%",
                        background: s.availableSeats === 0 ? "var(--netflix-red)" : "#1db954"
                      }} />
                    </div>
                    <span style={{ fontSize: "0.75rem", minWidth: "50px" }}>
                      {s.availableSeats} / {s.hall?.totalCapacity ?? "?"}
                    </span>
                  </div>
                </td>
                <td>${s.ticketPrice?.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${s.isActive ? "status-active" : "status-inactive"}`} style={{ fontSize: "0.6rem" }}>
                    {s.isActive ? "Confirmed" : "Cancelled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
