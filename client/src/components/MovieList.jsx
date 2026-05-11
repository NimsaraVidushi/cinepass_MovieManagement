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
        <article key={movie._id} className="card">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="poster" />
          ) : (
            <div className="poster placeholder">No Poster</div>
          )}
          <h3>{movie.title}</h3>
          <p>{movie.genre} - {movie.language}</p>
          <p>{movie.duration} min - {movie.ageRating}</p>
          <button onClick={() => onSelectMovie(movie._id)}>View Details</button>
        </article>
      ))}
    </div>
  );
}
