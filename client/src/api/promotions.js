const API_BASE = "http://localhost:5000/api/promotions";

export const fetchPromotions = async (token) => {
  const response = await fetch(API_BASE, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch promotions");
  return response.json();
};

export const fetchActivePromotions = async () => {
  const response = await fetch(`${API_BASE}/active`);
  if (!response.ok) throw new Error("Failed to fetch active promotions");
  return response.json();
};

export const createPromotion = async (data, token) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to create promotion");
  return response.json();
};

export const deletePromotion = async (id, token) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to delete promotion");
  return response.json();
};

export const validatePromo = async (code) => {
  const response = await fetch(`${API_BASE}/validate?code=${code}`);
  if (!response.ok) throw new Error("Validation failed");
  return response.json();
};
