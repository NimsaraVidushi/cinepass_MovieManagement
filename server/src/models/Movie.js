import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    ageRating: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    releaseDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    posterUrl: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

movieSchema.index({ title: "text", genre: "text", language: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
