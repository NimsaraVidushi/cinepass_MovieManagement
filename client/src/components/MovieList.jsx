export default function MovieList({ movies, onSelectMovie, loading }) {
  if (loading) {
    return <p className="info">Loading movies...</p>;
  }

  if (!movies.length) {
    return <p className="info">No movies match the current filters.</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <article key={movie._id} className="card" onClick={() => onSelectMovie(movie._id)}>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="poster" />
          ) : (
            <div className="poster placeholder">No Poster</div>
          )}
          <div className="card-info">
            <h3 className="card-title">{movie.title}</h3>
            <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", marginTop: "0.5rem" }}>
              <span className="amenity-pill">{movie.ageRating}</span>
              <span style={{ color: "var(--netflix-light-gray)" }}>{movie.duration}m</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
