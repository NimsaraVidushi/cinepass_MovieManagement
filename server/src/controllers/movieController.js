import { Movie } from "../models/Movie.js";

const parseSort = (sortQuery) => {
  if (!sortQuery) {
    return { createdAt: -1 };
  }

  const [field, direction] = sortQuery.split(":");
  return { [field]: direction === "asc" ? 1 : -1 };
};

const buildPosterUrl = (req, filename) => {
  if (!filename) return "";
  return `${req.protocol}://${req.get("host")}/uploads/posters/${filename}`;
};

const normalizePayload = (payload) => {
  const normalized = { ...payload };

  if (normalized.duration !== undefined) {
    normalized.duration = Number(normalized.duration);
  }

  if (normalized.isActive !== undefined) {
    normalized.isActive = normalized.isActive === "true" || normalized.isActive === true;
  }

  return normalized;
};

export const createMovie = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);
    const posterUrl = req.file 
      ? buildPosterUrl(req, req.file.filename) 
      : (payload.posterUrl || "");

    const movie = await Movie.create({
      ...payload,
      posterUrl
    });
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

export const getMovies = async (req, res, next) => {
  try {
    const {
      genre,
      language,
      ageRating,
      search,
      sort = "releaseDate:desc",
      includeInactive = "false"
    } = req.query;

    const query = {};
    if (genre) query.genre = genre;
    if (language) query.language = language;
    if (ageRating) query.ageRating = ageRating;
    if (search) query.$text = { $search: search };

    const canSeeInactive = includeInactive === "true";
    if (!canSeeInactive) {
      query.isActive = true;
    }

    const movies = await Movie.find(query).sort(parseSort(sort));
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const includeInactive = req.query.includeInactive === "true";
    const movie = await Movie.findById(id);

    if (!movie || (!movie.isActive && !includeInactive)) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = normalizePayload(req.body);
    
    if (req.file) {
      payload.posterUrl = buildPosterUrl(req, req.file.filename);
    } else if (payload.posterUrl === undefined) {
      // If posterUrl not in body and no file, don't change it
      delete payload.posterUrl;
    }

    const movie = await Movie.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
};

export const deactivateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.json({ message: "Movie deactivated", movie });
  } catch (error) {
    next(error);
  }
};

export const activateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.json({ message: "Movie activated", movie });
  } catch (error) {
    next(error);
  }
};
