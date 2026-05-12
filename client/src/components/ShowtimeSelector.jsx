import { useEffect, useState } from "react";
import { fetchShowtimes } from "../api/showtimes.js";
import { fetchMovies } from "../api/movies.js";

const today = () => new Date().toISOString().slice(0, 10);

export default function ShowtimeSelector({ onBook, initialMovieId = "" }) {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [filters, setFilters] = useState({ movieId: initialMovieId, date: today() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load active movies once for the movie filter dropdown
  useEffect(() => {
    fetchMovies({ includeInactive: "false" })
      .then(setMovies)
      .catch(() => {});
  }, []);

  // Reload showtimes whenever filters change
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchShowtimes({ ...filters, includeInactive: "false" })
      .then(setShowtimes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const formatTime = (isoStr) =>
    new Date(isoStr).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const formatDate = (isoStr) =>
    new Date(isoStr).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  const seatsPercent = (available, total) =>
    total > 0 ? Math.round((available / total) * 100) : 0;

  // Group showtimes by movie title for display
  const grouped = showtimes.reduce((acc, s) => {
    const key = s.movie?.title || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <section className="showtime-selector">
      <h2>Now Showing &amp; Upcoming</h2>

      {/* Filters */}
      <div className="showtime-filters">
        <select
          id="movie-filter"
          value={filters.movieId}
          onChange={(e) => setFilters((p) => ({ ...p, movieId: e.target.value }))}
        >
          <option value="">All Movies</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>

        <input
          id="date-filter"
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
        />
      </div>

      {error && <p className="error-banner">{error}</p>}
      {loading && <p className="info">Loading showtimes…</p>}

      {!loading && !error && showtimes.length === 0 && (
        <p className="info">No showtimes available for the selected filters.</p>
      )}

      {/* Grouped showtime cards */}
      {Object.entries(grouped).map(([movieTitle, times]) => {
        const first = times[0];
        const posterUrl = first?.movie?.posterUrl || "";
        return (
          <div key={movieTitle} className="showtime-group">
            <div className="showtime-group-header">
              {posterUrl ? (
                <img src={posterUrl} alt={movieTitle} className="showtime-poster" />
              ) : (
                <div className="showtime-poster placeholder">{movieTitle[0]}</div>
              )}
              <div>
                <h3 className="showtime-movie-title">{movieTitle}</h3>
                <p className="showtime-meta">
                  {first?.movie?.genre} &bull; {first?.movie?.duration} min
                </p>
                <p className="showtime-date">{formatDate(times[0].startTime)}</p>
              </div>
            </div>

            <div className="showtime-slots">
              {times.map((s) => {
                const pct = seatsPercent(s.availableSeats, s.hall?.totalCapacity);
                const soldOut = s.availableSeats === 0;
                return (
                  <div key={s._id} className={`showtime-slot ${soldOut ? "slot-sold-out" : ""}`}>
                    <div className="slot-top">
                      <span className="slot-time">{formatTime(s.startTime)}</span>
                      <span className="slot-hall">{s.hall?.name}</span>
                    </div>

                    {s.hall?.amenities?.length > 0 && (
                      <div className="amenity-pills">
                        {s.hall.amenities.map((a) => (
                          <span key={a} className="amenity-pill amenity-pill--sm">{a}</span>
                        ))}
                      </div>
                    )}

                    <div className="slot-bottom">
                      <span className={`seat-count ${soldOut ? "sold-out" : ""}`}>
                        {soldOut ? "Sold Out" : `${s.availableSeats} seats left`}
                      </span>
                      <span className="slot-price">${s.ticketPrice?.toFixed(2)}</span>
                    </div>

                    <button
                      className="book-btn"
                      disabled={soldOut}
                      onClick={() => onBook(s)}
                    >
                      {soldOut ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
