import { useEffect, useMemo, useState } from "react";
import AdminMovieManager from "./components/AdminMovieManager.jsx";
import AdminMovieEdit from "./components/AdminMovieEdit.jsx";
import AdminHallManager from "./components/AdminHallManager.jsx";
import AdminShowtimeManager from "./components/AdminShowtimeManager.jsx";
import ShowtimeSelector from "./components/ShowtimeSelector.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import MovieList from "./components/MovieList.jsx";
import BookingPage from "./components/BookingPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import BookingSuccess from "./components/BookingSuccess.jsx";
import BookingHistory from "./components/BookingHistory.jsx";
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
import { createBooking, checkoutBooking } from "./api/bookings.js";

export default function App() {
  // ── Movie state ─────────────────────────────────────────────────────────────
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
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

  // ── Booking flow state ──────────────────────────────────────────────────────
  // Steps: "none" | "booking" | "checkout" | "payment" | "success"
  const [bookingStep, setBookingStep] = useState("none");
  const [currentShowtime, setCurrentShowtime] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [selectedMovieIdForShowtimes, setSelectedMovieIdForShowtimes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── Tab state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("catalog");
  const [adminSection, setAdminSection] = useState("movies");
  const [editingMovie, setEditingMovie] = useState(null);

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
  }, [filters, activeTab]);

  const loadHalls = async () => {
    const result = await fetchHalls({ includeInactive: "true" });
    setHalls(result);
  };

  useEffect(() => {
    loadHalls();
  }, []);

  const loadAdminShowtimes = async () => {
    const result = await fetchShowtimes({ includeInactive: "true" });
    setShowtimes(result);
  };

  useEffect(() => {
    if (activeTab === "admin" && adminSection === "showtimes") {
      loadAdminShowtimes();
    }
  }, [activeTab, adminSection]);

  const genres = useMemo(() => [...new Set(movies.map((m) => m.genre))], [movies]);
  const languages = useMemo(() => [...new Set(movies.map((m) => m.language))], [movies]);
  const ratings = useMemo(() => [...new Set(movies.map((m) => m.ageRating))], [movies]);

  const handleSelectMovie = async (id) => {
    const movie = await fetchMovieById(id, activeTab === "admin");
    setSelectedMovie(movie);
  };
  const handleCreate = async (formData) => { await createMovie(formData); await loadMovies(true); };
  const handleUpdate = async (id, formData) => { await updateMovie(id, formData); await loadMovies(true); };
  const handleDeactivate = async (id) => { await deactivateMovie(id); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: false})); };
  const handleActivate = async (id) => { await activateMovie(id); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: true})); };

  const handleCreateHall = async (data) => { await createHall(data); await loadHalls(); };
  const handleUpdateHall = async (id, data) => { await updateHall(id, data); await loadHalls(); };
  const handleDeleteHall = async (id) => { await deleteHall(id); await loadHalls(); };

  const handleCreateShowtime = async (data) => { await createShowtime(data); await loadAdminShowtimes(); };
  const handleUpdateShowtime = async (id, data) => { await updateShowtime(id, data); await loadAdminShowtimes(); };
  const handleCancelShowtime = async (id) => { await cancelShowtime(id); await loadAdminShowtimes(); };

  // ── Booking flow handlers ───────────────────────────────────────────────────
  const startBooking = (showtime) => {
    setCurrentShowtime(showtime);
    setBookingStep("booking");
    setActiveTab("booking-flow"); // Internal tab name
  };

  const handleBookingSubmit = async (data) => {
    setErrorMessage("");
    try {
      const booking = await createBooking({
        showtimeId: currentShowtime._id,
        ...data
      });
      setCurrentBooking(booking);
      setBookingStep("checkout");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleCheckoutSubmit = (data) => {
    setCurrentBooking(prev => ({ ...prev, ...data }));
    setBookingStep("payment");
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const result = await checkoutBooking(currentBooking._id, paymentData);
      setCurrentBooking(result.booking);
      setBookingStep("success");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFlow = () => {
    setBookingStep("none");
    setCurrentShowtime(null);
    setCurrentBooking(null);
    setActiveTab("catalog");
  };

  const handleBookFromDetails = (movie) => {
    setSelectedMovie(null);
    setActiveTab("showtimes");
    setSelectedMovieIdForShowtimes(movie._id);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedMovie(null);
    setBookingStep("none");
    if (tab !== "showtimes") setSelectedMovieIdForShowtimes("");
  };

  return (
    <main className="container">
      <header>
        <h1>Cinepass</h1>
        <div className="tabs">
          <button
            id="tab-catalog"
            className={activeTab === "catalog" ? "active" : "secondary"}
            onClick={() => switchTab("catalog")}
          >
            Movies
          </button>
          <button
            id="tab-showtimes"
            className={activeTab === "showtimes" ? "active" : "secondary"}
            onClick={() => switchTab("showtimes")}
          >
            Showtimes
          </button>
          <button
            id="tab-bookings"
            className={activeTab === "bookings" ? "active" : "secondary"}
            onClick={() => switchTab("bookings")}
          >
            My Bookings
          </button>
          <button
            id="tab-admin"
            className={activeTab === "admin" ? "active" : "secondary"}
            onClick={() => switchTab("admin")}
          >
            Admin
          </button>
        </div>
      </header>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {/* ── Catalog Tab ───────────────────────────────────────────────────── */}
      {activeTab === "catalog" && (
        <>
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
            </select>
          </section>

          {selectedMovie
            ? <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onBook={handleBookFromDetails} />
            : <MovieList movies={movies} onSelectMovie={handleSelectMovie} loading={loading} />
          }
        </>
      )}

      {/* ── Showtimes Tab (user-facing) ───────────────────────────────────── */}
      {activeTab === "showtimes" && (
        <ShowtimeSelector 
          onBook={startBooking} 
          initialMovieId={selectedMovieIdForShowtimes} 
        />
      )}

      {/* ── Booking History Tab ───────────────────────────────────────────── */}
      {activeTab === "bookings" && <BookingHistory />}

      {/* ── Booking Flow ─────────────────────────────────────────────────── */}
      {activeTab === "booking-flow" && (
        <>
          {bookingStep === "booking" && (
            <BookingPage 
              showtime={currentShowtime} 
              onNext={handleBookingSubmit} 
              onCancel={resetFlow} 
            />
          )}
          {bookingStep === "checkout" && (
            <CheckoutPage 
              booking={currentBooking} 
              onNext={handleCheckoutSubmit} 
              onCancel={() => setBookingStep("booking")} 
            />
          )}
          {bookingStep === "payment" && (
            <PaymentPage 
              totalAmount={currentBooking.totalAmount} 
              onPay={handlePaymentSubmit} 
              onCancel={() => setBookingStep("checkout")} 
              isProcessing={isProcessing}
            />
          )}
          {bookingStep === "success" && (
            <BookingSuccess 
              booking={currentBooking} 
              onDone={resetFlow} 
            />
          )}
        </>
      )}

      {/* ── Admin Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "admin" && (
        <div className="admin">
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

          {adminSection === "movies" && !editingMovie && (
            <AdminMovieManager
              movies={movies}
              onCreate={handleCreate}
              onEditRequest={setEditingMovie}
            />
          )}

          {adminSection === "movies" && editingMovie && (
            <AdminMovieEdit
              movie={editingMovie}
              onUpdate={async (id, data) => { await handleUpdate(id, data); setEditingMovie(null); }}
              onCancel={() => setEditingMovie(null)}
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
        </div>
      )}
    </main>
  );
}
