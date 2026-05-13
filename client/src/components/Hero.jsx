import React from 'react';

export default function Hero({ movie, onSelect, onBook }) {
  if (!movie) return null;

  return (
    <section className="hero animate-in">
      <div className="hero-background">
        <img 
          src={movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2070"} 
          alt={movie.title} 
          className="fade-in"
        />
      </div>
      <div className="hero-content">
        <div className="hero-badge glass">NEW RELEASE</div>
        <h2 className="hero-title">{movie.title}</h2>
        <div className="hero-meta">
          <span className="match">98% Match</span>
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
          <span>{movie.duration}m</span>
        </div>
        <p className="hero-description">
          {movie.description || "Experience the magic of cinema. Book your tickets now for the latest blockbusters."}
        </p>
        <div className="hero-btns">
          <button className="hero-btn play" onClick={() => onSelect(movie._id)}>
            <span className="icon">▶</span> Play Info
          </button>
          <button className="hero-btn info glass" onClick={() => onBook(movie)}>
            <span className="icon">🎟</span> Book Now
          </button>
        </div>
      </div>
      <div className="hero-vignette"></div>
    </section>
  );
}
