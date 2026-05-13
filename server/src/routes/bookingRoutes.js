import { Router } from "express";
import {
  cancelBooking,
  checkout,
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByEmail
} from "../controllers/bookingController.js";
import { validatePromoCode } from "../services/paymentGateway.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// Promo code validation (lightweight, no DB hit)
router.get("/validate-promo", protect, (req, res) => {
  const { code } = req.query;
  const result = validatePromoCode(code);
  res.json(result);
});

// Admin — list all
router.get("/admin/all", protect, admin, getAllBookings);

// User — history (automatically uses logged-in user)
router.get("/my", protect, getBookingsByEmail);

// Single booking + payment
router.get("/:id", protect, getBookingById);

// Create booking (lock seats)
router.post("/", protect, createBooking);

// Checkout (process payment)
router.post("/:id/checkout", protect, checkout);

// Cancel + refund
router.delete("/:id", protect, cancelBooking);

export default router;
