import { Router } from "express";
import {
  cancelShowtime,
  createShowtime,
  getShowtimeById,
  getShowtimes,
  updateShowtime
} from "../controllers/showtimeController.js";

const router = Router();

router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);
router.post("/", createShowtime);
router.put("/:id", updateShowtime);
router.delete("/:id", cancelShowtime);

export default router;
