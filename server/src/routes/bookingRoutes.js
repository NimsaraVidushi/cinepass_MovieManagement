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

const router = Router();

// Promo code validation (lightweight, no DB hit)
router.get("/validate-promo", (req, res) => {
  const { code } = req.query;
  const result = validatePromoCode(code);
  res.json(result);
});

// Admin — list all
router.get("/admin/all", getAllBookings);

// User — history by email
router.get("/", getBookingsByEmail);

// Single booking + payment
router.get("/:id", getBookingById);

// Create booking (lock seats)
router.post("/", createBooking);

// Checkout (process payment)
router.post("/:id/checkout", checkout);

// Cancel + refund
router.delete("/:id", cancelBooking);

export default router;
