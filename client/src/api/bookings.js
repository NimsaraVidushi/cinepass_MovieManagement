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

/** Validate a promo code — returns { valid, discountPct } */
export const validatePromo = async (code) => {
  const res = await fetch(`${API_BASE}/validate-promo?code=${encodeURIComponent(code)}`);
  return handleResponse(res);
};

/** Create booking (lock seats) — returns pending Booking */
export const createBooking = async (data) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

/** Checkout a pending booking — returns { booking, payment } or throws on decline */
export const checkoutBooking = async (bookingId, paymentData) => {
  const res = await fetch(`${API_BASE}/${bookingId}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

/** Get booking history for an email */
export const fetchBookingsByEmail = async (email, status = "") => {
  const q = toQuery({ email, status });
  const res = await fetch(`${API_BASE}?${q}`);
  return handleResponse(res);
};

/** Get a single booking + its payment */
export const fetchBookingById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  return handleResponse(res);
};

/** Admin — fetch all bookings */
export const fetchAllBookings = async (params = {}) => {
  const q = toQuery(params);
  const res = await fetch(`${API_BASE}/admin/all?${q}`);
  return handleResponse(res);
};

/** Cancel a booking (+ refund if confirmed) */
export const cancelBooking = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return handleResponse(res);
};
