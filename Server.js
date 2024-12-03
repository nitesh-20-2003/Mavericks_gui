import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connect.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/api/img", express.static(path.join(__dirname, "public", "images")));
app.use('/api/nmf',express.static(path.join(__dirname, "public", "videos")));

app.use(express.json());
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


import authRouter from "./routes/authRouter.js";
import videoRoutes from "./routes/videoRouter.js";
import charRouter from "./routes/characters.js";

app.use("/api/auth", authRouter);
app.use("/api/videos", videoRoutes);
app.use("/api/char", charRouter);


app.get("/api/test", (req, res) => {
  res.json("test route");
});


app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found" });
});


app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof UnauthenticatedError) {
    return res.status(err.statusCode).json({ errors: err.message });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ errors: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({ errors: err.message });
  }
  res.status(500).json({ msg: "Something went wrong" });
});


const port = process.env.PORT || 5100;

(async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
})();
