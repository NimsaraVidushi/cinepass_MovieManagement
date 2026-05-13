import { useState } from "react";

export default function AdminMovieEdit({ movie, onUpdate, onCancel, onDeactivate, onActivate, onDelete }) {
  const [formData, setFormData] = useState({
    title: movie.title,
    genre: movie.genre,
    language: movie.language,
    duration: movie.duration,
    releaseDate: new Date(movie.releaseDate).toISOString().slice(0, 10),
    posterUrl: movie.posterUrl || "",
    description: movie.description || "",
    ageRating: movie.ageRating || "PG-13",
    isActive: movie.isActive
  });

  const handleDelete = () => {
    if (window.confirm(`Are you absolutely sure you want to PERMANENTLY delete "${movie.title}"? This cannot be undone.`)) {
      onDelete(movie._id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.has("isActive")) data.append("isActive", "false");
    await onUpdate(movie._id, data);
  };

  return (
    <section className="admin" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Edit Movie: {movie.title}</h2>
        <button className="secondary" onClick={onCancel}>← Back to List</button>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: "300px 1fr" }}>
        <div>
          <img 
            src={formData.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"} 
            alt="Preview" 
            style={{ 
              width: "100%", 
              aspectRatio: "2/3", 
              objectFit: "cover", 
              borderRadius: "8px", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)" 
            }}
          />
          <div className="admin-actions" style={{ marginTop: "1.5rem", display: "grid", gap: "0.5rem" }}>
            <button
              className="active"
              style={{ width: "100%", background: "#1db954" }}
              onClick={() => onActivate(movie._id)}
              disabled={movie.isActive}
            >
              Activate Movie
            </button>
            <button
              className="danger"
              style={{ width: "100%" }}
              onClick={() => onDeactivate(movie._id)}
              disabled={!movie.isActive}
            >
              Deactivate Movie
            </button>
            <button
              className="secondary"
              style={{ width: "100%", color: "#ff4d4d", borderColor: "#333", marginTop: "1rem" }}
              onClick={handleDelete}
            >
              🗑 Delete Permanently
            </button>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field-label">Title</label>
          <input 
            name="title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="field-label">Genre</label>
              <input 
                name="genre" 
                value={formData.genre} 
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="field-label">Language</label>
              <input 
                name="language" 
                value={formData.language} 
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                required 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="field-label">Duration (min)</label>
              <input 
                type="number" 
                name="duration" 
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label className="field-label">Age Rating</label>
              <input 
                name="ageRating" 
                value={formData.ageRating} 
                onChange={(e) => setFormData({...formData, ageRating: e.target.value})}
                required 
              />
            </div>
          </div>

          <label className="field-label">Release Date</label>
          <input 
            name="releaseDate" 
            type="date"
            value={formData.releaseDate} 
            onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
            required 
          />

          <label className="field-label">Poster URL</label>
          <input 
            name="posterUrl" 
            value={formData.posterUrl} 
            onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
          />

          <div style={{ margin: "0.5rem 0" }}>
            <label className="field-label">Update Poster File (Optional)</label>
            <input type="file" name="poster" accept="image/*" style={{ border: "none", padding: 0 }} />
          </div>

          <label className="field-label">Synopsis</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="5"
          />

          <label className="checkbox" style={{ margin: "1rem 0" }}>
            <input
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              value="true"
            />
            Currently Active
          </label>

          <button type="submit" style={{ width: "100%", height: "3.5rem", fontSize: "1.1rem" }}>
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
}
