import mongoose from "mongoose";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { Showtime } from "../models/Showtime.js";
import {
  processPayment,
  processRefund,
  validatePromoCode
} from "../services/paymentGateway.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calcTotal = (unitPrice, seats, discountPct) =>
  parseFloat((unitPrice * seats * (1 - discountPct / 100)).toFixed(2));

// ─── CREATE BOOKING  (Step 1 — lock seats) ────────────────────────────────────

/**
 * POST /api/bookings
 * Body: { showtimeId, seatsBooked, userName, userEmail, promoCode? }
 *
 * Locks seats by decrementing showtime.availableSeats atomically.
 * Returns a booking in "pending" state ready for checkout.
 */
export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { showtimeId, seatsBooked, userName, userEmail, promoCode = "" } = req.body;
    const seats = Number(seatsBooked);

    if (!seats || seats < 1 || seats > 10) {
      await session.abortTransaction();
      return res.status(400).json({ message: "seatsBooked must be between 1 and 10." });
    }

    // Atomically decrement — fails if not enough seats remain
    const showtime = await Showtime.findOneAndUpdate(
      { _id: showtimeId, isActive: true, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true, session }
    ).populate("movie", "title duration");

    if (!showtime) {
      await session.abortTransaction();
      return res.status(409).json({
        message: "Not enough seats available or showtime is inactive."
      });
    }

    // Validate promo code
    const { valid: promoValid, discountPct } = validatePromoCode(promoCode);
    if (promoCode && !promoValid) {
      await session.abortTransaction();
      return res.status(400).json({ message: `Promo code "${promoCode}" is not valid.` });
    }

    const totalAmount = calcTotal(showtime.ticketPrice, seats, discountPct);

    const [booking] = await Booking.create(
      [
        {
          user: { name: userName, email: userEmail },
          showtime: showtime._id,
          seatsBooked: seats,
          unitPrice: showtime.ticketPrice,
          discountPct,
          promoCode: promoCode.toUpperCase(),
          totalAmount,
          status: "pending"
        }
      ],
      { session }
    );

    await session.commitTransaction();

    // Populate for response
    const populated = await Booking.findById(booking._id).populate({
      path: "showtime",
      populate: [{ path: "movie", select: "title duration genre posterUrl" }, { path: "hall", select: "name amenities" }]
    });

    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ─── CHECKOUT  (Step 2 — process payment) ────────────────────────────────────

/**
 * POST /api/bookings/:id/checkout
 * Body: { method: "card"|"paypal"|"cash", cardLast4? }
 *
 * Orchestrates the full transaction:
 *   1. Validate booking is still pending
 *   2. Create a Payment record in "processing"
 *   3. Call payment gateway
 *   4. On success  → Payment "paid", Booking "confirmed"
 *   5. On failure  → Payment "failed", seats released back, Booking "cancelled"
 */
export const checkout = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { method, cardLast4 = "" } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate({ path: "showtime", select: "availableSeats ticketPrice" })
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found." });
    }
    if (booking.status !== "pending") {
      await session.abortTransaction();
      return res.status(409).json({
        message: `Booking is already ${booking.status}. Only pending bookings can be checked out.`
      });
    }

    // Create payment record in "processing"
    const [payment] = await Payment.create(
      [{ booking: booking._id, amount: booking.totalAmount, method, status: "processing" }],
      { session }
    );

    // ── Call gateway ─────────────────────────────────────────────────────────
    const gwResult = await processPayment({
      method,
      amount: booking.totalAmount,
      cardLast4
    });

    if (gwResult.success) {
      // ── Success path ──────────────────────────────────────────────────────
      await Payment.findByIdAndUpdate(
        payment._id,
        { status: "paid", gatewayTxId: gwResult.txId, gatewayResponse: gwResult.raw },
        { session }
      );
      booking.status = "confirmed";
      await booking.save({ session });

      await session.commitTransaction();

      const confirmed = await Booking.findById(booking._id).populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title duration genre posterUrl" },
          { path: "hall", select: "name amenities" }
        ]
      });
      const pmt = await Payment.findById(payment._id);

      return res.json({ booking: confirmed, payment: pmt });
    } else {
      // ── Failure path — release seats, cancel booking ──────────────────────
      await Payment.findByIdAndUpdate(
        payment._id,
        { status: "failed", gatewayTxId: gwResult.txId, gatewayResponse: gwResult.raw },
        { session }
      );

      // Release locked seats back to the showtime
      await Showtime.findByIdAndUpdate(
        booking.showtime._id,
        { $inc: { availableSeats: booking.seatsBooked } },
        { session }
      );

      booking.status = "cancelled";
      await booking.save({ session });

      await session.commitTransaction();

      return res.status(402).json({
        message: gwResult.raw?.error || "Payment failed.",
        booking: { _id: booking._id, status: "cancelled" },
        payment: { _id: payment._id, status: "failed" }
      });
    }
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ─── READ — User booking history ──────────────────────────────────────────────

/**
 * GET /api/bookings?email=user@example.com
 * Returns all bookings for a given email, newest first.
 */
export const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email, status } = req.query;
    if (!email) return res.status(400).json({ message: "email query param is required." });

    const query = { "user.email": email.toLowerCase() };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title duration genre posterUrl" },
          { path: "hall", select: "name amenities" }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/:id
 * Fetch a single booking with its payment record.
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "showtime",
      populate: [
        { path: "movie", select: "title duration genre posterUrl language ageRating" },
        { path: "hall", select: "name amenities totalCapacity" }
      ]
    });

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    const payment = await Payment.findOne({ booking: booking._id }).sort({ createdAt: -1 });

    res.json({ booking, payment });
  } catch (err) {
    next(err);
  }
};

// ─── READ — All bookings (admin) ──────────────────────────────────────────────

/**
 * GET /api/bookings/admin/all?status=&page=&limit=
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title" },
          { path: "hall", select: "name" }
        ]
      })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);
    res.json({ bookings, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

// ─── CANCEL + REFUND ──────────────────────────────────────────────────────────

/**
 * DELETE /api/bookings/:id
 * Cancels a confirmed/pending booking, releases seats, and initiates refund.
 */
export const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("showtime")
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found." });
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
      await session.abortTransaction();
      return res.status(409).json({
        message: `Cannot cancel a booking that is already ${booking.status}.`
      });
    }

    // Release seats
    await Showtime.findByIdAndUpdate(
      booking.showtime._id,
      { $inc: { availableSeats: booking.seatsBooked } },
      { session }
    );

    let refundResult = null;

    // Only attempt refund if booking was confirmed (payment exists)
    if (booking.status === "confirmed") {
      const payment = await Payment.findOne({ booking: booking._id, status: "paid" }).session(session);

      if (payment) {
        refundResult = await processRefund({
          originalTxId: payment.gatewayTxId,
          amount: payment.amount
        });

        await Payment.findByIdAndUpdate(
          payment._id,
          {
            status: "refunded",
            refundTxId: refundResult.refundTxId,
            refundedAt: new Date(),
            gatewayResponse: { ...payment.gatewayResponse, refund: refundResult.raw }
          },
          { session }
        );

        booking.status = "refunded";
      } else {
        booking.status = "cancelled";
      }
    } else {
      booking.status = "cancelled";
    }

    await booking.save({ session });
    await session.commitTransaction();

    res.json({
      message: booking.status === "refunded" ? "Booking cancelled and refund processed." : "Booking cancelled.",
      booking: { _id: booking._id, status: booking.status, bookingRef: booking.bookingRef },
      refund: refundResult
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};
