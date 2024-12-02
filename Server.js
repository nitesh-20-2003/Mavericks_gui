import express from "express";
import "express-async-errors";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "./errors/customErrors.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//  routes
import authRouter from "./routes/authRouter.js";
import charRouter from './routes/characters.js';
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/oneto9", express.static(path.join(__dirname, "oneto9")));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.get("/api/test", (req, res) => {
  res.json("test route");
});

app.use("/api/auth", authRouter);

app.use('/api/char',charRouter);
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
