import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connect.js";
import courseRoutes from "./routes/courseRoutes.js";
import posts from './routes/postRoutes.js'; // Ensure correct path
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js"; // Adjust path if needed

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static file routes
app.use("/api/img", express.static(path.join(__dirname, "public", "images")));
app.use('/api/nmf', express.static(path.join(__dirname, "public", "videos")));

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Logging middleware for development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Import routers for various routes
import authRouter from "./routes/authRouter.js";
import videoRoutes from "./routes/videoRouter.js";
import charRouter from "./routes/characters.js";

// Use the imported routers
app.use("/api/auth", authRouter);
app.use("/api/videos", videoRoutes);
app.use("/api/char", charRouter);
app.use("/api/courses", courseRoutes);
app.use('/api/posts', posts); // For post-related routes

// Test route
app.get("/api/test", (req, res) => {
  res.json("test route");
});

// Catch-all for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handling middleware
app.use(errorHandlerMiddleware);

// Initialize the server
const port = process.env.PORT || 5100;
(async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
})();
