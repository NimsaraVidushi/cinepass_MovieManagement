const API_BASE = "http://localhost:5000/api/showtimes";

const toQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const fetchShowtimes = async (params = {}) => {
  const query = toQuery(params);
  const response = await fetch(`${API_BASE}${query ? `?${query}` : ""}`);
  if (!response.ok) throw new Error("Failed to fetch showtimes");
  return response.json();
};

export const fetchShowtimeById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch showtime");
  return response.json();
};

export const createShowtime = async (data) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create showtime");
  }
  return response.json();
};

export const updateShowtime = async (id, data) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update showtime");
  }
  return response.json();
};

export const cancelShowtime = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to cancel showtime");
  }
  return response.json();
};
