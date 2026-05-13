export default function MovieDetails({ movie, onClose, onBook }) {
  if (!movie) return null;

  return (
    <section className="details animate-in" style={{ 
      position: "relative", 
      background: "var(--netflix-dark-gray)",
      padding: "0",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "var(--shadow-lg)"
    }}>
      <div style={{ 
        height: "500px", 
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
            filter: "brightness(0.3) blur(4px)"
          }} 
        />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to top, var(--netflix-dark-gray) 0%, transparent 60%)"
        }}></div>
        <button 
          className="secondary glass" 
          onClick={onClose} 
          style={{ 
            position: "absolute", 
            top: "1.5rem", 
            right: "1.5rem",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            zIndex: 10
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ 
        padding: "0 6% 4rem",
        marginTop: "-200px",
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "4rem"
      }}>
        <div className="fade-in">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="details-poster" 
            style={{ 
              borderRadius: "12px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              width: "100%"
            }}
          />
        </div>
        
        <div className="animate-in" style={{ animationDelay: "0.2s" }}>
          <h2 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)", 
            margin: "0 0 1rem", 
            fontWeight: "900",
            letterSpacing: "-2px",
            lineHeight: "1"
          }}>{movie.title}</h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
            <span style={{ color: "#46d369", fontWeight: "800", fontSize: "1.1rem" }}>98% Match</span>
            <span style={{ color: "var(--netflix-light-gray)", fontSize: "1.1rem" }}>{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="rating" style={{ border: "1px solid #666", padding: "2px 8px", borderRadius: "4px", fontSize: "0.9rem" }}>{movie.ageRating}</span>
            <span style={{ color: "var(--netflix-light-gray)", fontSize: "1.1rem" }}>{movie.duration}m</span>
            <span className="glass" style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "800" }}>4K ULTRA HD</span>
          </div>

          <p style={{ 
            fontSize: "1.3rem", 
            lineHeight: "1.7", 
            color: "rgba(255,255,255,0.9)", 
            maxWidth: "900px",
            marginBottom: "3rem"
          }}>
            {movie.description || "Experience the ultimate cinematic journey. This masterpiece brings together top-tier storytelling and breathtaking visuals in an unforgettable experience."}
          </p>

          <div style={{ display: "flex", gap: "2rem" }}>
            <button 
              className="active" 
              style={{ 
                padding: "1.2rem 4rem", 
                fontSize: "1.3rem", 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem",
                borderRadius: "8px"
              }}
              onClick={() => onBook(movie)}
            >
              <span>🎟</span> Book Tickets
            </button>
            <button 
              className="secondary glass" 
              style={{ 
                padding: "1.2rem 2.5rem", 
                fontSize: "1.3rem",
                borderRadius: "8px"
              }}
            >
              + My List
            </button>
          </div>

          <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
            <div>
              <p style={{ color: "#777", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Genre</p>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>{movie.genre}</p>
            </div>
            <div>
              <p style={{ color: "#777", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Language</p>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>{movie.language}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
