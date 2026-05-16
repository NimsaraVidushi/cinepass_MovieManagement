import express from "express";
import {
  getMovieReviews,
  addReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, admin, getAllReviews)
  .post(protect, addReview);

router.route("/movie/:movieId")
  .get(getMovieReviews);

router.route("/:id")
  .delete(protect, admin, deleteReview);

export default router;
