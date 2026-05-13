import { useState } from "react";

export default function AdminMovieManager({
  movies,
  onCreate,
  onEditRequest // Callback to navigate to edit page
}) {
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreate(formData);
    event.currentTarget.reset();
    setShowCreate(false);
  };

  return (
    <section className="admin animate-in glass">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h2 className="section-title">Movie Inventory</h2>
        <button className={showCreate ? "danger" : "active"} onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "✕ Cancel" : "+ Register Movie"}
        </button>
      </div>

      {showCreate && (
        <div className="fade-in" style={{ background: "rgba(255,255,255,0.03)", padding: "3rem", borderRadius: "12px", marginBottom: "3rem", border: "1px solid rgba(229, 9, 20, 0.3)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "2rem" }}>New Movie Entry</h3>
          <form className="form" onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label className="field-label">Title</label>
                <input name="title" placeholder="e.g. Inception" required />
              </div>
              <div className="form-group">
                <label className="field-label">Genre</label>
                <input name="genre" placeholder="Action, Sci-Fi" required />
              </div>
              <div className="form-group">
                <label className="field-label">Language</label>
                <input name="language" placeholder="English" required />
              </div>
              <div className="form-group">
                <label className="field-label">Age Rating</label>
                <input name="ageRating" placeholder="PG-13" required />
              </div>
              <div className="form-group">
                <label className="field-label">Duration (min)</label>
                <input name="duration" type="number" placeholder="148" required />
              </div>
              <div className="form-group">
                <label className="field-label">Release Date</label>
                <input name="releaseDate" type="date" required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label className="field-label">Poster Image URL</label>
              <input name="posterUrl" placeholder="https://..." />
            </div>
            <div className="form-group" style={{ margin: "1.5rem 0" }}>
              <label className="field-label">Or Upload Poster File</label>
              <input type="file" name="poster" accept="image/*" className="glass" style={{ width: "100%", padding: "1rem" }} />
            </div>
            <div className="form-group">
              <label className="field-label">Synopsis</label>
              <textarea name="description" placeholder="Brief summary of the movie..." rows="4" />
            </div>
            <button type="submit" style={{ width: "100%", marginTop: "2rem", padding: "1.2rem", fontSize: "1.1rem" }}>Add to Inventory</button>
          </form>
        </div>
      )}

      <div className="movie-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {movies.map((movie, index) => (
          <div key={movie._id} className="fade-in glass" style={{ 
            padding: "1.5rem", 
            borderRadius: "12px", 
            display: "flex", 
            gap: "1.5rem",
            animationDelay: `${index * 0.05}s`
          }}>
            <img 
              src={movie.posterUrl || "https://via.placeholder.com/150x225?text=No+Poster"} 
              alt={movie.title} 
              style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "8px", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: "800" }}>{movie.title}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                  <span className="status-badge" style={{ background: "#333", fontSize: "0.65rem" }}>{movie.genre}</span>
                  <span className={`status-badge ${movie.isActive ? "status-active" : "status-inactive"}`} style={{ fontSize: "0.65rem" }}>
                    {movie.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
              <button 
                className="secondary glass" 
                style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem", fontWeight: "700" }}
                onClick={() => onEditRequest(movie)}
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
