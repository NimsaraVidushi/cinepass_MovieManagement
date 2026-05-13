import { Router } from "express";
import {
  createHall,
  deleteHall,
  getHallById,
  getHalls,
  updateHall
} from "../controllers/hallController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getHalls);
router.get("/:id", getHallById);

// Admin only routes
router.post("/", protect, admin, createHall);
router.put("/:id", protect, admin, updateHall);
router.delete("/:id", protect, admin, deleteHall);

export default router;
