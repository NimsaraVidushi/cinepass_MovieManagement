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

const router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", uploadPoster.single("poster"), createMovie);
router.put("/:id", uploadPoster.single("poster"), updateMovie);
router.patch("/:id/deactivate", deactivateMovie);
router.patch("/:id/activate", activateMovie);

export default router;
