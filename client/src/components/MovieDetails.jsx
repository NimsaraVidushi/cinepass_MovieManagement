export default function MovieDetails({ movie, onClose }) {
  if (!movie) return null;

  return (
    <section className="details">
      <button className="secondary" onClick={onClose}>
        Back
      </button>
      <h2>{movie.title}</h2>
      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="details-poster" />}
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Language:</strong> {movie.language}</p>
      <p><strong>Age Rating:</strong> {movie.ageRating}</p>
      <p><strong>Duration:</strong> {movie.duration} minutes</p>
      <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {movie.isActive ? "Active" : "Inactive"}</p>
      <p>{movie.description || "No description available."}</p>
    </section>
  );
}
