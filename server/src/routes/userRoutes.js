import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/userController.js";

const router = express.Router();

router.route("/watchlist")
  .get(protect, getWatchlist);

router.route("/watchlist/:movieId")
  .post(protect, addToWatchlist)
  .delete(protect, removeFromWatchlist);

export default router;
