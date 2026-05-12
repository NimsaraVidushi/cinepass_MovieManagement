import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true
    },
    /** ISO-8601 / UTC stored by Mongoose */
    startTime: {
      type: Date,
      required: true
    },
    /**
     * Derived: startTime + movie.duration (minutes).
     * Set by the controller before saving so the hook can rely on it.
     */
    endTime: {
      type: Date,
      required: true
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0
    },
    /** Seeded from hall.totalCapacity; decremented as bookings are made */
    availableSeats: {
      type: Number,
      required: true,
      min: 0
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
 * Conflict detection: ensure no other active showtime in the same hall
 * has an overlapping time window [startTime, endTime].
 *
 * Two showtimes overlap when:
 *   existingStart < newEnd  AND  existingEnd > newStart
 */
showtimeSchema.pre("save", async function (next) {
  const query = {
    hall: this.hall,
    isActive: true,
    _id: { $ne: this._id }, // exclude self on update
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime }
  };

  const conflict = await mongoose.model("Showtime").findOne(query).select("_id startTime endTime").lean();

  if (conflict) {
    const err = new Error(
      `Scheduling conflict: hall is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}.`
    );
    err.status = 409;
    return next(err);
  }

  next();
});

showtimeSchema.index({ hall: 1, startTime: 1, endTime: 1 });
showtimeSchema.index({ movie: 1, startTime: 1 });

export const Showtime = mongoose.model("Showtime", showtimeSchema);
