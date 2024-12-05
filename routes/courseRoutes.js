// routes/courseRoutes.js
import express from "express";
import { getAllCourses } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);

export default router;
