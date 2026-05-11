const initialForm = {
  title: "",
  genre: "",
  language: "",
  ageRating: "",
  duration: "",
  releaseDate: "",
  description: "",
  isActive: true
};

export default function AdminMovieManager({
  movies,
  selectedMovieId,
  setSelectedMovieId,
  onCreate,
  onUpdate,
  onDeactivate,
  onActivate
}) {
  const selectedMovie = movies.find((movie) => movie._id === selectedMovieId);

  const handleCreate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreate(formData);
    event.currentTarget.reset();
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!selectedMovie) return;

    const formData = new FormData(event.currentTarget);
    if (!formData.has("isActive")) {
      formData.append("isActive", "false");
    }
    await onUpdate(selectedMovie._id, formData);
  };

  return (
    <section className="admin">
      <h2>Admin Movie Manager</h2>
      <div className="admin-grid">
        <div>
          <h3>Create Movie</h3>
          <form className="form" onSubmit={handleCreate}>
            {Object.entries(initialForm).map(([key, value]) => (
              <input
                key={key}
                name={key}
                type={key === "releaseDate" ? "date" : key === "duration" ? "number" : "text"}
                placeholder={key}
                defaultValue={value}
                required={key !== "description"}
              />
            ))}
            <input type="file" name="poster" accept="image/*" />
            <button type="submit">Add Movie</button>
          </form>
        </div>

        <div>
          <h3>Edit Movie</h3>
          <select
            value={selectedMovieId}
            onChange={(event) => setSelectedMovieId(event.target.value)}
          >
            <option value="">Select movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title} ({movie.isActive ? "Active" : "Inactive"})
              </option>
            ))}
          </select>

          {selectedMovie ? (
            <form className="form" onSubmit={handleUpdate}>
              <input name="title" defaultValue={selectedMovie.title} required />
              <input name="genre" defaultValue={selectedMovie.genre} required />
              <input name="language" defaultValue={selectedMovie.language} required />
              <input name="ageRating" defaultValue={selectedMovie.ageRating} required />
              <input name="duration" type="number" defaultValue={selectedMovie.duration} required />
              <input
                name="releaseDate"
                type="date"
                defaultValue={new Date(selectedMovie.releaseDate).toISOString().slice(0, 10)}
                required
              />
              <textarea name="description" defaultValue={selectedMovie.description} />
              <label className="checkbox">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={selectedMovie.isActive}
                  value="true"
                />
                Active
              </label>
              <input type="file" name="poster" accept="image/*" />
              <button type="submit">Update Movie</button>
            </form>
          ) : (
            <p className="info">Select a movie to edit.</p>
          )}

          {selectedMovie && (
            <div className="admin-actions">
              <button
                className="danger"
                onClick={() => onDeactivate(selectedMovie._id)}
                disabled={!selectedMovie.isActive}
              >
                Deactivate
              </button>
              <button
                className="secondary"
                onClick={() => onActivate(selectedMovie._id)}
                disabled={selectedMovie.isActive}
              >
                Activate
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
