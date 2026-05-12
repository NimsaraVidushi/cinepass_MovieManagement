import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Generates a unique booking reference in the format: CP-XXXXXXXX
 * Uses 4 bytes of random hex for uniqueness.
 */
const generateRef = () => `CP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

const bookingSchema = new mongoose.Schema(
  {
    /** Unique human-readable reference, e.g. CP-3F9A1B2C */
    bookingRef: {
      type: String,
      unique: true,
      default: generateRef
    },

    user: {
      /** Simple identifier — no auth module yet; store email or session ID */
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true }
    },

    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true
    },

    /** Number of seats reserved */
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    /** Snapshot price at time of booking (ticket price per seat) */
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    /** Discount percentage applied (0–100) */
    discountPct: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    /** Promo code used (if any) */
    promoCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true
    },

    /** Final amount after discount: unitPrice * seatsBooked * (1 - discountPct/100) */
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    /**
     * Booking lifecycle status:
     *  pending    → seats locked, awaiting payment
     *  confirmed  → payment successful
     *  cancelled  → user cancelled / payment failed + refunded
     *  refunded   → cancellation refund processed
     */
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refunded"],
      default: "pending"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ "user.email": 1, createdAt: -1 });
bookingSchema.index({ showtime: 1, status: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
