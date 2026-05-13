export default function MovieDetails({ movie, onClose, onBook }) {
  if (!movie) return null;

  return (
    <section className="details" style={{ 
      position: "relative", 
      background: "var(--netflix-dark-gray)",
      padding: "0",
      overflow: "hidden",
      borderRadius: "12px"
    }}>
      <div style={{ 
        height: "400px", 
        width: "100%", 
        position: "relative",
        overflow: "hidden"
      }}>
        <img 
          src={movie.posterUrl} 
          alt="" 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            filter: "brightness(0.4) blur(2px)"
          }} 
        />
        <button 
          className="secondary" 
          onClick={onClose} 
          style={{ 
            position: "absolute", 
            top: "1.5rem", 
            right: "1.5rem",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            border: "2px solid rgba(255,255,255,0.3)"
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ 
        padding: "2.5rem 4%",
        marginTop: "-150px",
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        gap: "3rem"
      }}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="details-poster" 
          style={{ 
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        />
        
        <div>
          <h2 style={{ fontSize: "3.5rem", margin: "0 0 0.5rem", fontWeight: "900" }}>{movie.title}</h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <span style={{ color: "#46d369", fontWeight: "700" }}>98% Match</span>
            <span style={{ color: "var(--netflix-light-gray)" }}>{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="amenity-pill">{movie.ageRating}</span>
            <span style={{ color: "var(--netflix-light-gray)" }}>{movie.duration}m</span>
            <span className="amenity-pill" style={{ background: "transparent", border: "1px solid #666" }}>HD</span>
          </div>

          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#fff", maxWidth: "800px" }}>
            {movie.description || "Experience the ultimate cinematic journey. This masterpiece brings together top-tier storytelling and breathtaking visuals."}
          </p>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem" }}>
            <button 
              className="active" 
              style={{ padding: "1rem 3.5rem", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}
              onClick={() => onBook(movie)}
            >
              <span>🎟</span> Book Tickets
            </button>
            <button 
              className="secondary" 
              style={{ padding: "1rem 2rem", fontSize: "1.2rem", background: "rgba(109, 109, 110, 0.7)" }}
            >
              + My List
            </button>
          </div>

          <div style={{ marginTop: "3rem", fontSize: "0.9rem", color: "var(--netflix-light-gray)" }}>
            <p><span style={{ color: "#777" }}>Genre:</span> {movie.genre}</p>
            <p><span style={{ color: "#777" }}>Language:</span> {movie.language}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
