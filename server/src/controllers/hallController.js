import { Hall } from "../models/Hall.js";
import { Showtime } from "../models/Showtime.js";

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createHall = async (req, res, next) => {
  try {
    const { name, totalCapacity, amenities, isActive } = req.body;
    const hall = await Hall.create({
      name,
      totalCapacity: Number(totalCapacity),
      amenities: Array.isArray(amenities)
        ? amenities
        : amenities
          ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      isActive: isActive === "false" ? false : true
    });
    res.status(201).json(hall);
  } catch (error) {
    next(error);
  }
};

// ─── READ ─────────────────────────────────────────────────────────────────────

export const getHalls = async (req, res, next) => {
  try {
    const { includeInactive = "false" } = req.query;
    const query = includeInactive === "true" ? {} : { isActive: true };
    const halls = await Hall.find(query).sort({ name: 1 });
    res.json(halls);
  } catch (error) {
    next(error);
  }
};

export const getHallById = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }
    res.json(hall);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateHall = async (req, res, next) => {
  try {
    const { name, totalCapacity, amenities, isActive } = req.body;
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (totalCapacity !== undefined) payload.totalCapacity = Number(totalCapacity);
    if (amenities !== undefined) {
      payload.amenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(",").map((a) => a.trim()).filter(Boolean);
    }
    if (isActive !== undefined) payload.isActive = isActive === "false" ? false : Boolean(isActive);

    const hall = await Hall.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(hall);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteHall = async (req, res, next) => {
  try {
    // Prevent deletion if there are active future showtimes in this hall
    const activeShowtimes = await Showtime.countDocuments({
      hall: req.params.id,
      isActive: true,
      startTime: { $gt: new Date() }
    });

    if (activeShowtimes > 0) {
      return res.status(400).json({
        message: `Cannot delete hall: ${activeShowtimes} active showtime(s) are still scheduled. Cancel them first.`
      });
    }

    const hall = await Hall.findByIdAndDelete(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json({ message: "Hall deleted successfully", hall });
  } catch (error) {
    next(error);
  }
};
