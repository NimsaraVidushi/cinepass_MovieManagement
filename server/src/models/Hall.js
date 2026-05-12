import mongoose from "mongoose";

const hallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    totalCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    amenities: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * When a hall's totalCapacity changes, propagate the new value to all future
 * showtimes that still have their full seat count available (i.e. not yet
 * partially/fully booked). Requires dynamic import to avoid circular deps.
 */
hallSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const { Showtime } = await import("./Showtime.js");
  const now = new Date();

  // Only touch showtimes that haven't started yet and still match the old
  // capacity (meaning no seats have been sold yet).
  await Showtime.updateMany(
    {
      hall: doc._id,
      startTime: { $gt: now },
      availableSeats: { $gt: 0 }
    },
    { $set: { availableSeats: doc.totalCapacity } }
  );
});

export const Hall = mongoose.model("Hall", hallSchema);
