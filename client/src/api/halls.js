const API_BASE = "http://localhost:5000/api/halls";

const toQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const fetchHalls = async (params = {}) => {
  const query = toQuery(params);
  const response = await fetch(`${API_BASE}${query ? `?${query}` : ""}`);
  if (!response.ok) throw new Error("Failed to fetch halls");
  return response.json();
};

export const fetchHallById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch hall");
  return response.json();
};

export const createHall = async (data) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create hall");
  }
  return response.json();
};

export const updateHall = async (id, data) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update hall");
  }
  return response.json();
};

export const deleteHall = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete hall");
  }
  return response.json();
};
