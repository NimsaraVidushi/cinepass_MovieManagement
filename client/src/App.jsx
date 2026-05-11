import { useEffect, useMemo, useState } from "react";
import AdminMovieManager from "./components/AdminMovieManager.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import MovieList from "./components/MovieList.jsx";
import {
  activateMovie,
  createMovie,
  deactivateMovie,
  fetchMovieById,
  fetchMovies,
  updateMovie
} from "./api/movies.js";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("catalog");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [adminSelectedMovieId, setAdminSelectedMovieId] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    ageRating: "",
    sort: "releaseDate:desc"
  });

  const loadMovies = async (includeInactive = false) => {
    setLoading(true);
    try {
      const result = await fetchMovies({
        ...filters,
        includeInactive: includeInactive ? "true" : "false"
      });
      setMovies(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(activeTab === "admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab]);

  const genres = useMemo(() => [...new Set(movies.map((movie) => movie.genre))], [movies]);
  const languages = useMemo(() => [...new Set(movies.map((movie) => movie.language))], [movies]);
  const ratings = useMemo(() => [...new Set(movies.map((movie) => movie.ageRating))], [movies]);

  const handleSelectMovie = async (id) => {
    const movie = await fetchMovieById(id, activeTab === "admin");
    setSelectedMovie(movie);
  };

  const handleCreate = async (formData) => {
    await createMovie(formData);
    await loadMovies(true);
  };

  const handleUpdate = async (id, formData) => {
    await updateMovie(id, formData);
    await loadMovies(true);
  };

  const handleDeactivate = async (id) => {
    await deactivateMovie(id);
    await loadMovies(true);
  };

  const handleActivate = async (id) => {
    await activateMovie(id);
    await loadMovies(true);
  };

  return (
    <main className="container">
      <header>
        <h1>Cinepass Movie Management</h1>
        <div className="tabs">
          <button
            className={activeTab === "catalog" ? "active" : ""}
            onClick={() => {
              setActiveTab("catalog");
              setSelectedMovie(null);
            }}
          >
            Movie Catalog
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => {
              setActiveTab("admin");
              setSelectedMovie(null);
            }}
          >
            Admin Panel
          </button>
        </div>
      </header>

      <section className="filters">
        <select value={filters.genre} onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value }))}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={filters.language}
          onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
        >
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <select
          value={filters.ageRating}
          onChange={(e) => setFilters((prev) => ({ ...prev, ageRating: e.target.value }))}
        >
          <option value="">All Age Ratings</option>
          {ratings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        <select value={filters.sort} onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
          <option value="releaseDate:desc">Newest Releases</option>
          <option value="releaseDate:asc">Oldest Releases</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
          <option value="duration:asc">Duration Low-High</option>
          <option value="duration:desc">Duration High-Low</option>
        </select>
      </section>

      {selectedMovie ? (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      ) : (
        <MovieList movies={movies} onSelectMovie={handleSelectMovie} loading={loading} />
      )}

      {activeTab === "admin" && (
        <AdminMovieManager
          movies={movies}
          selectedMovieId={adminSelectedMovieId}
          setSelectedMovieId={setAdminSelectedMovieId}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
        />
      )}
    </main>
  );
}
