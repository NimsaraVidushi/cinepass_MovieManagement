import "dotenv/config";
import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import showtimeRoutes from "./routes/showtimeRoutes.js";
import { connectDb } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/showtimes", showtimeRoutes);

app.use((error, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).json({ message: error.message || "Something went wrong" });
});

const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
