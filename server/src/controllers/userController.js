import User from "../models/User.js";

// @desc    Get user watchlist
// @route   GET /api/users/watchlist
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/users/watchlist/:movieId
// @access  Private
export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
