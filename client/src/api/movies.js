const API_BASE = "http://localhost:5000/api/movies";

const toQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const fetchMovies = async (params = {}) => {
  const query = toQuery(params);
  const response = await fetch(`${API_BASE}${query ? `?${query}` : ""}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return response.json();
};

export const fetchMovieById = async (id, includeInactive = false) => {
  const response = await fetch(
    `${API_BASE}/${id}?includeInactive=${includeInactive ? "true" : "false"}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

export const createMovie = async (formData, token) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error("Failed to create movie");
  }
  return response.json();
};

export const updateMovie = async (id, formData, token) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error("Failed to update movie");
  }
  return response.json();
};

export const deactivateMovie = async (id, token) => {
  const response = await fetch(`${API_BASE}/${id}/deactivate`, { 
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to deactivate movie");
  }
  return response.json();
};

export const activateMovie = async (id, token) => {
  const response = await fetch(`${API_BASE}/${id}/activate`, { 
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to activate movie");
  }
  return response.json();
};
