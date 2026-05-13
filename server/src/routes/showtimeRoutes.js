import { Router } from "express";
import {
  cancelShowtime,
  createShowtime,
  getShowtimeById,
  getShowtimes,
  updateShowtime
} from "../controllers/showtimeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);

// Admin only routes
router.post("/", protect, admin, createShowtime);
router.put("/:id", protect, admin, updateShowtime);
router.delete("/:id", protect, admin, cancelShowtime);

export default router;
