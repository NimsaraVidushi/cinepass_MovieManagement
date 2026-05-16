const API_URL = "http://localhost:5000/api/users";

export const fetchWatchlist = async (token) => {
  const response = await fetch(`${API_URL}/watchlist`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch watchlist");
  }
  return response.json();
};

export const addToWatchlist = async (movieId, token) => {
  const response = await fetch(`${API_URL}/watchlist/${movieId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add to watchlist");
  }
  return response.json();
};

export const removeFromWatchlist = async (movieId, token) => {
  const response = await fetch(`${API_URL}/watchlist/${movieId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove from watchlist");
  }
  return response.json();
};
