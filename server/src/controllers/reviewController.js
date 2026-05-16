import { Review } from "../models/Review.js";
import { Movie } from "../models/Movie.js";

// @desc    Get all reviews for a specific movie
// @route   GET /api/reviews/movie/:movieId
// @access  Public
export const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Add a new review for a movie
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { movie, rating, comment } = req.body;

    // Check if movie exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Optional: Check if user already reviewed this movie
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      movie,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this movie" });
    }

    const review = new Review({
      user: req.user._id,
      movie,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();
    
    // Populate user info before returning
    await createdReview.populate("user", "name email");

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("movie", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
