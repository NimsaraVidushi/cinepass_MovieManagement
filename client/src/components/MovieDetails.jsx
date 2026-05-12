export default function MovieDetails({ movie, onClose, onBook }) {
  if (!movie) return null;

  return (
    <section className="details">
      <div>
        <button className="secondary" onClick={onClose} style={{ marginBottom: "1rem" }}>
          ← Back to Catalog
        </button>
        {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="details-poster" />}
      </div>
      
      <div>
        <h2 style={{ fontSize: "3rem", margin: "0 0 1rem" }}>{movie.title}</h2>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <span className="status-badge status-active">{movie.genre}</span>
          <span className="status-badge secondary">{movie.ageRating}</span>
          <span style={{ color: "var(--netflix-light-gray)" }}>{movie.duration} min</span>
        </div>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#eee" }}>
          {movie.description || "No description available."}
        </p>

        <div style={{ marginTop: "2rem", display: "grid", gap: "0.5rem", color: "var(--netflix-light-gray)" }}>
          <p><strong>Language:</strong> {movie.language}</p>
          <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
        </div>

        <button 
          className="active" 
          style={{ marginTop: "2rem", padding: "1rem 3rem", fontSize: "1.2rem" }}
          onClick={() => onBook(movie)}
        >
          Book Tickets
        </button>
      </div>
    </section>
  );
}
