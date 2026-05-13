export default function MovieList({ movies, onSelectMovie, loading }) {
  if (loading) {
    return <div className="animate-in" style={{ padding: "4rem", textAlign: "center" }}>
      <div className="status-badge status-active">Loading Cinematic Excellence...</div>
    </div>;
  }

  if (!movies.length) {
    return <div className="animate-in" style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ color: "var(--netflix-light-gray)", fontSize: "1.2rem" }}>No movies match the current filters.</p>
    </div>;
  }

  return (
    <div className="movie-grid animate-in">
      {movies.map((movie, index) => (
        <article 
          key={movie._id} 
          className="card fade-in" 
          onClick={() => onSelectMovie(movie._id)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="poster" />
          ) : (
            <div className="poster placeholder">
              <span>No Poster Available</span>
            </div>
          )}
          <div className="card-info">
            <h3 className="card-title">{movie.title}</h3>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginTop: "0.8rem" }}>
              <span className="rating" style={{ border: "1px solid #555", padding: "0 4px", fontSize: "0.7rem", borderRadius: "2px" }}>{movie.ageRating}</span>
              <span style={{ color: "var(--netflix-light-gray)", fontSize: "0.8rem" }}>{movie.duration}m</span>
              <span style={{ color: "#46d369", fontSize: "0.8rem", fontWeight: "700" }}>HD</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
