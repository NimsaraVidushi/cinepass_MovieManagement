import { useState, useEffect } from "react";
import MovieList from "./MovieList.jsx";
import { fetchWatchlist } from "../api/users.js";

export default function Watchlist({ user, onSelectMovie }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setLoading(true);
        const data = await fetchWatchlist(user.token);
        setWatchlist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      loadWatchlist();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: "5rem", textAlign: "center" }}>Loading Watchlist...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div style={{ padding: "5rem", textAlign: "center" }}>
        <h2>Your Watchlist is empty</h2>
        <p style={{ marginTop: "1rem", color: "#ccc" }}>Add movies to your watchlist to keep track of what you want to see!</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: "5rem" }}>
      <MovieList 
        movies={watchlist} 
        variant="grid" 
        title="My Watchlist" 
        onSelectMovie={onSelectMovie} 
      />
    </div>
  );
}
