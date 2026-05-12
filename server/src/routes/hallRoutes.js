import { Router } from "express";
import {
  createHall,
  deleteHall,
  getHallById,
  getHalls,
  updateHall
} from "../controllers/hallController.js";

const router = Router();

router.get("/", getHalls);
router.get("/:id", getHallById);
router.post("/", createHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
