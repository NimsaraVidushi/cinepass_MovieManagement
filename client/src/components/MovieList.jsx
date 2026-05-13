export default function MovieList({ movies, onSelectMovie, loading, variant = "grid", title }) {
  if (loading) {
    return <div className="animate-in" style={{ padding: "4rem", textAlign: "center" }}>
      <div className="status-badge status-active">Loading Cinematic Excellence...</div>
    </div>;
  }

  if (!movies.length) {
    if (variant === "row") return null;
    return <div className="animate-in" style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ color: "var(--netflix-light-gray)", fontSize: "1.2rem" }}>No movies match the current filters.</p>
    </div>;
  }

  const isRow = variant === "row";

  return (
    <div className={isRow ? "movie-row" : "inner-container"} style={{ paddingBottom: isRow ? "0" : "4rem" }}>
      {title && <h3 className={isRow ? "row-title" : "section-title"}>{title}</h3>}
      
      <div className={isRow ? "row-container" : "movie-grid"}>
        {movies.map((movie, index) => (
          <article 
            key={movie._id} 
            className="card fade-in" 
            onClick={() => onSelectMovie(movie._id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="poster-wrapper" style={{ position: "relative", overflow: "hidden" }}>
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="poster" />
              ) : (
                <div className="poster placeholder">
                  <span>No Poster Available</span>
                </div>
              )}
            </div>
            <div className="card-info">
              <h3 className="card-title">{movie.title}</h3>
              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginTop: "0.8rem" }}>
                <span style={{ color: "var(--netflix-light-gray)", fontSize: "0.8rem" }}>{movie.duration}m</span>
                <span style={{ color: "#46d369", fontSize: "0.8rem", fontWeight: "700" }}>HD</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
