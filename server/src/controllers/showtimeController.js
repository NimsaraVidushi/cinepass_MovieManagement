import { Movie } from "../models/Movie.js";
import { Hall } from "../models/Hall.js";
import { Showtime } from "../models/Showtime.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a Date-only filter (start of day → end of day in UTC) from a
 * query string like "2025-06-15".
 */
const buildDateFilter = (dateStr) => {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  if (isNaN(start)) return null;
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createShowtime = async (req, res, next) => {
  try {
    const { movieId, hallId, startTime, ticketPrice } = req.body;

    // Resolve movie to derive endTime
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    const start = new Date(startTime);
    if (isNaN(start)) return res.status(400).json({ message: "Invalid startTime format. Use ISO-8601." });

    // endTime = startTime + movie.duration (in minutes)
    const end = new Date(start.getTime() + movie.duration * 60_000);

    const showtime = new Showtime({
      movie: movie._id,
      hall: hall._id,
      startTime: start,
      endTime: end,
      ticketPrice: Number(ticketPrice),
      availableSeats: hall.totalCapacity
    });

    // pre-save hook runs conflict check here
    await showtime.save();

    await showtime.populate(["movie", "hall"]);
    res.status(201).json(showtime);
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

// ─── READ ─────────────────────────────────────────────────────────────────────

export const getShowtimes = async (req, res, next) => {
  try {
    const { movieId, hallId, date, includeInactive = "false" } = req.query;

    const query = {};
    if (includeInactive !== "true") query.isActive = true;
    if (movieId) query.movie = movieId;
    if (hallId) query.hall = hallId;

    const dateFilter = buildDateFilter(date);
    if (dateFilter) query.startTime = dateFilter;

    const showtimes = await Showtime.find(query)
      .populate("movie", "title duration posterUrl genre")
      .populate("hall", "name totalCapacity amenities")
      .sort({ startTime: 1 });

    res.json(showtimes);
  } catch (error) {
    next(error);
  }
};

export const getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie")
      .populate("hall");

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json(showtime);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE (reschedule) ──────────────────────────────────────────────────────

export const updateShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    const { startTime, hallId, ticketPrice } = req.body;

    if (hallId) showtime.hall = hallId;
    if (ticketPrice !== undefined) showtime.ticketPrice = Number(ticketPrice);

    if (startTime) {
      const start = new Date(startTime);
      if (isNaN(start)) return res.status(400).json({ message: "Invalid startTime format. Use ISO-8601." });

      // Re-derive endTime based on movie duration
      const movie = await Movie.findById(showtime.movie);
      if (!movie) return res.status(404).json({ message: "Associated movie not found" });

      showtime.startTime = start;
      showtime.endTime = new Date(start.getTime() + movie.duration * 60_000);
    }

    // If hall changes, reseed availableSeats from new hall capacity
    if (hallId) {
      const hall = await Hall.findById(hallId);
      if (!hall) return res.status(404).json({ message: "Hall not found" });
      showtime.availableSeats = hall.totalCapacity;
    }

    await showtime.save(); // triggers conflict check pre-save
    await showtime.populate(["movie", "hall"]);

    res.json(showtime);
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

// ─── CANCEL ───────────────────────────────────────────────────────────────────

export const cancelShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json({ message: "Showtime cancelled", showtime });
  } catch (error) {
    next(error);
  }
};
