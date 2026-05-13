import { useEffect, useMemo, useState } from "react";
import AdminMovieManager from "./components/AdminMovieManager.jsx";
import AdminMovieEdit from "./components/AdminMovieEdit.jsx";
import AdminHallManager from "./components/AdminHallManager.jsx";
import AdminShowtimeManager from "./components/AdminShowtimeManager.jsx";
import AdminPromotionManager from "./components/AdminPromotionManager.jsx";
import ShowtimeSelector from "./components/ShowtimeSelector.jsx";
import { 
  fetchPromotions, 
  fetchActivePromotions,
  createPromotion as apiCreatePromo, 
  deletePromotion as apiDeletePromo 
} from "./api/promotions.js";
import MovieDetails from "./components/MovieDetails.jsx";
import MovieList from "./components/MovieList.jsx";
import BookingPage from "./components/BookingPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import BookingSuccess from "./components/BookingSuccess.jsx";
import BookingHistory from "./components/BookingHistory.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Hero from "./components/Hero.jsx";
import {
  activateMovie,
  createMovie,
  deactivateMovie,
  deleteMovie,
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
  const [promotions, setPromotions] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);

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
    if (userData.type === "switch-to-admin") {
      setActiveTab("admin-login");
      return;
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("catalog");
    }
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

  useEffect(() => {
    fetchActivePromotions()
      .then(setActivePromotions)
      .catch(() => {});
  }, []);

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

  const loadPromotions = async () => {
    const result = await fetchPromotions(user?.token);
    setPromotions(result);
  };

  useEffect(() => {
    if (activeTab === "admin") {
      if (adminSection === "showtimes") loadAdminShowtimes();
      if (adminSection === "promotions") loadPromotions();
    }
  }, [activeTab, adminSection]);

  const genres = useMemo(() => [...new Set(movies.map((m) => m.genre))], [movies]);
  const languages = useMemo(() => [...new Set(movies.map((m) => m.language))], [movies]);

  const handleSelectMovie = async (id) => {
    const movie = await fetchMovieById(id, activeTab === "admin");
    setSelectedMovie(movie);
  };
  const handleCreate = async (formData) => { await createMovie(formData, user?.token); await loadMovies(true); };
  const handleUpdate = async (id, formData) => { await updateMovie(id, formData, user?.token); await loadMovies(true); };
  const handleDeactivate = async (id) => { await deactivateMovie(id, user?.token); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: false})); };
  const handleActivate = async (id) => { await activateMovie(id, user?.token); await loadMovies(true); if (editingMovie?._id === id) setEditingMovie(prev => ({...prev, isActive: true})); };
  const handleDeleteMovie = async (id) => { 
    try {
      await deleteMovie(id, user?.token); 
      await loadMovies(true);
      setEditingMovie(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleCreateHall = async (data) => { await createHall(data, user?.token); await loadHalls(); };
  const handleUpdateHall = async (id, data) => { await updateHall(id, data, user?.token); await loadHalls(); };
  const handleDeleteHall = async (id) => { await deleteHall(id, user?.token); await loadHalls(); };

  const handleCreateShowtime = async (data) => { await createShowtime(data, user?.token); await loadAdminShowtimes(); };
  const handleUpdateShowtime = async (id, data) => { await updateShowtime(id, data, user?.token); await loadAdminShowtimes(); };
  const handleCancelShowtime = async (id) => { await cancelShowtime(id, user?.token); await loadAdminShowtimes(); };

  const handleCreatePromo = async (data) => { await apiCreatePromo(data, user?.token); await loadPromotions(); };
  const handleDeletePromo = async (id) => { await apiDeletePromo(id, user?.token); await loadPromotions(); };

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
        <div className="header-left">
          <h1 className="logo" onClick={() => switchTab("catalog")}>CINEPASS</h1>
          <nav className="tabs" style={{ marginLeft: "3rem" }}>
            <span className={activeTab === "catalog" ? "nav-link active" : "nav-link"} onClick={() => switchTab("catalog")}>Home</span>
            <span className={activeTab === "showtimes" ? "nav-link active" : "nav-link"} onClick={() => switchTab("showtimes")}>Showtimes</span>
            {user && <span className={activeTab === "bookings" ? "nav-link active" : "nav-link"} onClick={() => switchTab("bookings")}>My List</span>}
            {user?.role === "admin" && <span className={activeTab === "admin" ? "nav-link active" : "nav-link"} onClick={() => switchTab("admin")}>Admin</span>}
          </nav>
        </div>

        <div className="header-right">
          {user ? (
            <div className="user-nav">
              <div className="profile-container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="user-name" style={{ fontSize: "0.9rem", fontWeight: "600" }}>{user.username}</span>
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}&backgroundColor=e50914`} 
                  alt="Avatar" 
                  style={{ width: "32px", height: "32px", borderRadius: "4px" }}
                />
                <button 
                  className="secondary glass" 
                  onClick={handleLogout}
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="primary" 
              onClick={() => setActiveTab("login")}
              style={{ padding: "7px 17px", fontSize: "0.9rem", borderRadius: "3px" }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className="content-wrapper">

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {/* ── Catalog Tab ───────────────────────────────────────────────────── */}
      {activeTab === "catalog" && (
        <div className="catalog-container fade-in">
          {!selectedMovie && heroMovie && (
            <Hero 
              movie={heroMovie} 
              onSelect={handleSelectMovie} 
              onBook={handleBookFromDetails} 
            />
          )}

          {!selectedMovie && (
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
          )}

          <div className="inner-container animate-in" style={{ marginTop: "2rem" }}>
            {selectedMovie ? (
              <MovieDetails 
                movie={selectedMovie} 
                onClose={() => setSelectedMovie(null)} 
                onBook={handleBookFromDetails} 
              />
            ) : (
              <>
                {filters.genre || filters.language ? (
                  <MovieList 
                    movies={movies} 
                    onSelectMovie={handleSelectMovie} 
                    loading={loading} 
                    title="Search Results"
                  />
                ) : (
                  <div style={{ paddingBottom: "5rem" }}>
                    <MovieList 
                      movies={movies.slice(0, 6)} 
                      variant="row" 
                      title="Trending Now" 
                      onSelectMovie={handleSelectMovie} 
                      loading={loading} 
                    />

                    {activePromotions.length > 0 && (
                      <div className="promo-row-container" style={{ margin: "4rem 0" }}>
                        <h2 className="section-title" style={{ marginBottom: "1.5rem", fontSize: "1.4rem" }}>Exclusive Offers</h2>
                        <div className="promo-scroll" style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
                          {activePromotions.map(promo => (
                            <div key={promo._id} className="glass animate-in" style={{ 
                              minWidth: "300px", 
                              padding: "1.5rem", 
                              borderRadius: "12px", 
                              border: "1px solid var(--netflix-red)",
                              background: "linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(0,0,0,0.4) 100%)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#fff" }}>{promo.code}</span>
                                <span style={{ background: "var(--netflix-red)", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "800" }}>
                                  {promo.discountPct}% OFF
                                </span>
                              </div>
                              <p style={{ color: "#ccc", fontSize: "0.85rem", marginTop: "0.8rem", margin: "0.8rem 0 0" }}>{promo.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {genres.map((genre) => (
                      <MovieList 
                        key={genre}
                        movies={movies.filter(m => m.genre === genre)} 
                        variant="row" 
                        title={genre} 
                        onSelectMovie={handleSelectMovie} 
                        loading={loading} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
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
          {user ? (
            <BookingHistory user={user} />
          ) : (
            <div style={{ textAlign: "center", padding: "5rem" }}>
              <h2 style={{ marginBottom: "2rem" }}>Please login to view your history</h2>
              <button onClick={() => setActiveTab("login")}>Login Now</button>
            </div>
          )}
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
      {activeTab === "admin-login" && (
        <div className="inner-container">
          <AdminLogin 
            onLoginSuccess={handleLoginSuccess} 
            onCancel={() => setActiveTab("login")} 
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
              <button
                id="admin-tab-promotions"
                className={adminSection === "promotions" ? "active" : "secondary"}
                onClick={() => setAdminSection("promotions")}
              >
                Promotions
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
                onDelete={handleDeleteMovie}
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

            {adminSection === "promotions" && (
              <AdminPromotionManager
                promotions={promotions}
                onCreate={handleCreatePromo}
                onDelete={handleDeletePromo}
              />
            )}
          </div>
        </div>
      )}
    </div>
    </main>
  );
}
