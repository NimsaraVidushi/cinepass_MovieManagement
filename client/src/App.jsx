import { useEffect, useMemo, useState } from "react";
import AdminMovieManager from "./components/AdminMovieManager.jsx";
import AdminHallManager from "./components/AdminHallManager.jsx";
import AdminShowtimeManager from "./components/AdminShowtimeManager.jsx";
import ShowtimeSelector from "./components/ShowtimeSelector.jsx";
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
import {
  createHall,
  deleteHall,
  fetchHalls,
  updateHall
} from "./api/halls.js";
import {
  cancelShowtime,
  createShowtime,
  fetchShowtimes,
  updateShowtime
} from "./api/showtimes.js";

export default function App() {
  // ── Movie state ─────────────────────────────────────────────────────────────
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [adminSelectedMovieId, setAdminSelectedMovieId] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    ageRating: "",
    sort: "releaseDate:desc"
  });

  // ── Hall state ──────────────────────────────────────────────────────────────
  const [halls, setHalls] = useState([]);

  // ── Showtime state ──────────────────────────────────────────────────────────
  const [showtimes, setShowtimes] = useState([]);

  // ── Tab state ───────────────────────────────────────────────────────────────
  // Tabs: "catalog" | "showtimes" | "admin"
  // Admin sub-tabs: "movies" | "halls" | "showtimes"
  const [activeTab, setActiveTab] = useState("catalog");
  const [adminSection, setAdminSection] = useState("movies");

  // ── Load movies ──────────────────────────────────────────────────────────────
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

  // ── Load halls ───────────────────────────────────────────────────────────────
  const loadHalls = async () => {
    const result = await fetchHalls({ includeInactive: "true" });
    setHalls(result);
  };

  useEffect(() => {
    loadHalls();
  }, []);

  // ── Load showtimes (admin — all) ─────────────────────────────────────────────
  const loadAdminShowtimes = async () => {
    const result = await fetchShowtimes({ includeInactive: "true" });
    setShowtimes(result);
  };

  useEffect(() => {
    if (activeTab === "admin" && adminSection === "showtimes") {
      loadAdminShowtimes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, adminSection]);

  // ── Derived filter options ───────────────────────────────────────────────────
  const genres = useMemo(() => [...new Set(movies.map((m) => m.genre))], [movies]);
  const languages = useMemo(() => [...new Set(movies.map((m) => m.language))], [movies]);
  const ratings = useMemo(() => [...new Set(movies.map((m) => m.ageRating))], [movies]);

  // ── Movie handlers ───────────────────────────────────────────────────────────
  const handleSelectMovie = async (id) => {
    const movie = await fetchMovieById(id, activeTab === "admin");
    setSelectedMovie(movie);
  };
  const handleCreate = async (formData) => { await createMovie(formData); await loadMovies(true); };
  const handleUpdate = async (id, formData) => { await updateMovie(id, formData); await loadMovies(true); };
  const handleDeactivate = async (id) => { await deactivateMovie(id); await loadMovies(true); };
  const handleActivate = async (id) => { await activateMovie(id); await loadMovies(true); };

  // ── Hall handlers ────────────────────────────────────────────────────────────
  const handleCreateHall = async (data) => { await createHall(data); await loadHalls(); };
  const handleUpdateHall = async (id, data) => { await updateHall(id, data); await loadHalls(); };
  const handleDeleteHall = async (id) => { await deleteHall(id); await loadHalls(); };

  // ── Showtime handlers ────────────────────────────────────────────────────────
  const handleCreateShowtime = async (data) => { await createShowtime(data); await loadAdminShowtimes(); };
  const handleUpdateShowtime = async (id, data) => { await updateShowtime(id, data); await loadAdminShowtimes(); };
  const handleCancelShowtime = async (id) => { await cancelShowtime(id); await loadAdminShowtimes(); };

  // ── Tab navigation ───────────────────────────────────────────────────────────
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedMovie(null);
  };

  return (
    <main className="container">
      <header>
        <h1>Cinepass Movie Management</h1>
        <div className="tabs">
          <button
            id="tab-catalog"
            className={activeTab === "catalog" ? "active" : ""}
            onClick={() => switchTab("catalog")}
          >
            🎬 Movie Catalog
          </button>
          <button
            id="tab-showtimes"
            className={activeTab === "showtimes" ? "active" : ""}
            onClick={() => switchTab("showtimes")}
          >
            🕐 Showtimes
          </button>
          <button
            id="tab-admin"
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => switchTab("admin")}
          >
            ⚙️ Admin Panel
          </button>
        </div>
      </header>

      {/* ── Catalog Filters (only on catalog tab) ─────────────────────────── */}
      {activeTab === "catalog" && (
        <section className="filters">
          <select value={filters.genre} onChange={(e) => setFilters((p) => ({ ...p, genre: e.target.value }))}>
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filters.language} onChange={(e) => setFilters((p) => ({ ...p, language: e.target.value }))}>
            <option value="">All Languages</option>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={filters.ageRating} onChange={(e) => setFilters((p) => ({ ...p, ageRating: e.target.value }))}>
            <option value="">All Age Ratings</option>
            {ratings.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filters.sort} onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}>
            <option value="releaseDate:desc">Newest Releases</option>
            <option value="releaseDate:asc">Oldest Releases</option>
            <option value="title:asc">Title A–Z</option>
            <option value="title:desc">Title Z–A</option>
            <option value="duration:asc">Duration Low–High</option>
            <option value="duration:desc">Duration High–Low</option>
          </select>
        </section>
      )}

      {/* ── Catalog Tab ───────────────────────────────────────────────────── */}
      {activeTab === "catalog" && (
        selectedMovie
          ? <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
          : <MovieList movies={movies} onSelectMovie={handleSelectMovie} loading={loading} />
      )}

      {/* ── Showtimes Tab (user-facing) ───────────────────────────────────── */}
      {activeTab === "showtimes" && <ShowtimeSelector />}

      {/* ── Admin Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "admin" && (
        <>
          <div className="admin-sub-tabs">
            <button
              id="admin-tab-movies"
              className={adminSection === "movies" ? "active" : "secondary"}
              onClick={() => setAdminSection("movies")}
            >
              Movies
            </button>
            <button
              id="admin-tab-halls"
              className={adminSection === "halls" ? "active" : "secondary"}
              onClick={() => setAdminSection("halls")}
            >
              Halls
            </button>
            <button
              id="admin-tab-showtimes"
              className={adminSection === "showtimes" ? "active" : "secondary"}
              onClick={() => setAdminSection("showtimes")}
            >
              Showtimes
            </button>
          </div>

          {adminSection === "movies" && (
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

          {adminSection === "halls" && (
            <AdminHallManager
              halls={halls}
              onCreate={handleCreateHall}
              onUpdate={handleUpdateHall}
              onDelete={handleDeleteHall}
            />
          )}

          {adminSection === "showtimes" && (
            <AdminShowtimeManager
              movies={movies}
              halls={halls}
              showtimes={showtimes}
              onCreate={handleCreateShowtime}
              onUpdate={handleUpdateShowtime}
              onCancel={handleCancelShowtime}
            />
          )}
        </>
      )}
    </main>
  );
}
