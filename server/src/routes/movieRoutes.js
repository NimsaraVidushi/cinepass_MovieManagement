import { Router } from "express";
import {
  activateMovie,
  createMovie,
  deactivateMovie,
  getMovieById,
  getMovies,
  updateMovie
} from "../controllers/movieController.js";
import { uploadPoster } from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);

// Admin only routes
router.post("/", protect, admin, uploadPoster.single("poster"), createMovie);
router.put("/:id", protect, admin, uploadPoster.single("poster"), updateMovie);
router.patch("/:id/deactivate", protect, admin, deactivateMovie);
router.patch("/:id/activate", protect, admin, activateMovie);

export default router;
