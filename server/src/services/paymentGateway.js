import crypto from "crypto";

/**
 * Simulated payment gateway.
 *
 * In production replace these stubs with real Stripe / PayPal SDK calls.
 * The interface mirrors the shape you'd get from those SDKs so the
 * bookingController needs no changes when you swap in real credentials.
 */

const VALID_PROMO_CODES = {
  CINE10: 10,
  CINE20: 20,
  WELCOME: 15,
  VIP50: 50
};

/** Simulate network latency (50–200 ms) */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Promo / Discount ─────────────────────────────────────────────────────────

/**
 * Validate a promo code and return the discount percentage (0 if invalid).
 * @param {string} code
 * @returns {{ valid: boolean; discountPct: number }}
 */
export const validatePromoCode = (code) => {
  if (!code) return { valid: false, discountPct: 0 };
  const upper = code.toUpperCase().trim();
  const pct = VALID_PROMO_CODES[upper];
  if (pct === undefined) return { valid: false, discountPct: 0 };
  return { valid: true, discountPct: pct };
};

// ─── Charge ───────────────────────────────────────────────────────────────────

/**
 * Simulate charging a card / PayPal / cash.
 *
 * Rules (for demo purposes):
 *  - amount === 0  → always succeeds (free ticket edge case)
 *  - card number ending in "0000" → simulate decline
 *  - everything else → succeeds with 95 % probability
 *
 * @param {{ method: string; amount: number; cardLast4?: string }} payload
 * @returns {{ success: boolean; txId: string; raw: object }}
 */
export const processPayment = async ({ method, amount, cardLast4 = "" }) => {
  await delay(Math.random() * 150 + 50);

  const txId = `CP_TX_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  // Forced decline
  if (cardLast4 === "0000") {
    return {
      success: false,
      txId,
      raw: { error: "Your card was declined.", code: "card_declined" }
    };
  }

  // Zero-amount always passes
  if (amount === 0) {
    return { success: true, txId, raw: { note: "Zero-amount, no charge." } };
  }

  // 95 % success rate
  const success = Math.random() < 0.95;
  return {
    success,
    txId,
    raw: success
      ? { method, amount, currency: "USD", status: "succeeded" }
      : { error: "Payment processing failed.", code: "processing_error" }
  };
};

// ─── Refund ───────────────────────────────────────────────────────────────────

/**
 * Simulate issuing a refund against a previous transaction.
 *
 * @param {{ originalTxId: string; amount: number }} payload
 * @returns {{ success: boolean; refundTxId: string; raw: object }}
 */
export const processRefund = async ({ originalTxId, amount }) => {
  await delay(Math.random() * 100 + 30);

  const refundTxId = `CP_RF_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  return {
    success: true,
    refundTxId,
    raw: { originalTxId, refundAmount: amount, status: "refunded" }
  };
};
