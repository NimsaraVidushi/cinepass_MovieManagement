import mongoose from "mongoose";

/**
 * Payment record — one per booking attempt.
 * Stores the gateway response snapshot so audit trails survive schema changes.
 */
const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    /** Amount actually charged (mirrors booking.totalAmount at creation time) */
    amount: {
      type: Number,
      required: true,
      min: 0
    },

    /** Payment method chosen by user */
    method: {
      type: String,
      enum: ["card", "paypal", "cash"],
      required: true
    },

    /**
     * Simulated gateway transaction ID (e.g. "pi_xxx" for Stripe-style).
     * Set after a successful gateway call.
     */
    gatewayTxId: {
      type: String,
      default: ""
    },

    /**
     * Payment status:
     *  processing → gateway call in-flight
     *  paid       → gateway confirmed success
     *  failed     → gateway declined / error
     *  refunded   → full/partial refund processed
     */
    status: {
      type: String,
      enum: ["processing", "paid", "failed", "refunded"],
      default: "processing"
    },

    /** Raw gateway response payload (for audit) */
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    /** Refund transaction ID (populated on refund) */
    refundTxId: {
      type: String,
      default: ""
    },

    refundedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1 });
paymentSchema.index({ gatewayTxId: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
