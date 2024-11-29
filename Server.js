import express from "express";
import "express-async-errors";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "./errors/customErrors.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
const app = express();
dotenv.config();
app.use(cors());
import { authenticateUser } from "./middleware/authMiddleware.js";

// routes
import authRouter from "./routes/authRouter.js";
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// test route
app.get("/api/test", (req, res) => {
  
  res.json(`test route`)
});
app.use("/api/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: " route does not found" });
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
  // Handle other error types
  res.status(500).json({ msg: "something went wrong" });
});

const port = process.env.PORT || 5100;
(async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    app.listen(port, console.log(`im listning at port ${port}....`));
  } catch (error) {
    console.log(error);
  }
})();
