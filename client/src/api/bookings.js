const API_BASE = "http://localhost:5000/api/bookings";

const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  return q.toString();
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json();
};

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { "Authorization": `Bearer ${token}` } : {})
});

/** Validate a promo code — returns { valid, discountPct } */
export const validatePromo = async (code, token) => {
  const res = await fetch(`${API_BASE}/validate-promo?code=${encodeURIComponent(code)}`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(res);
};

/** Create booking (lock seats) — returns pending Booking */
export const createBooking = async (data, token) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

/** Checkout a pending booking — returns { booking, payment } or throws on decline */
export const checkoutBooking = async (bookingId, paymentData, token) => {
  const res = await fetch(`${API_BASE}/${bookingId}/checkout`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(paymentData)
  });
  // 402 = payment failed — still parse body for details
  if (res.status === 402) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || "Payment declined.");
    err.paymentFailed = true;
    err.detail = body;
    throw err;
  }
  return handleResponse(res);
};

/** Get booking history for current user */
export const fetchMyBookings = async (token, status = "") => {
  const q = toQuery({ status });
  const res = await fetch(`${API_BASE}/my?${q}`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(res);
};

/** Get a single booking + its payment */
export const fetchBookingById = async (id, token) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(res);
};

/** Admin — fetch all bookings */
export const fetchAllBookings = async (params = {}, token) => {
  const q = toQuery(params);
  const res = await fetch(`${API_BASE}/admin/all?${q}`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(res);
};

/** Cancel a booking (+ refund if confirmed) */
export const cancelBooking = async (id, token) => {
  const res = await fetch(`${API_BASE}/${id}`, { 
    method: "DELETE",
    headers: getAuthHeaders(token)
  });
  return handleResponse(res);
};
