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
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
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
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

  const [activeTab, setActiveTab] = useState("catalog");
  const [adminSection, setAdminSection] = useState("movies");
  const [editingMovie, setEditingMovie] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroMovie = useMemo(() => {
    if (movies.length === 0) return null;
    return movies[0]; // Just take the first movie as hero for now
  }, [movies]);

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setActiveTab("catalog");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setActiveTab("catalog");
  };

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
  const handleCreate = async (formData) => { await createMovie(formData, user?.token); await loadMovies(true); };
  const handleUpdate = async (id, formData) => { await updateMovie(id, formData, user?.token); await loadMovies(true); };
  const handleDeactivate = async (id) => { await deactivateMovie(id, user?.token); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: false})); };
  const handleActivate = async (id) => { await activateMovie(id, user?.token); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: true})); };

  const handleCreateHall = async (data) => { await createHall(data, user?.token); await loadHalls(); };
  const handleUpdateHall = async (id, data) => { await updateHall(id, data, user?.token); await loadHalls(); };
  const handleDeleteHall = async (id) => { await deleteHall(id, user?.token); await loadHalls(); };

  const handleCreateShowtime = async (data) => { await createShowtime(data, user?.token); await loadAdminShowtimes(); };
  const handleUpdateShowtime = async (id, data) => { await updateShowtime(id, data, user?.token); await loadAdminShowtimes(); };
  const handleCancelShowtime = async (id) => { await cancelShowtime(id, user?.token); await loadAdminShowtimes(); };

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
      }, user?.token);
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
      const result = await checkoutBooking(currentBooking._id, paymentData, user?.token);
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
      <header className={isScrolled ? "scrolled" : ""}>
        <h1 className="logo" onClick={() => switchTab("catalog")}>Cinepass</h1>
        <nav className="tabs">
          <button
            id="tab-catalog"
            className={activeTab === "catalog" ? "active-link" : "nav-link"}
            onClick={() => switchTab("catalog")}
            style={{ background: "none", boxShadow: "none", padding: "0.5rem" }}
          >
            Home
          </button>
          <button
            id="tab-showtimes"
            className={activeTab === "showtimes" ? "active-link" : "nav-link"}
            onClick={() => switchTab("showtimes")}
            style={{ background: "none", boxShadow: "none", padding: "0.5rem" }}
          >
            Showtimes
          </button>
          {user && (
            <button
              id="tab-bookings"
              className={activeTab === "bookings" ? "active-link" : "nav-link"}
              onClick={() => switchTab("bookings")}
              style={{ background: "none", boxShadow: "none", padding: "0.5rem" }}
            >
              My List
            </button>
          )}
          {user && user.role === "admin" && (
            <button
              id="tab-admin"
              className={activeTab === "admin" ? "active-link" : "nav-link"}
              onClick={() => switchTab("admin")}
              style={{ background: "none", boxShadow: "none", padding: "0.5rem" }}
            >
              Admin
            </button>
          )}
        </nav>

        <div className="user-nav">
          {user ? (
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="tabs">
              <button 
                className="secondary" 
                onClick={() => setActiveTab("login")}
                style={{ padding: "0.5rem 1rem" }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="content-wrapper">

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {/* ── Catalog Tab ───────────────────────────────────────────────────── */}
      {activeTab === "catalog" && (
        <div className="catalog-container">
          {!selectedMovie && heroMovie && (
            <section className="hero">
              <div className="hero-background">
                <img src={heroMovie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2070"} alt="Hero" />
              </div>
              <div className="hero-content">
                <h2 className="hero-title">{heroMovie.title}</h2>
                <p className="hero-description">{heroMovie.description || "Experience the magic of cinema. Book your tickets now for the latest blockbusters."}</p>
                <div className="hero-btns">
                  <button className="hero-btn play" onClick={() => handleSelectMovie(heroMovie._id)}>
                    <span>▶</span> Play Info
                  </button>
                  <button className="hero-btn info" onClick={() => handleBookFromDetails(heroMovie)}>
                    <span>ⓘ</span> Book Now
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="filters-container">
            <section className="filters">
              <select value={filters.genre} onChange={(e) => setFilters((p) => ({ ...p, genre: e.target.value }))}>
                <option value="">Genres</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={filters.language} onChange={(e) => setFilters((p) => ({ ...p, language: e.target.value }))}>
                <option value="">Languages</option>
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={filters.sort} onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}>
                <option value="releaseDate:desc">Newest</option>
                <option value="releaseDate:asc">Oldest</option>
                <option value="title:asc">A–Z</option>
              </select>
            </section>
          </div>

          <div className="inner-container">
            {selectedMovie
              ? <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onBook={handleBookFromDetails} />
              : <MovieList movies={movies} onSelectMovie={handleSelectMovie} loading={loading} />
            }
          </div>
        </div>
      )}

      {/* ── Showtimes Tab (user-facing) ───────────────────────────────────── */}
      {activeTab === "showtimes" && (
        <div className="inner-container">
          <ShowtimeSelector 
            onBook={startBooking} 
            initialMovieId={selectedMovieIdForShowtimes} 
          />
        </div>
      )}

      {/* ── Booking History Tab ───────────────────────────────────────────── */}
      {activeTab === "bookings" && (
        <div className="inner-container">
          {user ? <BookingHistory user={user} /> : setActiveTab("login")}
        </div>
      )}

      {/* ── Auth Tabs ─────────────────────────────────────────────────────── */}
      {activeTab === "login" && (
        <div className="inner-container">
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => setActiveTab("register")} 
          />
        </div>
      )}
      {activeTab === "register" && (
        <div className="inner-container">
          <Register 
            onRegisterSuccess={handleLoginSuccess} 
            onSwitchToLogin={() => setActiveTab("login")} 
          />
        </div>
      )}

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
        <div className="inner-container">
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
        </div>
      )}
    </div>
    </main>
  );
}
