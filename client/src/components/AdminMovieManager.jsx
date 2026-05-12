import { useState } from "react";

const initialForm = {
  title: "",
  genre: "",
  language: "",
  ageRating: "",
  duration: "",
  releaseDate: "",
  posterUrl: "", // Added posterUrl
  description: "",
  isActive: true
};

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
    <section className="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Movie Inventory</h2>
        <button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ Add New Movie"}
        </button>
      </div>

      {showCreate && (
        <div style={{ background: "#222", padding: "2rem", borderRadius: "8px", marginBottom: "2rem", border: "1px solid var(--netflix-red)" }}>
          <h3>Register New Movie</h3>
          <form className="form" onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input name="title" placeholder="Movie Title" required />
              <input name="genre" placeholder="Genre (e.g. Action, Drama)" required />
              <input name="language" placeholder="Language" required />
              <input name="ageRating" placeholder="Age Rating (e.g. PG-13)" required />
              <input name="duration" type="number" placeholder="Duration (min)" required />
              <input name="releaseDate" type="date" required title="Release Date" />
            </div>
            <input name="posterUrl" placeholder="Poster Image URL (Optional)" />
            <div style={{ margin: "0.5rem 0" }}>
              <label className="field-label">Or Upload File</label>
              <input type="file" name="poster" accept="image/*" style={{ border: "none", padding: 0 }} />
            </div>
            <textarea name="description" placeholder="Movie Synopsis" rows="4" />
            <button type="submit" style={{ width: "100%" }}>Create Movie Entry</button>
          </form>
        </div>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="card" style={{ background: "var(--netflix-dark-gray)", border: "1px solid #333", padding: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <img 
                src={movie.posterUrl || "https://via.placeholder.com/150x225?text=No+Poster"} 
                alt={movie.title} 
                style={{ width: "80px", height: "120px", objectFit: "cover", borderRadius: "4px" }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem" }}>{movie.title}</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  <span className="status-badge secondary" style={{ fontSize: "0.6rem" }}>{movie.genre}</span>
                  <span className={`status-badge ${movie.isActive ? "status-active" : "status-inactive"}`} style={{ fontSize: "0.6rem" }}>
                    {movie.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button 
                  className="secondary" 
                  style={{ width: "100%", padding: "0.4rem", fontSize: "0.8rem" }}
                  onClick={() => onEditRequest(movie)}
                >
                  Edit / Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
